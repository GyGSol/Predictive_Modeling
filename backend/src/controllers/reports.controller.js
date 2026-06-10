/**
 * PRODE-10 / PRODE-11: Controlador de reportes y exportación
 * T-Shirt: M
 */
import { env } from '../config/env.js';
import { Match } from '../models/Match.model.js';
import { runWalkForwardBacktest } from '../services/backtesting.service.js';
import { buildMatchFilter, fetchEnrichedMatches } from '../services/matchQuery.service.js';
import { matchesToCsv } from '../services/reportExport.service.js';

export async function getBacktestReport(req, res, next) {
  try {
    const { season } = req.query;

    const finished = await Match.find({
      leagueId: env.ligaArgentinaLeagueId,
      season: season ?? env.ligaArgentinaSeason,
      status: { $in: ['FT', 'AET', 'PEN'] },
      homeGoals: { $ne: null },
      awayGoals: { $ne: null },
    })
      .sort({ kickoff: 1 })
      .lean();

    const report = runWalkForwardBacktest(finished, {
      homeAdvantage: env.homeAdvantage,
      rho: env.dixonColesRho,
    });

    res.json({
      leagueId: env.ligaArgentinaLeagueId,
      season: season ?? env.ligaArgentinaSeason,
      method: 'walk-forward',
      ...report,
      details: report.details.slice(-20),
    });
  } catch (error) {
    next(error);
  }
}

export async function exportMatchesCsv(req, res, next) {
  try {
    const filter = buildMatchFilter(req.query);
    const matches = await fetchEnrichedMatches(filter, req.query.limit);
    const csv = matchesToCsv(matches);
    const season = req.query.season ?? env.ligaArgentinaSeason;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="predictive-modeling-${season}.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
}
