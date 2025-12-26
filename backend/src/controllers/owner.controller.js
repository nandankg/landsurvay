/**
 * Owner Controller - CRUD operations for owners
 */

const { PrismaClient } = require('@prisma/client');
const { success, error, notFound, paginated } = require('../utils/responseHelper');
const { asyncHandler } = require('../middleware/errorHandler');
const { maskAadhaar, validateAadhaar } = require('../utils/aadhaarMask');

const prisma = new PrismaClient();

/**
 * Get all owners with pagination
 * GET /api/admin/owners
 */
const getOwners = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  // Build search condition
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { aadhaar: { contains: search } }
        ]
      }
    : {};

  const [owners, total] = await Promise.all([
    prisma.person.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { properties: true }
        }
      }
    }),
    prisma.person.count({ where })
  ]);

  // Mask Aadhaar in response
  const maskedOwners = owners.map(owner => ({
    ...owner,
    aadhaar: maskAadhaar(owner.aadhaar),
    propertyCount: owner._count.properties
  }));

  return paginated(res, maskedOwners, { page, limit, total }, 'Owners retrieved');
});

/**
 * Get single owner by ID
 * GET /api/admin/owners/:id
 */
const getOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const owner = await prisma.person.findUnique({
    where: { id },
    include: {
      properties: {
        include: {
          _count: {
            select: { documents: true }
          }
        }
      }
    }
  });

  if (!owner) {
    return notFound(res, 'Owner not found');
  }

  // Mask Aadhaar
  const maskedOwner = {
    ...owner,
    aadhaar: maskAadhaar(owner.aadhaar)
  };

  return success(res, maskedOwner, 'Owner retrieved');
});

/**
 * Create new owner
 * POST /api/admin/owners
 */
const createOwner = asyncHandler(async (req, res) => {
  const { name, fatherName, gender, phone, aadhaar } = req.body;

  // Validate required fields
  if (!name || !phone || !aadhaar) {
    return error(res, 'Name, phone, and Aadhaar are required', 400);
  }

  // Clean and validate Aadhaar
  const cleanedAadhaar = aadhaar.replace(/[\s-]/g, '');
  if (!validateAadhaar(cleanedAadhaar)) {
    return error(res, 'Invalid Aadhaar format', 400);
  }

  // Check if Aadhaar already exists
  const existingOwner = await prisma.person.findUnique({
    where: { aadhaar: cleanedAadhaar }
  });

  if (existingOwner) {
    return error(res, 'An owner with this Aadhaar already exists', 400);
  }

  const owner = await prisma.person.create({
    data: {
      name,
      fatherName: fatherName || '',
      gender: gender || 'Unknown',
      phone,
      aadhaar: cleanedAadhaar
    }
  });

  return success(res, {
    ...owner,
    aadhaar: maskAadhaar(owner.aadhaar)
  }, 'Owner created successfully', 201);
});

/**
 * Update owner
 * PUT /api/admin/owners/:id
 */
const updateOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, fatherName, gender, phone } = req.body;

  // Check if owner exists
  const existing = await prisma.person.findUnique({
    where: { id }
  });

  if (!existing) {
    return notFound(res, 'Owner not found');
  }

  const owner = await prisma.person.update({
    where: { id },
    data: {
      name: name || existing.name,
      fatherName: fatherName !== undefined ? fatherName : existing.fatherName,
      gender: gender || existing.gender,
      phone: phone || existing.phone
    }
  });

  return success(res, {
    ...owner,
    aadhaar: maskAadhaar(owner.aadhaar)
  }, 'Owner updated successfully');
});

/**
 * Delete owner (and all properties)
 * DELETE /api/admin/owners/:id
 */
const deleteOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if owner exists
  const existing = await prisma.person.findUnique({
    where: { id },
    include: {
      _count: { select: { properties: true } }
    }
  });

  if (!existing) {
    return notFound(res, 'Owner not found');
  }

  // Delete (cascade will remove properties and documents)
  await prisma.person.delete({
    where: { id }
  });

  return success(res, {
    deletedOwner: existing.name,
    deletedProperties: existing._count.properties
  }, 'Owner deleted successfully');
});

module.exports = {
  getOwners,
  getOwner,
  createOwner,
  updateOwner,
  deleteOwner
};
