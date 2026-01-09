import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_theme.dart';
import '../../services/security_key_service.dart';
import '../../widgets/bihar_emblem.dart';
import '../../widgets/circular_text.dart';

/// Splash Screen with Bihar Government branding
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;
  final _securityService = SecurityKeyService();

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.6, curve: Curves.easeOut),
      ),
    );

    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.6, curve: Curves.easeOut),
      ),
    );

    _animationController.forward();

    // Check security key and navigate
    _checkSecurityAndNavigate();
  }

  Future<void> _checkSecurityAndNavigate() async {
    // Wait for animation to complete
    await Future.delayed(const Duration(milliseconds: 2500));

    if (!mounted) return;

    // Check if security key is already verified
    final isVerified = await _securityService.isKeyVerified();

    if (!mounted) return;

    if (isVerified) {
      // Already verified, go to home
      context.go('/home');
    } else {
      // Not verified, go to security key screen
      context.go('/security-key');
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
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
                  child: AnimatedBuilder(
                    animation: _animationController,
                    builder: (context, child) {
                      return Opacity(
                        opacity: _fadeAnimation.value,
                        child: const BiharSarkarBadge(size: 55),
                      );
                    },
                  ),
                ),
              ),

              // Main content - centered logo
              Expanded(
                child: Center(
                  child: AnimatedBuilder(
                    animation: _animationController,
                    builder: (context, child) {
                      return Opacity(
                        opacity: _fadeAnimation.value,
                        child: Transform.scale(
                          scale: _scaleAnimation.value,
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // Circular emblem with curved text
                              CircularEmblemWithText(
                                size: 220,
                                topText: 'Department of Revenue and Land Reforms,',
                                bottomText: 'Govt. Of Bihar',
                                textColor: AppTheme.textPrimary,
                                borderColor: AppTheme.textPrimary.withOpacity(0.2),
                                centerWidget: const BiharGovtLogo(size: 110),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),

              // NIC Logo at bottom
              AnimatedBuilder(
                animation: _animationController,
                builder: (context, child) {
                  return Opacity(
                    opacity: _fadeAnimation.value,
                    child: const Padding(
                      padding: EdgeInsets.only(bottom: 30),
                      child: NICLogo(size: 120),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
