/**
 * PRODE-4 / PRODE-12: Tests del motor Dixon-Coles
 * T-Shirt: M
 */
import {
  expectedGoals,
  poissonProbability,
  predictMatch,
  scoreMatrix,
} from '../src/services/predictionEngine.service.js';

describe('predictionEngine', () => {
  it('computes Poisson probability', () => {
    const prob = poissonProbability(1.5, 2);
    expect(prob).toBeGreaterThan(0);
    expect(prob).toBeLessThan(1);
  });

  it('computes expected goals from attack/defense strengths', () => {
    const { lambdaHome, lambdaAway } = expectedGoals({
      homeAttack: 1.2,
      homeDefense: 0.9,
      awayAttack: 1.0,
      awayDefense: 1.1,
    });

    expect(lambdaHome).toBeCloseTo(1.2 * 1.1 * 1.15, 5);
    expect(lambdaAway).toBeCloseTo(1.0 * 0.9, 5);
  });

  it('returns normalized 1X2 probabilities', () => {
    const result = predictMatch({
      homeAttack: 1.3,
      homeDefense: 0.95,
      awayAttack: 1.1,
      awayDefense: 1.05,
    });

    const total = result.probHomeWin + result.probDraw + result.probAwayWin;
    expect(total).toBeCloseTo(1, 5);
    expect(result.expectedHomeGoals).toBeGreaterThan(0);
    expect(result.expectedAwayGoals).toBeGreaterThan(0);
  });

  it('builds a score matrix with Dixon-Coles adjustment', () => {
    const { matrix } = scoreMatrix(1.4, 1.1);
    expect(matrix).toHaveLength(11);
    expect(matrix[0]).toHaveLength(11);
  });
});
