require('dotenv').config();

module.exports = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // File Upload
  upload: {
    maxFiles: parseInt(process.env.MAX_FILES) || 7,
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    uploadDir: process.env.UPLOAD_DIR || 'uploads/documents',
    baseDir: process.env.UPLOAD_BASE_DIR || process.cwd() // Base directory for file storage
  },

  // Admin (for seeding)
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  },

  // Mobile App Security
  appSecurity: {
    key: process.env.APP_SECURITY_KEY || 'BIHAR2024',
    maxAttempts: parseInt(process.env.APP_MAX_ATTEMPTS) || 5,
    lockDurationMinutes: parseInt(process.env.APP_LOCK_DURATION) || 30
  },

  // District Codes for Property ID generation
  districtCodes: {
    'Patna': 'PAT',
    'पटना': 'PAT',
    'Muzaffarpur': 'MUZ',
    'मुजफ्फरपुर': 'MUZ',
    'Gaya': 'GAY',
    'गया': 'GAY',
    'Bhagalpur': 'BHG',
    'भागलपुर': 'BHG',
    'Darbhanga': 'DAR',
    'दरभंगा': 'DAR',
    'Purnia': 'PUR',
    'पूर्णिया': 'PUR',
    'Begusarai': 'BEG',
    'बेगूसराय': 'BEG',
    'Samastipur': 'SAM',
    'समस्तीपुर': 'SAM'
  }
};
