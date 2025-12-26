/**
 * Public Routes - Accessible without authentication
 * Used by mobile app for search functionality
 */

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

// Search endpoints
router.get('/search/mobile/:phone', searchController.searchByPhone);
router.get('/search/aadhaar/:aadhaar', searchController.searchByAadhaar);
router.get('/search/property/:propertyId', searchController.searchByPropertyId);

// Property endpoints (public)
router.get('/properties/:id', searchController.getProperty);
router.get('/properties/:id/documents', searchController.getPropertyDocuments);

// Document view (inline) and download
router.get('/documents/:id/view', searchController.viewDocument);
router.get('/documents/:id/download', searchController.downloadDocument);

module.exports = router;
