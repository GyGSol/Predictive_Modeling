/**
 * PRODE-10: Backtesting walk-forward — predicción vs resultado real
 * T-Shirt: L
 */
import { predictMatch } from './predictionEngine.service.js';
import { computeTeamStrengths, isFinishedMatch } from './strengthCalibration.service.js';

const MIN_PRIOR_MATCHES = 5;

export function getActualOutcome(homeGoals, awayGoals) {
  if (homeGoals > awayGoals) return 'home';
  if (homeGoals < awayGoals) return 'away';
  return 'draw';
}

export function getPredictedOutcome(probHome, probDraw, probAway) {
  const entries = [
    ['home', probHome],
    ['draw', probDraw],
    ['away', probAway],
  ];
  return entries.reduce((best, current) => (current[1] > best[1] ? current : best))[0];
}

export function brierScore(probs, actualOutcome) {
  const actual = {
    home: actualOutcome === 'home' ? 1 : 0,
    draw: actualOutcome === 'draw' ? 1 : 0,
    away: actualOutcome === 'away' ? 1 : 0,
  };
  return (
    (probs.home - actual.home) ** 2 +
    (probs.draw - actual.draw) ** 2 +
    (probs.away - actual.away) ** 2
  );
}

export function logLoss(probs, actualOutcome) {
  const probability = probs[actualOutcome];
  return -Math.log(Math.max(probability, 1e-15));
}

export function evaluateSingleMatch({
  match,
  priorFinishedMatches,
  homeAdvantage = 1.15,
  rho = -0.13,
}) {
  const { teams } = computeTeamStrengths(priorFinishedMatches);
  const home = teams.find((t) => t.teamId === match.homeTeamId);
  const away = teams.find((t) => t.teamId === match.awayTeamId);
  if (!home || !away) return null;

  const prediction = predictMatch({
    homeAttack: home.attackStrength,
    homeDefense: home.defenseStrength,
    awayAttack: away.attackStrength,
    awayDefense: away.defenseStrength,
    homeAdvantage,
    rho,
  });

  const actualOutcome = getActualOutcome(match.homeGoals, match.awayGoals);
  const predictedOutcome = getPredictedOutcome(
    prediction.probHomeWin,
    prediction.probDraw,
    prediction.probAwayWin
  );

  const probs = {
    home: prediction.probHomeWin,
    draw: prediction.probDraw,
    away: prediction.probAwayWin,
  };

  return {
    matchId: match.apiFootballId,
    kickoff: match.kickoff,
    round: match.round,
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    actualOutcome,
    predictedOutcome,
    correct: actualOutcome === predictedOutcome,
    brierScore: Number(brierScore(probs, actualOutcome).toFixed(4)),
    logLoss: Number(logLoss(probs, actualOutcome).toFixed(4)),
    goalsErrorHome: Number(Math.abs(prediction.expectedHomeGoals - match.homeGoals).toFixed(3)),
    goalsErrorAway: Number(Math.abs(prediction.expectedAwayGoals - match.awayGoals).toFixed(3)),
    probHomeWin: prediction.probHomeWin,
    probDraw: prediction.probDraw,
    probAwayWin: prediction.probAwayWin,
    expectedHomeGoals: prediction.expectedHomeGoals,
    expectedAwayGoals: prediction.expectedAwayGoals,
    priorMatchesUsed: priorFinishedMatches.length,
  };
}

export function runWalkForwardBacktest(finishedMatches, options = {}) {
  const sorted = [...finishedMatches].sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );

  const details = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const match = sorted[index];
    if (!isFinishedMatch(match.status)) continue;
    if (match.homeGoals == null || match.awayGoals == null) continue;

    const prior = sorted
      .slice(0, index)
      .filter((m) => isFinishedMatch(m.status) && m.homeGoals != null && m.awayGoals != null);

    if (prior.length < MIN_PRIOR_MATCHES) continue;

    const evaluation = evaluateSingleMatch({
      match,
      priorFinishedMatches: prior,
      homeAdvantage: options.homeAdvantage,
      rho: options.rho,
    });

    if (evaluation) details.push(evaluation);
  }

  return aggregateBacktest(details);
}

export function aggregateBacktest(details) {
  if (!details.length) {
    return {
      evaluatedMatches: 0,
      minPriorMatches: MIN_PRIOR_MATCHES,
      summary: null,
      details: [],
    };
  }

  const correct = details.filter((d) => d.correct).length;
  const avg = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;

  return {
    evaluatedMatches: details.length,
    minPriorMatches: MIN_PRIOR_MATCHES,
    summary: {
      outcomeAccuracy: Number((correct / details.length).toFixed(4)),
      avgBrierScore: Number(avg(details.map((d) => d.brierScore)).toFixed(4)),
      avgLogLoss: Number(avg(details.map((d) => d.logLoss)).toFixed(4)),
      avgGoalsErrorHome: Number(avg(details.map((d) => d.goalsErrorHome)).toFixed(3)),
      avgGoalsErrorAway: Number(avg(details.map((d) => d.goalsErrorAway)).toFixed(3)),
    },
    details,
  };
}
