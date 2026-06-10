/**
 * PRODE-9: Manejo centralizado de errores (OWASP — no filtrar stack en prod)
 * T-Shirt: XS
 */
import { env } from '../config/env.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const payload = { error: err.message || 'Internal server error' };

  if (env.nodeEnv !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}
