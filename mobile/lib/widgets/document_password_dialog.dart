import 'package:flutter/material.dart';
import '../config/app_theme.dart';

/// Password dialog for secure document access
/// Default password is the property unique ID
class DocumentPasswordDialog extends StatefulWidget {
  final String propertyUniqueId;
  final VoidCallback onSuccess;

  const DocumentPasswordDialog({
    super.key,
    required this.propertyUniqueId,
    required this.onSuccess,
  });

  /// Show the password dialog
  static Future<bool> show({
    required BuildContext context,
    required String propertyUniqueId,
  }) async {
    final result = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (context) => DocumentPasswordDialog(
        propertyUniqueId: propertyUniqueId,
        onSuccess: () => Navigator.of(context).pop(true),
      ),
    );
    return result ?? false;
  }

  @override
  State<DocumentPasswordDialog> createState() => _DocumentPasswordDialogState();
}

class _DocumentPasswordDialogState extends State<DocumentPasswordDialog> {
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _obscurePassword = true;
  String? _errorMessage;
  int _attempts = 0;
  static const int _maxAttempts = 3;

  @override
  void dispose() {
    _passwordController.dispose();
    super.dispose();
  }

  void _validatePassword() {
    setState(() => _errorMessage = null);

    final enteredPassword = _passwordController.text.trim();

    if (enteredPassword.isEmpty) {
      setState(() => _errorMessage = 'कृपया पासवर्ड दर्ज करें / Please enter password');
      return;
    }

    // Check if password matches property unique ID
    if (enteredPassword == widget.propertyUniqueId) {
      widget.onSuccess();
    } else {
      _attempts++;
      if (_attempts >= _maxAttempts) {
        Navigator.of(context).pop(false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('बहुत अधिक गलत प्रयास। कृपया बाद में पुनः प्रयास करें। / Too many incorrect attempts.'),
            backgroundColor: AppTheme.primaryRed,
          ),
        );
      } else {
        setState(() {
          _errorMessage = 'गलत पासवर्ड। ${_maxAttempts - _attempts} प्रयास शेष। / Incorrect password. ${_maxAttempts - _attempts} attempts remaining.';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppTheme.radiusXl),
      ),
      title: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: AppTheme.headerGradient,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.lock_outline,
              color: Colors.white,
              size: 32,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'दस्तावेज़ सुरक्षित है',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppTheme.textPrimary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            'Document is Protected',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppTheme.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'दस्तावेज़ देखने के लिए प्रॉपर्टी ID दर्ज करें',
              style: TextStyle(
                fontSize: 13,
                color: AppTheme.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              'Enter Property ID to view document',
              style: TextStyle(
                fontSize: 12,
                color: AppTheme.textTertiary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            TextFormField(
              controller: _passwordController,
              obscureText: _obscurePassword,
              decoration: InputDecoration(
                labelText: 'पासवर्ड / Password',
                hintText: 'Property ID दर्ज करें',
                prefixIcon: Icon(Icons.key, color: AppTheme.gradientMid),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscurePassword ? Icons.visibility_off : Icons.visibility,
                    color: AppTheme.textTertiary,
                  ),
                  onPressed: () {
                    setState(() => _obscurePassword = !_obscurePassword);
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                  borderSide: BorderSide(color: AppTheme.gradientMid, width: 2),
                ),
                errorText: _errorMessage,
                errorMaxLines: 2,
              ),
              onFieldSubmitted: (_) => _validatePassword(),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: Text(
            'रद्द करें / Cancel',
            style: TextStyle(color: AppTheme.textSecondary),
          ),
        ),
        ElevatedButton(
          onPressed: _validatePassword,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.gradientMid,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          ),
          child: const Text('देखें / View'),
        ),
      ],
    );
  }
}
