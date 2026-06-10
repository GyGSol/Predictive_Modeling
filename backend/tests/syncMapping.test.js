/**
 * PRODE-3: Tests de mapeo API-Football → modelos
 * T-Shirt: S
 */
import { mapFixtureToMatch, mapTeamResponse } from '../src/services/syncService.js';

describe('syncService mapping', () => {
  it('maps fixture payload to match document shape', () => {
    const mapped = mapFixtureToMatch({
      fixture: { id: 999, date: '2024-03-10T21:00:00+00:00', status: { short: 'FT' } },
      league: { id: 128, season: 2024, round: 'Regular Season - 5' },
      teams: { home: { id: 435 }, away: { id: 436 } },
      goals: { home: 2, away: 1 },
    });

    expect(mapped.apiFootballId).toBe(999);
    expect(mapped.leagueId).toBe(128);
    expect(mapped.homeTeamId).toBe(435);
    expect(mapped.homeGoals).toBe(2);
    expect(mapped.kickoff).toBeInstanceOf(Date);
  });

  it('maps team payload', () => {
    const mapped = mapTeamResponse(
      {
        team: { id: 435, name: 'River Plate', code: 'RIV', country: 'Argentina', logo: 'x.png' },
      },
      128
    );

    expect(mapped.apiFootballId).toBe(435);
    expect(mapped.name).toBe('River Plate');
    expect(mapped.leagueId).toBe(128);
  });
});
