import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';

/// Service for handling app security key verification
class SecurityKeyService {
  static const String _keyVerifiedPref = 'security_key_verified';
  static const String _failedAttemptsPref = 'security_failed_attempts';
  static const String _lockTimePref = 'security_lock_time';

  late final Dio _dio;

  // Security config (fetched from server or defaults)
  int maxAttempts = 5;
  int lockDurationMinutes = 30;

  SecurityKeyService() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: const Duration(milliseconds: AppConfig.connectionTimeout),
      receiveTimeout: const Duration(milliseconds: AppConfig.receiveTimeout),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));
  }

  /// Check if the security key has already been verified
  Future<bool> isKeyVerified() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyVerifiedPref) ?? false;
  }

  /// Check if the app is currently locked due to too many failed attempts
  Future<bool> isLocked() async {
    final prefs = await SharedPreferences.getInstance();
    final lockTime = prefs.getInt(_lockTimePref);

    if (lockTime == null) return false;

    final lockDateTime = DateTime.fromMillisecondsSinceEpoch(lockTime);
    final unlockTime = lockDateTime.add(Duration(minutes: lockDurationMinutes));

    if (DateTime.now().isAfter(unlockTime)) {
      // Lock period has passed, reset attempts
      await _resetAttempts();
      return false;
    }

    return true;
  }

  /// Get remaining lock time in minutes
  Future<int> getRemainingLockMinutes() async {
    final prefs = await SharedPreferences.getInstance();
    final lockTime = prefs.getInt(_lockTimePref);

    if (lockTime == null) return 0;

    final lockDateTime = DateTime.fromMillisecondsSinceEpoch(lockTime);
    final unlockTime = lockDateTime.add(Duration(minutes: lockDurationMinutes));
    final remaining = unlockTime.difference(DateTime.now()).inMinutes;

    return remaining > 0 ? remaining + 1 : 0;
  }

  /// Get current failed attempts count
  Future<int> getFailedAttempts() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_failedAttemptsPref) ?? 0;
  }

  /// Get remaining attempts
  Future<int> getRemainingAttempts() async {
    final attempts = await getFailedAttempts();
    return maxAttempts - attempts;
  }

  /// Fetch security config from server
  Future<void> fetchSecurityConfig() async {
    try {
      final response = await _dio.get('/app/security-config');
      if (response.data['success'] == true && response.data['data'] != null) {
        final data = response.data['data'];
        maxAttempts = data['maxAttempts'] ?? 5;
        lockDurationMinutes = data['lockDurationMinutes'] ?? 30;
      }
    } catch (e) {
      // Use defaults if fetch fails
      maxAttempts = 5;
      lockDurationMinutes = 30;
    }
  }

  /// Verify the security key with the server
  Future<SecurityKeyResult> verifyKey(String securityKey) async {
    // Check if locked
    if (await isLocked()) {
      final remaining = await getRemainingLockMinutes();
      return SecurityKeyResult.locked(remaining);
    }

    try {
      final response = await _dio.post(
        '/app/verify-key',
        data: {'securityKey': securityKey},
      );

      if (response.data['success'] == true) {
        // Key verified successfully
        await _setKeyVerified(true);
        await _resetAttempts();
        return SecurityKeyResult.success();
      } else {
        // Invalid key
        return await _handleFailedAttempt();
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        // Invalid key
        return await _handleFailedAttempt();
      }
      // Network or other error
      return SecurityKeyResult.error(_getErrorMessage(e));
    } catch (e) {
      return SecurityKeyResult.error('An error occurred. Please try again.');
    }
  }

  /// Handle a failed verification attempt
  Future<SecurityKeyResult> _handleFailedAttempt() async {
    final prefs = await SharedPreferences.getInstance();
    final currentAttempts = (prefs.getInt(_failedAttemptsPref) ?? 0) + 1;
    await prefs.setInt(_failedAttemptsPref, currentAttempts);

    if (currentAttempts >= maxAttempts) {
      // Lock the app
      await prefs.setInt(_lockTimePref, DateTime.now().millisecondsSinceEpoch);
      return SecurityKeyResult.locked(lockDurationMinutes);
    }

    final remaining = maxAttempts - currentAttempts;
    return SecurityKeyResult.invalid(remaining);
  }

  /// Reset failed attempts
  Future<void> _resetAttempts() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_failedAttemptsPref);
    await prefs.remove(_lockTimePref);
  }

  /// Set the key verified status
  Future<void> _setKeyVerified(bool verified) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyVerifiedPref, verified);
  }

  /// Get error message from DioException
  String _getErrorMessage(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return 'Connection timeout. Please check your internet and try again.';
      case DioExceptionType.connectionError:
        return 'No internet connection. Please check your network.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  /// Reset verification (for testing purposes)
  Future<void> resetVerification() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyVerifiedPref);
    await _resetAttempts();
  }
}

/// Result of security key verification
class SecurityKeyResult {
  final SecurityKeyStatus status;
  final String? message;
  final int? remainingAttempts;
  final int? lockMinutes;

  SecurityKeyResult._({
    required this.status,
    this.message,
    this.remainingAttempts,
    this.lockMinutes,
  });

  factory SecurityKeyResult.success() => SecurityKeyResult._(
        status: SecurityKeyStatus.success,
        message: 'Security key verified successfully!',
      );

  factory SecurityKeyResult.invalid(int remainingAttempts) => SecurityKeyResult._(
        status: SecurityKeyStatus.invalid,
        message: 'Invalid security key.',
        remainingAttempts: remainingAttempts,
      );

  factory SecurityKeyResult.locked(int lockMinutes) => SecurityKeyResult._(
        status: SecurityKeyStatus.locked,
        message: 'Too many failed attempts. App is locked.',
        lockMinutes: lockMinutes,
      );

  factory SecurityKeyResult.error(String message) => SecurityKeyResult._(
        status: SecurityKeyStatus.error,
        message: message,
      );

  bool get isSuccess => status == SecurityKeyStatus.success;
  bool get isInvalid => status == SecurityKeyStatus.invalid;
  bool get isLocked => status == SecurityKeyStatus.locked;
  bool get isError => status == SecurityKeyStatus.error;
}

enum SecurityKeyStatus {
  success,
  invalid,
  locked,
  error,
}
