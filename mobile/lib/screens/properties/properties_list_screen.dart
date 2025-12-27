import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/app_theme.dart';
import '../../models/models.dart';

/// Properties List Screen - Shows owner info and all their properties
class PropertiesListScreen extends StatelessWidget {
  final Owner? owner;
  final List<Property> properties;
  final String searchType;
  final String searchValue;

  const PropertiesListScreen({
    super.key,
    required this.owner,
    required this.properties,
    required this.searchType,
    required this.searchValue,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            _buildHeader(context),

            // Content
            Expanded(
              child: properties.isEmpty
                  ? _buildEmptyState(context)
                  : SingleChildScrollView(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          // Owner Card
                          if (owner != null) _buildOwnerCard(context),

                          const SizedBox(height: 20),

                          // Properties List
                          ...properties.asMap().entries.map((entry) {
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: _PropertyCard(
                                property: entry.value,
                                index: entry.key,
                                onTap: () => _navigateToDetail(context, entry.value),
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(8, 8, 16, 16),
      color: AppTheme.bgPrimary,
      child: Row(
        children: [
          // Back button
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppTheme.radiusLg),
              boxShadow: AppTheme.cardShadow,
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back),
              color: AppTheme.textPrimary,
              onPressed: () => context.pop(),
            ),
          ),

          const SizedBox(width: 16),

          // Title
          Expanded(
            child: Text(
              'खोज परिणाम / Results',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary,
              ),
            ),
          ),

          // Count badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              gradient: AppTheme.headerGradient,
              borderRadius: BorderRadius.circular(50),
            ),
            child: Text(
              '${properties.length} प्रॉपर्टी',
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOwnerCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: AppTheme.primaryGradient,
        borderRadius: BorderRadius.circular(AppTheme.radiusXl),
        boxShadow: [
          BoxShadow(
            color: AppTheme.gradientMid.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Label
          Text(
            'मालिक / Owner',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: Colors.white.withOpacity(0.6),
              letterSpacing: 1,
            ),
          ),

          const SizedBox(height: 8),

          // Name
          Text(
            owner!.name,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),

          const SizedBox(height: 16),

          // Details row
          Wrap(
            spacing: 24,
            runSpacing: 12,
            children: [
              _ownerDetailItem('पिता/पति', owner!.fatherName),
              _ownerDetailItem('फोन', owner!.phone),
              _ownerDetailItem('आधार', owner!.maskedAadhaar),
            ],
          ),
        ],
      ),
    );
  }

  Widget _ownerDetailItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          label.toUpperCase(),
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: Colors.white.withOpacity(0.5),
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Colors.white.withOpacity(0.95),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.location_off_outlined,
            size: 64,
            color: AppTheme.textTertiary,
          ),
          const SizedBox(height: 16),
          Text(
            'कोई प्रॉपर्टी नहीं मिली',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'No properties found',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.textTertiary,
            ),
          ),
        ],
      ),
    );
  }

  void _navigateToDetail(BuildContext context, Property property) {
    context.push('/property/${property.id}', extra: {
      'property': property,
      'owner': owner,
    });
  }
}

/// Property Card Widget
class _PropertyCard extends StatelessWidget {
  final Property property;
  final int index;
  final VoidCallback onTap;

  const _PropertyCard({
    required this.property,
    required this.index,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppTheme.radiusXl),
          boxShadow: AppTheme.cardShadow,
          border: Border.all(
            color: Colors.grey.withOpacity(0.08),
            width: 1,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Property ID
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          AppTheme.gradientMid.withOpacity(0.15),
                          AppTheme.gradientEnd.withOpacity(0.1),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                    ),
                    child: Icon(
                      Icons.location_on,
                      size: 18,
                      color: AppTheme.gradientMid,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    property.propertyUniqueId,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.gradientMid,
                    ),
                  ),
                  const Spacer(),
                  Icon(
                    Icons.chevron_right,
                    color: AppTheme.textTertiary,
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Property info grid
              Row(
                children: [
                  Expanded(
                    child: _infoItem('प्लॉट नंबर', property.plotNo),
                  ),
                  Expanded(
                    child: _infoItem('खाता', property.khataNo),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: _infoItem('गाँव', property.village ?? 'N/A'),
                  ),
                  Expanded(
                    child: _infoItem('क्षेत्रफल', property.formattedArea),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Footer with documents count
              Container(
                padding: const EdgeInsets.only(top: 16),
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      color: Colors.grey.withOpacity(0.1),
                      width: 1,
                    ),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.description_outlined,
                      size: 16,
                      color: AppTheme.accentGold,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '${property.documentsCount} Documents',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _infoItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: AppTheme.textTertiary,
            letterSpacing: 0.3,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppTheme.textPrimary,
          ),
        ),
      ],
    );
  }
}
