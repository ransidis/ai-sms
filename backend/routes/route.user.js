const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller.user');

// Route to get user by Id
router.get('/details/:id', userController.getUserByID);

// Route to get user by Id
router.get('/all', userController.getAllUsers);

// Route to login a user (email, password)
router.post('/auth', userController.loginUser);

// Route to login a user via google
router.post('/auth/google', userController.googleLogin);

// Route to request password reset (email)
router.post('/reset-password', userController.responseResetLink);

// Route to request password reset (token, newPassword)
router.put('/update-password', userController.updatePassword);

module.exports = router;
