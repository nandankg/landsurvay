# Bihar Land Survey Mobile App - Development Guide

## App Architecture & Technical Documentation

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Core Components](#core-components)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Navigation](#navigation)
8. [Theming & Styling](#theming--styling)
9. [Models & Data Structures](#models--data-structures)
10. [Widgets & Components](#widgets--components)
11. [Configuration](#configuration)
12. [Development Setup](#development-setup)
13. [Coding Standards](#coding-standards)
14. [Testing](#testing)

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Flutter** | 3.x | Cross-platform UI framework |
| **Dart** | 3.x | Programming language |
| **Go Router** | 14.2.0 | Navigation & routing |
| **Dio** | 5.4.0 | HTTP client for API calls |
| **Provider** | 6.1.1 | State management |
| **Flutter SVG** | 2.0.9 | SVG rendering for logos |
| **Photo View** | 0.14.0 | Image viewing with zoom |
| **URL Launcher** | 6.2.2 | Opening external links |
| **Shared Preferences** | 2.2.2 | Local storage |
| **Cached Network Image** | 3.3.0 | Image caching |

---

## Project Structure

```
mobile/
├── assets/
│   └── logos/                    # Logo assets (SVG/PNG)
│       ├── bihar_govt_logo.svg
│       ├── nic_logo.svg
│       ├── revenue_dept_logo.svg
│       └── app_logo.svg
│
├── lib/
│   ├── main.dart                 # App entry point
│   │
│   ├── config/                   # Configuration files
│   │   ├── app_config.dart       # API URLs, constants
│   │   ├── app_theme.dart        # Colors, typography, styling
│   │   ├── app_router.dart       # Navigation routes
│   │   └── logo_assets.dart      # Logo asset paths
│   │
│   ├── models/                   # Data models
│   │   ├── models.dart           # Barrel export file
│   │   ├── owner.dart            # Owner model
│   │   ├── property.dart         # Property model
│   │   ├── document.dart         # Document model
│   │   └── search_result.dart    # Search result model
│   │
│   ├── services/                 # Business logic & API
│   │   └── api_service.dart      # API calls & response handling
│   │
│   ├── screens/                  # UI Screens
│   │   ├── splash/
│   │   │   └── splash_screen.dart
│   │   ├── home/
│   │   │   └── home_screen.dart
│   │   ├── search/
│   │   │   └── search_screen.dart
│   │   ├── properties/
│   │   │   └── properties_list_screen.dart
│   │   ├── property_detail/
│   │   │   └── property_detail_screen.dart
│   │   └── documents/
│   │       └── document_viewer_screen.dart
│   │
│   └── widgets/                  # Reusable widgets
│       ├── bihar_emblem.dart     # Logo widgets
│       └── loading_widget.dart   # Loading indicators
│
├── docs/                         # Documentation
│   ├── USER_GUIDE.md
│   ├── DEVELOPMENT_GUIDE.md
│   └── DEPLOYMENT_GUIDE.md
│
├── pubspec.yaml                  # Dependencies & assets
└── README.md                     # Project overview
```

---

## Architecture Overview

The app follows a clean architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Screens │  │ Widgets │  │  Theme  │  │  Router │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
└───────┼────────────┼────────────┼────────────┼──────────────┘
        │            │            │            │
┌───────┼────────────┼────────────┼────────────┼──────────────┐
│       │      Business Logic Layer            │              │
│  ┌────▼────────────▼────────────▼────────────▼────┐        │
│  │              State Management (Provider)        │        │
│  └────────────────────┬───────────────────────────┘        │
│                       │                                     │
│  ┌────────────────────▼───────────────────────────┐        │
│  │                  API Service                    │        │
│  └────────────────────┬───────────────────────────┘        │
└───────────────────────┼─────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────┐
│                 Data Layer                                   │
│  ┌────────────────────▼───────────────────────────┐        │
│  │                   Models                        │        │
│  │  (Owner, Property, Document, SearchResult)     │        │
│  └────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   Backend API   │
              │  (Node.js/Express)│
              └─────────────────┘
```

---

## Core Components

### 1. Main Entry Point (`main.dart`)

```dart
void main() {
  runApp(
    MultiProvider(
      providers: [
        Provider<ApiService>(create: (_) => ApiService()),
      ],
      child: const BiharLandApp(),
    ),
  );
}

class BiharLandApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Bihar Bhumi',
      theme: AppTheme.lightTheme,
      routerConfig: AppRouter.router,
    );
  }
}
```

### 2. Screen Flow

```
┌──────────┐     ┌────────────┐     ┌──────────────┐
│  Splash  │ ──▶ │    Home    │ ──▶ │    Search    │
│  Screen  │     │   Screen   │     │    Screen    │
└──────────┘     └────────────┘     └──────┬───────┘
                                           │
                                           ▼
┌──────────────┐     ┌─────────────────────────────┐
│   Document   │ ◀── │      Properties List        │
│    Viewer    │     │         Screen              │
└──────────────┘     └──────────────┬──────────────┘
       ▲                            │
       │                            ▼
       │             ┌─────────────────────────────┐
       └──────────── │      Property Detail        │
                     │         Screen              │
                     └─────────────────────────────┘
```

---

## State Management

### Provider Setup

The app uses Provider for dependency injection and state management:

```dart
// In main.dart
MultiProvider(
  providers: [
    Provider<ApiService>(create: (_) => ApiService()),
  ],
  child: const BiharLandApp(),
)

// Usage in screens
final apiService = Provider.of<ApiService>(context, listen: false);
final response = await apiService.searchByMobile(mobileNumber);
```

### Local State

Each screen manages its own local state using `StatefulWidget`:

```dart
class _PropertyDetailScreenState extends State<PropertyDetailScreen> {
  Property? _property;
  Owner? _owner;
  List<PropertyDocument> _documents = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchPropertyDetails();
  }

  Future<void> _fetchPropertyDetails() async {
    setState(() => _isLoading = true);
    // ... fetch data
    setState(() {
      _property = data.property;
      _isLoading = false;
    });
  }
}
```

---

## API Integration

### API Service (`services/api_service.dart`)

The `ApiService` class handles all backend communication:

```dart
class ApiService {
  late final Dio _dio;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: Duration(milliseconds: 30000),
      receiveTimeout: Duration(milliseconds: 30000),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));
  }

  // Search methods
  Future<ApiResponse<SearchResult>> searchByMobile(String mobile);
  Future<ApiResponse<SearchResult>> searchByAadhaar(String aadhaar);
  Future<ApiResponse<SearchResult>> searchByPropertyId(String propertyId);

  // Property methods
  Future<ApiResponse<PropertyDetailResult>> getPropertyDetails(String id);
  Future<ApiResponse<List<PropertyDocument>>> getPropertyDocuments(String propertyId);

  // Document URLs
  String getDocumentViewUrl(String documentId);
  String getDocumentDownloadUrl(String documentId);
}
```

### API Response Wrapper

```dart
class ApiResponse<T> {
  final T? data;
  final String? error;
  final bool isSuccess;

  factory ApiResponse.success(T data);
  factory ApiResponse.error(String error);
}
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search/mobile/:phone` | GET | Search by mobile number |
| `/api/search/aadhaar/:aadhaar` | GET | Search by Aadhaar |
| `/api/search/property/:propertyId` | GET | Search by Property ID |
| `/api/properties/:id` | GET | Get property details |
| `/api/properties/:id/documents` | GET | Get property documents |
| `/api/documents/:id/view` | GET | View document |
| `/api/documents/:id/download` | GET | Download document |

---

## Navigation

### Go Router Configuration (`config/app_router.dart`)

```dart
class AppRouter {
  static final router = GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/search',
        name: 'search',
        builder: (context, state) => const SearchScreen(),
      ),
      GoRoute(
        path: '/properties',
        name: 'properties',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>?;
          return PropertiesListScreen(
            owner: extra?['owner'],
            properties: extra?['properties'],
          );
        },
      ),
      GoRoute(
        path: '/property/:id',
        name: 'propertyDetail',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return PropertyDetailScreen(propertyId: id);
        },
      ),
      GoRoute(
        path: '/document/:id',
        name: 'documentViewer',
        builder: (context, state) => DocumentViewerScreen(...),
      ),
    ],
  );
}
```

### Navigation Examples

```dart
// Navigate to search
context.go('/search');

