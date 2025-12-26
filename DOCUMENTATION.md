# Bihar Land Survey & Revenue Application

## Complete Technical Documentation

**Version:** 1.0.0
**Date:** December 2024
**Status:** Development Complete (Backend + Admin Portal)

---

## Table of Contents
 
1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Database Schema](#4-database-schema)
5. [Backend API](#5-backend-api)
6. [Admin Portal](#6-admin-portal)
7. [Installation & Setup](#7-installation--setup)
8. [API Reference](#8-api-reference)
9. [Features Implemented](#9-features-implemented)
10. [Deployment Guide](#10-deployment-guide)
11. [Security Considerations](#11-security-considerations)
12. [Future Enhancements](#12-future-enhancements)

---

## 1. Project Overview

### 1.1 Purpose

The Bihar Land Survey & Revenue Application is a government digital platform for managing land records in Bihar, India. It enables:

- **Citizens** to search and view their land records via mobile app
- **Administrators** to manage land records, owners, and documents via web portal
- **Bulk Import** of land records from CSV/Excel files

### 1.2 Components

| Component | Status | Description |
|-----------|--------|-------------|
| Backend API | ✅ Complete | Node.js/Express REST API |
| Admin Portal | ✅ Complete | React.js Web Application |
| Mobile App | 🔜 Pending | Flutter Android Application |

### 1.3 Key Features

- Multi-language support (Hindi + English)
- Aadhaar-based owner identification
- Unique Property ID generation (BH2023-PAT-00001 format)
- Document management (5-7 documents per property)
- CSV/Excel bulk import with Hindi column support
- JWT-based authentication for admin operations

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────────────────┬───────────────────────────────────┤
│      Admin Portal           │         Mobile App                │
│   (React + Ant Design)      │     (Flutter) - Coming Soon       │
│   http://localhost:5173     │                                   │
└─────────────┬───────────────┴───────────────┬───────────────────┘
              │                               │
              │         REST API              │
              └───────────────┬───────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      BACKEND API                                 │
│                  (Node.js + Express)                            │
│                  http://localhost:3000                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Routes  │  │Controllers│ │ Services │  │Middleware│        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────┬───────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
┌─────────────▼─────────────┐   ┌─────────────▼─────────────┐
│      PostgreSQL           │   │     File Storage          │
│    (Prisma ORM)           │   │   /uploads/documents      │
│   - admins                │   │   - PDF files             │
│   - persons               │   │   - Image files           │
│   - land_properties       │   │                           │
│   - documents             │   │                           │
│   - import_logs           │   │                           │
└───────────────────────────┘   └───────────────────────────┘
```

### 2.2 Directory Structure

```
D:\land\
├── backend/                      # Backend API (Node.js/Express)
│   ├── package.json
│   ├── .env                      # Environment variables
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── seed.js               # Sample data seeder
│   ├── src/
│   │   ├── index.js              # Server entry point
│   │   ├── app.js                # Express application
│   │   ├── config/
│   │   │   └── index.js          # Configuration
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT authentication
│   │   │   ├── errorHandler.js   # Global error handling
│   │   │   └── upload.js         # File upload (Multer)
│   │   ├── routes/
│   │   │   ├── public.routes.js  # Public endpoints
│   │   │   └── admin.routes.js   # Admin endpoints
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── search.controller.js
│   │   │   ├── owner.controller.js
│   │   │   ├── property.controller.js
│   │   │   ├── document.controller.js
│   │   │   └── import.controller.js
│   │   ├── services/
│   │   │   ├── search.service.js
│   │   │   ├── propertyId.service.js
│   │   │   └── import.service.js
│   │   └── utils/
│   │       ├── aadhaarMask.js
│   │       └── responseHelper.js
│   ├── uploads/
│   │   └── documents/            # Uploaded files storage
│   └── render.yaml               # Render deployment config
│
├── admin/                        # Admin Portal (React)
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   ├── index.html
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Root component with routing
│   │   ├── config/
│   │   │   └── api.js            # Axios configuration
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication state
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx    # Login page layout
│   │   │   └── DashboardLayout.jsx # Main app layout
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Owners/
│   │   │   │   ├── OwnersList.jsx
│   │   │   │   └── OwnerForm.jsx
│   │   │   ├── Properties/
│   │   │   │   ├── PropertiesList.jsx
│   │   │   │   ├── PropertyForm.jsx
│   │   │   │   └── PropertyDetail.jsx
│   │   │   └── Import/
│   │   │       └── ImportPage.jsx
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── ConfirmModal.jsx
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── owner.service.js
│   │   │   ├── property.service.js
│   │   │   ├── document.service.js
│   │   │   └── import.service.js
│   │   └── utils/
│   │       ├── storage.js
│   │       └── formatters.js
│   └── render.yaml               # Render deployment config
│
├── demo/                         # UI Demo HTML files
│   ├── bihar-land-app-demo.html
│   └── bihar-land-app-demo-modern.html
│
├── screens/                      # Design reference screenshots
│
├── CLAUDE.md                     # Project guidance
├── DOCUMENTATION.md              # This file
└── Bihar_Land_App_MVP_Development_Plan_1.md
```

---

## 3. Technology Stack

### 3.1 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18.2 | Web framework |
| Prisma | 5.7.0 | ORM for database |
| PostgreSQL | 15+ | Database |
| JSON Web Token | 9.0.2 | Authentication |
| Multer | 1.4.5 | File uploads |
| Sharp | 0.33.1 | Image compression |
| bcryptjs | 2.4.3 | Password hashing |
| xlsx | 0.18.5 | Excel file parsing |
| csv-parser | 3.0.0 | CSV file parsing |

### 3.2 Admin Portal

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library |
| Vite | 5.0.8 | Build tool |
| Ant Design | 5.12.0 | UI component library |
| React Router | 6.21.0 | Client-side routing |
| Axios | 1.6.2 | HTTP client |
| xlsx | 0.18.5 | Excel file handling |
| papaparse | 5.4.1 | CSV parsing |

### 3.3 Database

| Feature | Implementation |
|---------|----------------|
| Database | PostgreSQL 15 |
| ORM | Prisma |
| Encoding | UTF-8 (Hindi support) |
| Indexes | Phone, Aadhaar, PropertyID, District |

---

## 4. Database Schema

### 4.1 Entity Relationship Diagram

```
┌─────────────────┐
│     Admin       │
├─────────────────┤
│ id (PK)         │
│ username (UQ)   │
│ password        │
│ name            │
│ createdAt       │
│ updatedAt       │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Person      │       │  LandProperty   │       │    Document     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │──┐    │ id (PK)         │
│ name            │  │    │ propertyUniqueId│  │    │ fileName        │
│ fatherName      │  │    │ plotNo          │  │    │ filePath        │
│ gender          │  └───▶│ khataNo         │  └───▶│ fileType        │
│ phone           │   1:N │ district        │   1:N │ fileSize        │
│ aadhaar (UQ)    │       │ village         │       │ description     │
│ createdAt       │       │ acres/decimals  │       │ uploadedAt      │
│ updatedAt       │       │ boundaries (4)  │       │ propertyId (FK) │
└─────────────────┘       │ surveyStatus    │       └─────────────────┘
                          │ ownerId (FK)    │
                          │ createdAt       │
                          └─────────────────┘

┌─────────────────┐
│   ImportLog     │
├─────────────────┤
│ id (PK)         │
│ fileName        │
│ totalRows       │
│ successCount    │
│ failedCount     │
│ errors (JSON)   │
│ importedBy      │
│ importedAt      │
└─────────────────┘
```

### 4.2 Model Definitions

#### Admin
```prisma
model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String                    // bcrypt hashed
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Person (Owner)
```prisma
model Person {
  id         String   @id @default(cuid())
  name       String                   // नाम
  fatherName String                   // पिता/पति का नाम
  gender     String                   // Male/Female/Other
  phone      String                   // 10-digit phone
  aadhaar    String   @unique         // 12-digit Aadhaar
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  properties LandProperty[]           // One owner can have multiple properties
}
```

#### LandProperty
```prisma
model LandProperty {
  id               String   @id @default(cuid())
  propertyUniqueId String   @unique    // BH2023-PAT-00001 format
  plotNo           String              // प्लॉट नंबर
  khataNo          String              // खाता नंबर
  acres            Float?              // ऐकर
  decimals         Float?              // डिसमिल
  district         String              // जिला
  village          String?             // गांव
  thana            String?             // थाना
  northBoundary    String?             // उत्तर
  southBoundary    String?             // दक्षिण
  eastBoundary     String?             // पूरब
  westBoundary     String?             // पश्चिम
  surveyStatus     String   @default("pending")
  ownerId          String
  owner            Person   @relation(...)
  documents        Document[]          // Max 7 documents
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

#### Document
```prisma
model Document {
  id          String   @id @default(cuid())
  fileName    String              // Original filename
  filePath    String              // Storage path
  fileType    String              // pdf, jpg, jpeg, png
  fileSize    Int                 // Size in bytes
  description String?
  uploadedAt  DateTime @default(now())
  propertyId  String
  property    LandProperty @relation(...)
}
```

### 4.3 Property ID Format

```
BH{YEAR}-{DISTRICT_CODE}-{SERIAL}

Examples:
- BH2023-PAT-00001 (Patna, first property)
- BH2023-GAY-00015 (Gaya, 15th property)
- BH2024-MUZ-00003 (Muzaffarpur, 3rd property in 2024)

District Codes:
- PAT = Patna (पटना)
- MUZ = Muzaffarpur (मुजफ्फरपुर)
- GAY = Gaya (गया)
- BHG = Bhagalpur (भागलपुर)
- DAR = Darbhanga (दरभंगा)
- PUR = Purnia (पूर्णिया)
- BEG = Begusarai (बेगूसराय)
- SAM = Samastipur (समस्तीपुर)
```

---

## 5. Backend API

### 5.1 Server Configuration

| Setting | Value |
|---------|-------|
| Port | 3000 |
| Base URL | `/api` |
| CORS | Enabled for localhost:5173 |
| Body Limit | 10MB |
| File Upload Limit | 10MB per file, 7 files max |

### 5.2 Middleware Stack

1. **CORS** - Cross-origin resource sharing
2. **JSON Parser** - Request body parsing
3. **Static Files** - Serve uploaded documents
4. **Auth Middleware** - JWT verification for admin routes
5. **Error Handler** - Global error handling

### 5.3 Route Structure

```
/api
├── /health                    GET     Health check
├── /search
│   ├── /mobile/:phone         GET     Search by phone
│   ├── /aadhaar/:aadhaar      GET     Search by Aadhaar
│   └── /property/:propertyId  GET     Search by Property ID
├── /properties
│   ├── /:id                   GET     Get property details
│   └── /:id/documents         GET     Get property documents
├── /documents
│   └── /:id/download          GET     Download document
└── /admin (JWT Required)
    ├── /login                 POST    Admin login
    ├── /me                    GET     Get current admin
    ├── /dashboard             GET     Dashboard statistics
    ├── /owners
    │   ├── /                  GET     List owners
    │   ├── /                  POST    Create owner
    │   ├── /:id               GET     Get owner
    │   ├── /:id               PUT     Update owner
    │   └── /:id               DELETE  Delete owner
    ├── /properties
    │   ├── /districts         GET     List unique districts
    │   ├── /                  GET     List properties
    │   ├── /                  POST    Create property
    │   ├── /:id               GET     Get property
    │   ├── /:id               PUT     Update property
    │   ├── /:id               DELETE  Delete property
    │   └── /:id/documents     POST    Upload documents
    ├── /documents
    │   ├── /:id               GET     Get document info
    │   └── /:id               DELETE  Delete document
    └── /import
        ├── /                  POST    Import CSV/Excel
        ├── /template          GET     Download template
        └── /logs              GET     Import history
```

---

## 6. Admin Portal

### 6.1 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Admin authentication |
| `/dashboard` | Dashboard | Statistics & overview |
| `/owners` | Owners List | View/manage owners |
| `/properties` | Properties List | View/manage properties |
| `/properties/new` | Property Form | Add new property |
| `/properties/:id` | Property Detail | View property & documents |
| `/properties/:id/edit` | Property Form | Edit property |
| `/import` | Import Page | CSV/Excel bulk import |

### 6.2 Features by Page

#### Login Page
- Username/password authentication
- JWT token storage in localStorage
- Redirect to dashboard on success

#### Dashboard
- Total owners count
- Total properties count
- Total documents count
- Recent properties list
- Properties by district breakdown

#### Owners List
- Paginated table view
- Search by name, phone, Aadhaar
- Add new owner (modal form)
- Edit owner (modal form)
- Delete owner (with confirmation)
- Property count per owner

#### Properties List
- Paginated table view
- Search by ID, plot, owner name
- Filter by district
- View property details
- Edit property
- Delete property (with confirmation)
- Document count per property

#### Property Form (Add/Edit)
- Owner selection (searchable dropdown)
- Plot and Khata numbers
- District selection
- Village and Thana fields
- Area (acres, decimals)
- Boundaries (North, South, East, West)
- Survey status selection
- Auto-generated Property ID (on create)

#### Property Detail
- Owner information display
- Property details display
- Boundaries display
- Document gallery
- Upload documents (up to 7)
- Download documents
- Delete documents
- Image preview / PDF icon

#### Import Page
- Download CSV template
- Drag & drop file upload
- Import progress indicator
- Success/failure summary
- Error details display
- Import history table

### 6.3 UI Components

| Component | Purpose |
|-----------|---------|
| `ProtectedRoute` | Auth guard for routes |
| `DashboardLayout` | Main layout with sidebar |
| `AuthLayout` | Login page layout |
| `StatCard` | Dashboard statistics card |
| `ConfirmModal` | Delete confirmation dialogs |

---

## 7. Installation & Setup

### 7.1 Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ installed and running
- Git (optional)

### 7.2 Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE bihar_land;
\q
```

### 7.3 Backend Setup

```bash
# Navigate to backend
cd D:\land\backend

# Install dependencies
npm install

# Configure environment
# Edit .env file with your database credentials:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/bihar_land"

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

### 7.4 Admin Portal Setup

```bash
# Navigate to admin
cd D:\land\admin

# Install dependencies
npm install

# Configure environment (optional - defaults to localhost:3000)
# Edit .env if needed:
VITE_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

### 7.5 Verification

1. Backend health check: http://localhost:3000/api/health
2. Admin Portal: http://localhost:5173
3. Login credentials: `admin` / `admin123`

---

## 8. API Reference

### 8.1 Authentication

#### Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "clx...",
      "username": "admin",
      "name": "System Administrator"
    }
  }
}
```

#### Using Token
```http
GET /api/admin/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 8.2 Public Search APIs

#### Search by Phone
```http
GET /api/search/mobile/8877225966

Response:
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "बिन्दु देवी",
    "fatherName": "श्री प्रमोद दास",
    "phone": "8877225966",
    "aadhaar": "XXXX-XXXX-0123",  // Masked
    "properties": [
      {
        "id": "clx...",
        "propertyUniqueId": "BH2023-PAT-00001",
        "plotNo": "3053",
        "khataNo": "129",
        ...
      }
    ]
  }
}
```

#### Search by Aadhaar
```http
GET /api/search/aadhaar/234567890123

Response: Same as phone search
```

#### Search by Property ID
```http
GET /api/search/property/BH2023-PAT-00001

Response:
{
  "success": true,
  "data": {
    "id": "clx...",
    "propertyUniqueId": "BH2023-PAT-00001",
    "plotNo": "3053",
    "owner": {
      "name": "बिन्दु देवी",
      "aadhaar": "XXXX-XXXX-0123"  // Masked
    },
    "documents": [...]
  }
}
```

### 8.3 Admin APIs

#### Create Owner
```http
POST /api/admin/owners
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "राजेश कुमार",
  "fatherName": "श्री रामेश्वर प्रसाद",
  "gender": "Male",
  "phone": "9876543210",
  "aadhaar": "567890123456"
}
```

#### Create Property
```http
POST /api/admin/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "ownerId": "clx...",
  "plotNo": "1234",
  "khataNo": "56",
  "district": "Patna",
  "village": "दानापुर",
  "decimals": 50,
  "northBoundary": "सड़क",
  "southBoundary": "खेत",
  "eastBoundary": "राम कुमार",
  "westBoundary": "नहर"
}

Response:
{
  "success": true,
  "data": {
    "propertyUniqueId": "BH2024-PAT-00005",  // Auto-generated
    ...
  }
}
```

#### Upload Documents
```http
POST /api/admin/properties/:id/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

documents: [file1.pdf, file2.jpg, ...]
description: "Land registration documents"

Response:
{
  "success": true,
  "data": {
    "uploaded": 3,
    "documents": [...]
  }
}
```

#### Import CSV/Excel
```http
POST /api/admin/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: data.xlsx

Response:
{
  "success": true,
  "data": {
    "totalRows": 100,
    "successCount": 95,
    "failedCount": 5,
    "created": {
      "owners": 20,
      "properties": 95
    },
    "errors": [
      "Row 15: Invalid Aadhaar format",
      ...
    ]
  }
}
```

### 8.4 Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

#### Paginated Response
```json
{
  "success": true,
  "message": "Records retrieved",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]  // Optional validation errors
}
```

---

## 9. Features Implemented

### 9.1 Backend Features

| Feature | Status | Description |
|---------|--------|-------------|
| JWT Authentication | ✅ | Secure admin login with token |
| Search by Phone | ✅ | Find owner by mobile number |
| Search by Aadhaar | ✅ | Find owner by Aadhaar number |
| Search by Property ID | ✅ | Find property by unique ID |
| Aadhaar Masking | ✅ | Display as XXXX-XXXX-1234 |
| Owner CRUD | ✅ | Create, Read, Update, Delete |
| Property CRUD | ✅ | Create, Read, Update, Delete |
| Auto Property ID | ✅ | Generate BH2023-PAT-00001 format |
| Document Upload | ✅ | Upload PDF/images to property |
| Document Limit | ✅ | Max 7 documents per property |
| Image Compression | ✅ | Sharp library for optimization |
| CSV Import | ✅ | Bulk import from CSV files |
| Excel Import | ✅ | Bulk import from XLSX files |
| Hindi Columns | ✅ | Support Hindi column headers |
| Import Logging | ✅ | Track all import operations |
| Error Handling | ✅ | Global error middleware |
| CORS Support | ✅ | Cross-origin requests |
| Health Check | ✅ | API status endpoint |

### 9.2 Admin Portal Features

| Feature | Status | Description |
|---------|--------|-------------|
| Login Page | ✅ | Admin authentication |
| Dashboard | ✅ | Statistics overview |
| Owners List | ✅ | Paginated, searchable |
| Add Owner | ✅ | Modal form |
| Edit Owner | ✅ | Modal form |
| Delete Owner | ✅ | With confirmation |
| Properties List | ✅ | Paginated, filterable |
| Add Property | ✅ | Full form page |
| Edit Property | ✅ | Full form page |
| Delete Property | ✅ | With confirmation |
| Property Detail | ✅ | View all information |
| Document Upload | ✅ | Multi-file upload |
| Document Preview | ✅ | Image thumbnails |
| Document Download | ✅ | Direct download link |
| Document Delete | ✅ | With confirmation |
| CSV Import | ✅ | Upload & process |
| Template Download | ✅ | CSV template file |
| Import History | ✅ | View past imports |
| Protected Routes | ✅ | Auth required |
| Responsive Design | ✅ | Works on all screens |
| Hindi Support | ✅ | Display Hindi text |

### 9.3 CSV Import Features

| Feature | Description |
|---------|-------------|
| File Types | .csv, .xls, .xlsx |
| Max Size | 5MB |
| Column Mapping | English & Hindi headers |
| Owner Lookup | Match existing Aadhaar |
| Auto Create | Create new owner if not found |
| Property ID | Auto-generate if empty |
| Validation | Row-level validation |
| Error Report | Detailed error messages |
| Transaction | Atomic per row |

#### Supported Column Headers

| English | Hindi | Field |
|---------|-------|-------|
| owner_name | नाम | Owner name |
| father_name | पिता / पिता का नाम | Father's name |
| gender | लिंग | Gender |
| phone | फोन / मोबाइल | Phone number |
| aadhaar | आधार / आधार नंबर | Aadhaar number |
| plot_no | प्लॉट / प्लॉट नंबर | Plot number |
| khata_no | खाता / खाता नंबर | Khata number |
| acres | ऐकर / एकड़ | Area in acres |
| decimal | डिसमिल | Area in decimals |
| north | उत्तर | North boundary |
| south | दक्षिण | South boundary |
| east | पूरब | East boundary |
| west | पश्चिम | West boundary |
| district | जिला | District name |
| village | गांव | Village name |

---

## 10. Deployment Guide

### 10.1 Render.com Deployment (Free Tier)

#### Step 1: Create PostgreSQL Database

1. Go to https://render.com
2. Create New → PostgreSQL
3. Name: `bihar-land-db`
4. Plan: Free
5. Copy the External Database URL

#### Step 2: Deploy Backend

1. Push code to GitHub repository
2. Create New → Web Service
3. Connect GitHub repo, select `backend` folder
4. Settings:
   - Name: `bihar-land-api`
   - Environment: Node
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`
5. Add Environment Variables:
   ```
   DATABASE_URL=<postgres-url-from-step-1>
   JWT_SECRET=<generate-secure-key>
   NODE_ENV=production
   PORT=3000
   MAX_FILES=7
   ```
6. Add Disk:
   - Mount Path: `/opt/render/project/src/uploads`
   - Size: 1 GB

#### Step 3: Deploy Admin Portal

1. Create New → Static Site
2. Connect GitHub repo, select `admin` folder
3. Settings:
   - Name: `bihar-land-admin`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://bihar-land-api.onrender.com/api
   ```
5. Add Rewrite Rule:
   - Source: `/*`
   - Destination: `/index.html`

#### Step 4: Initialize Production Database

```bash
# Connect to backend shell on Render
npx prisma db push
node prisma/seed.js
```

### 10.2 Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/bihar_land"

# JWT
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=production

# File Upload
MAX_FILES=7
MAX_FILE_SIZE=10485760
```

#### Admin Portal (.env)
```env
VITE_API_URL="https://your-api-domain.com/api"
```

---

## 11. Security Considerations

### 11.1 Implemented Security

| Measure | Implementation |
|---------|----------------|
| Password Hashing | bcrypt with salt rounds |
| JWT Authentication | Token-based auth for admin |
| Aadhaar Masking | Only show last 4 digits |
| File Type Validation | Whitelist PDF, JPG, PNG |
| File Size Limit | 10MB per file |
| CORS Configuration | Whitelist allowed origins |
| SQL Injection | Prisma ORM parameterized queries |
| Input Validation | express-validator |

### 11.2 Recommendations for Production

1. **Use HTTPS** - Enable SSL/TLS on all endpoints
2. **Rate Limiting** - Add request rate limiting
3. **Helmet.js** - Add security headers
4. **Audit Logging** - Log all admin actions
5. **Backup Strategy** - Regular database backups
6. **Environment Secrets** - Use secret management service
7. **Aadhaar Encryption** - Encrypt Aadhaar at rest

---

## 12. Future Enhancements

### 12.1 Mobile App (Pending)

- Flutter Android application
- Search by phone/Aadhaar/Property ID
- View property details
- View/download documents
- Offline caching
- Push notifications

### 12.2 Additional Features (Planned)

| Feature | Priority | Description |
|---------|----------|-------------|
| OTP Login | High | Phone-based authentication |
| Audit Trail | High | Track all changes |
| Report Generation | Medium | PDF export of records |
| Map Integration | Medium | Property location on map |
| Notifications | Medium | SMS/Email alerts |
| Multi-language | Low | Full Hindi UI option |
| Role-based Access | Low | Multiple admin roles |
| API Rate Limiting | Low | Prevent abuse |

---

## Appendix

### A. Sample Data

After running seed script, the database contains:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Owners:**
1. बिन्दु देवी (8877225966)
2. राम सेवक राम (9876543210)
3. सुनील दास (9988776655)

**Properties:**
1. BH2023-PAT-00001 (Owner: बिन्दु देवी)
2. BH2023-PAT-00002 (Owner: राम सेवक राम)
3. BH2023-GAY-00001 (Owner: सुनील दास)
4. BH2023-PAT-00003 (Owner: बिन्दु देवी)

### B. NPM Scripts

#### Backend
```bash
npm start        # Start production server
npm run dev      # Start with nodemon
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio
```

#### Admin Portal
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### C. Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection failed | Check DATABASE_URL in .env |
| CORS error | Add origin to CORS whitelist |
| File upload fails | Check uploads folder permissions |
| JWT invalid | Clear localStorage and re-login |
| Import fails | Check CSV column headers |

---

**Document Version:** 1.0
**Last Updated:** December 2024
**Author:** Claude Code Assistant
