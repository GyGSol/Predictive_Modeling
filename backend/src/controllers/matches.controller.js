/**
 * PRODE-7 / PRODE-8: Controlador de partidos y predicciones
 * T-Shirt: M
 */
import { Team } from '../models/Team.model.js';
import { env } from '../config/env.js';
import { buildMatchFilter, fetchEnrichedMatches } from '../services/matchQuery.service.js';

export async function getMatches(req, res, next) {
  try {
    const filter = buildMatchFilter(req.query);
    const enriched = await fetchEnrichedMatches(filter, req.query.limit);

    res.json({ count: enriched.length, matches: enriched });
  } catch (error) {
    next(error);
  }
}

export async function getTeams(req, res, next) {
  try {
    const teams = await Team.find({ leagueId: env.ligaArgentinaLeagueId })
      .sort({ name: 1 })
      .lean();
    res.json({ count: teams.length, teams });
  } catch (error) {
    next(error);
  }
}
