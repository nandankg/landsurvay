/**
 * Search Service - Business logic for search operations
 */

const { PrismaClient } = require('@prisma/client');
const { maskAadhaar } = require('../utils/aadhaarMask');

const prisma = new PrismaClient();

/**
 * Search by mobile phone number
 * Returns owner with all their properties
 */
const searchByPhone = async (phone) => {
  const person = await prisma.person.findFirst({
    where: { phone },
    include: {
      properties: {
        include: {
          documents: {
            select: {
              id: true,
              fileName: true,
              fileType: true,
              uploadedAt: true
            }
          }
        }
      }
    }
  });

  if (!person) return null;

  // Mask Aadhaar in response
  return {
    ...person,
    aadhaar: maskAadhaar(person.aadhaar)
  };
};

/**
 * Search by Aadhaar number
 * Returns owner with all their properties
 */
const searchByAadhaar = async (aadhaar) => {
  // Clean the Aadhaar input
  const cleanedAadhaar = aadhaar.replace(/[\s-]/g, '');

  const person = await prisma.person.findUnique({
    where: { aadhaar: cleanedAadhaar },
    include: {
      properties: {
        include: {
          documents: {
            select: {
              id: true,
              fileName: true,
              fileType: true,
              uploadedAt: true
            }
          }
        }
      }
    }
  });

  if (!person) return null;

  // Mask Aadhaar in response
  return {
    ...person,
    aadhaar: maskAadhaar(person.aadhaar)
  };
};

/**
 * Search by Property ID
 * Returns single property with owner details
 */
const searchByPropertyId = async (propertyId) => {
  const property = await prisma.landProperty.findUnique({
    where: { propertyUniqueId: propertyId },
    include: {
      owner: true,
      documents: {
        select: {
          id: true,
          fileName: true,
          fileType: true,
          uploadedAt: true
        }
      }
    }
  });

  if (!property) return null;

  // Mask Aadhaar in response
  return {
    ...property,
    owner: {
      ...property.owner,
      aadhaar: maskAadhaar(property.owner.aadhaar)
    }
  };
};

/**
 * Get property by ID with all details
 */
const getPropertyById = async (id) => {
  const property = await prisma.landProperty.findUnique({
    where: { id },
    include: {
      owner: true,
      documents: true
    }
  });

  if (!property) return null;

  // Safely handle owner data with null check
  const ownerData = property.owner ? {
    ...property.owner,
    aadhaar: maskAadhaar(property.owner.aadhaar)
  } : null;

  // Return property with owner and documents
  return {
    property: {
      id: property.id,
      propertyUniqueId: property.propertyUniqueId,
      plotNo: property.plotNo,
      khataNo: property.khataNo,
      acres: property.acres,
      decimal: property.decimal,
      northBoundary: property.northBoundary,
      southBoundary: property.southBoundary,
      eastBoundary: property.eastBoundary,
      westBoundary: property.westBoundary,
      district: property.district,
      village: property.village,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    },
    owner: ownerData,
    documents: property.documents || []
  };
};

/**
 * Get documents for a property
 */
const getPropertyDocuments = async (propertyId) => {
  const property = await prisma.landProperty.findUnique({
    where: { id: propertyId },
    include: {
      documents: true
    }
  });

  if (!property) return null;

  return property.documents;
};

/**
 * Get document by ID
 */
const getDocumentById = async (id) => {
  return prisma.document.findUnique({
    where: { id }
  });
};

module.exports = {
  searchByPhone,
  searchByAadhaar,
  searchByPropertyId,
  getPropertyById,
  getPropertyDocuments,
  getDocumentById
};
