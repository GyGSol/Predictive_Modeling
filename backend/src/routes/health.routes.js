/**
 * PRODE-1: Rutas de health check
 * T-Shirt: XS
 */
import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';

const router = Router();

router.get('/', getHealth);

export default router;
