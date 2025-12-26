/**
 * Search Service - Business logic for search operations
 */

const { PrismaClient } = require('@prisma/client');
const { maskAadhaar } = require('../utils/aadhaarMask');

const prisma = new PrismaClient();

/**
 * Search by mobile phone number
 * Returns owner with all their properties in consistent format
 */
const searchByPhone = async (phone) => {
  const person = await prisma.person.findFirst({
    where: { phone },
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

  if (!person) return null;

  // Return consistent format with owner and properties
  return {
    owner: {
      id: person.id,
      name: person.name,
      fatherName: person.fatherName,
      gender: person.gender,
      phone: person.phone,
      aadhaar: maskAadhaar(person.aadhaar)
    },
    properties: person.properties.map(p => ({
      ...p,
      documentsCount: p._count?.documents || 0
    })),
    propertiesCount: person.properties.length
  };
};

/**
 * Search by Aadhaar number
 * Returns owner with all their properties in consistent format
 */
const searchByAadhaar = async (aadhaar) => {
  // Clean the Aadhaar input
  const cleanedAadhaar = aadhaar.replace(/[\s-]/g, '');

  const person = await prisma.person.findUnique({
    where: { aadhaar: cleanedAadhaar },
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

  if (!person) return null;

  // Return consistent format with owner and properties
  return {
    owner: {
      id: person.id,
      name: person.name,
      fatherName: person.fatherName,
      gender: person.gender,
      phone: person.phone,
      aadhaar: maskAadhaar(person.aadhaar)
    },
    properties: person.properties.map(p => ({
      ...p,
      documentsCount: p._count?.documents || 0
    })),
    propertiesCount: person.properties.length
  };
};

/**
 * Search by Property ID
 * Returns single property with owner details in consistent format
 */
const searchByPropertyId = async (propertyId) => {
  const property = await prisma.landProperty.findUnique({
    where: { propertyUniqueId: propertyId },
    include: {
      owner: true,
      _count: {
        select: { documents: true }
      }
    }
  });

  if (!property) return null;

  // Return consistent format with owner and properties
  return {
    owner: property.owner ? {
      id: property.owner.id,
      name: property.owner.name,
      fatherName: property.owner.fatherName,
      gender: property.owner.gender,
      phone: property.owner.phone,
      aadhaar: maskAadhaar(property.owner.aadhaar)
    } : null,
    properties: [{
      ...property,
      documentsCount: property._count?.documents || 0
    }],
    propertiesCount: 1
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
      decimals: property.decimals,
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
