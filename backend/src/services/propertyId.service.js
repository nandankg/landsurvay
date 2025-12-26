/**
 * Property ID Generation Service
 * Format: BH{YEAR}-{DISTRICT_CODE}-{SERIAL}
 * Example: BH2023-PAT-00001
 */

const { PrismaClient } = require('@prisma/client');
const config = require('../config');

const prisma = new PrismaClient();

/**
 * Get district code from district name
 */
const getDistrictCode = (district) => {
  // Check if it's already a code
  if (/^[A-Z]{3}$/.test(district)) {
    return district;
  }

  // Look up in config
  const code = config.districtCodes[district];
  if (code) return code;

  // Generate code from first 3 letters if not found
  return district.substring(0, 3).toUpperCase();
};

/**
 * Generate next Property ID for a district
 */
const generatePropertyId = async (district) => {
  const year = new Date().getFullYear();
  const districtCode = getDistrictCode(district);
  const prefix = `BH${year}-${districtCode}`;

  // Find the last property ID with this prefix
  const lastProperty = await prisma.landProperty.findFirst({
    where: {
      propertyUniqueId: {
        startsWith: prefix
      }
    },
    orderBy: {
      propertyUniqueId: 'desc'
    },
    select: {
      propertyUniqueId: true
    }
  });

  let nextSerial = 1;

  if (lastProperty) {
    // Extract serial number from last ID
    const lastSerial = parseInt(lastProperty.propertyUniqueId.split('-')[2], 10);
    nextSerial = lastSerial + 1;
  }

  // Format: BH2023-PAT-00001
  return `${prefix}-${String(nextSerial).padStart(5, '0')}`;
};

/**
 * Validate Property ID format
 */
const validatePropertyId = (propertyId) => {
  // Format: BH{4-digit-year}-{3-letter-code}-{5-digit-serial}
  const regex = /^BH\d{4}-[A-Z]{3}-\d{5}$/;
  return regex.test(propertyId);
};

/**
 * Parse Property ID components
 */
const parsePropertyId = (propertyId) => {
  if (!validatePropertyId(propertyId)) {
    return null;
  }

  const parts = propertyId.split('-');
  return {
    year: parseInt(parts[0].slice(2), 10),
    districtCode: parts[1],
    serial: parseInt(parts[2], 10)
  };
};

module.exports = {
  getDistrictCode,
  generatePropertyId,
  validatePropertyId,
  parsePropertyId
};
