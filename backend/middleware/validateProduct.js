const { body, query, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Runs after the express-validator chains below and formats errors uniformly
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 120 })
    .withMessage('Product name must be between 2 and 120 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description must be under 2000 characters'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative whole number'),
  body('categories')
    .isArray({ min: 1 })
    .withMessage('Select at least one category')
    .custom((arr) => arr.every((id) => mongoose.Types.ObjectId.isValid(id)))
    .withMessage('One or more category IDs are invalid'),
  handleValidation,
];

const validateListQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('search').optional().isString().trim().isLength({ max: 200 }),
  query('categories').optional().isString(),
  handleValidation,
];

const validateIdParam = [
  param('id').custom((id) => mongoose.Types.ObjectId.isValid(id)).withMessage('Invalid product id'),
  handleValidation,
];

module.exports = { validateCreateProduct, validateListQuery, validateIdParam };
