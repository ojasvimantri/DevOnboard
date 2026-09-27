const { validationResult } = require('express-validator');

/**
 * Middleware: Reads express-validator errors from the request and returns
 * a 400 response with a structured error list if any validation failed.
 * Must be placed after the validation chain in the route definition.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { validate };
