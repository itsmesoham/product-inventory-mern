// Central error handler — converts Mongoose/duplicate-key/cast errors into
// clean, consistent JSON responses instead of leaking stack traces.
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Duplicate key (e.g. duplicate product name)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || { name: 1 })[0];
    return res.status(409).json({
      success: false,
      message: `A product with this ${field} already exists`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Invalid ObjectId cast
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}` });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFound };
