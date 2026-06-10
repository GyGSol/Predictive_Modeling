/**
 * PRODE-3: Sincronización API-Football → MongoDB
 * T-Shirt: L
 */
import { env } from '../config/env.js';
import { Match } from '../models/Match.model.js';
import { Team } from '../models/Team.model.js';
import { apiFootballClient } from './apiFootball.service.js';
import { predictMatch } from './predictionEngine.service.js';
import { computeTeamStrengths, isFinishedMatch } from './strengthCalibration.service.js';

function mapFixtureToMatch(item) {
  const { fixture, league, teams, goals } = item;
  return {
    apiFootballId: fixture.id,
    leagueId: league.id,
    season: league.season,
    round: league.round || '',
    homeTeamId: teams.home.id,
    awayTeamId: teams.away.id,
    kickoff: new Date(fixture.date),
    status: fixture.status.short,
    homeGoals: goals.home,
    awayGoals: goals.away,
  };
}

function mapTeamResponse(item, leagueId) {
  const { team } = item;
  return {
    apiFootballId: team.id,
    name: team.name,
    code: team.code || '',
    logo: team.logo || '',
    country: team.country || 'Argentina',
    leagueId,
  };
}

export class SyncService {
  constructor(client = apiFootballClient) {
    this.client = client;
  }

  async syncTeams(leagueId = env.ligaArgentinaLeagueId, season = env.ligaArgentinaSeason) {
    const data = await this.client.getTeams({ league: leagueId, season });
    const items = data.response || [];

    let upserted = 0;
    for (const item of items) {
      const payload = mapTeamResponse(item, leagueId);
      await Team.findOneAndUpdate(
        { apiFootballId: payload.apiFootballId },
        { $set: payload },
        { upsert: true, new: true }
      );
      upserted += 1;
    }

    return { leagueId, season, teams: upserted };
  }

  async syncFixtures(leagueId = env.ligaArgentinaLeagueId, season = env.ligaArgentinaSeason) {
    const data = await this.client.getFixtures({ league: leagueId, season });
    const items = data.response || [];

    let upserted = 0;
    for (const item of items) {
      const payload = mapFixtureToMatch(item);
      await Match.findOneAndUpdate(
        { apiFootballId: payload.apiFootballId },
        { $set: payload },
        { upsert: true, new: true }
      );
      upserted += 1;
    }

    return { leagueId, season, fixtures: upserted };
  }

  async calibrateStrengths(leagueId = env.ligaArgentinaLeagueId, season = env.ligaArgentinaSeason) {
    const finished = await Match.find({
      leagueId,
      season,
      status: { $in: ['FT', 'AET', 'PEN'] },
      homeGoals: { $ne: null },
      awayGoals: { $ne: null },
    }).lean();

    const { teams, leagueAverage } = computeTeamStrengths(finished);

    let updated = 0;
    for (const teamStrength of teams) {
      const result = await Team.findOneAndUpdate(
        { apiFootballId: teamStrength.teamId, leagueId },
        {
          $set: {
            attackStrength: teamStrength.attackStrength,
            defenseStrength: teamStrength.defenseStrength,
          },
        }
      );
      if (result) updated += 1;
    }

    return {
      leagueId,
      season,
      leagueAverage,
      teamsCalibrated: updated,
      matchesUsed: finished.length,
    };
  }

  async predictUpcoming(leagueId = env.ligaArgentinaLeagueId, season = env.ligaArgentinaSeason) {
    const upcoming = await Match.find({
      leagueId,
      season,
      status: { $nin: ['FT', 'AET', 'PEN', 'CANC', 'ABD'] },
    });

    const teamIds = [...new Set(upcoming.flatMap((m) => [m.homeTeamId, m.awayTeamId]))];
    const teams = await Team.find({ apiFootballId: { $in: teamIds }, leagueId }).lean();
    const teamMap = new Map(teams.map((t) => [t.apiFootballId, t]));

    let predicted = 0;
    for (const match of upcoming) {
      const home = teamMap.get(match.homeTeamId);
      const away = teamMap.get(match.awayTeamId);
      if (!home || !away) continue;

      const result = predictMatch({
        homeAttack: home.attackStrength,
        homeDefense: home.defenseStrength,
        awayAttack: away.attackStrength,
        awayDefense: away.defenseStrength,
        homeAdvantage: env.homeAdvantage,
        rho: env.dixonColesRho,
      });

      match.predictedHomeGoals = Number(result.expectedHomeGoals.toFixed(2));
      match.predictedAwayGoals = Number(result.expectedAwayGoals.toFixed(2));
      match.probHomeWin = Number(result.probHomeWin.toFixed(4));
      match.probDraw = Number(result.probDraw.toFixed(4));
      match.probAwayWin = Number(result.probAwayWin.toFixed(4));
      await match.save();
      predicted += 1;
    }

    return { leagueId, season, predicted };
  }

  async runFullSync(options = {}) {
    const leagueId = options.leagueId ?? env.ligaArgentinaLeagueId;
    const season = options.season ?? env.ligaArgentinaSeason;

    const teams = await this.syncTeams(leagueId, season);
    const fixtures = await this.syncFixtures(leagueId, season);
    const calibration = await this.calibrateStrengths(leagueId, season);
    const predictions = await this.predictUpcoming(leagueId, season);

    return { teams, fixtures, calibration, predictions };
  }
}

export { isFinishedMatch, mapFixtureToMatch, mapTeamResponse };
export const syncService = new SyncService();
