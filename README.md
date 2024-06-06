User Management Service

Features
User CRUD Operations: The service allows you to perform CRUD operations on user records.
Admin Privileges: Admin users can update, retrieve all users, and delete user records.
User Registration: Normal users can register for an account.
Login Functionality: Both admin and non-admin are able login and they get jwt token.
Admin Token Authorization: Only admin tokens have the ability to modify existing user data.
Immutable Admin Users: Admin users cannot be modified.

Technology
Node.js
Express.js
MongoDB (SQL may be more more adapated since data is sequilize)
Mongoose
bcrypt for hashing passwords
dotenv for env variables
