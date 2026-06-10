/**
 * PRODE-11: Exportación CSV con probabilidades y cuotas implícitas
 * T-Shirt: M
 */
export function impliedOdds(probability) {
  if (probability == null || probability <= 0) return '';
  return (1 / probability).toFixed(2);
}

function escapeCsv(value) {
  const text = value == null ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function matchToCsvRow(match) {
  const homeName = match.homeTeam?.name || match.homeTeamId;
  const awayName = match.awayTeam?.name || match.awayTeamId;

  return [
    formatDate(match.kickoff),
    match.round || '',
    homeName,
    awayName,
    match.status,
    match.homeGoals ?? '',
    match.awayGoals ?? '',
    match.probHomeWin != null ? match.probHomeWin.toFixed(4) : '',
    match.probDraw != null ? match.probDraw.toFixed(4) : '',
    match.probAwayWin != null ? match.probAwayWin.toFixed(4) : '',
    impliedOdds(match.probHomeWin),
    impliedOdds(match.probDraw),
    impliedOdds(match.probAwayWin),
    match.predictedHomeGoals ?? '',
    match.predictedAwayGoals ?? '',
  ]
    .map(escapeCsv)
    .join(',');
}

export const CSV_HEADERS = [
  'fecha',
  'jornada',
  'local',
  'visitante',
  'estado',
  'goles_local',
  'goles_visitante',
  'prob_local',
  'prob_empate',
  'prob_visitante',
  'cuota_implicita_local',
  'cuota_implicita_empate',
  'cuota_implicita_visitante',
  'goles_esperados_local',
  'goles_esperados_visitante',
];

export function matchesToCsv(enrichedMatches) {
  const rows = [CSV_HEADERS.join(','), ...enrichedMatches.map(matchToCsvRow)];
  return `${rows.join('\n')}\n`;
}
