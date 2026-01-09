/**
 * Document Controller - File upload and management
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { success, error, notFound } = require('../utils/responseHelper');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadMultiple, deleteFile, getFileInfo } = require('../middleware/upload');
const config = require('../config');

const prisma = new PrismaClient();

/**
 * Upload documents for a property
 * POST /api/admin/properties/:id/documents
 * Documents are named: {PropertyUniqueId}-{SequenceNo}.{ext}
 * Example: BH2023-PAT-00001-1.pdf, BH2023-PAT-00001-2.jpg
 */
const uploadDocuments = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if property exists and get propertyUniqueId
  const property = await prisma.landProperty.findUnique({
    where: { id },
    include: {
      documents: {
        select: { sequenceNo: true },
        orderBy: { sequenceNo: 'desc' }
      }
    }
  });

  if (!property) {
    return notFound(res, 'Property not found');
  }

  // Check document limit
  const currentCount = property.documents.length;
  if (currentCount >= config.upload.maxFiles) {
    return error(res, `Maximum ${config.upload.maxFiles} documents allowed per property`, 400);
  }

  // Get the next sequence number
  const maxSequence = property.documents.length > 0
    ? Math.max(...property.documents.map(d => d.sequenceNo || 0))
    : 0;

  // Handle file upload using multer
  uploadMultiple(req, res, async (uploadError) => {
    if (uploadError) {
      return error(res, uploadError.message, 400);
    }

    if (!req.files || req.files.length === 0) {
      return error(res, 'No files uploaded', 400);
    }

    // Check if upload would exceed limit
    const remainingSlots = config.upload.maxFiles - currentCount;
    if (req.files.length > remainingSlots) {
      // Delete uploaded files
      req.files.forEach(file => {
        const filePath = path.join(process.cwd(), config.upload.uploadDir, file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      return error(res, `Only ${remainingSlots} more documents can be uploaded`, 400);
    }

    try {
      const documents = [];
      let sequenceNo = maxSequence;

      for (const file of req.files) {
        sequenceNo++;
        const fileInfo = getFileInfo(file);
        const originalName = file.originalname;

        // Generate new filename: PropertyUniqueId-SequenceNo.extension
        const newFileName = `${property.propertyUniqueId}-${sequenceNo}.${fileInfo.fileType}`;
        const oldFilePath = path.join(process.cwd(), fileInfo.filePath);
        const newFilePath = path.join(process.cwd(), config.upload.uploadDir, newFileName);

        // Compress images using Sharp
        if (['jpg', 'jpeg', 'png'].includes(fileInfo.fileType)) {
          try {
            await sharp(oldFilePath)
              .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 80 })
              .toFile(newFilePath);

            // Delete original temp file
            fs.unlinkSync(oldFilePath);

            // Update file size
            const stats = fs.statSync(newFilePath);
            fileInfo.fileSize = stats.size;
          } catch (sharpError) {
            console.error('Image compression error:', sharpError.message);
            // If compression fails, just rename the file
            fs.renameSync(oldFilePath, newFilePath);
          }
        } else {
          // For non-image files (PDF), just rename
          fs.renameSync(oldFilePath, newFilePath);
        }

        // Create document record with new naming convention
        const document = await prisma.document.create({
          data: {
            fileName: newFileName,
            originalName: originalName,
            filePath: `${config.upload.uploadDir}/${newFileName}`,
            fileType: fileInfo.fileType,
            fileSize: fileInfo.fileSize,
            sequenceNo: sequenceNo,
            description: req.body.description || null,
            propertyId: id
          }
        });

        documents.push(document);
      }

      return success(res, {
        uploaded: documents.length,
        documents
      }, `${documents.length} document(s) uploaded successfully`, 201);

    } catch (dbError) {
      // Clean up uploaded files on database error
      req.files.forEach(file => {
        const filePath = path.join(process.cwd(), config.upload.uploadDir, file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      throw dbError;
    }
  });
});

/**
 * Delete a document
 * DELETE /api/admin/documents/:id
 */
const deleteDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const document = await prisma.document.findUnique({
    where: { id }
  });

  if (!document) {
    return notFound(res, 'Document not found');
  }

  // Delete file from disk - use configurable base directory
  const filePath = path.join(config.upload.baseDir, document.filePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Delete from database
  await prisma.document.delete({
    where: { id }
  });

  return success(res, {
    deletedDocument: document.fileName
  }, 'Document deleted successfully');
});

/**
 * Get document info
 * GET /api/admin/documents/:id
 */
const getDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      property: {
        select: {
          id: true,
          propertyUniqueId: true
        }
      }
    }
  });

  if (!document) {
    return notFound(res, 'Document not found');
  }

  return success(res, document, 'Document retrieved');
});

module.exports = {
  uploadDocuments,
  deleteDocument,
  getDocument
};
