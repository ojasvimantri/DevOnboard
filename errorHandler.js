const logger = require('../config/logger');

/**
 * Global error handler — must be the last middleware registered in app.js.
 * Handles known error types and falls back to a generic 500 for unexpected errors.
 */
function errorHandler(err, req, res, next) {
  // Knex / PostgreSQL unique constraint violation
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  // Knex / PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced resource does not exist' });
  }

  // JWT errors (should be caught upstream, but just in case)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Known operational errors (thrown intentionally)
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }

  // Unknown errors — log and return generic response
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : err.message,
  });
}

module.exports = { errorHandler };
