# Logo Replacement Guide

This guide explains how to replace placeholder logos with official department logos in both the Mobile App and Admin Web Portal.

## Required Logos

You need to prepare the following logos from the department:

| Logo | Description | Recommended Size |
|------|-------------|------------------|
| **Bihar Government Logo** | Official Bihar Sarkar emblem | 200x200 px |
| **NIC Logo** | National Informatics Centre logo | 200x200 px |
| **Revenue Department Logo** | Revenue & Land Reforms Dept logo | 200x200 px |
| **App Logo (Bihar Bhumi)** | Bihar Bhumi app logo (Bodhi Tree) | 200x240 px |

## Supported File Formats

- **SVG** (Recommended) - Scalable, best quality at all sizes
- **PNG** - With transparent background
- **JPG** - For photos/complex images

---

## Mobile App (Flutter)

### Logo Location
```
mobile/assets/logos/
├── bihar_govt_logo.svg    # Bihar Government Logo
├── nic_logo.svg           # NIC Logo
├── revenue_dept_logo.svg  # Revenue Department Logo
└── app_logo.svg           # Bihar Bhumi App Logo
```

### How to Replace

1. **Prepare your logo files** in SVG or PNG format
2. **Navigate to** `mobile/assets/logos/`
3. **Replace the placeholder files** with your actual logos, keeping the same filenames:
   - `bihar_govt_logo.svg` → Replace with actual Bihar Government logo
   - `nic_logo.svg` → Replace with actual NIC logo
   - `revenue_dept_logo.svg` → Replace with actual Revenue Department logo
   - `app_logo.svg` → Replace with actual Bihar Bhumi logo

4. **Rebuild the app**:
   ```bash
   cd mobile
   flutter clean
   flutter pub get
   flutter run
   ```

### Configuration File
The logo paths are defined in:
```
mobile/lib/config/logo_assets.dart
```

If you need to use different filenames or add more logos, edit this file.

### Available Logo Widgets

```dart
import 'package:bihar_land_app/widgets/bihar_emblem.dart';

// Individual logos
BiharGovtLogo(size: 50)
NICLogo(size: 50)
RevenueDeptLogo(size: 50)
BiharBhumiLogo(size: 50)

// Combined logos
HeaderLogos(logoSize: 40)   // For headers
FooterLogos(logoSize: 35)   // For footers
```

---

## Admin Web Portal (React)

### Logo Location
```
admin/public/logos/
├── bihar_govt_logo.svg    # Bihar Government Logo
├── bihar_govt_logo.png    # Bihar Government Logo (PNG)
├── nic_logo.svg           # NIC Logo
├── nic_logo.png           # NIC Logo (PNG)
├── revenue_dept_logo.svg  # Revenue Department Logo
├── revenue_dept_logo.png  # Revenue Department Logo (PNG)
├── app_logo.svg           # Bihar Bhumi App Logo (Login + Sidebar)
└── admin_logo.png         # Admin Logo (Alternative for Login/Dashboard)
```

### How to Replace

1. **Prepare your logo files** in SVG or PNG format
2. **Navigate to** `admin/public/logos/`
3. **Replace the placeholder files** with your actual logos, keeping the same filenames:
   - `bihar_govt_logo.svg` → Replace with actual Bihar Government logo
   - `nic_logo.svg` → Replace with actual NIC logo
   - `revenue_dept_logo.svg` → Replace with actual Revenue Department logo
   - `app_logo.svg` → Replace with actual Bihar Bhumi logo

4. **Restart the dev server** or rebuild:
   ```bash
   cd admin
   npm run dev   # For development
   npm run build # For production
   ```

---

## Admin Login Page & Dashboard Logo

The admin login page and dashboard sidebar show the app logo. These are defined in:

### Files to Update
| Location | File | Description |
|----------|------|-------------|
| Login Page | `admin/src/pages/Login.jsx` | Logo shown on login card |
| Dashboard Sidebar | `admin/src/layouts/DashboardLayout.jsx` | Logo in sidebar header |

### How to Change Admin Login & Dashboard Logo

