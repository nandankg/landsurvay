/**
 * File Upload Middleware using Multer
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), config.upload.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomstring.extension
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: PDF, JPG, JPEG, PNG`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: config.upload.maxFiles
  }
});

// Single file upload
const uploadSingle = upload.single('document');

// Multiple files upload (max 7)
const uploadMultiple = upload.array('documents', config.upload.maxFiles);

// Delete file utility
const deleteFile = (filePath) => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
};

// Get file info
const getFileInfo = (file) => {
  return {
    fileName: file.originalname,
    filePath: `${config.upload.uploadDir}/${file.filename}`,
    fileType: path.extname(file.originalname).slice(1).toLowerCase(),
    fileSize: file.size
  };
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteFile,
  getFileInfo
};
