# Backend API Configuration Guide

This guide explains how to change the Backend API URL for both Mobile and Admin sections.

## Current API URL
```
https://bihar-land-api.onrender.com/api
```

---

## Mobile App (Flutter)

### File Location
```
mobile/lib/config/app_config.dart
```

### How to Change
Edit line 8 in `app_config.dart`:

```dart
// For Production:
static const String apiBaseUrl = 'https://bihar-land-api.onrender.com/api';

// For Local Development:
static const String apiBaseUrl = 'http://localhost:3000/api';
```

### After Changing
```bash
cd mobile
flutter pub get
flutter run
```

---

## Admin Portal (React)

### File Location
```
admin/.env
```

### How to Change
Edit the `.env` file:

```env
# For Production:
VITE_API_URL=https://bihar-land-api.onrender.com/api

# For Local Development:
VITE_API_URL=http://localhost:3000/api
```

### After Changing
```bash
cd admin
npm run dev
```

**Note:** You must restart the dev server after changing `.env` values.

---

## Quick Reference Table

| Component | Config File | Variable Name |
|-----------|-------------|---------------|
| Mobile | `mobile/lib/config/app_config.dart` | `apiBaseUrl` |
| Admin | `admin/.env` | `VITE_API_URL` |

---

## Switching Between Environments

### To use Local Backend:
1. Start backend: `cd backend && npm run dev`
2. Mobile: Set `apiBaseUrl = 'http://localhost:3000/api'`
3. Admin: Set `VITE_API_URL=http://localhost:3000/api`

### To use Production Backend:
1. Mobile: Set `apiBaseUrl = 'https://bihar-land-api.onrender.com/api'`
2. Admin: Set `VITE_API_URL=https://bihar-land-api.onrender.com/api`
