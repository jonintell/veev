const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Adjust the path to your app file
const User = require('../src/models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { expect } = chai;
chai.use(chaiHttp);

describe('User Management', () => {
    before(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('Registration and Authentication', () => {
        it('should register a new user and login', async () => {
            // test all user oeprations (nopt admin)
            //register test
            const res = await chai.request(app)
                .post('/api/users/register')
                .send({
                    name: 'Test User',
                    email: 'testuser@example.com',
                    password: 'password123',
                });
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('token');

            //login test 
            const loginRes = await chai.request(app)
                .post('/api/users/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                });
            expect(loginRes).to.have.status(200);
            expect(loginRes.body).to.have.property('token');
        });
    });

    describe('User Operations', () => {
        let adminToken;
        let userNotAdmin;

        before(async () => {
            // mock admin user
            // const adminPassword = await bcrypt.hash('adminpassword', 10);
            const adminUser = new User({
                name: 'Admin User',
                email: 'admin@example.com',
                password: "adminpassword", // Use the hashed password
                isAdmin: true,
            });
            await adminUser.save();

            const notAdminUser = new User({
                name: 'Admin User',
                email: 'notadmin@example.com',
                password: "adminpassword", // Use the hashed password
                isAdmin: false,
            });
            await adminUser.save();
            userNotAdmin = await User.findOne({isAdmin: false});

            // Login as admin to obtain token
            const loginRes = await chai.request(app)
                .post('/api/users/login')
                .send({
                    email: 'admin@example.com',
                    password: 'adminpassword', 
                });
            expect(loginRes).to.have.status(200);
            expect(loginRes.body).to.have.property('token');
            adminToken = loginRes.body.token;
        });


        it('should perform operations with admin token', async () => {
            // Perform operations with admin token
            const newUserRes = await chai.request(app)
                .post('/api/users/register')
                .set('Authorization', `${adminToken}`)
                .send({
                    name: 'New User',
                    email: 'newuser@example.com',
                    password: 'password123',
                });
            expect(newUserRes).to.have.status(201);
            
            // Get all users
            const getUsersRes = await chai.request(app)
                .get('/api/users')
                .set('Authorization', `${adminToken}`);
            expect(getUsersRes).to.have.status(200);

            // Update user
            // const updateUserRes = await chai.request(app)
            //     .put(`/api/users/${userNotAdmin._id.toString()}`)
            //     .set('Authorization', `${adminToken}`)
            //     .send({ name: 'Updated User' });
            // expect(updateUserRes).to.have.status(200);

            // Delete user
            // const deleteUserRes = await chai.request(app)
            //     .delete(`/api/users/${userNotAdmin._id}`)
            //     .set('Authorization', `${adminToken}`);
            // expect(deleteUserRes).to.have.status(200);
        });


    });
});
