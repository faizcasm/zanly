import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import client from 'prom-client';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config.js';
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
if (prisma) {
  logger.info('Database connected');
}
const register = new client.Registry();
client.collectDefaultMetrics({ register });
// Count total HTTP requests
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  buckets :[10,20,50,100,300,400,1000,1500,2000]
});

// Measure request duration
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});
// Register custom metrics
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
  });
  next();
});

//swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 4000;
// const SERVER_URL =
//   process.env.NODE_ENV === 'development'
//     ? `http://localhost:${PORT}`
//     : process.env.SERVER_URL;
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
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.listen(PORT,'0.0.0.0' ,() => {
  logger.info('Server started at port', PORT);
  logger.info('http://localhost:4000');
  logger.info(`📊 Metrics available at http://localhost:${PORT}/metrics`);
});
startCronJob('http://localhost:4000');
