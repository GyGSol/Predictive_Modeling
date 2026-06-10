/**
 * PRODE-7 / PRODE-8: Rutas de partidos y equipos
 * T-Shirt: S
 */
import { Router } from 'express';
import { getMatches, getTeams } from '../controllers/matches.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { matchesQuerySchema } from '../schemas/api.schema.js';

const router = Router();

router.get('/matches', validate(matchesQuerySchema, 'query'), getMatches);
router.get('/teams', getTeams);

export default router;
