/** Catches any URL that matched no route. */
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * One place that turns every thrown error into clean JSON.
 * Express 4 only reaches this from async code if you call next(err),
 * so controllers below wrap their bodies in try/catch.
 */
export const errorHandler = (err, req, res, _next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Something went wrong on the server.';

  // Bad ObjectId in the URL, e.g. /api/products/abc
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    status = 404;
    message = 'That record does not exist.';
  }

  // Unique index violation, e.g. duplicate email
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || { field: '' })[0];
    message = `That ${field} is already registered.`;
  }

  // Mongoose schema validation
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join('. ');
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
