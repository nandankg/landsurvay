/**
 * Maintenance Mode Middleware
 *
 * When config.maintenanceMode is true, all API requests are blocked with a
 * 503 response — EXCEPT the health check (/api/health), which must stay up so
 * Render's health probe does not mark the service as unhealthy and restart it.
 *
 * Toggle without a redeploy: set the MAINTENANCE_MODE env var on Render
 * ("true" to take everything down, "false"/unset to restore) and the next
 * request picks up the change after the service reads its environment.
 */

const config = require('../config');

// Paths that remain reachable even during maintenance.
// - /api/health: keeps Render's health probe green so the service isn't restarted.
// - /api/app/status: lets the mobile app detect maintenance and show its 503 screen.
const ALLOWLIST = ['/api/health', '/api/app/status'];

const maintenance = (req, res, next) => {
  if (!config.maintenanceMode) {
    return next();
  }

  if (ALLOWLIST.includes(req.path)) {
    return next();
  }

  res.set('Retry-After', '3600'); // hint clients to retry after ~1 hour
  return res.status(503).json({
    success: false,
    maintenance: true,
    message: 'सेवा अस्थायी रूप से बंद है। कृपया बाद में पुनः प्रयास करें। ' +
      'The service is temporarily down for maintenance. Please try again later.'
  });
};

module.exports = maintenance;
