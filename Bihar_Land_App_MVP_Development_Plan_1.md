# Bihar Land & Revenue Mobile App
## MVP Development & Testing Plan - Stage 1

---

**Project:** Bihar Land Survey & Revenue Mobile Application  
**Client:** Department of Revenue and Land Reforms, Government of Bihar  
**Timeline:** 5 Working Days  
**Version:** 1.1  
**Date:** December 2025

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Data Model & Relationships](#2-data-model--relationships)
3. [MVP Scope Definition](#3-mvp-scope-definition)
4. [Technology Stack](#4-technology-stack)
5. [Database Design](#5-database-design)
6. [API Design](#6-api-design)
7. [Day-by-Day Development Plan](#7-day-by-day-development-plan)
8. [Testing Plan](#8-testing-plan)
9. [Deployment Guide](#9-deployment-guide)
10. [Risk & Mitigation](#10-risk--mitigation)

---

## 1. Executive Summary

### 1.1 Project Overview

This document outlines the MVP development plan for the Bihar Land Survey & Revenue Mobile Application. The MVP focuses on delivering a functional mobile app with all 8 modules visible and the Survey Status (सर्वेक्षण स्थिति 2023) module fully operational, along with an admin portal for data management including CSV/Excel import functionality.

### 1.2 Key Data Relationships

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATA MODEL OVERVIEW                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ONE PERSON (Aadhaar) ──────► MULTIPLE LAND PROPERTIES                 │
│                                                                          │
│   Example:                                                               │
│   ┌─────────────────┐                                                   │
│   │ राम प्रसाद यादव   │                                                   │
│   │ Aadhaar: 8542... │                                                   │
│   │ Phone: 887722... │                                                   │
│   └────────┬────────┘                                                   │
│            │                                                             │
│            ├──► Property 1 (BH2023-PAT-001) ──► 5-7 Documents           │
│            │    Plot: 3053, Khata: 129                                  │
│            │                                                             │
│            ├──► Property 2 (BH2023-PAT-002) ──► 5-7 Documents           │
│            │    Plot: 1567, Khata: 89                                   │
│            │                                                             │
│            └──► Property 3 (BH2023-MUZ-001) ──► 5-7 Documents           │
│                 Plot: 2234, Khata: 156                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3 MVP Deliverables

| Component | Description |
|-----------|-------------|
| **Mobile App** | Android app with 8 module home screen, search functionality, record display |
| **Admin Portal** | Web app for single admin to manage survey data with CSV/Excel import |
| **Backend API** | REST APIs for search, CRUD operations, bulk import, document management |
| **Database** | PostgreSQL with Hindi data support (UTF-8) |

### 1.4 Key Features Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        MVP FEATURES                              │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Mobile App with 8 module buttons (Home Screen)               │
│ ✅ Survey Status 2023 - Full functionality                       │
│ ✅ Search by Mobile / Aadhaar / Property Unique ID               │
│ ✅ One person can have multiple properties                       │
│ ✅ Each property has unique Property ID                          │
│ ✅ 5-7 documents (PDF/Image) per property                        │
│ ✅ Hindi language data display                                   │
│ ✅ CSV/Excel bulk import in Admin                                │
│ ✅ Single admin authentication                                   │
│ ✅ CRUD operations for land records                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Model & Relationships

### 2.1 Entity Relationships

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     ENTITY RELATIONSHIP DIAGRAM                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐         ┌──────────────────┐        ┌──────────────┐  │
│  │    Person    │ 1     N │  LandProperty    │ 1    N │   Document   │  │
│  │  (Owner)     │────────►│  (Land Record)   │───────►│  (PDF/Image) │  │
│  └──────────────┘         └──────────────────┘        └──────────────┘  │
│                                                                          │
│  Identified by:           Identified by:              Linked to:         │
│  - Aadhaar Number         - Property Unique ID        - Property ID      │
│  - Phone Number           (BH2023-PAT-001)                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Key Identifiers

| Entity | Primary Identifier | Secondary Identifier | Notes |
|--------|-------------------|---------------------|-------|
| **Person** | Aadhaar Number | Phone Number | Same Aadhaar can own multiple properties |
| **Land Property** | Property Unique ID | Plot + Khata combination | Each property has separate unique ID |
| **Document** | Document ID | File Path | 5-7 documents per property |

### 2.3 Property Unique ID Format

```
Format: BH{YEAR}-{DISTRICT_CODE}-{SERIAL}

Examples:
- BH2023-PAT-00001  (Patna, Serial 1)
- BH2023-PAT-00002  (Patna, Serial 2)
- BH2023-MUZ-00001  (Muzaffarpur, Serial 1)
- BH2023-GAY-00015  (Gaya, Serial 15)

District Codes:
- PAT = पटना (Patna)
- MUZ = मुजफ्फरपुर (Muzaffarpur)
- GAY = गया (Gaya)
- BHG = भागलपुर (Bhagalpur)
- etc.
```

### 2.4 Search Behavior

| Search By | Returns |
|-----------|---------|
| **Phone Number** | All properties owned by that person |
| **Aadhaar Number** | All properties owned by that person |
| **Property Unique ID** | Single specific property |

```
Example Search Flow:

Search by Phone: 8877225966
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ Found: राम प्रसाद यादव (Aadhaar: 854211545950)      │
│                                                      │
│ Properties (3):                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 1. BH2023-PAT-001 | Plot: 3053 | Khata: 129    │ │
│ │    Village: दानापुर | Area: 86 डिसमिल            │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ 2. BH2023-PAT-002 | Plot: 1567 | Khata: 89     │ │
│ │    Village: पटना सिटी | Area: 1.5 ऐकर          │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ 3. BH2023-MUZ-001 | Plot: 2234 | Khata: 156    │ │
│ │    Village: कटरा | Area: 2 ऐकर                  │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 3. MVP Scope Definition

### 3.1 Mobile Application Features

#### Home Screen - 8 Modules (All Visible)

Based on the Bihar Bhumi portal design:

| Module (Hindi) | Module (English) | MVP Status |
|----------------|------------------|------------|
| भू अभिलेख एवं परिमाप निदेशालय | Land Records & Survey Directorate | 🔵 Button Only |
| भू लगान | Land Revenue | 🔵 Button Only |
| **सर्वेक्षण स्थिति 2023** | **Survey Status 2023** | ✅ **Fully Functional** |
| जमाबंदी पंजी | Jamabandi Register | 🔵 Button Only |
| आम सूचना | General Information | 🔵 Button Only |
| भू मानचित्र | Land Map | 🔵 Button Only |
| आधार / मोबाइल सीडिंग स्थिति | Aadhaar/Mobile Seeding Status | 🔵 Button Only |
| सरकारी भूमि का दाखिल खारिज | Government Land Mutation | 🔵 Button Only |

> **Note:** 🔵 Button Only = Shows "Coming Soon / जल्द आ रहा है" message when tapped

#### Screen Flow

```
┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  Splash  │───►│    Home      │───►│   Search    │───►│  Properties  │
│  Screen  │    │  (8 modules) │    │   Screen    │    │    List      │
└──────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                                              │
                                    ┌─────────────────────────┘
                                    ▼
                            ┌──────────────┐    ┌──────────────┐
                            │  Property    │───►│  Documents   │
                            │   Detail     │    │   Gallery    │
                            └──────────────┘    └──────────────┘
```

#### Search Screen Features

```
┌─────────────────────────────────────────────┐
│         सर्वेक्षण स्थिति 2023                 │
│         Survey Status 2023                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📱 Mobile no.                        │   │
│  │ ┌─────────────────────────────────┐ │   │
│  │ │                                 │ │   │
│  │ └─────────────────────────────────┘ │   │
│  │         [Search]                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🆔 Aadhaar no.                       │   │
│  │ ┌─────────────────────────────────┐ │   │
│  │ │                                 │ │   │
│  │ └─────────────────────────────────┘ │   │
│  │         [Search]                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🏠 Property Unique ID                │   │
│  │ ┌─────────────────────────────────┐ │   │
│  │ │                                 │ │   │
│  │ └─────────────────────────────────┘ │   │
│  │         [Search]                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

#### Properties List Screen (Multiple Properties)

```
┌─────────────────────────────────────────────┐
│  ◄ Back    Properties Found: 3              │
├─────────────────────────────────────────────┤
│                                             │
│  Owner: राम प्रसाद यादव                      │
│  Phone: 8877225966                          │
│  Aadhaar: XXXX-XXXX-5950                    │
│                                             │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ 📍 BH2023-PAT-001                       │ │
│ │ Plot: 3053 | Khata: 129                 │ │
│ │ Village: दानापुर | Area: 86 डिसमिल       │ │
│ │ 📄 Documents: 6                    [►]  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 📍 BH2023-PAT-002                       │ │
│ │ Plot: 1567 | Khata: 89                  │ │
│ │ Village: पटना सिटी | Area: 1.5 ऐकर      │ │
│ │ 📄 Documents: 5                    [►]  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 📍 BH2023-MUZ-001                       │ │
│ │ Plot: 2234 | Khata: 156                 │ │
│ │ Village: कटरा | Area: 2 ऐकर             │ │
│ │ 📄 Documents: 7                    [►]  │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### Property Detail Screen

```
┌─────────────────────────────────────────────┐
│  ◄ Back         Property Details            │
├─────────────────────────────────────────────┤
│                                             │
│  Property ID: BH2023-PAT-001                │
│                                             │
│  ─────────── Owner Details ───────────      │
│                                             │
│  नाम: राम प्रसाद यादव                        │
│  पिता / पति: श्री सुखदेव यादव                │
│  लिंग: Male                                 │
│  फोन नंबर: 8877225966                       │
│  आधार नंबर: XXXX-XXXX-5950                  │
│                                             │
│  ─────────── Land Details ────────────      │
│                                             │
│  प्लॉट नंबर: 3053        खाता: 129          │
│  ऐकर: -                 डिसमिल: 86          │
│  जिला: पटना             गाँव: दानापुर        │
│                                             │
│  ─────────── चौहदी (Boundaries) ──────      │
│                                             │
│  उत्तर: साहेब बहादुर                         │
│  दक्षिण: राम सेवक राम                        │
│  पूरब: सुनील दास                            │
│  पश्चिम: ख.स -1502                          │
│                                             │
│  ─────────── Documents (6) ───────────      │
│                                             │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ PDF │ │ IMG │ │ IMG │ │ PDF │          │
│  │  1  │ │  2  │ │  3  │ │  4  │          │
│  └─────┘ └─────┘ └─────┘ └─────┘          │
│  ┌─────┐ ┌─────┐                           │
│  │ IMG │ │ PDF │                           │
│  │  5  │ │  6  │                           │
│  └─────┘ └─────┘                           │
│                                             │
│         [View All Documents]                │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.2 Admin Portal Features

#### Core Features (MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| Login | Simple username/password authentication | P0 |
| Dashboard | Total records, properties, documents stats | P0 |
| Owners List | List all owners with property count | P0 |
| Properties List | Paginated table with search & filter | P0 |
| Add Owner | Add new owner (can add properties later) | P0 |
| Add Property | Add property to existing/new owner | P0 |
| Edit Property | Modify existing property | P0 |
| Delete Property | Remove with confirmation | P0 |
| **CSV/Excel Import** | Bulk upload survey data | **P0** |
| **Document Upload** | Upload multiple (5-7) PDF/Images per property | **P0** |
| Document Management | View, delete documents | P1 |

#### CSV/Excel Import - Updated Fields

```
Import Fields Mapping (Updated for new model):
┌──────────────────────────────────────────────────────────────────────┐
│ CSV Column              │ Database Field      │ Required │ Type     │
├──────────────────────────────────────────────────────────────────────┤
│ OWNER FIELDS:                                                        │
│ owner_name / नाम         │ Person.name         │ Yes      │ String   │
│ father_name / पिता       │ Person.fatherName   │ Yes      │ String   │
│ gender / लिंग            │ Person.gender       │ Yes      │ String   │
│ phone / फोन              │ Person.phone        │ Yes      │ String   │
│ aadhaar / आधार           │ Person.aadhaar      │ Yes      │ String   │
├──────────────────────────────────────────────────────────────────────┤
│ PROPERTY FIELDS:                                                     │
│ property_id / संपत्ति आईडी │ Property.uniqueId   │ Yes      │ String   │
│ plot_no / प्लॉट          │ Property.plotNo     │ Yes      │ String   │
│ khata_no / खाता          │ Property.khataNo    │ Yes      │ String   │
│ acres / ऐकर              │ Property.acres      │ No       │ Float    │
│ decimal / डिसमिल         │ Property.decimal    │ Yes      │ Float    │
│ north / उत्तर            │ Property.north      │ Yes      │ String   │
│ south / दक्षिण           │ Property.south      │ Yes      │ String   │
│ east / पूरब              │ Property.east       │ Yes      │ String   │
│ west / पश्चिम            │ Property.west       │ Yes      │ String   │
│ district / जिला          │ Property.district   │ No       │ String   │
│ village / गाँव           │ Property.village    │ No       │ String   │
└──────────────────────────────────────────────────────────────────────┘

Note: If same Aadhaar exists, new property is added to existing owner.
      If new Aadhaar, new owner is created with the property.
```

### 3.3 What's OUT of Scope (Phase 2)

| Feature | Reason |
|---------|--------|
| OTP Verification | Requires SMS gateway integration |
| Multiple Admin Roles | Single admin sufficient for MVP |
| Interactive Land Maps (GIS) | Complex PostGIS setup |
| Offline Mode | Requires local database |
| Aadhaar Encryption/Hashing | Add before production |
| Other 7 Modules Functionality | Focus on Survey Status only |
| Audit Logging | Not critical for testing |

---

## 4. Technology Stack

### 4.1 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                            │
├─────────────────────────────────────────────────────────────────┤
│  MOBILE APP          │  ADMIN PORTAL       │  BACKEND           │
│  ─────────────       │  ─────────────      │  ─────────         │
│  React Native        │  React.js           │  Node.js           │
│  Expo                │  Ant Design         │  Express.js        │
│  React Navigation    │  React Router       │  Prisma ORM        │
│  Axios               │  Axios              │  Multer (uploads)  │
│  Image Viewer        │  xlsx / papaparse   │  xlsx / csv-parser │
│  PDF Viewer          │  Ant Upload         │  Sharp (images)    │
├─────────────────────────────────────────────────────────────────┤
│                        DATABASE                                  │
│  PostgreSQL 15 (UTF-8 for Hindi)                                │
│  File Storage: Local filesystem / Cloudinary                    │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Document Handling Libraries

| Platform | Library | Purpose |
|----------|---------|---------|
| Mobile | `react-native-pdf` | View PDF documents |
| Mobile | `react-native-image-viewing` | Image gallery view |
| Mobile | `expo-file-system` | Download/cache documents |
| Admin | `antd Upload` | Multiple file upload |
| Admin | `react-pdf` | PDF preview |
| Backend | `multer` | File upload handling |
| Backend | `sharp` | Image compression/thumbnails |

---

## 5. Database Design

### 5.1 Updated Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────────┐       ┌─────────────────┐
│     Admin       │       │       Person        │       │  LandProperty   │
├─────────────────┤       │      (Owner)        │       ├─────────────────┤
│ id (PK)         │       ├─────────────────────┤       │ id (PK)         │
│ username        │       │ id (PK)             │       │ propertyUniqueId│◄─ Search Key
│ password        │       │ name                │       │ plotNo          │
│ name            │       │ fatherName          │       │ khataNo         │
│ createdAt       │       │ gender              │       │ acres           │
└─────────────────┘       │ phone (IDX)         │◄──────│ decimal         │
                          │ aadhaar (UNIQUE)    │  1:N  │ northBoundary   │
                          │ createdAt           │       │ southBoundary   │
                          │ updatedAt           │       │ eastBoundary    │
                          └─────────────────────┘       │ westBoundary    │
                                                        │ district        │
                                                        │ village         │
                                                        │ ownerId (FK)    │
                                                        │ createdAt       │
                                                        └────────┬────────┘
                                                                 │
                                                                 │ 1:N (5-7 docs)
                                                                 ▼
                                                        ┌─────────────────┐
                                                        │    Document     │
                                                        ├─────────────────┤
                                                        │ id (PK)         │
                                                        │ propertyId (FK) │
                                                        │ fileName        │
                                                        │ originalName    │
                                                        │ fileType        │
                                                        │ filePath        │
                                                        │ fileSize        │
                                                        │ description     │
                                                        │ createdAt       │
                                                        └─────────────────┘
```

### 5.2 Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
}

// Person/Owner - identified by Aadhaar (one person can own multiple properties)
model Person {
  id         Int            @id @default(autoincrement())
  name       String         // नाम
  fatherName String         // पिता/पति
  gender     String         // Male/Female
  phone      String         // फोन नंबर
  aadhaar    String         @unique // आधार नंबर - UNIQUE identifier
  properties LandProperty[] // One person can have multiple properties
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt

  @@index([phone])
  @@index([aadhaar])
}

// Land Property - each has unique Property ID, belongs to one owner
model LandProperty {
  id               Int        @id @default(autoincrement())
  propertyUniqueId String     @unique // BH2023-PAT-00001 format
  plotNo           String     // प्लॉट नंबर
  khataNo          String     // खाता
  acres            Float?     // ऐकर (can be null)
  decimal          Float      // डिसमिल
  northBoundary    String     // चौहदी - उत्तर
  southBoundary    String     // चौहदी - दक्षिण
  eastBoundary     String     // चौहदी - पूरब
  westBoundary     String     // चौहदी - पश्चिम
  district         String?    // जिला
  village          String?    // गाँव
  ownerId          Int
  owner            Person     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  documents        Document[] // 5-7 documents per property
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  @@index([propertyUniqueId])
  @@index([plotNo, khataNo])
}

// Document - PDF or Image file attached to property (5-7 per property)
model Document {
  id           Int          @id @default(autoincrement())
  propertyId   Int
  property     LandProperty @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  fileName     String       // System generated filename
  originalName String       // Original uploaded filename
  fileType     String       // 'pdf', 'jpg', 'jpeg', 'png'
  filePath     String       // Storage path
  fileSize     Int          // Size in bytes
  description  String?      // Optional description (दाखिल खारिज, रसीद, etc.)
  createdAt    DateTime     @default(now())

  @@index([propertyId])
}

// Import Log - Track bulk imports
model ImportLog {
  id           Int      @id @default(autoincrement())
  fileName     String
  totalRows    Int
  successCount Int
  errorCount   Int
  errors       String?  // JSON string of errors
  importedBy   String
  createdAt    DateTime @default(now())
}
```

### 5.3 Sample Seed Data

```javascript
// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create admin
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'admin123',
      name: 'System Administrator'
    }
  });

  // Create Person 1 with MULTIPLE properties (same Aadhaar)
  const person1 = await prisma.person.create({
    data: {
      name: 'राम प्रसाद यादव',
      fatherName: 'श्री सुखदेव यादव',
      gender: 'Male',
      phone: '8877225966',
      aadhaar: '854211545950',
      properties: {
        create: [
          // Property 1
          {
            propertyUniqueId: 'BH2023-PAT-00001',
            plotNo: '3053',
            khataNo: '129',
            decimal: 86,
            northBoundary: 'साहेब बहादुर',
            southBoundary: 'राम सेवक राम',
            eastBoundary: 'सुनील दास',
            westBoundary: 'ख.स -1502',
            district: 'पटना',
            village: 'दानापुर'
          },
          // Property 2 (same owner, same Aadhaar)
          {
            propertyUniqueId: 'BH2023-PAT-00002',
            plotNo: '1567',
            khataNo: '89',
            acres: 1.5,
            decimal: 0,
            northBoundary: 'सरकारी रास्ता',
            southBoundary: 'मोहन लाल',
            eastBoundary: 'नहर',
            westBoundary: 'रामचंद्र सिंह',
            district: 'पटना',
            village: 'पटना सिटी'
          },
          // Property 3 (same owner, different district)
          {
            propertyUniqueId: 'BH2023-MUZ-00001',
            plotNo: '2234',
            khataNo: '156',
            acres: 2,
            decimal: 0,
            northBoundary: 'खेत',
            southBoundary: 'सड़क',
            eastBoundary: 'नाला',
            westBoundary: 'श्याम सुंदर',
            district: 'मुजफ्फरपुर',
            village: 'कटरा'
          }
        ]
      }
    }
  });

  // Add 6 documents to first property
  const property1 = await prisma.landProperty.findUnique({
    where: { propertyUniqueId: 'BH2023-PAT-00001' }
  });

  await prisma.document.createMany({
    data: [
      {
        propertyId: property1.id,
        fileName: 'doc1.pdf',
        originalName: 'दाखिल_खारिज.pdf',
        fileType: 'pdf',
        filePath: '/uploads/documents/doc1.pdf',
        fileSize: 245000,
        description: 'दाखिल खारिज'
      },
      {
        propertyId: property1.id,
        fileName: 'doc2.jpg',
        originalName: 'भू_नक्शा.jpg',
        fileType: 'jpg',
        filePath: '/uploads/documents/doc2.jpg',
        fileSize: 180000,
        description: 'भू नक्शा'
      },
      {
        propertyId: property1.id,
        fileName: 'doc3.pdf',
        originalName: 'रसीद.pdf',
        fileType: 'pdf',
        filePath: '/uploads/documents/doc3.pdf',
        fileSize: 120000,
        description: 'लगान रसीद'
      },
      {
        propertyId: property1.id,
        fileName: 'doc4.pdf',
        originalName: 'जमाबंदी.pdf',
        fileType: 'pdf',
        filePath: '/uploads/documents/doc4.pdf',
        fileSize: 320000,
        description: 'जमाबंदी पंजी'
      },
      {
        propertyId: property1.id,
        fileName: 'doc5.jpg',
        originalName: 'जमीन_फोटो.jpg',
        fileType: 'jpg',
        filePath: '/uploads/documents/doc5.jpg',
        fileSize: 450000,
        description: 'जमीन का फोटो'
      },
      {
        propertyId: property1.id,
        fileName: 'doc6.pdf',
        originalName: 'अन्य.pdf',
        fileType: 'pdf',
        filePath: '/uploads/documents/doc6.pdf',
        fileSize: 200000,
        description: 'अन्य दस्तावेज'
      }
    ]
  });

  console.log('Seed data created!');
  console.log('Person 1 has 3 properties');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 6. API Design

### 6.1 API Endpoints

#### Base URL
```
Development: http://localhost:3000/api
Production:  https://bihar-land-api.onrender.com/api
```

#### Public APIs (Mobile App)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/search/mobile/:phone` | Returns owner + ALL properties |
| `GET` | `/search/aadhaar/:aadhaar` | Returns owner + ALL properties |
| `GET` | `/search/property/:propertyId` | Returns single property |
| `GET` | `/properties/:id` | Get property details |
| `GET` | `/properties/:id/documents` | Get all documents (5-7) |
| `GET` | `/documents/:id/download` | Download document |

#### Admin APIs (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/login` | Admin login |
| `GET` | `/admin/dashboard` | Stats |
| `GET` | `/admin/owners` | List owners |
| `POST` | `/admin/owners` | Create owner |
| `GET` | `/admin/properties` | List properties |
| `POST` | `/admin/properties` | Create property |
| `PUT` | `/admin/properties/:id` | Update property |
| `DELETE` | `/admin/properties/:id` | Delete property |
| `POST` | `/admin/properties/:id/documents` | Upload 5-7 documents |
| `DELETE` | `/admin/documents/:id` | Delete document |
| `POST` | `/admin/import` | CSV/Excel import |
| `GET` | `/admin/import/template` | Download template |

### 6.2 Sample API Responses

#### Search by Phone (Returns Owner + Multiple Properties)
```json
GET /api/search/mobile/8877225966

{
  "success": true,
  "data": {
    "owner": {
      "id": 1,
      "name": "राम प्रसाद यादव",
      "fatherName": "श्री सुखदेव यादव",
      "gender": "Male",
      "phone": "8877225966",
      "aadhaar": "XXXX-XXXX-5950"
    },
    "propertiesCount": 3,
    "properties": [
      {
        "id": 1,
        "propertyUniqueId": "BH2023-PAT-00001",
        "plotNo": "3053",
        "khataNo": "129",
        "decimal": 86,
        "district": "पटना",
        "village": "दानापुर",
        "documentsCount": 6
      },
      {
        "id": 2,
        "propertyUniqueId": "BH2023-PAT-00002",
        "plotNo": "1567",
        "khataNo": "89",
        "acres": 1.5,
        "district": "पटना",
        "village": "पटना सिटी",
        "documentsCount": 5
      },
      {
        "id": 3,
        "propertyUniqueId": "BH2023-MUZ-00001",
        "plotNo": "2234",
        "khataNo": "156",
        "acres": 2,
        "district": "मुजफ्फरपुर",
        "village": "कटरा",
        "documentsCount": 7
      }
    ]
  }
}
```

#### Property Details with Documents
```json
GET /api/properties/1

{
  "success": true,
  "data": {
    "property": {
      "id": 1,
      "propertyUniqueId": "BH2023-PAT-00001",
      "plotNo": "3053",
      "khataNo": "129",
      "decimal": 86,
      "northBoundary": "साहेब बहादुर",
      "southBoundary": "राम सेवक राम",
      "eastBoundary": "सुनील दास",
      "westBoundary": "ख.स -1502",
      "district": "पटना",
      "village": "दानापुर"
    },
    "owner": {
      "name": "राम प्रसाद यादव",
      "fatherName": "श्री सुखदेव यादव",
      "gender": "Male",
      "phone": "8877225966",
      "aadhaar": "XXXX-XXXX-5950"
    },
    "documents": [
      {"id": 1, "fileName": "doc1.pdf", "description": "दाखिल खारिज", "fileType": "pdf"},
      {"id": 2, "fileName": "doc2.jpg", "description": "भू नक्शा", "fileType": "jpg"},
      {"id": 3, "fileName": "doc3.pdf", "description": "लगान रसीद", "fileType": "pdf"},
      {"id": 4, "fileName": "doc4.pdf", "description": "जमाबंदी पंजी", "fileType": "pdf"},
      {"id": 5, "fileName": "doc5.jpg", "description": "जमीन का फोटो", "fileType": "jpg"},
      {"id": 6, "fileName": "doc6.pdf", "description": "अन्य दस्तावेज", "fileType": "pdf"}
    ]
  }
}
```

### 6.3 CSV Import Logic

```javascript
// Import Logic: Same Aadhaar = Add property to existing owner

async function processImportRow(row) {
  const aadhaar = row.aadhaar || row['आधार'];
  
  // Check if owner exists
  let owner = await prisma.person.findUnique({
    where: { aadhaar: aadhaar }
  });

  // If not exists, create new owner
  if (!owner) {
    owner = await prisma.person.create({
      data: {
        name: row.owner_name || row['नाम'],
        fatherName: row.father_name || row['पिता'],
        gender: row.gender || row['लिंग'],
        phone: row.phone || row['फोन'],
        aadhaar: aadhaar
      }
    });
  }

  // Create property for owner (existing or new)
  const property = await prisma.landProperty.create({
    data: {
      propertyUniqueId: row.property_id,
      plotNo: row.plot_no,
      khataNo: row.khata_no,
      // ... other fields
      ownerId: owner.id
    }
  });

  return { owner, property };
}
```

### 6.4 CSV Template

```csv
property_id,owner_name,father_name,gender,phone,aadhaar,plot_no,khata_no,acres,decimal,north,south,east,west,district,village
BH2023-PAT-00001,राम प्रसाद यादव,श्री सुखदेव यादव,Male,8877225966,854211545950,3053,129,,86,साहेब बहादुर,राम सेवक राम,सुनील दास,ख.स -1502,पटना,दानापुर
BH2023-PAT-00002,राम प्रसाद यादव,श्री सुखदेव यादव,Male,8877225966,854211545950,1567,89,1.5,,सरकारी रास्ता,मोहन लाल,नहर,रामचंद्र सिंह,पटना,पटना सिटी
BH2023-PAT-00003,बिन्दु देवी,श्री प्रमोद दास,Female,9876543210,123456789012,4521,234,,50,गंगा राम,सीता देवी,मंदिर,तालाब,पटना,फुलवारी
```

**Result:** 2 owners created, 3 properties (first owner has 2 properties)

---

## 7. Day-by-Day Development Plan

### Team Allocation

| Role | Responsibilities |
|------|------------------|
| Dev 1 (Lead) | Backend API, Database, CSV Import |
| Dev 2 | Mobile App (React Native) |
| Dev 3 | Admin Portal (React.js) |

---

### DAY 1: Setup & Database

**Goal:** Database with schema, basic project structure

| Time | Task | Owner |
|------|------|-------|
| 9:00-10:30 | Git repo, backend init, Prisma schema | Dev 1 |
| 9:00-10:30 | React Native + Expo init | Dev 2 |
| 9:00-10:30 | React.js + Ant Design init | Dev 3 |
| 10:30-12:00 | PostgreSQL setup, migrations | Dev 1 |
| 10:30-12:00 | Navigation setup, Splash screen | Dev 2 |
| 10:30-12:00 | Router setup, Login page | Dev 3 |
| 1:00-3:00 | Seed script (multiple properties per owner) | Dev 1 |
| 1:00-3:00 | **Home screen with 8 module cards** | Dev 2 |
| 1:00-3:00 | Dashboard layout | Dev 3 |
| 3:00-5:00 | File upload directory setup | Dev 1 |
| 3:00-5:00 | Home screen styling (Bihar colors) | Dev 2 |
| 3:00-5:00 | Owners/Properties list pages | Dev 3 |
| 5:00-6:00 | Team sync | All |

**Deliverables:**
- [ ] Database with Person → Properties → Documents
- [ ] Seed data: 2+ persons with multiple properties each
- [ ] Mobile: Home with 8 cards
- [ ] Admin: Login + Dashboard shell

---

### DAY 2: Search APIs & Mobile Search

**Goal:** All search APIs, mobile search working

| Time | Task | Owner |
|------|------|-------|
| 9:00-12:00 | Search APIs (mobile, aadhaar, property) | Dev 1 |
| 9:00-12:00 | Search screen UI (3 forms) | Dev 2 |
| 9:00-12:00 | Admin login API + JWT | Dev 3 |
| 1:00-3:00 | GET /properties/:id with documents | Dev 1 |
| 1:00-3:00 | **Properties List screen (multiple per owner)** | Dev 2 |
| 1:00-3:00 | Properties table with filters | Dev 3 |
| 3:00-5:00 | Test APIs with Postman | Dev 1 |
| 3:00-5:00 | Connect search → API | Dev 2 |
| 3:00-5:00 | Connect admin → APIs | Dev 3 |
| 5:00-6:00 | Team sync | All |

**Deliverables:**
- [ ] Search by phone returns owner + ALL properties
- [ ] Search by property ID returns single property
- [ ] Mobile: Search → Properties List working
- [ ] Admin: Login + Properties list

---

### DAY 3: CRUD, Details & CSV Import

**Goal:** Full mobile flow, CRUD APIs, CSV import

| Time | Task | Owner |
|------|------|-------|
| 9:00-12:00 | CRUD APIs (POST, PUT, DELETE) | Dev 1 |
| 9:00-12:00 | **Property Detail screen + boundaries** | Dev 2 |
| 9:00-12:00 | Add/Edit Property forms | Dev 3 |
| 1:00-3:00 | **CSV Import API (owner lookup logic)** | Dev 1 |
| 1:00-3:00 | **Documents grid on detail screen** | Dev 2 |
| 1:00-3:00 | **CSV Import UI** | Dev 3 |
| 3:00-5:00 | Test CSV with Hindi data | Dev 1+3 |
| 3:00-5:00 | Documents gallery screen | Dev 2 |
| 5:00-6:00 | Team sync | All |

**Deliverables:**
- [ ] CSV Import with owner lookup (same Aadhaar → add property)
- [ ] Mobile: Search → List → Detail → Documents
- [ ] Admin: CRUD + Import working

---

### DAY 4: Documents & Polish

**Goal:** Document upload, UI polish, testing

| Time | Task | Owner |
|------|------|-------|
| 9:00-12:00 | **Multi-document upload API (5-7 files)** | Dev 1 |
| 9:00-12:00 | PDF viewer + Image gallery | Dev 2 |
| 9:00-12:00 | **Document upload UI (multiple)** | Dev 3 |
| 1:00-3:00 | Error handling all APIs | Dev 1 |
| 1:00-3:00 | Loading states, error messages | Dev 2 |
| 1:00-3:00 | Form validation, loading states | Dev 3 |
| 3:00-5:00 | **Manual testing** | All |
| 5:00-6:00 | Bug fixing + sync | All |

**Deliverables:**
- [ ] Upload 5-7 documents per property
- [ ] PDF/Image viewer in mobile
- [ ] All screens polished
- [ ] Testing complete

---

### DAY 5: Deploy & Demo

**Goal:** Production deployment, demo

| Time | Task | Owner |
|------|------|-------|
| 9:00-12:00 | Deploy backend (Render) | Dev 1 |
| 9:00-12:00 | Build APK (Expo EAS) | Dev 2 |
| 9:00-12:00 | Deploy admin (Vercel) | Dev 3 |
| 1:00-3:00 | Production DB + seed data | Dev 1 |
| 1:00-3:00 | Test APK on device | Dev 2 |
| 1:00-3:00 | Test admin on production | Dev 3 |
| 3:00-5:00 | Fix production bugs | All |
| 5:00-6:00 | **Demo to stakeholders** | All |

**Deliverables:**
- [ ] API deployed
- [ ] APK generated
- [ ] Admin deployed
- [ ] Demo completed

---

## 8. Testing Plan

### Mobile Test Cases

| ID | Test | Expected |
|----|------|----------|
| M01 | Home screen | 8 module cards visible |
| M02 | Search by phone | Owner + multiple properties shown |
| M03 | Search by Aadhaar | Owner + multiple properties shown |
| M04 | Search by Property ID | Single property shown |
| M05 | Properties list | Multiple properties for same owner |
| M06 | Property detail | All fields + boundaries shown |
| M07 | Documents grid | 5-7 document thumbnails |
| M08 | View PDF | PDF opens in viewer |
| M09 | View Image | Image opens in gallery |
| M10 | No results | "कोई रिकॉर्ड नहीं" message |

### Admin Test Cases

| ID | Test | Expected |
|----|------|----------|
| A01 | Login | Redirects to dashboard |
| A02 | Add property - new owner | Creates owner + property |
| A03 | Add property - existing Aadhaar | Adds to existing owner |
| A04 | CSV import - same Aadhaar | Multiple properties added to owner |
| A05 | Upload documents | 5-7 files uploaded |
| A06 | Delete document | Document removed |

### Integration Test Cases

| ID | Test | Expected |
|----|------|----------|
| I01 | Import CSV → Search mobile | All imported records found |
| I02 | Same owner multiple properties | All properties shown in list |
| I03 | Upload docs → View mobile | Documents visible |

---

## 9. Deployment Guide

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="secret"
PORT=3000
MAX_FILES=7
```

**Admin (.env)**
```env
VITE_API_URL="https://api.example.com/api"
```

**Mobile (app.config.js)**
```javascript
extra: {
  apiUrl: "https://api.example.com/api"
}
```

### Deployment Steps

1. **Database:** Supabase/Neon free tier
2. **Backend:** Render.com
3. **Admin:** Vercel
4. **Mobile:** Expo EAS Build

---

## 10. Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Same Aadhaar handling confusion | Clear logic: lookup owner, add property |
| Large file uploads | 10MB limit, compression |
| Hindi encoding issues | UTF-8 everywhere |
| Multiple documents slow | Lazy load, thumbnails |

---

## Quick Reference

### Property ID Format
```
BH{YEAR}-{DISTRICT}-{SERIAL}
Example: BH2023-PAT-00001
```

### Document Types
- PDF (.pdf)
- JPEG (.jpg, .jpeg)
- PNG (.png)

### Limits
- Documents per property: 7
- File size: 10MB
- CSV rows: 1000

---

**Ready to start development! 🚀**
