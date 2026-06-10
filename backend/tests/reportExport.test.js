/**
 * PRODE-11: Tests de exportación CSV
 * T-Shirt: S
 */
import { impliedOdds, matchToCsvRow, matchesToCsv } from '../src/services/reportExport.service.js';

describe('reportExport', () => {
  it('computes implied decimal odds', () => {
    expect(impliedOdds(0.5)).toBe('2.00');
    expect(impliedOdds(0)).toBe('');
  });

  it('builds csv rows with escaped team names', () => {
    const row = matchToCsvRow({
      kickoff: new Date('2024-03-10T21:00:00.000Z'),
      round: 'Regular Season - 5',
      homeTeam: { name: 'River, Plate' },
      awayTeam: { name: 'Boca Juniors' },
      status: 'NS',
      homeGoals: null,
      awayGoals: null,
      probHomeWin: 0.45,
      probDraw: 0.28,
      probAwayWin: 0.27,
      predictedHomeGoals: 1.5,
      predictedAwayGoals: 1.1,
    });

    expect(row).toContain('"River, Plate"');
    expect(row).toContain('2.22');
  });

  it('generates csv with header and rows', () => {
    const csv = matchesToCsv([
      {
        kickoff: new Date('2024-03-10T21:00:00.000Z'),
        round: 'R1',
        homeTeam: { name: 'A' },
        awayTeam: { name: 'B' },
        status: 'FT',
        homeGoals: 2,
        awayGoals: 1,
        probHomeWin: 0.4,
        probDraw: 0.3,
        probAwayWin: 0.3,
        predictedHomeGoals: 1.4,
        predictedAwayGoals: 1.2,
      },
    ]);

    expect(csv.startsWith('fecha,jornada,local,visitante')).toBe(true);
    expect(csv.split('\n')).toHaveLength(3);
  });
});
