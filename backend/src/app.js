/**
 * PRODE-1 / PRODE-9: Bootstrap Express con cabeceras OWASP
 * T-Shirt: M
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { sanitizeInputs } from './middleware/security.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import healthRoutes from './routes/health.routes.js';
import syncRoutes from './routes/sync.routes.js';
import matchesRoutes from './routes/matches.routes.js';
import reportsRoutes from './routes/reports.routes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: env.nodeEnv === 'production',
      crossOriginEmbedderPolicy: false,
      hsts: env.nodeEnv === 'production',
    })
  );

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use(express.json({ limit: '100kb' }));
  app.use(sanitizeInputs);

  app.use('/api/health', healthRoutes);
  app.use('/api/sync', syncRoutes);
  app.use('/api', matchesRoutes);
  app.use('/api/reports', reportsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
