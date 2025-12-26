/**
 * Auth Controller - Admin authentication
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const { success, error, unauthorized } = require('../utils/responseHelper');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Admin Login
 * POST /api/admin/login
 */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return error(res, 'Username and password are required', 400);
  }

  // Find admin by username
  const admin = await prisma.admin.findUnique({
    where: { username }
  });

  if (!admin) {
    return unauthorized(res, 'Invalid credentials');
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, admin.password);

  if (!isValidPassword) {
    return unauthorized(res, 'Invalid credentials');
  }

  // Generate token
  const token = generateToken(admin);

  return success(res, {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      name: admin.name
    }
  }, 'Login successful');
});

/**
 * Get current admin info
 * GET /api/admin/me
 */
const getMe = asyncHandler(async (req, res) => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin.id },
    select: {
      id: true,
      username: true,
      name: true,
      createdAt: true
    }
  });

  if (!admin) {
    return error(res, 'Admin not found', 404);
  }

  return success(res, admin);
});

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard
 */
const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalOwners,
    totalProperties,
    totalDocuments,
    recentProperties,
    districtStats
  ] = await Promise.all([
    prisma.person.count(),
    prisma.landProperty.count(),
    prisma.document.count(),
    prisma.landProperty.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: { name: true }
        }
      }
    }),
    prisma.landProperty.groupBy({
      by: ['district'],
      _count: true
    })
  ]);

  return success(res, {
    stats: {
      totalOwners,
      totalProperties,
      totalDocuments
    },
    recentProperties,
    districtStats: districtStats.map(d => ({
      district: d.district,
      count: d._count
    }))
  }, 'Dashboard data retrieved');
});

module.exports = {
  login,
  getMe,
  getDashboard
};
