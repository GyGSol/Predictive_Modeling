/**
 * PRODE-4: Motor Dixon-Coles con distribución Poisson
 * T-Shirt: L
 *
 * Calcula goles esperados λ_home, λ_away a partir de fuerzas ofensivas/defensivas
 * y aplica corrección Dixon-Coles para marcadores bajos (0-0, 1-0, 0-1, 1-1).
 */
const MAX_GOALS = 10;

function factorial(n) {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

export function poissonProbability(lambda, goals) {
  return (Math.exp(-lambda) * lambda ** goals) / factorial(goals);
}

export function dixonColesAdjustment(homeGoals, awayGoals, lambdaHome, lambdaAway, rho = -0.13) {
  if (homeGoals === 0 && awayGoals === 0) {
    return 1 - lambdaHome * lambdaAway * rho;
  }
  if (homeGoals === 0 && awayGoals === 1) {
    return 1 + lambdaHome * rho;
  }
  if (homeGoals === 1 && awayGoals === 0) {
    return 1 + lambdaAway * rho;
  }
  if (homeGoals === 1 && awayGoals === 1) {
    return 1 - rho;
  }
  return 1;
}

export function expectedGoals({ homeAttack, homeDefense, awayAttack, awayDefense, homeAdvantage = 1.15 }) {
  const lambdaHome = homeAttack * awayDefense * homeAdvantage;
  const lambdaAway = awayAttack * homeDefense;
  return { lambdaHome, lambdaAway };
}

export function scoreMatrix(lambdaHome, lambdaAway, rho = -0.13) {
  const matrix = [];
  let probHomeWin = 0;
  let probDraw = 0;
  let probAwayWin = 0;

  for (let homeGoals = 0; homeGoals <= MAX_GOALS; homeGoals += 1) {
    const row = [];
    for (let awayGoals = 0; awayGoals <= MAX_GOALS; awayGoals += 1) {
      const base = poissonProbability(lambdaHome, homeGoals) * poissonProbability(lambdaAway, awayGoals);
      const adjusted = base * dixonColesAdjustment(homeGoals, awayGoals, lambdaHome, lambdaAway, rho);
      row.push(adjusted);

      if (homeGoals > awayGoals) probHomeWin += adjusted;
      else if (homeGoals === awayGoals) probDraw += adjusted;
      else probAwayWin += adjusted;
    }
    matrix.push(row);
  }

  const total = probHomeWin + probDraw + probAwayWin || 1;
  return {
    matrix,
    probHomeWin: probHomeWin / total,
    probDraw: probDraw / total,
    probAwayWin: probAwayWin / total,
    expectedHomeGoals: lambdaHome,
    expectedAwayGoals: lambdaAway,
  };
}

export function predictMatch({ homeAttack, homeDefense, awayAttack, awayDefense, homeAdvantage = 1.15, rho = -0.13 }) {
  const { lambdaHome, lambdaAway } = expectedGoals({
    homeAttack,
    homeDefense,
    awayAttack,
    awayDefense,
    homeAdvantage,
  });

  return scoreMatrix(lambdaHome, lambdaAway, rho);
}
