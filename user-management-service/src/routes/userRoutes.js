const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminAuthMiddleware');
const { validateRegisterUser, validateLoginUser } = require('../utils/validator');


router.post('/register', validateRegisterUser, registerUser);
router.post('/login', validateLoginUser, loginUser);
router.get('/', auth, admin, getUsers);//only admin can getUsers
router.put('/:id', auth, admin, updateUser);//only admin can updateUser
router.delete('/:id', auth, admin, deleteUser);//only admin can deleteUser

module.exports = router;
