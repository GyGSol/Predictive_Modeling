/**
 * PRODE-3: Rutas de sincronización
 * T-Shirt: S
 */
import { Router } from 'express';
import { postCalibrate, postSync } from '../controllers/sync.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { syncBodySchema } from '../schemas/api.schema.js';

const router = Router();

router.post('/', validate(syncBodySchema), postSync);
router.post('/calibrate', validate(syncBodySchema), postCalibrate);

export default router;
