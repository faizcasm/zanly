import {
  AppError,
  prisma,
  logger,
} from '../routes/route.handler.js';
import redisClient from '../config/redis.config.js';
const addBookmark = async (req, res, next) => {
  const { materialId } = req.body;
  const userId = req.user.id;

  if (!materialId) {
    logger.warn(`User ${userId} tried to add bookmark without materialId`);
    return next(new AppError('Material ID is required', 400));
  }

  const material = await prisma.material.findUnique({
    where: { id: Number(materialId) },
  });
  if (!material) {
    logger.warn(
      `User ${userId} tried to bookmark non-existing material ${materialId}`,
    );
    return next(new AppError('Material not found', 404));
  }

  const bookmark = await prisma.bookmark.create({
    data: { userId, materialId: Number(materialId) },
  });

  await redisClient.del(`zanly:bookmarks:${userId}`);
  logger.info(`User ${userId} added bookmark for material ${materialId}`);

  res.status(201).json({
    success: true,
    message: 'Bookmark added successfully',
    bookmark,
  });
};

const removeBookmark = async (req, res, next) => {
  const { materialId } = req.params;
  const userId = req.user.id;

  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_materialId: {
        userId,
        materialId: Number(materialId),
      },
    },
  });

  if (!bookmark) {
    logger.warn(
      `User ${userId} tried to remove non-existing bookmark for material ${materialId}`,
    );
    return next(new AppError('Bookmark not found', 404));
  }

  await prisma.bookmark.delete({
    where: { id: bookmark.id },
  });

  await redisClient.del(`zanly:bookmarks:${userId}`);
  logger.info(`User ${userId} removed bookmark for material ${materialId}`);

  res.status(200).json({
    success: true,
    message: 'Bookmark removed successfully',
  });
};

const getMyBookmarks = async (req, res, next) => {
  const userId = req.user.id;
  const cacheKey = `zanly:bookmarks:${userId}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    logger.info(`Bookmarks served from cache for user ${userId}`);
    return res.status(200).json({
      success: true,
      source: 'cache',
      bookmarks: JSON.parse(cached),
    });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: { material: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!bookmarks || bookmarks.length === 0) {
    logger.warn(`No bookmarks found for user ${userId}`);
    return next(new AppError('No bookmarks found', 404));
  }

  await redisClient.set(cacheKey, JSON.stringify(bookmarks), {
    EX: 60 * 10,
  });

  logger.info(`Bookmarks served from DB and cached for user ${userId}`);

  res.status(200).json({
    success: true,
    source: 'db',
    bookmarks,
  });
};

export { addBookmark, removeBookmark, getMyBookmarks };
