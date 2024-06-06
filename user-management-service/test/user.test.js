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

        before(async () => {
            // mock admin user
            const adminPassword = await bcrypt.hash('adminpassword', 10);
            const adminUser = new User({
                name: 'Admin User',
                email: 'admin@example.com',
                password: adminPassword,
                isAdmin: true,
            });
            await adminUser.save();

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

    
    });
});
