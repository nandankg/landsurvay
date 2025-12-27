/**
 * Express Application Setup
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// CORS configuration - Allow all origins in development
app.use(cors({
  origin: config.nodeEnv === 'production'
    ? ['https://bihar-land-admin.onrender.com', 'https://bihar-land-app.onrender.com']
    : true, // Allow all origins in development
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
