/**
 * Search Controller - Public search endpoints
 */

const searchService = require('../services/search.service');
const config = require('../config');
const { success, notFound, error } = require('../utils/responseHelper');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Search by mobile phone number
 * GET /api/search/mobile/:phone
 */
const searchByPhone = asyncHandler(async (req, res) => {
  const { phone } = req.params;

  if (!phone || phone.length < 10) {
    return error(res, 'Valid phone number is required', 400);
  }

  const result = await searchService.searchByPhone(phone);

  if (!result) {
    return notFound(res, 'No records found for this phone number');
  }

  return success(res, result, 'Records found successfully');
});

/**
 * Search by Aadhaar number
 * GET /api/search/aadhaar/:aadhaar
 */
const searchByAadhaar = asyncHandler(async (req, res) => {
  const { aadhaar } = req.params;

  // Clean and validate
  const cleanedAadhaar = aadhaar.replace(/[\s-]/g, '');

  if (!cleanedAadhaar || cleanedAadhaar.length !== 12) {
    return error(res, 'Valid 12-digit Aadhaar number is required', 400);
  }

  const result = await searchService.searchByAadhaar(cleanedAadhaar);

  if (!result) {
    return notFound(res, 'No records found for this Aadhaar number');
  }

  return success(res, result, 'Records found successfully');
});

/**
 * Search by Property ID
 * GET /api/search/property/:propertyId
 */
const searchByPropertyId = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    return error(res, 'Property ID is required', 400);
  }

  const result = await searchService.searchByPropertyId(propertyId);

  if (!result) {
    return notFound(res, 'No property found with this ID');
  }

  return success(res, result, 'Property found successfully');
});

/**
 * Get property by ID
 * GET /api/properties/:id
 */
const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await searchService.getPropertyById(id);

  if (!result) {
    return notFound(res, 'Property not found');
  }

  return success(res, result, 'Property retrieved successfully');
});

/**
 * Get property documents
 * GET /api/properties/:id/documents
 */
const getPropertyDocuments = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const documents = await searchService.getPropertyDocuments(id);

  if (!documents) {
    return notFound(res, 'Property not found');
  }

  return success(res, documents, 'Documents retrieved successfully');
});

/**
 * View document inline (for preview)
 * GET /api/documents/:id/view
 */
const viewDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const path = require('path');
  const fs = require('fs');

  const document = await searchService.getDocumentById(id);

  if (!document) {
    return notFound(res, 'Document not found');
  }

  // Use configurable base directory for file storage
  const filePath = path.join(config.upload.baseDir, document.filePath);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`[viewDocument] File not found: ${filePath}`);
    console.error(`[viewDocument] Base dir: ${config.upload.baseDir}, Document path: ${document.filePath}`);
    return notFound(res, 'File not found on server');
  }

  // Set content type based on file type
  const contentTypes = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png'
  };

  const contentType = contentTypes[document.fileType] || 'application/octet-stream';

  // Set headers for inline viewing (not download)
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `inline; filename="${document.fileName}"`);

  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

/**
 * Download document
 * GET /api/documents/:id/download
 */
const downloadDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const path = require('path');
  const fs = require('fs');

  const document = await searchService.getDocumentById(id);

  if (!document) {
    return notFound(res, 'Document not found');
  }

  // Use configurable base directory for file storage
  const filePath = path.join(config.upload.baseDir, document.filePath);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return notFound(res, 'File not found on server');
  }

  res.download(filePath, document.fileName, (err) => {
    if (err) {
      console.error('Download error:', err);
      if (!res.headersSent) {
        return error(res, 'Error downloading file', 500);
      }
    }
  });
});

module.exports = {
  searchByPhone,
  searchByAadhaar,
  searchByPropertyId,
  getProperty,
  getPropertyDocuments,
  viewDocument,
  downloadDocument
};
