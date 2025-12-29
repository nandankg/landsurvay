/**
 * Express Application Setup
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// CORS configuration - Allow specific origins + localhost for development
const allowedOrigins = [
  'https://bihar-land-admin.onrender.com',
  'https://bihar-land-app.onrender.com'
];

// Function to check if origin is allowed
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow requests with no origin (mobile apps, Postman)
  if (allowedOrigins.includes(origin)) return true;
  // Allow any localhost/127.0.0.1 origin (for local development)
  if (origin.match(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) return true;
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (config.nodeEnv !== 'production') {
      callback(null, true); // Allow all in development
    } else if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded documents)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bihar Land API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API Routes
const publicRoutes = require('./routes/public.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
