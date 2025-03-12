const { body } = require('express-validator');
const config = require('../config/default');

// Password validation rules
exports.passwordValidationRules = [
  body('password')
    .isLength({ min: config.passwordPolicy.minLength })
    .withMessage(`Password must be at least ${config.passwordPolicy.minLength} characters long`)
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
];

// Registration validation rules
exports.registerValidationRules = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  ...this.passwordValidationRules,
  body('role')
    .optional()
    .isIn([config.roles.INTERVIEWER, config.roles.APPLICANT])
    .withMessage('Invalid role specified'),
];

// Login validation rules
exports.loginValidationRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').not().isEmpty().withMessage('Password is required'),
];

// Reset password validation rules
exports.forgotPasswordValidationRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
];

// Reset password validation rules
exports.resetPasswordValidationRules = [
  body('resetToken').not().isEmpty().withMessage('Reset token is required'),
  ...this.passwordValidationRules,
];