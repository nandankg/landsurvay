/**
 * Import Controller - CSV/Excel bulk import
 */

const path = require('path');
const multer = require('multer');
const { success, error } = require('../utils/responseHelper');
const { asyncHandler } = require('../middleware/errorHandler');
const importService = require('../services/import.service');

// Configure multer with memory storage (works on Render.com and other cloud platforms)
const importUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'text/plain',
      'application/csv',
      'application/octet-stream',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];
    const ext = path.extname(file.originalname).toLowerCase();

    // Allow based on extension (more reliable than MIME type for CSV)
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only CSV and Excel files are allowed. Got: ${file.mimetype}`), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
}).single('file');

/**
 * Import data from CSV/Excel file
 * POST /api/admin/import
 */
const importData = asyncHandler(async (req, res) => {
  importUpload(req, res, async (uploadError) => {
    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      return error(res, uploadError.message, 400);
    }

    if (!req.file) {
      console.error('No file in request');
      return error(res, 'No file uploaded', 400);
    }

    console.log('File uploaded:', req.file.originalname, req.file.mimetype, req.file.size);

    try {
      // With memory storage, file is in buffer not path
      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;
      const adminUsername = req.admin?.username || 'system';

      const result = await importService.processImportFromBuffer(fileBuffer, fileName, adminUsername);

      console.log('Import result:', JSON.stringify(result, null, 2));

      if (result.successCount === 0 && result.errors.length > 0) {
        return error(res, 'Import failed: ' + result.errors[0], 400, result.errors);
      }

      return success(res, {
        totalRows: result.totalRows,
        successCount: result.successCount,
        failedCount: result.failedCount,
        created: result.created,
        errors: result.errors.slice(0, 20) // Limit errors in response
      }, `Import completed: ${result.successCount} records imported successfully`);

    } catch (processError) {
      console.error('Process error:', processError);
      return error(res, `Import processing failed: ${processError.message}`, 500);
    }
  });
});

/**
 * Download CSV template
 * GET /api/admin/import/template
 */
const downloadTemplate = asyncHandler(async (req, res) => {
  const templateBuffer = importService.generateTemplate();

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=bihar_land_import_template.xlsx');
  res.send(templateBuffer);
});

/**
 * Get import history
 * GET /api/admin/import/logs
 */
const getImportLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { logs, total } = await importService.getImportLogs(page, limit);

  return success(res, {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }, 'Import logs retrieved');
});

module.exports = {
  importData,
  downloadTemplate,
  getImportLogs
};
