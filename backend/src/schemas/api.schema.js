/**
 * PRODE-3 / PRODE-8: Esquemas Zod para sync y consulta de partidos
 * T-Shirt: S
 */
import { z } from 'zod';

export const syncBodySchema = z.object({
  leagueId: z.number().int().positive().optional(),
  season: z.number().int().min(2000).max(2100).optional(),
});

export const matchesQuerySchema = z.object({
  teamId: z.coerce.number().int().positive().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD')
    .optional(),
  round: z.string().trim().min(1).optional(),
  status: z.string().trim().min(1).optional(),
  season: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const exportQuerySchema = matchesQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(500).default(500),
});

export const backtestQuerySchema = z.object({
  season: z.coerce.number().int().optional(),
});
