import {
  prisma,
  logger,
  AppError,
  cloudinary,
} from '../routes/route.handler.js';
import redisClient from '../config/redis.config.js';
import mime from 'mime-types';
import fs from 'fs';
const uploadMaterial = async (req, res, next) => {
  const { title, description, class: className, subject, type } = req.body;
  const file = req.file;
  console.log(file);

  if (!title || !className || !subject || !type || !file) {
    return next(
      new AppError('Title, class, subject, type, and file are required', 400),
    );
  }

  if (file.size > 10 * 1024 * 1024)
    return next(new AppError('File size cannot exceed 10MB', 400));

  const mimeType = file.mimetype || mime.lookup(file.originalname);
  // 2️⃣ Choose correct resource type
  let resourceType = 'raw';
  if (mimeType?.startsWith('image/')) resourceType = 'image';
  else if (mimeType?.startsWith('video/')) resourceType = 'video';
  else resourceType = 'raw'; // default for pdf, docs, zips, etc.
  const cloudResult = await cloudinary.uploader.upload(file.path, {
    folder: 'study_materials',
    resource_type: resourceType,
    format: mimeType.split('/')[1],
  });
  fs.unlinkSync(file.path);
  const material = await prisma.material.create({
    data: {
      title,
      description,
      fileUrl: cloudResult.secure_url,
      publicId: cloudResult.public_id,
      fileType: file.mimetype,
      class: className,
      subject,
      type,
      uploadedById: req.user.id,
    },
  });

  await redisClient.del(
    `materials:class:${className}:subject:${subject}:type:${type}`,
  );

  logger.info(`Material uploaded by ${req.user.email} to Cloudinary`);

  res.status(201).json({ message: 'Material uploaded', material });
};

const getMaterials = async (req, res) => {
  const { page = 1, limit = 10, class: className, subject } = req.query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const cacheKey = `materials:page:${page}:limit:${limit}:class:${className || 'all'}:subject:${subject || 'all'}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return res.status(200).json(JSON.parse(cached));

  const where = { status: 'APPROVED' };
  if (className) where.class = className;
  if (subject) where.subject = subject;

  const [materials, total] = await prisma.$transaction([
    prisma.material.findMany({
      where,
      skip,
      take: parseInt(limit, 10),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.material.count({ where }),
  ]);

  const response = {
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / limit),
    total,
    materials,
  };
  await redisClient.setEx(cacheKey, 300, JSON.stringify(response));

  res.status(200).json(response);
};

const searchMaterials = async (req, res, next) => {
  const { q, page = 1, limit = 10 } = req.query;
  if (!q) return next(new AppError('Search query is required', 400));

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const cacheKey = `materials:search:${q}:page:${page}:limit:${limit}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    logger.info(`Materials search for "${q}" fetched from cache`);
    return res.status(200).json(JSON.parse(cached));
  }

  const where = {
    AND: [
      { status: 'APPROVED' },
      {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
    ],
  };

  const [materials, total] = await prisma.$transaction([
    prisma.material.findMany({
      where,
      skip,
      take: parseInt(limit, 10),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.material.count({ where }),
  ]);

  const response = {
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / limit),
    total,
    materials,
  };
  await redisClient.setEx(cacheKey, 300, JSON.stringify(response));

  logger.info(`Materials search for "${q}" fetched from DB`);
  res.status(200).json(response);
};

const filterMaterials = async (req, res, next) => {
  const { type, class: className, subject, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  if (!type && !className && !subject) {
    return next(
      new AppError(
        'At least one filter (type, class, or subject) is required',
        400,
      ),
    );
  }

  const cacheKey = `materials:filter:type:${type || 'all'}:class:${className || 'all'}:subject:${subject || 'all'}:page:${page}:limit:${limit}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    logger.info('Filtered materials fetched from cache');
    return res.status(200).json(JSON.parse(cached));
  }

  const where = { status: 'APPROVED' };
  if (type) where.type = type;
  if (className) where.class = className;
  if (subject) where.subject = subject;

  const [materials, total] = await prisma.$transaction([
    prisma.material.findMany({
      where,
      skip,
      take: parseInt(limit, 10),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.material.count({ where }),
  ]);

  const response = {
    page: parseInt(page, 10),
    totalPages: Math.ceil(total / limit),
    total,
    materials,
  };
  await redisClient.setEx(cacheKey, 300, JSON.stringify(response));

  logger.info('Filtered materials fetched from DB');
  res.status(200).json(response);
};

export { uploadMaterial, getMaterials, searchMaterials, filterMaterials };
