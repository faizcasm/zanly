import jwt from 'jsonwebtoken';
import { AppError } from '../routes/route.handler.js';

export const authMiddleware = (req, res, next) => {
  try {
    let token;

    if (req?.cookies?.token) {
      token = req.cookies.token;
    } else if (req?.headers?.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication token not found', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired, please login again', 401));
    }

    return next(new AppError('Authentication failed', 401));
  }
};
