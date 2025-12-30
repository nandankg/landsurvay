import 'package:flutter/material.dart';

/// Application Theme Configuration
class AppTheme {
  // Primary Colors - Government Trust
  static const Color primaryRed = Color(0xFFC41E3A);
  static const Color primaryRedDark = Color(0xFF9B1B30);
  static const Color primaryRedLight = Color(0xFFFF6B7A);
  static const Color primaryBlue = Color(0xFF2E5AAC);

  // Module Colors
  static const Color moduleBlue = Color(0xFF2E5AAC);
  static const Color moduleBlueDark = Color(0xFF1E4A9C);
  static const Color moduleBlueLight = Color(0xFF5B8EC9);

  // Gradient Colors
  static const Color gradientStart = Color(0xFF0A1628);
  static const Color gradientMid = Color(0xFF1E3A5F);
  static const Color gradientEnd = Color(0xFF3B6EA5);

  // Accent Colors
  static const Color accentGold = Color(0xFFF0B429);
  static const Color accentEmerald = Color(0xFF10B981);
  static const Color accentOrange = Color(0xFFF97316);

  // Background Colors
  static const Color bgPrimary = Color(0xFFF0F2F5);
  static const Color bgSecondary = Color(0xFFFFFFFF);
  static const Color bgCard = Color(0xFFFFFFFF);
  static const Color bgCream = Color(0xFFFAFAF8);

  // Text Colors
  static const Color textPrimary = Color(0xFF1A1D21);
  static const Color textSecondary = Color(0xFF5F6368);
  static const Color textTertiary = Color(0xFF9AA0A6);
  static const Color textInverse = Color(0xFFFFFFFF);

  // Document Colors
  static const Color docPdf = Color(0xFFE74C3C);
  static const Color docImage = Color(0xFF3498DB);
  static const Color docBlue = Color(0xFF4FC3F7);

  // Border Radius
  static const double radiusSm = 10.0;
  static const double radiusMd = 14.0;
  static const double radiusLg = 18.0;
  static const double radiusXl = 24.0;
  static const double radius2xl = 32.0;

  // Shadows
  static List<BoxShadow> get cardShadow => [
        BoxShadow(
          color: Colors.black.withOpacity(0.06),
          blurRadius: 12,
          offset: const Offset(0, 2),
        ),
      ];

  static List<BoxShadow> get cardShadowHover => [
        BoxShadow(
          color: gradientMid.withOpacity(0.15),
          blurRadius: 24,
          offset: const Offset(0, 8),
        ),
      ];

  static List<BoxShadow> get buttonShadow => [
        BoxShadow(
          color: primaryRed.withOpacity(0.3),
          blurRadius: 16,
          offset: const Offset(0, 4),
        ),
      ];

  // Gradients
  static LinearGradient get primaryGradient => const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [gradientStart, gradientMid, gradientEnd],
      );

  static LinearGradient get headerGradient => const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [gradientStart, gradientMid],
      );

  static LinearGradient get buttonGradient => const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [primaryRed, primaryRedLight],
      );

  static LinearGradient get moduleActiveGradient => const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [gradientStart, gradientMid],
      );

  // Light Theme
  static ThemeData get lightTheme => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        primaryColor: primaryRed,
        scaffoldBackgroundColor: bgPrimary,
        // Uses default system font with Hindi support
        colorScheme: ColorScheme.light(
          primary: primaryRed,
          secondary: moduleBlue,
          surface: bgSecondary,
          error: primaryRed,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
          iconTheme: IconThemeData(color: textInverse),
          titleTextStyle: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: textInverse,
          ),
        ),
        cardTheme: CardTheme(
          color: bgCard,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusXl),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: primaryRed,
            foregroundColor: textInverse,
            elevation: 0,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(50),
            ),
            textStyle: const TextStyle(
              // Uses default system font with Hindi support
              fontSize: 15,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFFF8F9FA),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(radiusLg),
            borderSide: const BorderSide(color: Color(0xFFE8EAED), width: 2),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(radiusLg),
            borderSide: const BorderSide(color: Color(0xFFE8EAED), width: 2),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(radiusLg),
            borderSide: const BorderSide(color: gradientMid, width: 2),
          ),
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          hintStyle: TextStyle(
            color: textTertiary,
            fontWeight: FontWeight.w400,
          ),
        ),
        textTheme: const TextTheme(
          displayLarge: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 32,
            fontWeight: FontWeight.w800,
            color: textPrimary,
          ),
          displayMedium: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
          headlineLarge: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: textPrimary,
          ),
          headlineMedium: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: textPrimary,
          ),
          titleLarge: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: textPrimary,
          ),
          titleMedium: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: textPrimary,
          ),
          bodyLarge: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: textPrimary,
          ),
          bodyMedium: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: textSecondary,
          ),
          bodySmall: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: textTertiary,
          ),
          labelLarge: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: textPrimary,
          ),
          labelMedium: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: textSecondary,
          ),
          labelSmall: TextStyle(
            // Uses default system font with Hindi support
            fontSize: 10,
            fontWeight: FontWeight.w500,
            color: textTertiary,
          ),
        ),
      );
}
