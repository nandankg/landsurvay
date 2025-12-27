import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../config/app_theme.dart';
import '../config/logo_assets.dart';

/// Bihar Government Logo Widget
/// Displays the official Bihar Sarkar emblem
class BiharGovtLogo extends StatelessWidget {
  final double size;
  final Color? color;

  const BiharGovtLogo({
    super.key,
    this.size = 55,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
      LogoAssets.biharGovtLogo,
      width: size,
      height: size,
      colorFilter: color != null
          ? ColorFilter.mode(color!, BlendMode.srcIn)
          : null,
      placeholderBuilder: (context) => _buildPlaceholder(),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: color ?? AppTheme.primaryRed, width: 2),
      ),
      child: Icon(
        Icons.account_balance,
        size: size * 0.5,
        color: color ?? AppTheme.primaryRed,
      ),
    );
  }
}

/// NIC (National Informatics Centre) Logo Widget
class NICLogo extends StatelessWidget {
  final double size;
  final Color? color;

  const NICLogo({
    super.key,
    this.size = 50,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
      LogoAssets.nicLogo,
      width: size,
      height: size,
      colorFilter: color != null
          ? ColorFilter.mode(color!, BlendMode.srcIn)
          : null,
      placeholderBuilder: (context) => _buildPlaceholder(),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      width: size,
      height: size * 0.6,
      decoration: BoxDecoration(
        border: Border.all(color: color ?? AppTheme.primaryBlue, width: 2),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Center(
        child: Text(
          'NIC',
          style: TextStyle(
            fontSize: size * 0.25,
            fontWeight: FontWeight.bold,
            color: color ?? AppTheme.primaryBlue,
          ),
        ),
      ),
    );
  }
}

/// Revenue Department Logo Widget
class RevenueDeptLogo extends StatelessWidget {
  final double size;
  final Color? color;

  const RevenueDeptLogo({
    super.key,
    this.size = 50,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
      LogoAssets.revenueDeptLogo,
      width: size,
      height: size,
      colorFilter: color != null
          ? ColorFilter.mode(color!, BlendMode.srcIn)
          : null,
      placeholderBuilder: (context) => _buildPlaceholder(),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: color ?? const Color(0xFF1A5F2A), width: 2),
      ),
      child: Icon(
        Icons.landscape,
        size: size * 0.5,
        color: color ?? const Color(0xFF1A5F2A),
      ),
    );
  }
}

/// Bihar Bhumi App Logo (Bodhi Tree)
class BiharBhumiLogo extends StatelessWidget {
  final double size;
  final Color? color;
  final bool showText;

  const BiharBhumiLogo({
    super.key,
    this.size = 50,
    this.color,
    this.showText = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SvgPicture.asset(
          LogoAssets.appLogo,
          width: size,
          height: size * 1.2,
          colorFilter: color != null
              ? ColorFilter.mode(color!, BlendMode.srcIn)
              : null,
          placeholderBuilder: (context) => _buildPlaceholder(),
        ),
        if (showText) ...[
          SizedBox(height: size * 0.05),
          Text(
            'बिहार भूमि',
            style: TextStyle(
              fontSize: size * 0.24,
              fontWeight: FontWeight.w600,
              color: color ?? AppTheme.primaryRed,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildPlaceholder() {
    return Icon(
      Icons.park,
      size: size,
      color: color ?? AppTheme.primaryRed,
    );
  }
}

/// Combined Header Logos - Shows all three logos in a row
class HeaderLogos extends StatelessWidget {
  final double logoSize;
  final Color? color;

  const HeaderLogos({
    super.key,
    this.logoSize = 40,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        BiharGovtLogo(size: logoSize, color: color),
        SizedBox(width: logoSize * 0.3),
        BiharBhumiLogo(size: logoSize * 0.8, color: color, showText: false),
        SizedBox(width: logoSize * 0.3),
        NICLogo(size: logoSize, color: color),
      ],
    );
  }
}

/// Footer Logos - For displaying at bottom of screens
class FooterLogos extends StatelessWidget {
  final double logoSize;

  const FooterLogos({
    super.key,
    this.logoSize = 35,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            BiharGovtLogo(size: logoSize),
            SizedBox(width: logoSize * 0.5),
            NICLogo(size: logoSize),
            SizedBox(width: logoSize * 0.5),
            RevenueDeptLogo(size: logoSize),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          'Powered by NIC',
          style: TextStyle(
            fontSize: 10,
            color: AppTheme.textTertiary,
          ),
        ),
      ],
    );
  }
}

// ============================================================
// LEGACY WIDGETS (for backward compatibility)
// These widgets are kept for existing code that may reference them
// ============================================================

/// @deprecated Use BiharGovtLogo instead
class BiharSarkarBadge extends StatelessWidget {
  final double size;

  const BiharSarkarBadge({super.key, this.size = 55});

  @override
  Widget build(BuildContext context) {
    return BiharGovtLogo(size: size);
  }
}

/// @deprecated Use BiharBhumiLogo instead
class TreeEmblem extends StatelessWidget {
  final double size;
  final Color color;

  const TreeEmblem({
    super.key,
    this.size = 100,
    this.color = const Color(0xFF333333),
  });

  @override
  Widget build(BuildContext context) {
    return BiharBhumiLogo(size: size, color: color, showText: false);
  }
}

/// @deprecated Use BiharGovtLogo instead
class GovtEmblem extends StatelessWidget {
  final double size;
  final Color color;

  const GovtEmblem({
    super.key,
    this.size = 44,
    this.color = Colors.white,
  });

  @override
  Widget build(BuildContext context) {
    return BiharGovtLogo(size: size, color: color);
  }
}
