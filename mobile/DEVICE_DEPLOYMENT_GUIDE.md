# Device Deployment Guide

Step-by-step guide to deploy, install, and run the Bihar Land Survey mobile app on a physical Android device.

---

## Prerequisites

### On Your Android Device

1. **Enable Developer Options**
   - Go to `Settings > About Phone`
   - Tap `Build Number` 7 times
   - You'll see "You are now a developer!"

2. **Enable USB Debugging**
   - Go to `Settings > Developer Options`
   - Enable `USB Debugging`
   - (Optional) Enable `Install via USB` if available

3. **Allow Unknown Sources** (for manual APK install)
   - Go to `Settings > Security`
   - Enable `Unknown Sources` or `Install unknown apps`

### On Your Computer

1. **USB Drivers** (Windows only)
   - Install your device manufacturer's USB drivers
   - Or install [Universal ADB Driver](https://adb.clockworkmod.com/)

2. **Verify ADB Connection**
   ```bash
   adb devices
   ```
   Your device should appear in the list.

---

## Method 1: Direct Install via Flutter (Recommended for Development)

### Step 1: Connect Device
```bash
# Connect phone via USB cable
# Accept "Allow USB debugging" prompt on phone

# Verify connection
flutter devices
```

### Step 2: Run App on Device
```bash
cd D:\land\mobile

# Debug mode (faster build, includes debug tools)
flutter run

# Release mode (optimized, no debug overhead)
flutter run --release
```

### Step 3: Select Device
If multiple devices are connected, specify the device:
```bash
flutter run -d <device_id>
```

---

## Method 2: Install Pre-built APK

### Step 1: Build the APK
```bash
cd D:\land\mobile
flutter build apk --release
```
APK location: `build\app\outputs\flutter-apk\app-release.apk`

### Step 2: Install via ADB
```bash
# Connect phone via USB
adb install build\app\outputs\flutter-apk\app-release.apk
```

### Step 3: Install via File Transfer
1. Connect phone via USB (File Transfer mode)
2. Copy `app-release.apk` to phone's `Downloads` folder
3. Open file manager on phone
4. Tap the APK file to install
5. Accept installation prompts

---

## Method 3: Wireless Debugging (Android 11+)

### Step 1: Enable Wireless Debugging
- Go to `Settings > Developer Options > Wireless debugging`
- Enable it and tap to open

### Step 2: Pair Device
```bash
# On phone: Tap "Pair device with pairing code"
# Note the IP:Port and pairing code

adb pair <ip>:<port>
# Enter the pairing code when prompted
```

### Step 3: Connect
```bash
# Use the IP:Port shown under "Wireless debugging" (not pairing port)
adb connect <ip>:<port>

# Verify
flutter devices
```

### Step 4: Run App
```bash
flutter run --release
```

---

## Updating the App After Code Changes

### Option A: Hot Reload (Debug Mode Only)
While app is running in debug mode:
- Press `r` in terminal for **Hot Reload** (preserves state)
- Press `R` for **Hot Restart** (resets state)

### Option B: Reinstall via Flutter
```bash
# Automatically rebuilds and reinstalls
flutter run --release
```

### Option C: Build and Install New APK
```bash
# Build new APK
flutter build apk --release

# Reinstall (replaces existing app, preserves data)
adb install -r build\app\outputs\flutter-apk\app-release.apk
```

### Option D: Uninstall and Fresh Install
```bash
# Uninstall existing app
adb uninstall com.bihar.land.bihar_land_app

# Install fresh
adb install build\app\outputs\flutter-apk\app-release.apk
```

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| List connected devices | `flutter devices` |
| Run in debug mode | `flutter run` |
| Run in release mode | `flutter run --release` |
| Build release APK | `flutter build apk --release` |
| Install APK | `adb install <path-to-apk>` |
| Reinstall APK | `adb install -r <path-to-apk>` |
| Uninstall app | `adb uninstall com.bihar.land.bihar_land_app` |
| View device logs | `flutter logs` |
| View ADB logs | `adb logcat` |

---

## Troubleshooting

### Device Not Detected
```bash
# Restart ADB server
adb kill-server
adb start-server
adb devices
```

### "Install Failed" Error
```bash
# Uninstall existing version first
adb uninstall com.bihar.land.bihar_land_app
adb install build\app\outputs\flutter-apk\app-release.apk
```

### App Crashes on Launch
```bash
# Check logs for errors
adb logcat | grep -i "bihar_land"

# Or use Flutter logs
flutter logs
```

### Slow Build Times
```bash
# Use debug mode for development
flutter run

# Only use --release for final testing
```

---

## Development Workflow Summary

```
┌─────────────────────────────────────────────────────────┐
│                   DEVELOPMENT CYCLE                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Connect Device                                       │
│     └── flutter devices                                  │
│                                                          │
│  2. Run in Debug Mode                                    │
│     └── flutter run                                      │
│                                                          │
│  3. Make Code Changes                                    │
│     └── Edit files in lib/                              │
│                                                          │
│  4. Hot Reload                                           │
│     └── Press 'r' in terminal                           │
│                                                          │
│  5. Test Changes                                         │
│     └── Verify on device                                │
│                                                          │
│  6. Ready for Release?                                   │
│     └── flutter build apk --release                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## App Package Details

- **Package Name:** `com.bihar.land.bihar_land_app`
- **APK Location:** `build\app\outputs\flutter-apk\app-release.apk`
- **Min SDK:** Android 5.0 (API 21)
- **Target SDK:** Android 34
