import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
//app imports
import {
  app,
  logger,
  rateLimiting,
  startCronJob,
  passport,
  errorHandler,
  prisma,
} from './routes/route.handler.js';
import userRouter from './routes/index.user.js';
import adminRouter from './routes/index.admin.js';
if(prisma){
  logger.info('Database connected');
}
const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.NODE_ENV === 'development' ? `http://localhost:${PORT}`: process.env.SERVER_URL; 
const time = parseInt(process.env.RATE_LIMIT_TIME);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQ);
const message = process.env.RATE_LIMIT_MESSAGE;
const stream = {
  write: (message) => logger.http(message.trim()),
};
//security
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(hpp());
app.use(rateLimiting(time, maxRequests, message));
//other middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream }));
app.use(passport.initialize());
app.use('/api/v1/', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Server is running');
});
app.get('/health', (req, res) => {
  res.json({ message: 'Server health is good', uptime: process.uptime() });
});
app.listen(PORT, () => {
  logger.info('Server started at port',PORT);
  logger.info(`${SERVER_URL}`);
});
startCronJob('http://localhost:3000');
