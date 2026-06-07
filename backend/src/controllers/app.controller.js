/**
 * App Controller - Mobile app security endpoints
 */

const config = require('../config');
const { success, error } = require('../utils/responseHelper');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Verify app security key
 * POST /api/app/verify-key
 */
const verifySecurityKey = asyncHandler(async (req, res) => {
  const { securityKey } = req.body;

  if (!securityKey) {
    return error(res, 'Security key is required', 400);
  }

  // Compare with configured security key
  const isValid = securityKey === config.appSecurity.key;

  if (isValid) {
    return success(res, {
      verified: true
    }, 'Security key verified successfully');
  } else {
    return error(res, 'Invalid security key', 401);
  }
});

/**
 * Get app security config (public info only)
 * GET /api/app/security-config
 */
const getSecurityConfig = asyncHandler(async (req, res) => {
  return success(res, {
    maxAttempts: config.appSecurity.maxAttempts,
    lockDurationMinutes: config.appSecurity.lockDurationMinutes
  }, 'Security config retrieved');
});

/**
 * Get app status - lets the mobile app know if maintenance mode is on.
 * GET /api/app/status
 * Must stay reachable during maintenance (allowlisted in maintenance middleware)
 * so the app can show the 503/maintenance screen on launch.
 */
const getAppStatus = asyncHandler(async (req, res) => {
  return success(res, {
    maintenance: config.maintenanceMode,
    message: config.maintenanceMode
      ? 'सेवा अस्थायी रूप से बंद है। कृपया बाद में पुनः प्रयास करें। ' +
        'The service is temporarily down for maintenance. Please try again later.'
      : null
  }, 'App status retrieved');
});

module.exports = {
  verifySecurityKey,
  getSecurityConfig,
  getAppStatus
};
