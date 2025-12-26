# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bihar Land Survey & Revenue Mobile Application - a government app for land records management in Bihar, India. The project consists of three components:
- **Mobile App**: Flutter Android app with 8 modules (Survey Status 2023 is the MVP focus)
- **Admin Portal**: React.js web app with Ant Design for data management
- **Backend API**: Node.js/Express with Prisma ORM and PostgreSQL

## Tech Stack

| Component | Technologies |
|-----------|-------------|
| Mobile | Flutter, Dart, Go Router, Dio, flutter_pdfview |
| Admin | React.js, Ant Design, React Router, xlsx/papaparse |
| Backend | Node.js, Express.js, Prisma ORM, Multer, Sharp |
| Database | PostgreSQL 15 (UTF-8 for Hindi support) |

## Build & Run Commands

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

# Admin Portal
cd admin
npm install
npm run dev

# Mobile App
cd mobile
flutter pub get
flutter run                       # Run in debug mode
flutter build apk --release       # Build release APK
```

## Database

Uses Prisma ORM with PostgreSQL. Key models:
- `Person` (owner) - identified by unique Aadhaar, can own multiple properties
- `LandProperty` - unique Property ID format: `BH{YEAR}-{DISTRICT}-{SERIAL}` (e.g., BH2023-PAT-00001)
- `Document` - 5-7 PDF/images per property

Run migrations: `npx prisma migrate dev`
Seed data: `npx prisma db seed`
View database: `npx prisma studio`

## API Structure

Base URL: `/api`

Public endpoints (mobile):
- `GET /search/mobile/:phone` - Returns owner + all properties
- `GET /search/aadhaar/:aadhaar` - Returns owner + all properties
- `GET /search/property/:propertyId` - Returns single property
- `GET /properties/:id/documents` - Get property documents

Admin endpoints (JWT protected):
- `POST /admin/login`
- CRUD for `/admin/owners` and `/admin/properties`
- `POST /admin/import` - CSV/Excel bulk import
- `POST /admin/properties/:id/documents` - Upload documents

## Key Architecture Decisions

1. **One-to-Many Owner-Property**: Same Aadhaar can own multiple properties. CSV import checks existing Aadhaar before creating new owner.

2. **Property ID Generation**: Format `BH{YEAR}-{DISTRICT_CODE}-{SERIAL}`. District codes: PAT=Patna, MUZ=Muzaffarpur, GAY=Gaya, BHG=Bhagalpur.

3. **Document Storage**: Local filesystem with Multer. Max 7 documents per property, 10MB per file. Supported: PDF, JPG, JPEG, PNG.

4. **Hindi Data**: UTF-8 encoding throughout. CSV import supports both English and Hindi column headers.

5. **Aadhaar Masking**: Display as `XXXX-XXXX-{last4}` in mobile app responses.

## Environment Variables

```bash
# Backend
DATABASE_URL="postgresql://..."
JWT_SECRET="secret"
PORT=3000
MAX_FILES=7

# Admin
VITE_API_URL="https://api.example.com/api"

# Mobile (lib/config/app_config.dart)
static const String apiUrl = "https://api.example.com/api";
```

## Mobile App Screens

1. Splash → Home (8 module cards) → Search (3 input methods) → Properties List → Property Detail → Documents Gallery

Only "Survey Status 2023" module is functional in MVP; other 7 modules show "Coming Soon" message.

## CSV Import Format

```csv
property_id,owner_name,father_name,gender,phone,aadhaar,plot_no,khata_no,acres,decimal,north,south,east,west,district,village
```

Hindi column names also supported (नाम, पिता, फोन, आधार, etc.).