// Navigate with data
context.push('/properties', extra: {
  'owner': owner,
  'properties': properties,
});

// Navigate to detail with path parameter
context.push('/property/${property.id}');

// Go back
context.pop();
```

---

## Theming & Styling

### App Theme (`config/app_theme.dart`)

```dart
class AppTheme {
  // Primary Colors
  static const Color primaryRed = Color(0xFFC41E3A);
  static const Color primaryBlue = Color(0xFF2E5AAC);

  // Gradient Colors
  static const Color gradientStart = Color(0xFFC41E3A);
  static const Color gradientMid = Color(0xFF9C1B30);
  static const Color gradientEnd = Color(0xFF2E5AAC);

  // Background Colors
  static const Color bgPrimary = Color(0xFFF8F9FA);
  static const Color bgSecondary = Color(0xFFFFFFFF);

  // Text Colors
  static const Color textPrimary = Color(0xFF1A1A2E);
  static const Color textSecondary = Color(0xFF4A5568);
  static const Color textTertiary = Color(0xFF9CA3AF);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [gradientStart, gradientMid, gradientEnd],
  );

  // Border Radius
  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 20.0;

  // Shadows
  static List<BoxShadow> cardShadow = [...];
}
```

---

## Models & Data Structures

### Owner Model

```dart
class Owner {
  final String id;
  final String name;
  final String fatherName;
  final String? gender;
  final String phone;
  final String aadhaar;

