const { body, param, query } = require('express-validator');

// ── Auth ──────────────────────────────────────────────────────────────────────
exports.signupRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 80 }).withMessage('Name too long'),
  body('email').trim().isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((val, { req }) => {
    if (val !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
  body('role').optional()
    .isIn(['customer', 'provider']).withMessage('Role must be customer or provider'),
];

exports.loginRules = [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.updateProfileRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 80 }).withMessage('Name too long'),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
];

// ── Services ──────────────────────────────────────────────────────────────────
exports.createServiceRules = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 120 }).withMessage('Title too long'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description too long'),
  body('category').trim().notEmpty().withMessage('Category is required')
    .isLength({ max: 80 }).withMessage('Category too long'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location').trim().notEmpty().withMessage('Location is required')
    .isLength({ max: 120 }).withMessage('Location too long'),
];

exports.updateServiceRules = [
  body('title').optional().trim().isLength({ min: 1, max: 120 }).withMessage('Title invalid'),
  body('description').optional().trim().isLength({ min: 1, max: 2000 }).withMessage('Description invalid'),
  body('category').optional().trim().isLength({ min: 1, max: 80 }).withMessage('Category invalid'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location').optional().trim().isLength({ min: 1, max: 120 }).withMessage('Location invalid'),
];

exports.serviceQueryRules = [
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
];

// ── Messages ──────────────────────────────────────────────────────────────────
exports.sendMessageRules = [
  body('serviceId').trim().notEmpty().withMessage('serviceId is required')
    .isMongoId().withMessage('Invalid serviceId'),
  body('content').trim().notEmpty().withMessage('Message content is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Message must be 10–1000 characters'),
];

// ── Users (Admin) ─────────────────────────────────────────────────────────────
exports.updateRoleRules = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('role').isIn(['customer', 'provider', 'admin']).withMessage('Invalid role'),
];

exports.userIdParamRules = [
  param('id').isMongoId().withMessage('Invalid user ID'),
];

// ── Categories ────────────────────────────────────────────────────────────────
exports.createCategoryRules = [
  body('name').trim().notEmpty().withMessage('Category name is required')
    .isLength({ max: 80 }).withMessage('Name too long')
    .matches(/^[a-zA-Z0-9 &\-]+$/).withMessage('Name contains invalid characters'),
];

exports.categoryIdParamRules = [
  param('id').isMongoId().withMessage('Invalid category ID'),
];
