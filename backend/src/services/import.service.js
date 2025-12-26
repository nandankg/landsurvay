/**
 * CSV/Excel Import Service
 * Handles bulk import of land records with Hindi column support
 */

const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { generatePropertyId } = require('./propertyId.service');
const { validateAadhaar } = require('../utils/aadhaarMask');

const prisma = new PrismaClient();

// Column mappings (English -> Hindi)
const COLUMN_MAPPINGS = {
  // English columns
  'property_id': 'propertyId',
  'owner_name': 'ownerName',
  'father_name': 'fatherName',
  'gender': 'gender',
  'phone': 'phone',
  'aadhaar': 'aadhaar',
  'plot_no': 'plotNo',
  'khata_no': 'khataNo',
  'acres': 'acres',
  'decimal': 'decimals',
  'decimals': 'decimals',
  'north': 'northBoundary',
  'south': 'southBoundary',
  'east': 'eastBoundary',
  'west': 'westBoundary',
  'district': 'district',
  'village': 'village',

  // Hindi columns
  'नाम': 'ownerName',
  'पिता': 'fatherName',
  'पिता का नाम': 'fatherName',
  'लिंग': 'gender',
  'फोन': 'phone',
  'मोबाइल': 'phone',
  'आधार': 'aadhaar',
  'आधार नंबर': 'aadhaar',
  'प्लॉट': 'plotNo',
  'प्लॉट नंबर': 'plotNo',
  'खाता': 'khataNo',
  'खाता नंबर': 'khataNo',
  'ऐकर': 'acres',
  'एकड़': 'acres',
  'डिसमिल': 'decimals',
  'उत्तर': 'northBoundary',
  'दक्षिण': 'southBoundary',
  'पूरब': 'eastBoundary',
  'पश्चिम': 'westBoundary',
  'जिला': 'district',
  'गांव': 'village'
};

/**
 * Normalize column names
 */
const normalizeColumns = (row) => {
  const normalized = {};

  for (const [key, value] of Object.entries(row)) {
    const cleanKey = key.trim().toLowerCase();
    const mappedKey = COLUMN_MAPPINGS[cleanKey] || COLUMN_MAPPINGS[key.trim()] || cleanKey;
    normalized[mappedKey] = value;
  }

  return normalized;
};

/**
 * Parse Excel/CSV file
 */
const parseFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert to JSON with header row
  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return data.map(normalizeColumns);
};

/**
 * Validate a single row
 */
const validateRow = (row, rowIndex) => {
  const errors = [];

  // Required fields
  if (!row.ownerName) {
    errors.push(`Row ${rowIndex}: Owner name is required`);
  }

  if (!row.phone && !row.aadhaar) {
    errors.push(`Row ${rowIndex}: Either phone or Aadhaar is required`);
  }

  if (row.aadhaar && !validateAadhaar(row.aadhaar)) {
    errors.push(`Row ${rowIndex}: Invalid Aadhaar format`);
  }

  if (!row.plotNo) {
    errors.push(`Row ${rowIndex}: Plot number is required`);
  }

  if (!row.district) {
    errors.push(`Row ${rowIndex}: District is required`);
  }

  return errors;
};

/**
 * Process import file
 */
const processImport = async (filePath, adminUsername) => {
  const results = {
    totalRows: 0,
    successCount: 0,
    failedCount: 0,
    errors: [],
    created: {
      owners: 0,
      properties: 0
    }
  };

  try {
    const rows = parseFile(filePath);
    results.totalRows = rows.length;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowIndex = i + 2; // Excel row (1-indexed + header)

      try {
        // Validate row
        const validationErrors = validateRow(row, rowIndex);
        if (validationErrors.length > 0) {
          results.errors.push(...validationErrors);
          results.failedCount++;
          continue;
        }

        // Clean Aadhaar
        const cleanedAadhaar = row.aadhaar
          ? row.aadhaar.toString().replace(/[\s-]/g, '')
          : null;

        // Check if owner exists by Aadhaar
        let owner = null;
        if (cleanedAadhaar) {
          owner = await prisma.person.findUnique({
            where: { aadhaar: cleanedAadhaar }
          });
        }

        // Create owner if not exists
        if (!owner) {
          owner = await prisma.person.create({
            data: {
              name: row.ownerName.toString().trim(),
              fatherName: (row.fatherName || '').toString().trim(),
              gender: (row.gender || 'Unknown').toString().trim(),
              phone: (row.phone || '').toString().trim(),
              aadhaar: cleanedAadhaar || `TEMP-${Date.now()}-${i}`
            }
          });
          results.created.owners++;
        }

        // Generate Property ID if not provided
        let propertyId = row.propertyId;
        if (!propertyId) {
          propertyId = await generatePropertyId(row.district);
        }

        // Check if property already exists
        const existingProperty = await prisma.landProperty.findUnique({
          where: { propertyUniqueId: propertyId }
        });

        if (existingProperty) {
          results.errors.push(`Row ${rowIndex}: Property ID ${propertyId} already exists`);
          results.failedCount++;
          continue;
        }

        // Create property
        await prisma.landProperty.create({
          data: {
            propertyUniqueId: propertyId,
            plotNo: row.plotNo.toString().trim(),
            khataNo: (row.khataNo || '').toString().trim(),
            acres: row.acres ? parseFloat(row.acres) : null,
            decimals: row.decimals ? parseFloat(row.decimals) : null,
            district: row.district.toString().trim(),
            village: (row.village || '').toString().trim(),
            northBoundary: (row.northBoundary || '').toString().trim(),
            southBoundary: (row.southBoundary || '').toString().trim(),
            eastBoundary: (row.eastBoundary || '').toString().trim(),
            westBoundary: (row.westBoundary || '').toString().trim(),
            surveyStatus: 'pending',
            ownerId: owner.id
          }
        });

        results.created.properties++;
        results.successCount++;

      } catch (error) {
        results.errors.push(`Row ${rowIndex}: ${error.message}`);
        results.failedCount++;
      }
    }

    // Log import
    await prisma.importLog.create({
      data: {
        fileName: path.basename(filePath),
        totalRows: results.totalRows,
        successCount: results.successCount,
        failedCount: results.failedCount,
        errors: results.errors.length > 0 ? results.errors : null,
        importedBy: adminUsername
      }
    });

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

  } catch (error) {
    results.errors.push(`File processing error: ${error.message}`);
  }

  return results;
};

/**
 * Generate CSV template
 */
const generateTemplate = () => {
  const headers = [
    'property_id',
    'owner_name',
    'father_name',
    'gender',
    'phone',
    'aadhaar',
    'plot_no',
    'khata_no',
    'acres',
    'decimal',
    'north',
    'south',
    'east',
    'west',
    'district',
    'village'
  ];

  const sampleRow = [
    '', // property_id (auto-generated if empty)
    'राम कुमार',
    'श्री शिव कुमार',
    'Male',
    '9876543210',
    '123456789012',
    '1234',
    '56',
    '2',
    '50',
    'मोहन लाल',
    'राजेश कुमार',
    'सड़क',
    'खाली जमीन',
    'Patna',
    'दानापुर'
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

/**
 * Get import logs
 */
const getImportLogs = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.importLog.findMany({
      skip,
      take: limit,
      orderBy: { importedAt: 'desc' }
    }),
    prisma.importLog.count()
  ]);

  return { logs, total };
};

module.exports = {
  parseFile,
  processImport,
  generateTemplate,
  getImportLogs
};