  // Computed property for masked Aadhaar
  String get maskedAadhaar => 'XXXX-XXXX-${aadhaar.substring(aadhaar.length - 4)}';

  factory Owner.fromJson(Map<String, dynamic> json);
  Map<String, dynamic> toJson();
}
```

### Property Model

```dart
class Property {
  final String id;
  final String propertyUniqueId;
  final String plotNo;
  final String khataNo;
  final double? acres;
  final double? decimals;
  final String? northBoundary;
  final String? southBoundary;
  final String? eastBoundary;
  final String? westBoundary;
  final String? district;
  final String? village;
  final String? ownerId;
  final int documentsCount;

  // Computed property for formatted area
  String get formattedArea;

  factory Property.fromJson(Map<String, dynamic> json);
  Map<String, dynamic> toJson();
}
```

### Document Model

```dart
class PropertyDocument {
  final String id;
  final String propertyId;
  final String fileName;
  final String originalName;
  final String fileType;
  final String filePath;
  final int? fileSize;
  final String? description;

  // Computed properties
  bool get isPdf;
  bool get isImage;
  String get displayName;
  String get formattedSize;

  factory PropertyDocument.fromJson(Map<String, dynamic> json);
  Map<String, dynamic> toJson();
}
```

---

## Widgets & Components

### Logo Widgets (`widgets/bihar_emblem.dart`)

```dart
// Individual logos
BiharGovtLogo(size: 50, color: Colors.white)
NICLogo(size: 50)
RevenueDeptLogo(size: 50)
BiharBhumiLogo(size: 50, showText: true)

// Combined logos
HeaderLogos(logoSize: 40, color: Colors.white)
FooterLogos(logoSize: 35)
```

### Loading Widget

```dart
class LoadingWidget extends StatelessWidget {
  final String? message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(),
          if (message != null) Text(message!),
        ],
      ),
    );
  }
}
```

---

## Configuration

### App Configuration (`config/app_config.dart`)

```dart
class AppConfig {
  // API Configuration
  static const String apiBaseUrl = 'http://localhost:3000/api';

