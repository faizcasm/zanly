import { AppError, zanlyAi, logger } from '../routes/route.handler.js';

const zanlyAiController = async (req, res, next) => {
  const { prompt } = req.body;
  console.log(req?.body);

  if (!req?.user?.id) {
    logger.error('Zanly AI: You are unauthorized please login!');
    return next(new AppError('Unauthorized', 401));
  }
  if (!prompt) {
    logger.error('Zanly AI: Prompt is missing in request body');
    return next(new AppError('Prompt is required', 400));
  }

  logger.info(`Zanly AI: Received prompt - ${prompt}`);

  const reply =
    (await zanlyAi(prompt)) || 'Something went wrong (possibly limit reached)';
  logger.info(`Zanly AI: Generated reply for prompt - ${prompt}`);
  res.status(200).json({ success: true, reply });
};

export default zanlyAiController;
