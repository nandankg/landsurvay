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

module.exports = {
  verifySecurityKey,
  getSecurityConfig
};
