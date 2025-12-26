/**
 * Aadhaar Masking Utility
 * Masks Aadhaar number to show only last 4 digits
 * Example: 123456789012 → XXXX-XXXX-9012
 */

const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return null;

  // Remove any spaces or dashes
  const cleaned = aadhaar.replace(/[\s-]/g, '');

  // Validate length
  if (cleaned.length !== 12) {
    return aadhaar; // Return as-is if invalid
  }

  // Mask format: XXXX-XXXX-{last4}
  return `XXXX-XXXX-${cleaned.slice(-4)}`;
};

/**
 * Format Aadhaar for display (with dashes)
 * Example: 123456789012 → 1234-5678-9012
 */
const formatAadhaar = (aadhaar) => {
  if (!aadhaar) return null;

  const cleaned = aadhaar.replace(/[\s-]/g, '');

  if (cleaned.length !== 12) {
    return aadhaar;
  }

  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
};

/**
 * Validate Aadhaar number
 */
const validateAadhaar = (aadhaar) => {
  if (!aadhaar) return false;

  const cleaned = aadhaar.replace(/[\s-]/g, '');

  // Must be 12 digits
  if (!/^\d{12}$/.test(cleaned)) {
    return false;
  }

  // First digit cannot be 0 or 1
  if (cleaned[0] === '0' || cleaned[0] === '1') {
    return false;
  }

  return true;
};

module.exports = {
  maskAadhaar,
  formatAadhaar,
  validateAadhaar
};