  // Endpoints
  static const String healthEndpoint = '/health';
  static const String searchByMobileEndpoint = '/search/mobile';
  static const String searchByAadhaarEndpoint = '/search/aadhaar';
  static const String searchByPropertyIdEndpoint = '/search/property';
  static const String propertiesEndpoint = '/properties';
  static const String documentsEndpoint = '/documents';

  // Timeouts
  static const int connectionTimeout = 30000;
  static const int receiveTimeout = 30000;

  // Validation
  static const int mobileNumberLength = 10;
  static const int aadhaarNumberLength = 12;

  // App Info
  static const String appName = 'बिहार भूमि';
  static const String appVersion = '1.0.0';
  static const String governmentName = 'Government of Bihar';
  static const String departmentName = 'Department of Revenue and Land Reforms';
}
```

---

## Development Setup

### Prerequisites

1. **Flutter SDK** (version 3.0 or higher)
2. **Dart SDK** (version 3.0 or higher)
3. **Android Studio** or **VS Code** with Flutter extension
4. **Android SDK** for Android development
5. **Git** for version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd land/mobile

# Install dependencies
flutter pub get

# Run the app
flutter run

# Run on specific device
flutter run -d chrome       # Web
flutter run -d <device-id>  # Android device
```

### Environment Configuration

Update `lib/config/app_config.dart` with your API URL:

```dart
// For development
static const String apiBaseUrl = 'http://localhost:3000/api';

// For production
static const String apiBaseUrl = 'https://api.biharland.gov.in/api';
```

---

## Coding Standards

### File Naming
- Use `snake_case` for file names: `property_detail_screen.dart`
- Use `PascalCase` for class names: `PropertyDetailScreen`
- Use `camelCase` for variables and functions: `fetchPropertyDetails()`

### Widget Structure
```dart
class MyScreen extends StatefulWidget {
  // 1. Constructor parameters
  final String id;

  const MyScreen({super.key, required this.id});

  @override
  State<MyScreen> createState() => _MyScreenState();
}

class _MyScreenState extends State<MyScreen> {
  // 2. State variables
  bool _isLoading = true;

  // 3. Lifecycle methods
  @override
  void initState() { ... }

  @override
  void dispose() { ... }

  // 4. Private methods
  Future<void> _fetchData() async { ... }

  // 5. Build method
  @override
  Widget build(BuildContext context) { ... }

  // 6. Build helper methods
  Widget _buildHeader() { ... }
  Widget _buildContent() { ... }
}
```

### Import Order
```dart
// 1. Dart imports
import 'dart:async';

// 2. Flutter imports
import 'package:flutter/material.dart';

// 3. Package imports
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

// 4. Local imports
import '../config/app_theme.dart';
import '../models/models.dart';
```

---

## Testing

### Running Tests

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/models/property_test.dart

# Run with coverage
flutter test --coverage
```

### Test Structure

```
test/
├── models/
│   ├── owner_test.dart
│   ├── property_test.dart
│   └── document_test.dart
├── services/
│   └── api_service_test.dart
├── widgets/
│   └── bihar_emblem_test.dart
└── screens/
    └── search_screen_test.dart
```

### Example Test

```dart
void main() {
  group('Property Model', () {
    test('should parse JSON correctly', () {
      final json = {
        'id': '123',
        'propertyUniqueId': 'BH2023-PAT-00001',
        'plotNo': '100',
        'khataNo': '50',
      };

      final property = Property.fromJson(json);

      expect(property.id, '123');
      expect(property.propertyUniqueId, 'BH2023-PAT-00001');
    });

    test('should format area correctly', () {
      final property = Property(acres: 2.5, ...);
      expect(property.formattedArea, '2.5 ऐकर');
    });
  });
}
```

---

## Additional Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [Go Router Documentation](https://pub.dev/packages/go_router)
- [Provider Documentation](https://pub.dev/packages/provider)
- [Dio Documentation](https://pub.dev/packages/dio)

---

*This document is part of the Bihar Land Survey Mobile Application project.*
