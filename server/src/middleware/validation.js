const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Event validation rules
const createEventValidation = [
  body('name')
    .notEmpty()
    .withMessage('Event name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Event name must be between 3 and 100 characters')
    .trim(),
  
  body('mode')
    .isIn(['offline', 'online'])
    .withMessage('Mode must be either "offline" or "online"'),
  
  body('location')
    .if(body('mode').equals('offline'))
    .notEmpty()
    .withMessage('Location is required for offline events')
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters')
    .trim(),
  
  body('slots')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Slots must be a number between 1 and 10'),
  
  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date'),
  
  body('totalSeats')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Total seats must be a number between 1 and 10000'),
  
  body('eventDescription')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Event description must not exceed 1000 characters')
    .trim(),
  
  body('isLive')
    .optional()
    .isBoolean()
    .withMessage('isLive must be a boolean value'),
  
  handleValidationErrors
];

// Get events validation
const getEventsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'startTime', 'totalSeats', 'registrationCount'])
    .withMessage('SortBy must be one of: name, startTime, totalSeats, registrationCount'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either "asc" or "desc"'),
  
  query('mode')
    .optional()
    .isIn(['offline', 'online'])
    .withMessage('Mode must be either "offline" or "online"'),
  
  query('search')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Search query must not exceed 100 characters')
    .trim(),
  
  handleValidationErrors
];

// Get event by ID validation
const getEventByIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid event ID format'),
  
  handleValidationErrors
];

// Book ticket validation
const bookTicketValidation = [
  body('eventId')
    .isMongoId()
    .withMessage('Invalid event ID format'),
  
  handleValidationErrors
];

// Get pass validation
const getPassValidation = [
  body('eventId')
    .isMongoId()
    .withMessage('Invalid event ID format'),
  
  handleValidationErrors
];

// Pass UUID validation
const passUUIDValidation = [
  param('passUUID')
    .notEmpty()
    .withMessage('Pass UUID is required')
    .isLength({ min: 10 })
    .withMessage('Invalid pass UUID format'),
  
  handleValidationErrors
];

// QR and Pass validation
const qrPassValidation = [
  body('passUUID')
    .notEmpty()
    .withMessage('Pass UUID is required')
    .isLength({ min: 10 })
    .withMessage('Invalid pass UUID format'),
  
  body('qrId')
    .isMongoId()
    .withMessage('Invalid QR ID format'),
  
  handleValidationErrors
];

// Can scan validation
const canScanValidation = [
  body('eventId')
    .isMongoId()
    .withMessage('Invalid event ID format'),
  
  handleValidationErrors
];

// Accept pass validation
const acceptPassValidation = [
  body('uuid')
    .notEmpty()
    .withMessage('Pass UUID is required')
    .isLength({ min: 10 })
    .withMessage('Invalid pass UUID format'),
  
  body('qrId')
    .isMongoId()
    .withMessage('Invalid QR ID format'),
  
  handleValidationErrors
];

// Authentication validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  handleValidationErrors
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

const resetPasswordValidation = [
  param('token')
    .isLength({ min: 32 })
    .withMessage('Invalid reset token'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  handleValidationErrors
];

module.exports = {
  createEventValidation,
  getEventsValidation,
  getEventByIdValidation,
  bookTicketValidation,
  getPassValidation,
  passUUIDValidation,
  qrPassValidation,
  canScanValidation,
  acceptPassValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  handleValidationErrors
};
