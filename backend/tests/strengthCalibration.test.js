/**
 * PRODE-6: Tests de calibración de coeficientes
 * T-Shirt: M
 */
import { computeTeamStrengths, isFinishedMatch } from '../src/services/strengthCalibration.service.js';

describe('strengthCalibration', () => {
  it('detects finished match statuses', () => {
    expect(isFinishedMatch('FT')).toBe(true);
    expect(isFinishedMatch('NS')).toBe(false);
  });

  it('computes attack and defense strengths vs league average', () => {
    const finished = [
      { homeTeamId: 1, awayTeamId: 2, homeGoals: 2, awayGoals: 0 },
      { homeTeamId: 2, awayTeamId: 1, homeGoals: 1, awayGoals: 1 },
    ];

    const { teams, leagueAverage } = computeTeamStrengths(finished);

    expect(leagueAverage).toBe(1);
    expect(teams).toHaveLength(2);

    const team1 = teams.find((t) => t.teamId === 1);
    const team2 = teams.find((t) => t.teamId === 2);

    expect(team1.attackStrength).toBeGreaterThan(team2.attackStrength);
    expect(team2.defenseStrength).toBeGreaterThan(team1.defenseStrength);
  });

  it('returns empty result when no matches provided', () => {
    const result = computeTeamStrengths([]);
    expect(result.teams).toEqual([]);
    expect(result.leagueAverage).toBe(0);
  });
});
