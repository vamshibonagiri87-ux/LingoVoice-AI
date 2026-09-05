const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(`[Error Middleware] ${err.name || 'Error'}: ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id ${err.value}`;
    return res.status(404).json({
      success: false,
      code: 'RESOURCE_NOT_FOUND',
      error: message
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    return res.status(400).json({
      success: false,
      code: 'DUPLICATE_KEY',
      error: message
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      error: message
    });
  }

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || (statusCode === 404 ? 'NOT_FOUND' : 'SERVER_ERROR');

  res.status(statusCode).json({
    success: false,
    code: errorCode,
    error: error.message || 'Internal Server Error'
  });
};

module.exports = { errorHandler };
