import { body, validationResult } from 'express-validator';

export const validateUser = [
  body('firstName')
    .isString()
    .notEmpty()
    .withMessage('Please provide your firstname'),
  body('lastName')
    .isString()
    .notEmpty()
    .withMessage('Please provide your lastname'),
  body('email')
    .isEmail()
    .withMessage('Please provide your email'),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Please provide your password, it must be at least 6 characters long'),
  body('phoneNumber')
    .optional()
    .isString()
    .withMessage('Please provide your phone number'),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        })),
      })
    }
    next()
  }
]
