/**
 * PRODE-10: Tests de backtesting walk-forward
 * T-Shirt: M
 */
import {
  aggregateBacktest,
  brierScore,
  evaluateSingleMatch,
  getActualOutcome,
  getPredictedOutcome,
  logLoss,
  runWalkForwardBacktest,
} from '../src/services/backtesting.service.js';

describe('backtesting', () => {
  const sampleFinished = [
    { apiFootballId: 1, homeTeamId: 10, awayTeamId: 20, homeGoals: 2, awayGoals: 1, status: 'FT', kickoff: new Date('2024-01-01') },
    { apiFootballId: 2, homeTeamId: 20, awayTeamId: 10, homeGoals: 0, awayGoals: 0, status: 'FT', kickoff: new Date('2024-01-08') },
    { apiFootballId: 3, homeTeamId: 10, awayTeamId: 20, homeGoals: 1, awayGoals: 2, status: 'FT', kickoff: new Date('2024-01-15') },
    { apiFootballId: 4, homeTeamId: 20, awayTeamId: 10, homeGoals: 3, awayGoals: 0, status: 'FT', kickoff: new Date('2024-01-22') },
    { apiFootballId: 5, homeTeamId: 10, awayTeamId: 20, homeGoals: 1, awayGoals: 1, status: 'FT', kickoff: new Date('2024-01-29') },
    { apiFootballId: 6, homeTeamId: 20, awayTeamId: 10, homeGoals: 0, awayGoals: 1, status: 'FT', kickoff: new Date('2024-02-05') },
  ];

  it('resolves actual and predicted outcomes', () => {
    expect(getActualOutcome(2, 1)).toBe('home');
    expect(getActualOutcome(1, 1)).toBe('draw');
    expect(getPredictedOutcome(0.6, 0.2, 0.2)).toBe('home');
  });

  it('computes brier score and log loss', () => {
    const probs = { home: 0.5, draw: 0.3, away: 0.2 };
    expect(brierScore(probs, 'home')).toBeGreaterThan(0);
    expect(logLoss(probs, 'home')).toBeGreaterThan(0);
  });

  it('evaluates a single match with prior history', () => {
    const evaluation = evaluateSingleMatch({
      match: sampleFinished[5],
      priorFinishedMatches: sampleFinished.slice(0, 5),
    });

    expect(evaluation).not.toBeNull();
    expect(evaluation.actualOutcome).toBe('away');
    expect(evaluation.priorMatchesUsed).toBe(5);
  });

  it('runs walk-forward backtest with summary metrics', () => {
    const report = runWalkForwardBacktest(sampleFinished);

    expect(report.evaluatedMatches).toBeGreaterThan(0);
    expect(report.summary.outcomeAccuracy).toBeGreaterThanOrEqual(0);
    expect(report.summary.avgBrierScore).toBeGreaterThan(0);
  });

  it('returns empty summary when no evaluations exist', () => {
    const report = aggregateBacktest([]);
    expect(report.summary).toBeNull();
  });
});
