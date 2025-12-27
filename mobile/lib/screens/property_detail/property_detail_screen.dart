import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../models/models.dart';
import '../../services/api_service.dart';

/// Property Detail Screen - Shows complete property information
class PropertyDetailScreen extends StatefulWidget {
  final String propertyId;
  final Property? property;
  final Owner? owner;

  const PropertyDetailScreen({
    super.key,
    required this.propertyId,
    this.property,
    this.owner,
  });

  @override
  State<PropertyDetailScreen> createState() => _PropertyDetailScreenState();
}

class _PropertyDetailScreenState extends State<PropertyDetailScreen> {
  Property? _property;
  Owner? _owner;
  List<PropertyDocument> _documents = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _property = widget.property;
    _owner = widget.owner;

    if (_property != null) {
      _isLoading = false;
      _fetchDocuments();
    } else {
      _fetchPropertyDetails();
    }
  }

  Future<void> _fetchPropertyDetails() async {
    setState(() => _isLoading = true);

    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final response = await apiService.getPropertyDetails(widget.propertyId);

      if (!mounted) return;

      if (response.isSuccess && response.data != null) {
        setState(() {
          _property = response.data!.property;
          _owner = response.data!.owner;
          _documents = response.data!.documents;
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = response.error ?? 'Property not found';
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Failed to load property details';
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _fetchDocuments() async {
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final propertyId = _property?.id ?? widget.propertyId;
      print('Fetching documents for property: $propertyId');

      final response = await apiService.getPropertyDocuments(propertyId);

      print('Documents response - isSuccess: ${response.isSuccess}, data: ${response.data?.length ?? 0} items, error: ${response.error}');

      if (!mounted) return;

      if (response.isSuccess && response.data != null) {
        print('Setting documents: ${response.data!.length} documents');
        setState(() => _documents = response.data!);
      }
    } catch (e) {
      print('Error fetching documents: $e');
    }
  }

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
              child: _isLoading
                  ? _buildLoading()
                  : _error != null
                      ? _buildError()
                      : _buildContent(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(8, 8, 16, 8),
      child: Row(
        children: [
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
          Text(
            'प्रॉपर्टी विवरण / Property Details',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoading() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppTheme.gradientMid),
          ),
          const SizedBox(height: 16),
          Text(
            'लोड हो रहा है... / Loading...',
            style: TextStyle(
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildError() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline,
            size: 56,
            color: AppTheme.primaryRed,
          ),
          const SizedBox(height: 16),
          Text(
            _error ?? 'An error occurred',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: AppTheme.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => context.pop(),
            child: const Text('वापस जाएं / Go Back'),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          // Property ID Banner
          _buildPropertyIdBanner(),

          const SizedBox(height: 20),

          // Owner Details Section
          if (_owner != null) _buildOwnerSection(),

          const SizedBox(height: 16),

          // Land Details Section
          _buildLandDetailsSection(),

          const SizedBox(height: 16),

          // Boundaries Section
          _buildBoundariesSection(),

          const SizedBox(height: 16),

          // Documents Section
          _buildDocumentsSection(),
        ],
      ),
    );
  }

  Widget _buildPropertyIdBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
      decoration: BoxDecoration(
        gradient: AppTheme.headerGradient,
        borderRadius: BorderRadius.circular(AppTheme.radiusXl),
        boxShadow: [
          BoxShadow(
            color: AppTheme.gradientMid.withOpacity(0.3),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Text(
        _property?.propertyUniqueId ?? '',
        textAlign: TextAlign.center,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w800,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildOwnerSection() {
    return _DetailSection(
      icon: Icons.person_outline,
      title: 'मालिक विवरण / Owner Details',
      children: [
        _DetailRow(label: 'नाम / Name', value: _owner!.name),
        _DetailRow(label: 'पिता / पति', value: _owner!.fatherName),
        _DetailRow(label: 'लिंग / Gender', value: _owner!.gender ?? 'N/A'),
        _DetailRow(label: 'फोन नंबर', value: _owner!.phone),
        _DetailRow(label: 'आधार नंबर', value: _owner!.maskedAadhaar),
      ],
    );
  }

  Widget _buildLandDetailsSection() {
    return _DetailSection(
      icon: Icons.location_on_outlined,
      title: 'भूमि विवरण / Land Details',
      children: [
        Row(
          children: [
            Expanded(
              child: _DetailRow(label: 'प्लॉट नंबर', value: _property!.plotNo),
            ),
            Expanded(
              child: _DetailRow(label: 'खाता', value: _property!.khataNo),
            ),
          ],
        ),
        Row(
          children: [
            Expanded(
              child: _DetailRow(
                label: 'ऐकर',
                value: _property!.acres?.toString() ?? '-',
              ),
            ),
            Expanded(
              child: _DetailRow(
                label: 'डिसमिल',
                value: _property!.decimals?.toString() ?? '-',
              ),
            ),
          ],
        ),
        Row(
          children: [
            Expanded(
              child: _DetailRow(
                label: 'जिला',
                value: _property!.district ?? 'N/A',
              ),
            ),
            Expanded(
              child: _DetailRow(
                label: 'गाँव',
                value: _property!.village ?? 'N/A',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBoundariesSection() {
    return _DetailSection(
      icon: Icons.crop_square_outlined,
      title: 'चौहदी / Boundaries',
      children: [
        Row(
          children: [
            Expanded(
              child: _BoundaryItem(
                direction: 'उत्तर / North',
                value: _property!.northBoundary ?? 'N/A',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _BoundaryItem(
                direction: 'दक्षिण / South',
                value: _property!.southBoundary ?? 'N/A',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _BoundaryItem(
                direction: 'पूरब / East',
                value: _property!.eastBoundary ?? 'N/A',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _BoundaryItem(
                direction: 'पश्चिम / West',
                value: _property!.westBoundary ?? 'N/A',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDocumentsSection() {
    return _DetailSection(
      icon: Icons.description_outlined,
      title: 'दस्तावेज / Documents (${_documents.length})',
      children: [
        if (_documents.isEmpty)
          Padding(
            padding: const EdgeInsets.all(20),
            child: Text(
              'कोई दस्तावेज नहीं / No documents',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppTheme.textTertiary),
            ),
          )
        else
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 0.9,
            ),
            itemCount: _documents.length,
            itemBuilder: (context, index) {
              return _DocumentCard(
                document: _documents[index],
                onTap: () => _openDocument(index),
              );
            },
          ),
      ],
    );
  }

  void _openDocument(int index) {
    context.push('/document/${_documents[index].id}', extra: {
      'document': _documents[index],
      'documents': _documents,
      'initialIndex': index,
    });
  }
}

/// Detail Section Card
class _DetailSection extends StatelessWidget {
  final IconData icon;
  final String title;
  final List<Widget> children;

  const _DetailSection({
    required this.icon,
    required this.title,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusXl),
        boxShadow: AppTheme.cardShadow,
        border: Border.all(
          color: Colors.grey.withOpacity(0.08),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: AppTheme.buttonGradient,
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                ),
                child: Icon(
                  icon,
                  size: 16,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textPrimary,
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          Container(
            height: 2,
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.1),
              borderRadius: BorderRadius.circular(1),
            ),
          ),

          const SizedBox(height: 16),

          // Content
          ...children,
        ],
      ),
    );
  }
}

/// Detail Row Widget
class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
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
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

/// Boundary Item Widget
class _BoundaryItem extends StatelessWidget {
  final String direction;
  final String value;

  const _BoundaryItem({required this.direction, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.grey.withOpacity(0.05),
            Colors.grey.withOpacity(0.08),
          ],
        ),
        borderRadius: BorderRadius.circular(AppTheme.radiusLg),
      ),
      child: Column(
        children: [
          Text(
            direction.toUpperCase(),
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: AppTheme.textTertiary,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

/// Document Card Widget
class _DocumentCard extends StatelessWidget {
  final PropertyDocument document;
  final VoidCallback onTap;

  const _DocumentCard({required this.document, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.grey.withOpacity(0.05),
              Colors.grey.withOpacity(0.1),
            ],
          ),
          borderRadius: BorderRadius.circular(AppTheme.radiusLg),
          border: Border.all(
            color: Colors.transparent,
            width: 2,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              document.isPdf
                  ? Icons.picture_as_pdf
                  : Icons.image_outlined,
              size: 32,
              color: document.isPdf
                  ? AppTheme.docPdf
                  : AppTheme.docImage,
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                document.displayName,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
