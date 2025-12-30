/// Logo Assets Configuration
///
/// This file centralizes all logo asset paths for easy replacement.
/// To update logos, simply replace the SVG/PNG files in the assets/logos/ folder
/// with the actual department logos while keeping the same filenames.
///
/// Supported formats: SVG (recommended), PNG, JPG
///
/// Required logos:
/// 1. bihar_govt_logo.svg - Bihar Government Official Logo
/// 2. nic_logo.svg - National Informatics Centre (NIC) Logo
/// 3. revenue_dept_logo.svg - Revenue Department Logo
/// 4. app_logo.svg - Bihar Bhumi App Logo (Bodhi Tree)

class LogoAssets {
  // Private constructor to prevent instantiation
  LogoAssets._();

  /// Base path for all logo assets
  static const String _basePath = 'assets/logos/';

  /// Bihar Government Official Logo
  /// Replace with: Official Bihar Sarkar emblem
  static const String biharGovtLogo = '${_basePath}bihar_govt_logo.png';

  /// National Informatics Centre (NIC) Logo
  /// Replace with: Official NIC logo
  static const String nicLogo = '${_basePath}nic_logo.png';

  /// Revenue Department Logo
  /// Replace with: Official Revenue & Land Reforms Department logo
  static const String revenueDeptLogo = '${_basePath}revenue_dept_logo.png';

  /// Bihar Bhumi App Logo (Bodhi Tree)
  /// Replace with: Official Bihar Bhumi logo
  static const String appLogo = '${_basePath}bihar_govt_logo.png';

  /// List of all logo assets (for preloading)
  static const List<String> allLogos = [
    biharGovtLogo,
    nicLogo,
    revenueDeptLogo,
    appLogo,
  ];
}