**Step 1:** Prepare your new logo file (SVG or PNG recommended)

**Step 2:** Replace the file at:
```
admin/public/logos/app_logo.svg
```
Or add a PNG version:
```
admin/public/logos/app_logo.png
```

**Step 3:** Restart the admin dev server:
```bash
cd admin
npm run dev
```

### Current Logo Files Used

| Location | Primary File | Fallback |
|----------|--------------|----------|
| Login Page | `/logos/app_logo.svg` | `/logos/bihar_govt_logo.png` |
| Dashboard Sidebar | `/logos/app_logo.svg` | `/logos/bihar_govt_logo.png` |

### Source Code Locations

The logo is used in these files:
- **Login Page:** `admin/src/pages/Login.jsx` (line 44)
- **Dashboard Sidebar:** `admin/src/layouts/DashboardLayout.jsx` (line 97)

### Example: Using a Custom PNG Logo

To use a custom PNG logo instead of SVG:

1. Save your logo as `admin/public/logos/app_logo.png`
2. Edit `admin/src/pages/Login.jsx`:
```jsx
<img
  src="/logos/app_logo.png"  // ← Change to PNG
  alt="Bihar Land"
  ...
/>
```

3. Edit `admin/src/layouts/DashboardLayout.jsx`:
```jsx
<img
  src="/logos/app_logo.png"  // ← Change to PNG
  alt="Bihar Land"
  ...
/>
```

### Logo Styling

The logo is displayed with:
- Clean, borderless design
- Auto-scaling to fit container
- Transparent background support

### Configuration File
The logo paths are defined in:
```
admin/src/config/logoConfig.js
```

If you need to use different filenames or add more logos, edit this file.

### Available Logo Components

```jsx
import {
  BiharGovtLogo,
  NICLogo,
  RevenueDeptLogo,
  AppLogo,
  HeaderLogos,
  FooterLogos
} from '../components/LogoComponents';

// Individual logos
<BiharGovtLogo size={50} />
<NICLogo size={50} />
<RevenueDeptLogo size={50} />
<AppLogo size={50} />

// Combined logos
<HeaderLogos size={40} />   // For headers
<FooterLogos size={35} />   // For footers
```

---

## Quick Replacement Checklist

### Mobile App
- [ ] Prepare logos in SVG/PNG format
- [ ] Copy to `mobile/assets/logos/`
- [ ] Run `flutter clean && flutter pub get`
- [ ] Test the app

### Admin Portal
- [ ] Prepare logos in SVG/PNG format
- [ ] Copy to `admin/public/logos/`
- [ ] Restart the development server
- [ ] Test the portal

---

## Troubleshooting

### Mobile App: Logo not showing
1. Ensure the file is in `mobile/assets/logos/`
2. Check the filename matches exactly (case-sensitive)
3. Run `flutter clean` and rebuild
4. Check pubspec.yaml includes the assets folder

### Admin Portal: Logo not showing
1. Ensure the file is in `admin/public/logos/`
2. Check the filename matches exactly (case-sensitive)
3. Clear browser cache (Ctrl+Shift+R)
4. Restart the development server

### SVG not rendering correctly
- Ensure SVG has proper viewBox attribute
- Remove any external references or fonts
- Convert text to paths if fonts don't render

---

## File Structure Summary

```
land/
├── mobile/
│   ├── assets/
│   │   └── logos/
│   │       ├── bihar_govt_logo.svg
│   │       ├── nic_logo.svg
│   │       ├── revenue_dept_logo.svg
│   │       └── app_logo.svg
│   └── lib/
│       ├── config/
│       │   └── logo_assets.dart      # Logo path configuration
│       └── widgets/
│           └── bihar_emblem.dart     # Logo widgets
│
└── admin/
    ├── public/
    │   └── logos/
    │       ├── bihar_govt_logo.svg
    │       ├── nic_logo.svg
    │       ├── revenue_dept_logo.svg
    │       └── app_logo.svg
    └── src/
        ├── config/
        │   └── logoConfig.js          # Logo path configuration
        └── components/
            └── LogoComponents.jsx     # Logo components
```
