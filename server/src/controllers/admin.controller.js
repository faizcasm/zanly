import {
  prisma,
  AppError,
  hashPassword,
  logger,
} from '../routes/route.handler.js';
import redisClient from '../config/redis.config.js';
const getAllUsers = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const cacheKey = `users:page:${page}:limit:${limit}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    logger.info(`Fetched users page ${page} from cache`);
    return res.status(200).json(JSON.parse(cached));
  }

  const users = await prisma.user.findMany({
    skip,
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count();
  const totalPages = Math.ceil(total / limit);

  const response = {
    message: 'Users fetched successfully',
    users,
    page: parseInt(page),
    totalPages,
    total,
  };
  if (!response) {
    return next(new AppError('Something went wrong', 400));
  }
  await redisClient.setEx(cacheKey, 300, JSON.stringify(response));

  logger.info(`Fetched users page ${page} from DB`);
  res.status(200).json(response);
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) return next(new AppError('User not found', 404));

  logger.info(`Fetched user: ${user.email}`);
  res.status(200).json({ message: 'User fetched successfully', user });
};

const updateUserByAdmin = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (!user) return next(new AppError('User not found', 404));

  const hashedPassword = password
    ? await hashPassword(password)
    : user.password;

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await redisClient.setEx(`user:${id}`, 300, JSON.stringify(updatedUser));

  logger.info(`Admin updated user: ${updatedUser.email}`);
  res
    .status(200)
    .json({ message: 'User updated successfully', user: updatedUser });
};

const deleteUserByAdmin = async (req, res, next) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (!user) return next(new AppError('User not found', 404));

  await prisma.user.delete({ where: { id: parseInt(id) } });

  await redisClient.del(`user:${id}`);

  logger.info(`Admin deleted user: ${user.email}`);
  res.status(200).json({ message: 'User deleted successfully' });
};

const changeUserRole = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) return next(new AppError('Role is required', 400));

  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (!user) return next(new AppError('User not found', 404));

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  await redisClient.setEx(`user:${id}`, 300, JSON.stringify(updatedUser));

  logger.info(`Admin changed role for user: ${updatedUser.email} to ${role}`);
  res
    .status(200)
    .json({ message: 'User role updated successfully', user: updatedUser });
};

const approveMaterial = async (req, res) => {
  const { materialId } = req.params;
  const material = await prisma.material.update({
    where: { id: parseInt(materialId) },
    data: { status: 'APPROVED' },
  });
  logger.info(`Material approved: ${material.title}`);
  res.json({ message: 'Material approved', material });
};

const rejectMaterial = async (req, res) => {
  const { materialId } = req.params;
  const material = await prisma.material.update({
    where: { id: parseInt(materialId) },
    data: { status: 'REJECTED' },
  });
  logger.info(`Material rejected: ${material.title}`);
  res.json({ message: 'Material rejected', material });
};

const getAllMaterials = async (req, res, next) => {
  const { page = 1, limit = 10, class: className, subject, status } = req.query;
  const skip = (page - 1) * limit;

  const cacheKey = `materials:page:${page}:limit:${limit}:class:${className || ''}:subject:${subject || ''}:status:${status || 'APPROVED'}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    logger.info(`Fetched materials page ${page} from cache`);
    return res.status(200).json(JSON.parse(cached));
  }

  const where = {};
  if (className) where.class = className;
  if (subject) where.subject = subject;
  if (status) where.status = status;
  else where.status = 'PENDING';

  const [materials, total] = await prisma.$transaction([
    prisma.material.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.material.count({ where }),
  ]);

  const response = {
    message: 'Materials fetched successfully',
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    total,
    materials,
  };
  if (!response) {
    return next(new AppError('Something went wrong', 400));
  }
  await redisClient.setEx(cacheKey, 300, JSON.stringify(response));

  logger.info(`Fetched materials page ${page} from DB`);
  res.status(200).json(response);
};

const getMaterialById = async (req, res, next) => {
  const { materialId } = req.params;

  const material = await prisma.material.findUnique({
    where: { id: parseInt(materialId) },
  });

  if (!material) return next(new AppError('Material not found', 404));

  logger.info(`Fetched material: ${material.title}`);
  res.status(200).json({ message: 'Material fetched successfully', material });
};

//notifications
const addNotification = async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return next(new AppError('Title and description are required', 400));
  }

  const notification = await prisma.notification.create({
    data: {
      title,
      description,
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
  });
  await redisClient.del('notifications');

  res.status(201).json({
    status: 'success',
    data: notification,
  });
};

const getNotifications = async (req, res, next) => {
  if (!req?.user?.id) {
    return next(new AppError('Unauthorized', 401));
  }
  const cached = await redisClient.get('notifications');
  if (cached) {
    return res.status(200).json({
      status: 'success',
      data: JSON.parse(cached),
      cached: true,
    });
  }

  const notifications = await prisma.notification.findMany({
    where: {
      expiresAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!notifications) {
    return next(new AppError('No notifications', 400));
  }
  await redisClient.set(
    'notifications',
    JSON.stringify(notifications),
    'EX',
    3600,
  );

  res.status(200).json({
    status: 'success',
    data: notifications,
    cached: false,
  });
};

const cleanupExpiredNotifications = async (req, res, next) => {
  if (!req?.user?.id) {
    return next(new AppError('Unauthorized', 401));
  }
  await prisma.notification.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  await redisClient.del('notifications');

  res.status(200).json({ message: 'Notifications delete' });
};
const clearCache = async (req, res, next) => {
  if (!req?.user?.id) {
    return next(new AppError('Unauthorized', 401));
  }
  await redisClient.flushDb();
  res.status(200).json({ message: 'Redis Cache Cleared' });
};

export {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  changeUserRole,
  approveMaterial,
  rejectMaterial,
  getAllMaterials,
  getMaterialById,
  addNotification,
  getNotifications,
  cleanupExpiredNotifications,
  clearCache,
};
