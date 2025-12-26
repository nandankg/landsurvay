/**
 * JWT Authentication Middleware
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const { unauthorized } = require('../utils/responseHelper');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'Access denied. No token provided.');
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return unauthorized(res, 'Access denied. No token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Add user info to request
    req.admin = {
      id: decoded.id,
      username: decoded.username
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return unauthorized(res, 'Invalid token.');
    }

    if (error.name === 'TokenExpiredError') {
      return unauthorized(res, 'Token has expired.');
    }

    return unauthorized(res, 'Authentication failed.');
  }
};

// Generate JWT token
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id,
      username: admin.username
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

module.exports = {
  authMiddleware,
  generateToken
};
