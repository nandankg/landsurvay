# Mobile APK Build and Test Guide

This guide provides step-by-step instructions to build the Bihar Land Survey mobile APK and test it.

---

## Prerequisites

Before building the APK, ensure you have the following installed:

| Requirement | Version | Verification Command |
|-------------|---------|---------------------|
| Flutter SDK | 3.x+ | `flutter --version` |
| Android SDK | Latest | `flutter doctor` |
| Java JDK | 11+ | `java -version` |

Run the following to verify your setup:
```bash
flutter doctor
```

All checkmarks should be green for Android development.

---

## Step 1: Navigate to Mobile Directory

Open terminal and navigate to the mobile app folder:

```bash
cd D:\land\mobile
```

---

## Step 2: Install Dependencies

Fetch all Flutter packages:

```bash
flutter pub get
```

---

## Step 3: Configure Backend API URL

Edit the configuration file to point to your backend server:

**File:** `lib/config/app_config.dart`

```dart
static const String apiUrl = "http://YOUR_BACKEND_IP:3000/api";
```

### Important Notes:
- For **local testing**, use your machine's local IP address (e.g., `192.168.1.100`)
- Do **NOT** use `localhost` - Android devices cannot resolve it
- For **production**, use your deployed backend URL

To find your local IP:
- Windows: `ipconfig`
- Linux/Mac: `ifconfig` or `ip addr`

---

## Step 4: Build the APK

### Option A: Debug APK (For Testing)

```bash
flutter build apk --debug
```

**Output:** `build/app/outputs/flutter-apk/app-debug.apk`

- Larger file size
- Includes debugging symbols
- Faster build time

### Option B: Release APK (For Distribution)

```bash
flutter build apk --release
```

**Output:** `build/app/outputs/flutter-apk/app-release.apk`

- Optimized and minified
- Smaller file size
- Better performance

### Option C: Split APKs by Architecture

```bash
flutter build apk --split-per-abi
```

**Output:** Multiple APKs for different CPU architectures:
- `app-armeabi-v7a-release.apk` (32-bit ARM)
- `app-arm64-v8a-release.apk` (64-bit ARM)
- `app-x86_64-release.apk` (x86 64-bit)

---

## Step 5: Testing the APK

### Method 1: Android Emulator

1. Start Android emulator from Android Studio or command line
2. Run the app:
```bash
flutter run
```

### Method 2: Physical Device via USB

1. **Enable Developer Options** on your Android device:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging**:
   - Go to Settings > Developer Options
   - Enable "USB Debugging"

3. **Connect device** via USB cable

4. **Verify device detection**:
```bash
flutter devices
```

5. **Run the app**:
```bash
flutter run
```

### Method 3: Manual APK Installation

1. Copy the APK file to your Android device
2. On the device, go to Settings > Security
3. Enable "Install from Unknown Sources"
4. Navigate to the APK file using a file manager
5. Tap to install

---

## Step 6: Functional Testing Checklist

### App Launch
- [ ] Splash screen displays correctly
- [ ] App logo and branding visible
- [ ] Smooth transition to home screen

### Home Screen
- [ ] All 8 module cards displayed
- [ ] "Survey Status 2023" module is tappable
- [ ] Other modules show "Coming Soon" message

### Search Functionality
Test all three search methods:

| Search Type | Test Input | Expected Result |
|-------------|------------|-----------------|
| Mobile Number | Valid 10-digit number | Owner details + properties |
| Aadhaar Number | Valid 12-digit number | Owner details + properties |
| Property ID | e.g., BH2023-PAT-00001 | Single property details |

### Property Details Screen
- [ ] Owner name displays correctly
- [ ] Father's name visible
- [ ] Aadhaar shows masked format (XXXX-XXXX-1234)
- [ ] Land details (plot, khata, area) correct
- [ ] Boundary information displayed

### Documents
- [ ] Document list loads
- [ ] PDF documents open in viewer
- [ ] Images display correctly
- [ ] Can navigate between documents

---

## Troubleshooting

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| `flutter: command not found` | Flutter not in PATH | Add Flutter bin to system PATH |
| Gradle build fails | Corrupted cache | Run `flutter clean` then rebuild |
| Device not detected | USB drivers missing | Install OEM USB drivers |
| API connection timeout | Wrong API URL | Verify `apiUrl` in config |
| App crashes on launch | Missing dependencies | Run `flutter pub get` |
| White screen on start | API unreachable | Ensure backend is running |

### Clean Build

If you encounter build issues, try a clean build:

```bash
flutter clean
flutter pub get
flutter build apk --release
```

### Check Logs

View real-time logs while app is running:

```bash
flutter logs
```

---

## Backend Requirements for Testing

Ensure the backend server is running before testing the mobile app:

```bash
cd D:\land\backend
npm install
npx prisma generate
npx prisma db seed    # Load test data
npm run dev           # Start server on port 3000
```

---

## Test Data

The seeded database includes test records. Use these for testing:

| Field | Sample Values |
|-------|---------------|
| Mobile | Numbers from seed data |
| Property ID | BH2023-PAT-00001, etc. |
| District | Patna, Muzaffarpur, Gaya, Bhagalpur |

---

## APK Distribution

### For Internal Testing
1. Share the debug APK via:
   - Google Drive
   - Email
   - Direct file transfer

### For Production Release
1. Build release APK
2. Sign with release keystore
3. Upload to Google Play Console

### Generate Signed APK

```bash
flutter build apk --release --keystore-path=keystore.jks --keystore-password=YOUR_PASSWORD
```

---

## Quick Reference Commands

```bash
# Get dependencies
flutter pub get

# Run on connected device
flutter run

# Build debug APK
flutter build apk --debug

# Build release APK
flutter build apk --release

# Clean build files
flutter clean

# Check connected devices
flutter devices

# View logs
flutter logs

# Analyze code
flutter analyze
```

---

## Support

For issues or questions:
1. Check Flutter documentation: https://flutter.dev/docs
2. Review project CLAUDE.md for architecture details
3. Check backend logs for API issues
