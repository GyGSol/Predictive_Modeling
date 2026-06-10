/**
 * PRODE-1: Punto de entrada del servidor
 * T-Shirt: S
 */
import { createApp } from './app.js';
import { env } from './config/env.js';
import { db } from './config/db.js';

async function bootstrap() {
  await db.connect();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Predictive Modeling API listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
