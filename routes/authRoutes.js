const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
} = require('../controllers/authController');

const {
  registerValidationRules,
  loginValidationRules,
  forgotPasswordValidationRules,
  resetPasswordValidationRules,
  passwordValidationRules,
} = require('../utils/validators');

const { auth } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', registerValidationRules, register);
router.post('/login', loginValidationRules, login);
router.post('/forgotpassword', forgotPasswordValidationRules, forgotPassword);
router.put('/resetpassword/:resettoken', [...passwordValidationRules], resetPassword);

// Protected routes
router.use(auth); // All routes below require authentication
router.get('/me', getMe);
router.put('/updatepassword', [...passwordValidationRules], updatePassword);
router.get('/logout', logout);

module.exports = router;