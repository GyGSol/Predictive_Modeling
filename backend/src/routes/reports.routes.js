/**
 * PRODE-10 / PRODE-11: Rutas de reportes
 * T-Shirt: S
 */
import { Router } from 'express';
import { exportMatchesCsv, getBacktestReport } from '../controllers/reports.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { backtestQuerySchema, exportQuerySchema } from '../schemas/api.schema.js';

const router = Router();

router.get('/backtest', validate(backtestQuerySchema, 'query'), getBacktestReport);
router.get('/export.csv', validate(exportQuerySchema, 'query'), exportMatchesCsv);

export default router;
