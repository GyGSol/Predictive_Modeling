/**
 * PRODE-7 / PRODE-8: Utilidades compartidas de consulta de partidos
 * T-Shirt: S
 */
import { Match } from '../models/Match.model.js';
import { Team } from '../models/Team.model.js';
import { env } from '../config/env.js';

export function buildMatchFilter(query = {}) {
  const { teamId, date, round, status, season } = query;

  const filter = {
    leagueId: env.ligaArgentinaLeagueId,
    season: season ?? env.ligaArgentinaSeason,
  };

  if (teamId) {
    filter.$or = [{ homeTeamId: teamId }, { awayTeamId: teamId }];
  }
  if (round) filter.round = new RegExp(round, 'i');
  if (status) filter.status = status;
  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    filter.kickoff = { $gte: start, $lte: end };
  }

  return filter;
}

export async function fetchEnrichedMatches(filter, limit = 500) {
  const matches = await Match.find(filter).sort({ kickoff: 1 }).limit(limit).lean();
  const teamIds = [...new Set(matches.flatMap((m) => [m.homeTeamId, m.awayTeamId]))];
  const teams = await Team.find({ apiFootballId: { $in: teamIds } }).lean();
  const teamMap = new Map(teams.map((t) => [t.apiFootballId, t]));

  return matches.map((match) => ({
    ...match,
    homeTeam: teamMap.get(match.homeTeamId) || null,
    awayTeam: teamMap.get(match.awayTeamId) || null,
  }));
}
