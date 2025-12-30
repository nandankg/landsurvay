/// Application Configuration
class AppConfig {
  // API Configuration
  // Local development URL (uncomment for local testing):
  // static const String apiBaseUrl = 'http://localhost:3000/api';

  // Production API URL
  static const String apiBaseUrl = 'https://bihar-land-api.onrender.com/api';

  // API Endpoints
  static const String healthEndpoint = '/health';
  static const String searchByMobileEndpoint = '/search/mobile';
  static const String searchByAadhaarEndpoint = '/search/aadhaar';
  static const String searchByPropertyIdEndpoint = '/search/property';
  static const String propertiesEndpoint = '/properties';
  static const String documentsEndpoint = '/documents';

  // Timeouts
  static const int connectionTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds

  // App Information
  static const String appName = 'Bihar Land Survey';
  static const String appNameHindi = 'बिहार भूमि सर्वेक्षण';
  static const String departmentName = 'Department of Revenue and Land Reforms';
  static const String departmentNameHindi = 'राजस्व एवं भूमि सुधार विभाग';
  static const String governmentName = 'Government of Bihar';
  static const String governmentNameHindi = 'बिहार सरकार';

  // Validation Rules
  static const int mobileNumberLength = 10;
  static const int aadhaarNumberLength = 12;
  static const int maxDocumentsPerProperty = 7;
}
