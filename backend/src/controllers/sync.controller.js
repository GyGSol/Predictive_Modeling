/**
 * PRODE-3: Controlador de sincronización
 * T-Shirt: M
 */
import { syncService } from '../services/syncService.js';

export async function postSync(req, res, next) {
  try {
    const result = await syncService.runFullSync(req.body);
    res.json({ ok: true, result });
  } catch (error) {
    next(error);
  }
}

export async function postCalibrate(req, res, next) {
  try {
    const { leagueId, season } = req.body;
    const calibration = await syncService.calibrateStrengths(leagueId, season);
    const predictions = await syncService.predictUpcoming(leagueId, season);
    res.json({ ok: true, calibration, predictions });
  } catch (error) {
    next(error);
  }
}
