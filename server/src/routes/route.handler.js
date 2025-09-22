//app
import app from '../app.js';
import { startCronJob } from '../services/cron.job.js';
//config
import cloudinary from '../config/cloudinary.config.js';
import prisma from '../config/db.config.js';
import logger from '../config/logger.config.js';
import { upload } from '../config/multer.config.js';
import redisClient from '../config/redis.config.js';

//middlewares
import { authMiddleware } from '../middlewares/auth.middleware.js';
import errorHandler from '../middlewares/error.handler.middleware.js';
import { roleBaseAuth } from '../middlewares/rbac.middleware.js';
import { oauthCallback, passport } from '../config/passport.config.js';

//services
import { generateToken } from '../services/generate.token.js';
import generateOtp from '../services/generate.otp.js';
import AppError from '../services/error.handler.js';
import hashPassword from '../services/generate.bcrypt.js';
import verifyPassword from '../services/compare.bcrypt.js';
import sendMail from '../services/mailer.service.js';
import rateLimiting from '../services/rate.limit.js';
import cookieOptions from '../services/cookie.options.js';
//user controller
import {
  SignUp,
  Login,
  Logout,
  updateUser,
  deleteAccount,
  getUser,
  forgotPassword,
  resetPassword,
} from '../controllers/user.controller.js';

//admin-controllers
import {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  changeUserRole,
  approveMaterial,
  rejectMaterial,
  getAllMaterials,
  getMaterialById,
} from '../controllers/admin.controller.js';

//student-controls
import {
  getMaterials,
  uploadMaterial,
  searchMaterials,
  filterMaterials,
} from '../controllers/student.controller.js';
export {
  //app
  app,
  startCronJob,
  //configs
  cloudinary,
  prisma,
  logger,
  upload,
  redisClient,
  //middlewares
  authMiddleware,
  errorHandler,
  roleBaseAuth,
  oauthCallback,
  passport,
  //services
  generateOtp,
  generateToken,
  hashPassword,
  verifyPassword,
  AppError,
  sendMail,
  rateLimiting,
  cookieOptions,

  //usercontrollers
  SignUp,
  Login,
  Logout,
  updateUser,
  deleteAccount,
  getUser,
  forgotPassword,
  resetPassword,

  //admin-controllers
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  changeUserRole,
  approveMaterial,
  rejectMaterial,
  getAllMaterials,
  getMaterialById,

  //student-controls
  getMaterials,
  uploadMaterial,
  searchMaterials,
  filterMaterials,
};
