import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../config/redis.config.js';
function rateLimiting(time, max, message) {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
      prefix: 'rl:',
      expiry: 60,
    }),
    windowMs: time,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message,
  });
}

export default rateLimiting;
