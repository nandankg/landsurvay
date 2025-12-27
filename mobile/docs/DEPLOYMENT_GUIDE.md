# Bihar Land Survey Mobile App - Deployment Guide

## Building & Publishing the Android App

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Building Debug APK](#building-debug-apk)
4. [Building Release APK](#building-release-apk)
5. [App Signing](#app-signing)
6. [Building App Bundle (AAB)](#building-app-bundle-aab)
7. [Play Store Deployment](#play-store-deployment)
8. [Direct APK Distribution](#direct-apk-distribution)
9. [App Updates](#app-updates)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before building the release version, ensure:

### Code Preparation
- [ ] All features are tested and working
- [ ] Debug logs and print statements removed
- [ ] API URL points to production server
- [ ] Error handling is comprehensive
- [ ] All placeholder logos replaced with official logos

### Assets
- [ ] App icon is set (1024x1024 PNG)
- [ ] Splash screen configured
- [ ] All logos in `assets/logos/` are production-ready

### Configuration
- [ ] `pubspec.yaml` version number updated
- [ ] App name is correct
- [ ] Package name is finalized

### Legal & Compliance
- [ ] Privacy policy URL available
- [ ] Terms of service prepared
- [ ] Required permissions justified

---

## Environment Configuration

### 1. Update API URL

Edit `lib/config/app_config.dart`:

```dart
class AppConfig {
  // PRODUCTION URL
  static const String apiBaseUrl = 'https://api.biharland.gov.in/api';

  // Remove or comment out development URLs
  // static const String apiBaseUrl = 'http://localhost:3000/api';
}
```

### 2. Update App Version

Edit `pubspec.yaml`:

```yaml
name: bihar_land_app
description: Bihar Land Survey & Revenue Mobile Application
version: 1.0.0+1  # Format: major.minor.patch+buildNumber
```

**Version Numbering:**
- `1.0.0` - Version name (shown to users)
- `+1` - Build number (must increment for each Play Store upload)

### 3. Update App Name

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<application
    android:label="बिहार भूमि"
    android:icon="@mipmap/ic_launcher">
```

---

## Building Debug APK

For testing purposes:

```bash
# Navigate to mobile directory
cd mobile

# Clean previous builds
flutter clean

# Get dependencies
flutter pub get

# Build debug APK
flutter build apk --debug

# Output location
# build/app/outputs/flutter-apk/app-debug.apk
```

**Debug APK Characteristics:**
- Larger file size
- Contains debug symbols
- Not optimized
- Cannot be uploaded to Play Store

---

## Building Release APK

### Quick Build (Unsigned)

```bash
# Build release APK
flutter build apk --release

# Output location
# build/app/outputs/flutter-apk/app-release.apk
```

### Optimized Build

```bash
# Build with optimization flags
flutter build apk --release --shrink --obfuscate --split-debug-info=build/debug-info

# Split APKs by ABI (smaller file sizes)
flutter build apk --release --split-per-abi
```

**Split APK Output:**
```
build/app/outputs/flutter-apk/
├── app-armeabi-v7a-release.apk  (~15-20 MB)
├── app-arm64-v8a-release.apk    (~15-20 MB)
└── app-x86_64-release.apk       (~15-20 MB)
```

---

## App Signing

### Creating a Keystore

**IMPORTANT:** Keep your keystore file and passwords secure. If lost, you cannot update your app on Play Store.

```bash
# Generate keystore (run once, keep forever)
keytool -genkey -v -keystore bihar-land-app.jks -keyalg RSA -keysize 2048 -validity 10000 -alias bihar_land_key

# You will be prompted for:
# - Keystore password
# - Key password
# - Name, Organization, Country, etc.
```

### Storing Keystore Securely

1. Create `android/key.properties` (DO NOT commit to git):

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=bihar_land_key
storeFile=../bihar-land-app.jks
```

2. Add to `.gitignore`:
```
android/key.properties
*.jks
*.keystore
```

### Configuring Gradle for Signing

Edit `android/app/build.gradle`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Building Signed APK

```bash
flutter build apk --release
# This will now produce a signed APK
```

---

## Building App Bundle (AAB)

Google Play Store prefers App Bundles over APKs:

```bash
# Build App Bundle
flutter build appbundle --release

# Output location
# build/app/outputs/bundle/release/app-release.aab
```

**App Bundle Benefits:**
- Smaller download size for users
- Google optimizes delivery per device
- Required for new apps on Play Store

---

## Play Store Deployment

### Prerequisites

1. **Google Play Developer Account** ($25 one-time fee)
2. **Signed App Bundle or APK**
3. **App Assets:**
   - App icon (512x512 PNG)
   - Feature graphic (1024x500 PNG)
   - Screenshots (minimum 2, phone and tablet)
   - Short description (80 characters)
   - Full description (4000 characters)

### Step-by-Step Play Store Upload

#### 1. Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in:
   - App name: `बिहार भूमि - Bihar Land Survey`
   - Default language: Hindi
   - App type: App
   - Free or Paid: Free

#### 2. Complete Store Listing

**Main Store Listing:**
```
App Name: बिहार भूमि - Bihar Land Survey
Short Description:
बिहार भूमि सर्वेक्षण और राजस्व मोबाइल ऐप। अपनी जमीन के रिकॉर्ड खोजें।

Full Description:
बिहार भूमि (Bihar Bhumi) - बिहार सरकार के राजस्व और भूमि सुधार विभाग का आधिकारिक मोबाइल एप्लिकेशन।

मुख्य विशेषताएं:
• मोबाइल नंबर से भूमि रिकॉर्ड खोजें
• आधार नंबर से संपत्ति खोजें
• प्रॉपर्टी आईडी से विवरण देखें
• दस्तावेज़ देखें और डाउनलोड करें
• सर्वेक्षण स्थिति 2023 जांचें

सुविधाएं:
- पूर्ण संपत्ति विवरण
- मालिक की जानकारी
- भूमि की सीमाएं (चौहदी)
- PDF और इमेज दस्तावेज़

यह ऐप बिहार सरकार द्वारा NIC के सहयोग से विकसित किया गया है।
```

#### 3. Content Rating

Complete the content rating questionnaire:
- Violence: None
- Sexuality: None
- Language: None
- Controlled substance: None
- IARC Rating: Likely to get "Everyone" rating

#### 4. App Access

If app requires login or specific data:
- Provide test credentials or demo data
- Explain how to access features

For this app:
```
Test Instructions:
1. Open the app
2. Tap "सर्वेक्षण स्थिति 2023"
3. Search using mobile: 8877225966
4. View property and document details
```

#### 5. Privacy Policy

Create and host a privacy policy:

```
Required URL: https://biharland.gov.in/privacy-policy

Privacy Policy should include:
- Data collection practices
- How Aadhaar data is handled
- No data is stored on device
- Data transmitted over HTTPS
```

#### 6. Upload App Bundle

1. Go to "Release" > "Production"
2. Click "Create new release"
3. Upload `app-release.aab`
4. Add release notes:
   ```
   Version 1.0.0
   - Initial release
   - Survey Status 2023 module
   - Search by Mobile, Aadhaar, Property ID
   - Property details and documents viewing
   ```
5. Review and roll out

### Release Process

1. **Internal Testing** (optional but recommended)
   - Test with 100 internal users
   - Quick approval (minutes)

2. **Closed Testing** (optional)
   - Test with up to 10,000 users
   - Requires review (hours to days)

3. **Open Testing** (optional)
   - Public beta testing
   - Requires review

4. **Production Release**
   - Full public release
   - Review takes 1-7 days for new apps

---

## Direct APK Distribution

For government portal distribution (bypassing Play Store):

### 1. Build Signed APK

```bash
flutter build apk --release
```

### 2. Host APK on Government Server

Upload to: `https://biharland.gov.in/downloads/bihar-bhumi-v1.0.0.apk`

### 3. Create Download Page

```html
<div class="app-download">
    <h2>बिहार भूमि ऐप डाउनलोड करें</h2>
    <p>वर्जन: 1.0.0</p>
    <p>साइज: ~25 MB</p>
    <a href="/downloads/bihar-bhumi-v1.0.0.apk" class="download-btn">
        APK डाउनलोड करें
    </a>
    <p>नोट: इंस्टॉल करने से पहले "अज्ञात स्रोत" सक्षम करें</p>
</div>
```

### 4. User Installation Instructions

1. Download APK from official website
2. Open Settings → Security
3. Enable "Unknown Sources" or "Install from Unknown Apps"
4. Open downloaded APK
5. Tap Install
6. Open app after installation

---

## App Updates

### Version Update Process

1. **Update version in `pubspec.yaml`:**
   ```yaml
   version: 1.1.0+2  # Increment both version and build number
   ```

2. **Build new release:**
   ```bash
   flutter build appbundle --release
   ```

3. **Upload to Play Console:**
   - Create new release
   - Upload new AAB
   - Add release notes

### Semantic Versioning

```
MAJOR.MINOR.PATCH+BUILD

1.0.0+1  → Initial release
1.0.1+2  → Bug fixes
1.1.0+3  → New features
2.0.0+4  → Breaking changes
```

### Force Update Implementation

For critical updates, implement force update check:

```dart
// In app startup
Future<void> checkForUpdate() async {
  final response = await apiService.checkVersion();
  if (response.minVersion > currentVersion) {
    showForceUpdateDialog();
  }
}
```

---

## Troubleshooting

### Build Errors

#### Error: "Keystore was tampered with"
```bash
# Delete and recreate keystore
rm android/bihar-land-app.jks
keytool -genkey -v -keystore bihar-land-app.jks ...
```

#### Error: "INSTALL_FAILED_UPDATE_INCOMPATIBLE"
```bash
# Uninstall existing app first
adb uninstall com.bihar.land.app
```

#### Error: "Gradle build failed"
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter build apk --release
```

### Play Store Rejection Reasons

| Issue | Solution |
|-------|----------|
| Missing privacy policy | Add privacy policy URL |
| Broken functionality | Test all features before upload |
| Metadata policy violation | Review app name and description |
| Impersonation | Use official government branding |

### APK Size Optimization

```bash
# Enable R8 minification (in build.gradle)
minifyEnabled true
shrinkResources true

# Use split APKs
flutter build apk --release --split-per-abi

# Analyze APK size
flutter build apk --analyze-size
```

---

## Security Considerations

### Before Release

1. **Remove Debug Code:**
   ```dart
   // Remove all print statements
   // Remove debug banners
   ```

2. **Enable ProGuard:**
   ```gradle
   buildTypes {
       release {
           minifyEnabled true
           proguardFiles getDefaultProguardFile('proguard-android.txt')
       }
   }
   ```

3. **SSL Pinning (Optional):**
   ```dart
   // For high-security apps, implement certificate pinning
   ```

4. **Secure Storage:**
   ```dart
   // Use flutter_secure_storage for sensitive data
   ```

---

## Post-Deployment

### Monitoring

1. **Play Console Analytics:**
   - Install statistics
   - Crash reports
   - User reviews

2. **Firebase Crashlytics (Optional):**
   ```bash
   flutter pub add firebase_crashlytics
   ```

3. **Google Analytics (Optional):**
   ```bash
   flutter pub add firebase_analytics
   ```

### User Feedback

1. Monitor Play Store reviews
2. Respond to user issues promptly
3. Plan updates based on feedback

---

## Quick Reference Commands

```bash
# Development
flutter run                           # Run debug
flutter run --release                 # Run release

# Building
flutter build apk --debug             # Debug APK
flutter build apk --release           # Release APK
flutter build apk --release --split-per-abi  # Split APKs
flutter build appbundle --release     # App Bundle

# Testing
flutter test                          # Run tests
flutter analyze                       # Code analysis

# Cleaning
flutter clean                         # Clean build
flutter pub get                       # Get dependencies

# Device Management
flutter devices                       # List devices
flutter install                       # Install to device
```

---

## Deployment Checklist Summary

### Pre-Build
- [ ] Update API URL to production
- [ ] Update version number
- [ ] Replace placeholder logos
- [ ] Remove debug code
- [ ] Test all features

### Build
- [ ] Create/verify keystore
- [ ] Configure signing in Gradle
- [ ] Build signed APK/AAB
- [ ] Test signed build on device

### Play Store
- [ ] Prepare store listing assets
- [ ] Write descriptions (Hindi/English)
- [ ] Create privacy policy
- [ ] Upload and submit for review

### Post-Release
- [ ] Monitor crash reports
- [ ] Respond to user reviews
- [ ] Plan next update

---

*This document is part of the Bihar Land Survey Mobile Application project.*
*For technical support, contact the development team.*
