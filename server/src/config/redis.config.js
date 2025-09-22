import { createClient } from 'redis';
import { logger } from '../routes/route.handler.js';
const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => logger.error('Redis error', err));

await redisClient.connect();
logger.info('Redis conneted');
export default redisClient;
