/**
 * Admin Routes - Protected with JWT authentication
 * Used by Admin Portal for data management
 */

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Controllers
const authController = require('../controllers/auth.controller');
const ownerController = require('../controllers/owner.controller');
const propertyController = require('../controllers/property.controller');
const documentController = require('../controllers/document.controller');
const importController = require('../controllers/import.controller');

// ===== Public Admin Routes (no auth) =====
router.post('/login', authController.login);

// ===== Protected Routes (auth required) =====
router.use(authMiddleware);

// Auth
router.get('/me', authController.getMe);
router.get('/dashboard', authController.getDashboard);

// Owners
router.get('/owners', ownerController.getOwners);
router.get('/owners/:id', ownerController.getOwner);
router.post('/owners', ownerController.createOwner);
router.put('/owners/:id', ownerController.updateOwner);
router.delete('/owners/:id', ownerController.deleteOwner);

// Properties
router.get('/properties/districts', propertyController.getDistricts);
router.get('/properties', propertyController.getProperties);
router.get('/properties/:id', propertyController.getProperty);
router.post('/properties', propertyController.createProperty);
router.put('/properties/:id', propertyController.updateProperty);
router.delete('/properties/:id', propertyController.deleteProperty);

// Documents
router.post('/properties/:id/documents', documentController.uploadDocuments);
router.get('/documents/:id', documentController.getDocument);
router.delete('/documents/:id', documentController.deleteDocument);

// Import
router.post('/import', importController.importData);
router.get('/import/template', importController.downloadTemplate);
router.get('/import/logs', importController.getImportLogs);

module.exports = router;
