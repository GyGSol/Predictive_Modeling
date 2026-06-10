/**
 * PRODE-1: Controlador de health check
 * T-Shirt: XS
 */
export function getHealth(req, res) {
  res.json({
    status: 'ok',
    service: 'predictive-modeling-api',
    timestamp: new Date().toISOString(),
  });
}
