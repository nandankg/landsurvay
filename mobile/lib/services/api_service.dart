import 'package:dio/dio.dart';
import '../config/app_config.dart';
import '../models/models.dart';

/// API Service for all backend calls
class ApiService {
  late final Dio _dio;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: const Duration(milliseconds: AppConfig.connectionTimeout),
      receiveTimeout: const Duration(milliseconds: AppConfig.receiveTimeout),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Add logging interceptor for debugging
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));
  }

  /// Health check endpoint
  Future<bool> checkHealth() async {
    try {
      final response = await _dio.get(AppConfig.healthEndpoint);
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  /// Search by mobile number
  Future<ApiResponse<SearchResult>> searchByMobile(String mobile) async {
    try {
      final response =
          await _dio.get('${AppConfig.searchByMobileEndpoint}/$mobile');

      if (response.data['success'] == true && response.data['data'] != null) {
        return ApiResponse.success(
          SearchResult.fromJson(response.data['data']),
        );
      }
      return ApiResponse.error('No records found');
    } on DioException catch (e) {
      return ApiResponse.error(_handleDioError(e));
    } catch (e) {
      return ApiResponse.error('An error occurred: $e');
    }
  }

  /// Search by Aadhaar number
  Future<ApiResponse<SearchResult>> searchByAadhaar(String aadhaar) async {
    try {
      final response =
          await _dio.get('${AppConfig.searchByAadhaarEndpoint}/$aadhaar');

      if (response.data['success'] == true && response.data['data'] != null) {
        return ApiResponse.success(
          SearchResult.fromJson(response.data['data']),
        );
      }
      return ApiResponse.error('No records found');
    } on DioException catch (e) {
      return ApiResponse.error(_handleDioError(e));
    } catch (e) {
      return ApiResponse.error('An error occurred: $e');
    }
  }

  /// Search by Property Unique ID
  Future<ApiResponse<SearchResult>> searchByPropertyId(String propertyId) async {
    try {
      final response =
          await _dio.get('${AppConfig.searchByPropertyIdEndpoint}/$propertyId');

      if (response.data['success'] == true && response.data['data'] != null) {
        return ApiResponse.success(
          SearchResult.fromJson(response.data['data']),
        );
      }
      return ApiResponse.error('No records found');
    } on DioException catch (e) {
      return ApiResponse.error(_handleDioError(e));
    } catch (e) {
      return ApiResponse.error('An error occurred: $e');
    }
  }

  /// Get property details by ID
  Future<ApiResponse<PropertyDetailResult>> getPropertyDetails(String id) async {
    try {
      final response = await _dio.get('${AppConfig.propertiesEndpoint}/$id');

      if (response.data['success'] == true && response.data['data'] != null) {
        final data = response.data['data'];
        return ApiResponse.success(
          PropertyDetailResult(
            property: Property.fromJson(data['property'] ?? data),
            owner: data['owner'] != null ? Owner.fromJson(data['owner']) : null,
            documents: (data['documents'] as List<dynamic>?)
                    ?.map((d) =>
                        PropertyDocument.fromJson(d as Map<String, dynamic>))
                    .toList() ??
                [],
          ),
        );
      }
      return ApiResponse.error('Property not found');
    } on DioException catch (e) {
      return ApiResponse.error(_handleDioError(e));
    } catch (e) {
      return ApiResponse.error('An error occurred: $e');
    }
  }

  /// Get property documents
  Future<ApiResponse<List<PropertyDocument>>> getPropertyDocuments(
      String propertyId) async {
    try {
      final response = await _dio
          .get('${AppConfig.propertiesEndpoint}/$propertyId/documents');

      if (response.data['success'] == true && response.data['data'] != null) {
        final dataField = response.data['data'];
        // Handle both formats: direct array or {documents: [...]}
        final List<dynamic> docs;
        if (dataField is List) {
          docs = dataField;
        } else if (dataField is Map && dataField['documents'] is List) {
          docs = dataField['documents'] as List<dynamic>;
        } else {
          docs = [];
        }
        return ApiResponse.success(
          docs
              .map((d) =>
                  PropertyDocument.fromJson(d as Map<String, dynamic>))
              .toList(),
        );
      }
      return ApiResponse.success([]);
    } on DioException catch (e) {
      return ApiResponse.error(_handleDioError(e));
    } catch (e) {
      return ApiResponse.error('An error occurred: $e');
    }
  }

  /// Get document view URL
  String getDocumentViewUrl(String documentId) {
    return '${AppConfig.apiBaseUrl}${AppConfig.documentsEndpoint}/$documentId/view';
  }

  /// Get document download URL
  String getDocumentDownloadUrl(String documentId) {
    return '${AppConfig.apiBaseUrl}${AppConfig.documentsEndpoint}/$documentId/download';
  }

  /// Handle Dio errors
  String _handleDioError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return 'कनेक्शन टाइमआउट। कृपया पुनः प्रयास करें।\nConnection timeout. Please try again.';
      case DioExceptionType.connectionError:
        return 'इंटरनेट कनेक्शन नहीं है।\nNo internet connection.';
      case DioExceptionType.badResponse:
        final statusCode = e.response?.statusCode;
        if (statusCode == 404) {
          return 'कोई रिकॉर्ड नहीं मिला।\nNo records found.';
        }
        if (statusCode == 500) {
          return 'सर्वर त्रुटि। कृपया बाद में प्रयास करें।\nServer error. Please try again later.';
        }
        return 'त्रुटि: ${e.response?.statusMessage ?? 'Unknown error'}';
      default:
        return 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।\nAn error occurred. Please try again.';
    }
  }
}

/// Generic API Response wrapper
class ApiResponse<T> {
  final T? data;
  final String? error;
  final bool isSuccess;

  ApiResponse._({this.data, this.error, required this.isSuccess});

  factory ApiResponse.success(T data) =>
      ApiResponse._(data: data, isSuccess: true);

  factory ApiResponse.error(String error) =>
      ApiResponse._(error: error, isSuccess: false);
}

/// Property Detail Result containing property, owner, and documents
class PropertyDetailResult {
  final Property property;
  final Owner? owner;
  final List<PropertyDocument> documents;

  PropertyDetailResult({
    required this.property,
    this.owner,
    required this.documents,
  });
}
