/**
 * Property Controller - CRUD operations for properties
 */

const { PrismaClient } = require('@prisma/client');
const { success, error, notFound, paginated } = require('../utils/responseHelper');
const { asyncHandler } = require('../middleware/errorHandler');
const { generatePropertyId } = require('../services/propertyId.service');
const { maskAadhaar } = require('../utils/aadhaarMask');

const prisma = new PrismaClient();

/**
 * Get all properties with pagination
 * GET /api/admin/properties
 */
const getProperties = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const district = req.query.district || '';
  const skip = (page - 1) * limit;

  // Build filter conditions
  const where = {
    AND: [
      search
        ? {
            OR: [
              { propertyUniqueId: { contains: search, mode: 'insensitive' } },
              { plotNo: { contains: search } },
              { khataNo: { contains: search } },
              { owner: { name: { contains: search, mode: 'insensitive' } } }
            ]
          }
        : {},
      district ? { district: { equals: district, mode: 'insensitive' } } : {}
    ]
  };

  const [properties, total] = await Promise.all([
    prisma.landProperty.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            aadhaar: true
          }
        },
        _count: {
          select: { documents: true }
        }
      }
    }),
    prisma.landProperty.count({ where })
  ]);

  // Mask Aadhaar in response
  const maskedProperties = properties.map(prop => ({
    ...prop,
    owner: {
      ...prop.owner,
      aadhaar: maskAadhaar(prop.owner.aadhaar)
    },
    documentCount: prop._count.documents
  }));

  return paginated(res, maskedProperties, { page, limit, total }, 'Properties retrieved');
});

/**
 * Get single property by ID
 * GET /api/admin/properties/:id
 */
const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await prisma.landProperty.findUnique({
    where: { id },
    include: {
      owner: true,
      documents: true
    }
  });

  if (!property) {
    return notFound(res, 'Property not found');
  }

  // Mask Aadhaar
  const maskedProperty = {
    ...property,
    owner: {
      ...property.owner,
      aadhaar: maskAadhaar(property.owner.aadhaar)
    }
  };

  return success(res, maskedProperty, 'Property retrieved');
});

/**
 * Create new property
 * POST /api/admin/properties
 */
const createProperty = asyncHandler(async (req, res) => {
  const {
    ownerId,
    plotNo,
    khataNo,
    acres,
    decimals,
    district,
    village,
    thana,
    northBoundary,
    southBoundary,
    eastBoundary,
    westBoundary,
    surveyStatus
  } = req.body;

  // Validate required fields
  if (!ownerId || !plotNo || !district) {
    return error(res, 'Owner ID, plot number, and district are required', 400);
  }

  // Check if owner exists
  const owner = await prisma.person.findUnique({
    where: { id: ownerId }
  });

  if (!owner) {
    return error(res, 'Owner not found', 404);
  }

  // Generate unique Property ID
  const propertyUniqueId = await generatePropertyId(district);

  const property = await prisma.landProperty.create({
    data: {
      propertyUniqueId,
      plotNo,
      khataNo: khataNo || '',
      acres: acres ? parseFloat(acres) : null,
      decimals: decimals ? parseFloat(decimals) : null,
      district,
      village: village || '',
      thana: thana || '',
      northBoundary: northBoundary || '',
      southBoundary: southBoundary || '',
      eastBoundary: eastBoundary || '',
      westBoundary: westBoundary || '',
      surveyStatus: surveyStatus || 'pending',
      ownerId
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          phone: true
        }
      }
    }
  });

  return success(res, property, 'Property created successfully', 201);
});

/**
 * Update property
 * PUT /api/admin/properties/:id
 */
const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    plotNo,
    khataNo,
    acres,
    decimals,
    district,
    village,
    thana,
    northBoundary,
    southBoundary,
    eastBoundary,
    westBoundary,
    surveyStatus
  } = req.body;

  // Check if property exists
  const existing = await prisma.landProperty.findUnique({
    where: { id }
  });

  if (!existing) {
    return notFound(res, 'Property not found');
  }

  const property = await prisma.landProperty.update({
    where: { id },
    data: {
      plotNo: plotNo !== undefined ? plotNo : existing.plotNo,
      khataNo: khataNo !== undefined ? khataNo : existing.khataNo,
      acres: acres !== undefined ? parseFloat(acres) : existing.acres,
      decimals: decimals !== undefined ? parseFloat(decimals) : existing.decimals,
      district: district || existing.district,
      village: village !== undefined ? village : existing.village,
      thana: thana !== undefined ? thana : existing.thana,
      northBoundary: northBoundary !== undefined ? northBoundary : existing.northBoundary,
      southBoundary: southBoundary !== undefined ? southBoundary : existing.southBoundary,
      eastBoundary: eastBoundary !== undefined ? eastBoundary : existing.eastBoundary,
      westBoundary: westBoundary !== undefined ? westBoundary : existing.westBoundary,
      surveyStatus: surveyStatus || existing.surveyStatus
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          phone: true
        }
      }
    }
  });

  return success(res, property, 'Property updated successfully');
});

/**
 * Delete property
 * DELETE /api/admin/properties/:id
 */
const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if property exists
  const existing = await prisma.landProperty.findUnique({
    where: { id },
    include: {
      _count: { select: { documents: true } }
    }
  });

  if (!existing) {
    return notFound(res, 'Property not found');
  }

  // Delete (cascade will remove documents)
  await prisma.landProperty.delete({
    where: { id }
  });

  return success(res, {
    deletedPropertyId: existing.propertyUniqueId,
    deletedDocuments: existing._count.documents
  }, 'Property deleted successfully');
});

/**
 * Get all districts (for filters)
 * GET /api/admin/properties/districts
 */
const getDistricts = asyncHandler(async (req, res) => {
  const districts = await prisma.landProperty.findMany({
    distinct: ['district'],
    select: { district: true },
    orderBy: { district: 'asc' }
  });

  return success(res, districts.map(d => d.district), 'Districts retrieved');
});

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getDistricts
};
