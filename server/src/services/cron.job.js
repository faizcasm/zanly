import cron from 'node-cron';
import axios from 'axios';
import { logger } from '../routes/route.handler.js';
export const startCronJob = (url) => {
  cron.schedule(`*/${process.env.CRON_TIME} * * * *`, async () => {
    try {
      const response = await axios.get(url);
      logger.info(`Cron job success: ${url} - Status: ${response.status}`);
    } catch (error) {
      logger.error(`Cron job failed: ${url}`, error);
    }
  });

  logger.info(
    `Cron job started: Sending request to ${url} every ${process.env.CRON_TIME} minutes`,
  );
};
