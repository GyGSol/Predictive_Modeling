/**
 * PRODE-6: Estimación de coeficientes ofensivos (A) y defensivos (D)
 * T-Shirt: L
 *
 * Normaliza goles a favor/en contra vs la media de la liga (modelo Poisson clásico).
 */
const FINISHED_STATUSES = new Set(['FT', 'AET', 'PEN']);

export function isFinishedMatch(status) {
  return FINISHED_STATUSES.has(status);
}

export function computeTeamStrengths(finishedMatches) {
  if (!finishedMatches.length) {
    return { teams: [], leagueAverage: 0 };
  }

  const stats = new Map();

  const ensureTeam = (teamId) => {
    if (!stats.has(teamId)) {
      stats.set(teamId, { teamId, goalsFor: 0, goalsAgainst: 0, played: 0 });
    }
    return stats.get(teamId);
  };

  let totalGoals = 0;

  for (const match of finishedMatches) {
    const { homeTeamId, awayTeamId, homeGoals, awayGoals } = match;
    if (homeGoals == null || awayGoals == null) continue;

    totalGoals += homeGoals + awayGoals;

    const home = ensureTeam(homeTeamId);
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    home.played += 1;

    const away = ensureTeam(awayTeamId);
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;
    away.played += 1;
  }

  const leagueAverage = totalGoals / (2 * finishedMatches.length) || 1;

  const teams = [...stats.values()].map((team) => ({
    teamId: team.teamId,
    attackStrength: Number((team.goalsFor / team.played / leagueAverage).toFixed(4)),
    defenseStrength: Number((team.goalsAgainst / team.played / leagueAverage).toFixed(4)),
    played: team.played,
  }));

  return { teams, leagueAverage: Number(leagueAverage.toFixed(4)) };
}
