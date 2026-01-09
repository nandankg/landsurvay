import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_theme.dart';
import '../../services/security_key_service.dart';
import '../../widgets/bihar_emblem.dart';
import '../../widgets/circular_text.dart';

/// Security Key Verification Screen
/// Required on first app use after installation
class SecurityKeyScreen extends StatefulWidget {
  const SecurityKeyScreen({super.key});

  @override
  State<SecurityKeyScreen> createState() => _SecurityKeyScreenState();
}

class _SecurityKeyScreenState extends State<SecurityKeyScreen> {
  final _keyController = TextEditingController();
  final _securityService = SecurityKeyService();
  final _formKey = GlobalKey<FormState>();

  bool _isLoading = false;
  bool _isLocked = false;
  bool _obscureKey = true;
  int _remainingAttempts = 5;
  int _lockMinutes = 0;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _initializeScreen();
  }

  Future<void> _initializeScreen() async {
    await _securityService.fetchSecurityConfig();
    await _checkLockStatus();
  }

  Future<void> _checkLockStatus() async {
    final isLocked = await _securityService.isLocked();
    final remaining = await _securityService.getRemainingAttempts();
    final lockMinutes = await _securityService.getRemainingLockMinutes();

    if (mounted) {
      setState(() {
        _isLocked = isLocked;
        _remainingAttempts = remaining;
        _lockMinutes = lockMinutes;
      });
    }
  }

  @override
  void dispose() {
    _keyController.dispose();
    super.dispose();
  }

  Future<void> _verifyKey() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await _securityService.verifyKey(_keyController.text.trim());

      if (!mounted) return;

      if (result.isSuccess) {
        // Navigate to home
        context.go('/home');
      } else if (result.isLocked) {
        setState(() {
          _isLocked = true;
          _lockMinutes = result.lockMinutes ?? 30;
          _errorMessage = 'बहुत अधिक असफल प्रयास। ऐप ${result.lockMinutes} मिनट के लिए लॉक है।';
        });
      } else if (result.isInvalid) {
        setState(() {
          _remainingAttempts = result.remainingAttempts ?? 0;
          _errorMessage = 'गलत सुरक्षा कुंजी। ${result.remainingAttempts} प्रयास शेष।';
        });
        _keyController.clear();
      } else if (result.isError) {
        setState(() {
          _errorMessage = result.message;
        });
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          color: Colors.white,
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Bihar Sarkar logo at top right
              Align(
                alignment: Alignment.topRight,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: const BiharSarkarBadge(size: 55),
                ),
              ),

              // Main content
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        const SizedBox(height: 20),

                        // Logo
                        CircularEmblemWithText(
                          size: 160,
                          topText: 'Department of Revenue and Land Reforms,',
                          bottomText: 'Govt. Of Bihar',
                          textColor: AppTheme.textPrimary,
                          borderColor: AppTheme.textPrimary.withOpacity(0.2),
                          centerWidget: const BiharGovtLogo(size: 80),
                        ),

                        const SizedBox(height: 40),

                        // Title
                        Text(
                          'सुरक्षा सत्यापन',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Security Verification',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: AppTheme.textSecondary,
                          ),
                        ),

                        const SizedBox(height: 32),

                        // Lock message or form
                        if (_isLocked) ...[
                          _buildLockedMessage(),
                        ] else ...[
                          _buildSecurityForm(),
                        ],

                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ),

              // NIC Logo at bottom
              const Padding(
                padding: EdgeInsets.only(bottom: 30),
                child: NICLogo(size: 100),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLockedMessage() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.primaryRed.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppTheme.radiusXl),
        border: Border.all(
          color: AppTheme.primaryRed.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Icon(
            Icons.lock_clock,
            size: 64,
            color: AppTheme.primaryRed,
          ),
          const SizedBox(height: 16),
          Text(
            'ऐप अस्थायी रूप से लॉक है',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppTheme.primaryRed,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'App Temporarily Locked',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppTheme.primaryRed.withOpacity(0.8),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Text(
            'बहुत अधिक असफल प्रयास। कृपया $_lockMinutes मिनट बाद पुनः प्रयास करें।',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Too many failed attempts. Please try again after $_lockMinutes minutes.',
            style: TextStyle(
              fontSize: 12,
              color: AppTheme.textTertiary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () async {
                await _checkLockStatus();
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.primaryRed,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(50),
                ),
                side: BorderSide(color: AppTheme.primaryRed),
              ),
              child: const Text(
                'पुनः जांचें / Check Again',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSecurityForm() {
    return Form(
      key: _formKey,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppTheme.radiusXl),
          boxShadow: AppTheme.cardShadow,
          border: Border.all(
            color: Colors.grey.withOpacity(0.1),
            width: 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Instruction text
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.gradientMid.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.info_outline,
                    size: 24,
                    color: AppTheme.gradientMid,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'ऐप का उपयोग करने के लिए सुरक्षा कुंजी दर्ज करें',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Security key label
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.accentOrange.withOpacity(0.2),
                        AppTheme.accentOrange.withOpacity(0.1),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                  ),
                  child: Icon(
                    Icons.key,
                    size: 20,
                    color: AppTheme.accentOrange,
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  'सुरक्षा कुंजी / Security Key',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Security key input
            TextFormField(
              controller: _keyController,
              obscureText: _obscureKey,
              enabled: !_isLoading,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: AppTheme.textPrimary,
                letterSpacing: _obscureKey ? 4 : 1,
              ),
              decoration: InputDecoration(
                hintText: 'सुरक्षा कुंजी दर्ज करें',
                filled: true,
                fillColor: const Color(0xFFF8F9FA),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                  borderSide: const BorderSide(
                    color: Color(0xFFE8EAED),
                    width: 2,
                  ),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                  borderSide: const BorderSide(
                    color: Color(0xFFE8EAED),
                    width: 2,
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                  borderSide: BorderSide(
                    color: AppTheme.gradientMid,
                    width: 2,
                  ),
                ),
                errorBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                  borderSide: BorderSide(
                    color: AppTheme.primaryRed,
                    width: 2,
                  ),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 16,
                ),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureKey ? Icons.visibility_off : Icons.visibility,
                    color: AppTheme.textTertiary,
                  ),
                  onPressed: () {
                    setState(() {
                      _obscureKey = !_obscureKey;
                    });
                  },
                ),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'कृपया सुरक्षा कुंजी दर्ज करें';
                }
                return null;
              },
              onFieldSubmitted: (_) => _verifyKey(),
            ),

            // Error message
            if (_errorMessage != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.primaryRed.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 20,
                      color: AppTheme.primaryRed,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _errorMessage!,
                        style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.primaryRed,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            // Remaining attempts indicator
            if (!_isLocked && _remainingAttempts < 5) ...[
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'शेष प्रयास: ',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  ...List.generate(5, (index) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2),
                      child: Icon(
                        index < _remainingAttempts
                            ? Icons.circle
                            : Icons.circle_outlined,
                        size: 10,
                        color: index < _remainingAttempts
                            ? AppTheme.accentEmerald
                            : AppTheme.textTertiary,
                      ),
                    );
                  }),
                ],
              ),
            ],

            const SizedBox(height: 24),

            // Verify button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _verifyKey,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryRed,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(50),
                  ),
                  elevation: 0,
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text(
                        'सत्यापित करें / Verify',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
