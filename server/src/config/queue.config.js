import { Queue } from 'bullmq';
import { bullConnection } from '../config/bullq.config.js';

const jobQueue = new Queue('jobQueue', { connection: bullConnection });

export default jobQueue;
