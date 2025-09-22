import {
  AppError,
  cloudinary,
  generateOtp,
  generateToken,
  hashPassword,
  prisma,
  sendMail,
  verifyPassword,
  redisClient,
  logger,
  cookieOptions,
} from '../routes/route.handler.js';
import fs from 'fs';

const SignUp = async (req, res, next) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password)
    return next(new AppError('All fields are required', 400));

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return next(new AppError('User already exists', 400));

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });

  await redisClient.setEx(`user:${user.id}`, 300, JSON.stringify(user));

  logger.info(`New user signed up: ${user.email}`);
  res.status(200).json({ message: 'Signup complete', user });
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('All fields are required', 400));

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return next(new AppError('Invalid email or password', 400));

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return next(new AppError('Invalid email or password', 400));

  const token = generateToken(user);
  res.cookie('token', token, cookieOptions);

  await redisClient.setEx(`user:${user.id}`, 300, JSON.stringify(user));

  logger.info(`User logged in: ${user.email}`);
  res.status(200).json({ message: 'Login success', token, user });
};

const Logout = async (req, res, next) => {
  const userId = req?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
  if (!user) return next(new AppError('Unauthorized', 401));

  res.clearCookie('token', { httpOnly: true, secure: true });
  logger.info(`User logged out: ${user.email}`);
  res.status(200).json({ message: 'Logout success' });
};

const getUser = async (req, res, next) => {
  const userId = parseInt(req?.user?.id);
  const cachedUser = await redisClient.get(`user:${userId}`);
  let user;
  if (cachedUser) {
    user = JSON.parse(cachedUser);
  } else {
    user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return next(new AppError('Unauthorized', 401));
    await redisClient.setEx(`user:${userId}`, 300, JSON.stringify(user));
  }

  logger.info(`User data fetched: ${user.email}`);
  res.status(200).json({ message: 'User data fetched', user });
};

const updateUser = async (req, res, next) => {
  const { newName, newEmail, newPassword } = req.body;
  const imagePath = req.file?.path;

  const userId = parseInt(req?.user?.id);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return next(new AppError('Unauthorized', 401));

  let cloudResult = {};
  if (imagePath) {
    cloudResult = await cloudinary.uploader.upload(imagePath, {
      folder: 'zanly_users',
    });
    fs.unlinkSync(imagePath);
  }

  const hashedPassword = newPassword
    ? await hashPassword(newPassword)
    : user.password;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: newName || user.name,
      email: newEmail || user.email,
      password: hashedPassword,
      image: cloudResult.secure_url || user.image,
      publicId: cloudResult.public_id || user.publicId,
    },
  });

  await redisClient.setEx(`user:${userId}`, 300, JSON.stringify(updatedUser));

  logger.info(`User updated: ${updatedUser.email}`);
  res
    .status(200)
    .json({ message: 'User updated successfully', user: updatedUser });
};

const deleteAccount = async (req, res, next) => {
  const userId = parseInt(req?.user?.id);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return next(new AppError('Unauthorized', 401));

  if (user.publicId) await cloudinary.uploader.destroy(user.publicId);

  await prisma.user.delete({ where: { id: userId } });
  await redisClient.del(`user:${userId}`);

  res.clearCookie('token', cookieOptions);
  logger.info(`User deleted: ${user.email}`);
  res.status(200).json({ message: 'Account deleted successfully' });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Please provide a valid email', 400));

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return next(new AppError('Email does not exist', 404));

  const otp = generateOtp(6);
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpiry: expiry },
  });

  await sendMail({ Otp: otp, email: user.email, name: user.name });

  logger.info(`OTP sent for password reset: ${user.email}`);
  res.status(200).json({ message: 'OTP sent to your email' });
};

const resetPassword = async (req, res, next) => {
  const { otp, newPassword } = req.body;
  if (!otp || !newPassword)
    return next(new AppError('Please provide OTP and new password', 400));

  const user = await prisma.user.findFirst({ where: { otp } });
  if (!user) return next(new AppError('Invalid OTP', 400));
  if (!user.otpExpiry || new Date() > user.otpExpiry)
    return next(new AppError('OTP expired', 400));

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, otp: null, otpExpiry: null },
  });

  logger.info(`Password reset successfully: ${user.email}`);
  res.status(200).json({ message: 'Password reset successfully' });
};

export {
  SignUp,
  Login,
  Logout,
  getUser,
  updateUser,
  deleteAccount,
  forgotPassword,
  resetPassword,
};
