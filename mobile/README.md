# Bihar Land Survey Mobile App (बिहार भूमि)

Official mobile application for the Department of Revenue and Land Reforms, Government of Bihar.

![Flutter](https://img.shields.io/badge/Flutter-3.0+-02569B?logo=flutter)
![Dart](https://img.shields.io/badge/Dart-3.0+-0175C2?logo=dart)
![License](https://img.shields.io/badge/License-Government-red)

---

## Overview

The Bihar Bhumi mobile app allows citizens to search and view their land records using:
- **Mobile Number** - Search all properties linked to a phone number
- **Aadhaar Number** - Search using 12-digit Aadhaar (displayed masked)
- **Property Unique ID** - Direct lookup by property ID (BH2023-XXX-NNNNN)

### Key Features

| Feature | Description |
|---------|-------------|
| **Survey Status 2023** | Search and view land survey records |
| **Property Details** | Complete information including boundaries |
| **Owner Information** | View owner details with masked Aadhaar |
| **Document Viewer** | View and download PDF/image documents |
| **Bilingual Interface** | Hindi and English support |

---

## Quick Start

### Prerequisites

- Flutter SDK 3.0+
- Dart SDK 3.0+
- Android Studio or VS Code with Flutter extension

### Installation

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
flutter pub get

# Run the app
flutter run
```

### Build Release APK

```bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

---

## Documentation

| Document | Description |
|----------|-------------|
| **[User Guide](docs/USER_GUIDE.md)** | How to use the app (for end users) |
| **[Development Guide](docs/DEVELOPMENT_GUIDE.md)** | Architecture, code structure, APIs |
| **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** | Build, sign, and publish to Play Store |

---

## Project Structure

```
mobile/
├── assets/
│   └── logos/                    # Logo assets (SVG/PNG)
│       ├── bihar_govt_logo.svg   # Bihar Government logo
│       ├── nic_logo.svg          # NIC logo
│       ├── revenue_dept_logo.svg # Revenue Dept logo
│       └── app_logo.svg          # App logo (Bodhi Tree)
│
├── lib/
│   ├── main.dart                 # App entry point
│   │
│   ├── config/                   # Configuration
│   │   ├── app_config.dart       # API URLs, constants
│   │   ├── app_theme.dart        # Colors, typography
│   │   ├── app_router.dart       # Navigation routes
│   │   └── logo_assets.dart      # Logo asset paths
│   │
│   ├── models/                   # Data models
│   │   ├── models.dart           # Barrel export
│   │   ├── owner.dart            # Owner model
│   │   ├── property.dart         # Property model
│   │   ├── document.dart         # Document model
│   │   └── search_result.dart    # Search result
│   │
│   ├── services/                 # Business logic
│   │   └── api_service.dart      # API calls
│   │
│   ├── screens/                  # UI Screens
│   │   ├── splash/               # Splash screen
│   │   ├── home/                 # Home (8 modules)
│   │   ├── search/               # Search screen
│   │   ├── properties/           # Properties list
│   │   ├── property_detail/      # Property details
│   │   └── documents/            # Document viewer
│   │
│   └── widgets/                  # Reusable widgets
│       ├── bihar_emblem.dart     # Logo widgets
│       └── loading_widget.dart   # Loading states
│
├── docs/                         # Documentation
│   ├── USER_GUIDE.md
│   ├── DEVELOPMENT_GUIDE.md
│   └── DEPLOYMENT_GUIDE.md
│
└── pubspec.yaml                  # Dependencies
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Flutter | 3.x | Cross-platform UI framework |
| Dart | 3.x | Programming language |
| Go Router | 14.2.0 | Navigation & routing |
| Dio | 5.4.0 | HTTP client |
| Provider | 6.1.1 | State management |
| Flutter SVG | 2.0.9 | SVG rendering |
| Photo View | 0.14.0 | Image viewing with zoom |

---

## Configuration

### API URL

Edit `lib/config/app_config.dart`:

```dart
// Development (local backend)
static const String apiBaseUrl = 'http://localhost:3000/api';

// Production
static const String apiBaseUrl = 'https://api.biharland.gov.in/api';
```

### Logo Replacement

Replace placeholder logos in `assets/logos/` with official logos:

| File | Description |
|------|-------------|
| `bihar_govt_logo.svg` | Bihar Government emblem |
| `nic_logo.svg` | NIC logo |
| `revenue_dept_logo.svg` | Revenue Department logo |
| `app_logo.svg` | Bihar Bhumi app logo |

See [Logo Replacement Guide](../LOGO_REPLACEMENT_GUIDE.md) for details.

---

## Screens

### 1. Splash Screen
- Government branding with logos
- Auto-navigation to home after 2 seconds

### 2. Home Screen
- 8 service module cards (2x4 grid)
- "Survey Status 2023" is active (MVP)
- Other modules show "Coming Soon"

### 3. Search Screen
- Mobile number search (10 digits)
- Aadhaar number search (12 digits)
- Property ID search (BH2023-PAT-00001 format)

### 4. Properties List
- Owner information card with gradient
- List of all properties with document counts
- Tap any property for details

### 5. Property Detail
- Owner details section
- Land details (plot, khata, area, location)
- Boundaries (North, South, East, West)
- Documents grid with thumbnails

### 6. Document Viewer
- Pinch-to-zoom for images
- PDF opens in external viewer
- Download option available

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/search/mobile/:phone` | GET | Search by mobile number |
| `/search/aadhaar/:aadhaar` | GET | Search by Aadhaar |
| `/search/property/:id` | GET | Search by Property ID |
| `/properties/:id` | GET | Get property details |
| `/properties/:id/documents` | GET | Get property documents |
| `/documents/:id/view` | GET | View document |
| `/documents/:id/download` | GET | Download document |

---

## Commands Reference

```bash
# Development
flutter run                           # Run debug
flutter run -d chrome                 # Run on web
flutter run --release                 # Run release mode

# Building
flutter build apk --debug             # Debug APK
flutter build apk --release           # Release APK
flutter build apk --split-per-abi     # Split APKs by architecture
flutter build appbundle --release     # App Bundle (for Play Store)

# Testing & Analysis
flutter test                          # Run tests
flutter analyze                       # Code analysis
flutter doctor                        # Check environment

# Maintenance
flutter clean                         # Clean build files
flutter pub get                       # Get dependencies
flutter pub upgrade                   # Upgrade dependencies
```

---

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Red | `#C41E3A` | Government branding, buttons |
| Primary Blue | `#2E5AAC` | Module cards, accents |
| Gradient Start | `#C41E3A` | Header gradient |
| Gradient Mid | `#9C1B30` | Gradient middle |
| Gradient End | `#2E5AAC` | Gradient end |
| Background | `#F8F9FA` | Screen backgrounds |

---

## Troubleshooting

### API Connection Issues
- Verify internet connection
- Check API URL in `app_config.dart`
- Ensure backend server is running
- For Android emulator, use `10.0.2.2` instead of `localhost`

### Build Errors
```bash
flutter clean
flutter pub get
flutter run
```

### Flutter Version Issues
```bash
flutter --version          # Check current version
flutter upgrade            # Upgrade Flutter
flutter doctor             # Diagnose issues
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2023 | Initial MVP release - Survey Status 2023 module |

---

## License

Government of Bihar - All Rights Reserved

---

## Contact & Support

- **Department:** Revenue and Land Reforms, Government of Bihar
- **Developed by:** NIC (National Informatics Centre)

---

<div align="center">

**बिहार सरकार | राजस्व एवं भूमि सुधार विभाग**

*Powered by NIC*

</div>
