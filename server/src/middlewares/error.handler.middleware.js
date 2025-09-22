import { logger } from '../routes/route.handler.js'; // adjust path if needed

const errorHandler = (err, req, res, next) => {
  // If headers are already sent, let Express handle it
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Internal Server Error';

  logger.error({
    message,
    statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
