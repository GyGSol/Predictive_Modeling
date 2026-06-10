/**
 * PRODE-7 / PRODE-8: Dashboard con partidos y filtros
 * T-Shirt: M
 */
import { useCallback, useEffect, useState } from 'react';

function formatPct(value) {
  if (value == null) return '—';
  return `${(value * 100).toFixed(1)}%`;
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [backtest, setBacktest] = useState(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ teamId: '', date: '', status: 'NS' });

  const loadMatches = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.teamId) params.set('teamId', filters.teamId);
    if (filters.date) params.set('date', filters.date);
    if (filters.status) params.set('status', filters.status);

    fetch(`/api/matches?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los partidos');
        return res.json();
      })
      .then((data) => setMatches(data.matches || []))
      .catch((err) => setError(err.message));
  }, [filters]);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('API no disponible');
        return res.json();
      })
      .then(setHealth)
      .catch((err) => setError(err.message));

    fetch('/api/teams')
      .then((res) => (res.ok ? res.json() : { teams: [] }))
      .then((data) => setTeams(data.teams || []))
      .catch(() => {});

    fetch('/api/reports/backtest')
      .then((res) => (res.ok ? res.json() : null))
      .then(setBacktest)
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const exportParams = new URLSearchParams();
  if (filters.teamId) exportParams.set('teamId', filters.teamId);
  if (filters.date) exportParams.set('date', filters.date);
  if (filters.status) exportParams.set('status', filters.status);
  const exportUrl = `/api/reports/export.csv?${exportParams}`;

  return (
    <div className="app-shell">
      <header className="hero">
        <h1>Predictive Modeling</h1>
        <p>Dashboard de estadísticas — Liga Argentina · Modelo Dixon-Coles (Poisson)</p>
      </header>

      <section className="status-card" aria-live="polite">
        <h2>Estado del sistema</h2>
        {error && <p className="status-error">{error}</p>}
        {!error && !health && <p>Conectando con el backend…</p>}
        {health && <p className="status-ok">API operativa — {health.service}</p>}
      </section>

      <section className="reports-card">
        <div className="reports-header">
          <h2>Reportes (PRODE-10 / PRODE-11)</h2>
          <a className="export-btn" href={exportUrl} download>
            Exportar CSV
          </a>
        </div>
        {backtest?.summary ? (
          <div className="grid">
            <div className="metric">
              <span>Partidos evaluados</span>
              <strong>{backtest.evaluatedMatches}</strong>
            </div>
            <div className="metric">
              <span>Acierto 1X2</span>
              <strong>{formatPct(backtest.summary.outcomeAccuracy)}</strong>
            </div>
            <div className="metric">
              <span>Brier score</span>
              <strong>{backtest.summary.avgBrierScore}</strong>
            </div>
            <div className="metric">
              <span>Log loss</span>
              <strong>{backtest.summary.avgLogLoss}</strong>
            </div>
          </div>
        ) : (
          <p className="muted">Backtesting walk-forward disponible tras sincronizar partidos finalizados.</p>
        )}
      </section>

      <section className="filters-card">
        <h2>Filtros (PRODE-8)</h2>
        <div className="filters-row">
          <label>
            Equipo
            <select
              value={filters.teamId}
              onChange={(e) => setFilters((f) => ({ ...f, teamId: e.target.value }))}
            >
              <option value="">Todos</option>
              {teams.map((team) => (
                <option key={team.apiFootballId} value={team.apiFootballId}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Fecha
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
            />
          </label>
          <label>
            Estado
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="NS">Por jugar</option>
              <option value="FT">Finalizado</option>
            </select>
          </label>
        </div>
      </section>

      <section className="matches-card">
        <h2>Partidos y predicciones</h2>
        {matches.length === 0 && <p className="muted">Sin partidos. Ejecutá POST /api/sync con API_FOOTBALL_KEY.</p>}
        <ul className="match-list">
          {matches.map((match) => (
            <li key={match.apiFootballId} className="match-item">
              <div className="match-meta">
                <span>{match.round || 'Jornada'}</span>
                <span>{new Date(match.kickoff).toLocaleString('es-AR')}</span>
                <span className="badge">{match.status}</span>
              </div>
              <div className="match-teams">
                <strong>{match.homeTeam?.name || match.homeTeamId}</strong>
                <span>vs</span>
                <strong>{match.awayTeam?.name || match.awayTeamId}</strong>
              </div>
              <div className="prob-grid">
                <div><span>Local</span><strong>{formatPct(match.probHomeWin)}</strong></div>
                <div><span>Empate</span><strong>{formatPct(match.probDraw)}</strong></div>
                <div><span>Visitante</span><strong>{formatPct(match.probAwayWin)}</strong></div>
              </div>
              {match.predictedHomeGoals != null && (
                <p className="expected-goals">
                  Goles esperados: {match.predictedHomeGoals} — {match.predictedAwayGoals}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
