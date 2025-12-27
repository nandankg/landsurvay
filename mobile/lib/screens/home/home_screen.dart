import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_theme.dart';
import '../../config/app_config.dart';
import '../../widgets/bihar_emblem.dart';

/// Home Screen with 8 module cards
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.white,
        child: SafeArea(
          child: Column(
            children: [
              // Header
              _buildHeader(context),

              // Modules Grid
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: _buildModulesGrid(context),
                ),
              ),

              // Footer
              _buildFooter(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppConfig.governmentName,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.primaryRed,
                    fontStyle: FontStyle.italic,
                    height: 1.3,
                  ),
                ),
                Text(
                  AppConfig.departmentName,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: AppTheme.primaryRed,
                    fontStyle: FontStyle.italic,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          const BiharSarkarBadge(size: 50),
        ],
      ),
    );
  }

  Widget _buildModulesGrid(BuildContext context) {
    final modules = _getModules();

    return GridView.builder(
      physics: const BouncingScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.1,
      ),
      itemCount: modules.length,
      itemBuilder: (context, index) {
        final module = modules[index];
        return _ModuleCard(
          title: module['title'] as String,
          isActive: module['active'] as bool,
          isHighlighted: module['highlighted'] as bool? ?? false,
          onTap: () => _handleModuleTap(context, module),
        );
      },
    );
  }

  void _handleModuleTap(BuildContext context, Map<String, dynamic> module) {
    if (module['active'] == true) {
      context.push('/search');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
            'जल्द आ रहा है / Coming Soon',
            textAlign: TextAlign.center,
          ),
          behavior: SnackBarBehavior.floating,
          backgroundColor: AppTheme.moduleBlue,
          duration: const Duration(seconds: 2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: const EdgeInsets.symmetric(horizontal: 50, vertical: 20),
        ),
      );
    }
  }

  List<Map<String, dynamic>> _getModules() {
    return [
      {
        'id': 'land-records',
        'title': 'भू अभिलेख एवं परिमाप निदेशालय',
        'active': false,
      },
      {
        'id': 'land-revenue',
        'title': 'भू लगान',
        'active': false,
      },
      {
        'id': 'survey-status',
        'title': 'सर्वेक्षण स्थिति 2023',
        'active': true,
        'highlighted': true,
      },
      {
        'id': 'jamabandi',
        'title': 'जमाबंदी पंजी',
        'active': false,
      },
      {
        'id': 'general-info',
        'title': 'आम सूचना',
        'active': false,
      },
      {
        'id': 'land-map',
        'title': 'भू मानचित्र',
        'active': false,
      },
      {
        'id': 'aadhaar-seeding',
        'title': 'आधार / मोबाइल सीडिंग स्थिति',
        'active': false,
      },
      {
        'id': 'govt-land',
        'title': 'सरकारी भूमि का दाखिल खारिज',
        'active': false,
      },
    ];
  }

  Widget _buildFooter(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: BiharBhumiLogo(size: 50),
    );
  }
}

/// Module Card Widget
class _ModuleCard extends StatelessWidget {
  final String title;
  final bool isActive;
  final bool isHighlighted;
  final VoidCallback onTap;

  const _ModuleCard({
    required this.title,
    required this.isActive,
    required this.isHighlighted,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          gradient: isHighlighted
              ? LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppTheme.moduleBlue,
                    AppTheme.moduleBlueDark,
                  ],
                )
              : null,
          color: isHighlighted ? null : AppTheme.moduleBlue,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          boxShadow: [
            BoxShadow(
              color: AppTheme.moduleBlue.withOpacity(0.3),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
          border: isHighlighted
              ? Border.all(
                  color: Colors.lightBlueAccent.withOpacity(0.5),
                  width: 2,
                )
              : null,
        ),
        child: Stack(
          children: [
            // Coming Soon badge
            if (!isActive)
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.accentGold,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    'Coming Soon',
                    style: TextStyle(
                      fontSize: 8,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                ),
              ),

            // Title
            Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  title,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                    height: 1.4,
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
