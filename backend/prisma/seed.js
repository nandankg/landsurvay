/**
 * Database Seed Script
 * Creates sample data with Hindi content for testing
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...\n');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'System Administrator'
    }
  });
  console.log('Admin created:', admin.username);

  // Create Sample Owners (Persons)
  const owner1 = await prisma.person.upsert({
    where: { aadhaar: '234567890123' },
    update: {},
    create: {
      name: 'बिन्दु देवी',
      fatherName: 'श्री प्रमोद दास',
      gender: 'Female',
      phone: '8877225966',
      aadhaar: '234567890123'
    }
  });
  console.log('Owner 1 created:', owner1.name);

  const owner2 = await prisma.person.upsert({
    where: { aadhaar: '345678901234' },
    update: {},
    create: {
      name: 'राम सेवक राम',
      fatherName: 'श्री सुखदेव राम',
      gender: 'Male',
      phone: '9876543210',
      aadhaar: '345678901234'
    }
  });
  console.log('Owner 2 created:', owner2.name);

  const owner3 = await prisma.person.upsert({
    where: { aadhaar: '456789012345' },
    update: {},
    create: {
      name: 'सुनील दास',
      fatherName: 'श्री महेश दास',
      gender: 'Male',
      phone: '9988776655',
      aadhaar: '456789012345'
    }
  });
  console.log('Owner 3 created:', owner3.name);

  // Create Sample Properties
  const property1 = await prisma.landProperty.upsert({
    where: { propertyUniqueId: 'BH2023-PAT-00001' },
    update: {},
    create: {
      propertyUniqueId: 'BH2023-PAT-00001',
      plotNo: '3053',
      khataNo: '129',
      decimals: 86,
      district: 'Patna',
      village: 'दानापुर',
      northBoundary: 'साहेब बहादुर',
      southBoundary: 'राम सेवक राम',
      eastBoundary: 'सुनील दास',
      westBoundary: 'ख.स -1502',
      surveyStatus: 'completed',
      ownerId: owner1.id
    }
  });
  console.log('Property 1 created:', property1.propertyUniqueId);

  const property2 = await prisma.landProperty.upsert({
    where: { propertyUniqueId: 'BH2023-PAT-00002' },
    update: {},
    create: {
      propertyUniqueId: 'BH2023-PAT-00002',
      plotNo: '2145',
      khataNo: '87',
      decimals: 45,
      acres: 1,
      district: 'Patna',
      village: 'फुलवारी',
      northBoundary: 'सड़क',
      southBoundary: 'खेत',
      eastBoundary: 'मोहन लाल',
      westBoundary: 'नहर',
      surveyStatus: 'completed',
      ownerId: owner2.id
    }
  });
  console.log('Property 2 created:', property2.propertyUniqueId);

  const property3 = await prisma.landProperty.upsert({
    where: { propertyUniqueId: 'BH2023-GAY-00001' },
    update: {},
    create: {
      propertyUniqueId: 'BH2023-GAY-00001',
      plotNo: '1892',
      khataNo: '156',
      decimals: 32,
      district: 'Gaya',
      village: 'बोधगया',
      northBoundary: 'मंदिर',
      southBoundary: 'राजेश कुमार',
      eastBoundary: 'सड़क',
      westBoundary: 'खाली जमीन',
      surveyStatus: 'pending',
      ownerId: owner3.id
    }
  });
  console.log('Property 3 created:', property3.propertyUniqueId);

  // Second property for owner1 (same Aadhaar owns multiple properties)
  const property4 = await prisma.landProperty.upsert({
    where: { propertyUniqueId: 'BH2023-PAT-00003' },
    update: {},
    create: {
      propertyUniqueId: 'BH2023-PAT-00003',
      plotNo: '4521',
      khataNo: '201',
      decimals: 50,
      district: 'Patna',
      village: 'खगौल',
      northBoundary: 'रेलवे लाइन',
      southBoundary: 'विजय कुमार',
      eastBoundary: 'स्कूल',
      westBoundary: 'खेत',
      surveyStatus: 'verified',
      ownerId: owner1.id
    }
  });
  console.log('Property 4 created:', property4.propertyUniqueId);

  console.log('\n✓ Database seeded successfully!');
  console.log('\nSummary:');
  console.log('- 1 Admin (username: admin, password: admin123)');
  console.log('- 3 Owners');
  console.log('- 4 Properties');
  console.log('\nYou can now test the API!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
