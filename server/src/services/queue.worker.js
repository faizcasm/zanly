import { Worker } from 'bullmq';
import { logger, sendMail } from '../routes/route.handler.js';
import { bullConnection } from '../config/bullq.config.js';

const worker = new Worker(
  'jobQueue',
  async (job) => {
    try {
      const { to, name, emailType, Otp } = job.data;
      logger.info(Otp);
      if (!to || !name || !emailType) {
        throw new Error('Missing required email fields');
      }
      await sendMail({
        Otp: Otp || null,
        email: to,
        name,
        emailType,
      });

      logger.info(`✅ Email (${emailType}) successfully sent to ${to}`);
    } catch (error) {
      logger.error(`❌ Failed to process job ${job.id}:`, error);
      throw error; 
    }
  },
  { connection: bullConnection }
);

worker.on('completed', (job) =>
  logger.info(`🎉 Job ${job.id} completed successfully`)
);
worker.on('failed', (job, err) =>
  logger.error(`💥 Job ${job?.id || 'unknown'} failed:`, err)
);
