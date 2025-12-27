import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../config/app_config.dart';
import '../../services/api_service.dart';
import '../../widgets/bihar_emblem.dart';

/// Search Screen with 3 search options
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _mobileController = TextEditingController();
  final _aadhaarController = TextEditingController();
  final _propertyIdController = TextEditingController();

  String? _loadingType; // 'mobile', 'aadhaar', 'property', or null

  @override
  void dispose() {
    _mobileController.dispose();
    _aadhaarController.dispose();
    _propertyIdController.dispose();
    super.dispose();
  }

  Future<void> _handleSearch(String type) async {
    String searchValue = '';

    switch (type) {
      case 'mobile':
        searchValue = _mobileController.text.trim();
        if (searchValue.length != AppConfig.mobileNumberLength) {
          _showError('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें');
          return;
        }
        break;
      case 'aadhaar':
        searchValue = _aadhaarController.text.trim().replaceAll(' ', '');
        if (searchValue.length != AppConfig.aadhaarNumberLength) {
          _showError('कृपया 12 अंकों का आधार नंबर दर्ज करें');
          return;
        }
        break;
      case 'property':
        searchValue = _propertyIdController.text.trim().toUpperCase();
        if (searchValue.isEmpty) {
          _showError('कृपया प्रॉपर्टी आईडी दर्ज करें');
          return;
        }
        break;
    }

    setState(() => _loadingType = type);

    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final response = switch (type) {
        'mobile' => await apiService.searchByMobile(searchValue),
        'aadhaar' => await apiService.searchByAadhaar(searchValue),
        'property' => await apiService.searchByPropertyId(searchValue),
        _ => throw Exception('Invalid search type'),
      };

      if (!mounted) return;

      if (response.isSuccess && response.data != null) {
        final result = response.data!;

        // Navigate to properties list
        context.push('/properties', extra: {
          'owner': result.owner,
          'properties': result.properties,
          'searchType': type,
          'searchValue': searchValue,
        });
      } else {
        _showError(response.error ?? 'कोई रिकॉर्ड नहीं मिला / No records found');
      }
    } catch (e) {
      _showError('खोज में त्रुटि / Search error');
    } finally {
      if (mounted) {
        setState(() => _loadingType = null);
      }
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppTheme.primaryRed,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Header
          _buildHeader(context),

          // Search Forms
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    // Mobile Search
                    _SearchCard(
                      icon: Icons.phone_android,
                      label: 'Mobile no. / मोबाइल नंबर',
                      hint: '10 अंकों का मोबाइल नंबर दर्ज करें',
                      controller: _mobileController,
                      keyboardType: TextInputType.phone,
                      maxLength: 10,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      isLoading: _loadingType == 'mobile',
                      isDisabled: _loadingType != null,
                      onSearch: () => _handleSearch('mobile'),
                    ),

                    const SizedBox(height: 16),

                    // Aadhaar Search
                    _SearchCard(
                      icon: Icons.credit_card,
                      label: 'Aadhaar no. / आधार नंबर',
                      hint: '12 अंकों का आधार नंबर दर्ज करें',
                      controller: _aadhaarController,
                      keyboardType: TextInputType.number,
                      maxLength: 12,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      isLoading: _loadingType == 'aadhaar',
                      isDisabled: _loadingType != null,
                      onSearch: () => _handleSearch('aadhaar'),
                    ),

                    const SizedBox(height: 16),

                    // Property ID Search
                    _SearchCard(
                      icon: Icons.home_outlined,
                      label: 'Property Unique ID / प्रॉपर्टी आईडी',
                      hint: 'उदाहरण: BH2023-PAT-00001',
                      controller: _propertyIdController,
                      keyboardType: TextInputType.text,
                      textCapitalization: TextCapitalization.characters,
                      isLoading: _loadingType == 'property',
                      isDisabled: _loadingType != null,
                      onSearch: () => _handleSearch('property'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: AppTheme.primaryGradient,
      ),
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // Back button and logo
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 16, 8),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => context.pop(),
                  ),
                  const Spacer(),
                  const BiharBhumiLogo(size: 45),
                ],
              ),
            ),

            // Header text
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
              child: Column(
                children: [
                  Text(
                    AppConfig.governmentName,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.white.withOpacity(0.8),
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  Text(
                    AppConfig.departmentName,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w400,
                      color: Colors.white.withOpacity(0.7),
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ),
            ),

            // Title
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
              child: Text(
                'सर्वेक्षण स्थिति 2023',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Search Card Widget
class _SearchCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String hint;
  final TextEditingController controller;
  final TextInputType keyboardType;
  final int? maxLength;
  final TextCapitalization textCapitalization;
  final List<TextInputFormatter>? inputFormatters;
  final bool isLoading;
  final bool isDisabled;
  final VoidCallback onSearch;

  const _SearchCard({
    required this.icon,
    required this.label,
    required this.hint,
    required this.controller,
    required this.keyboardType,
    this.maxLength,
    this.textCapitalization = TextCapitalization.none,
    this.inputFormatters,
    required this.isLoading,
    required this.isDisabled,
    required this.onSearch,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusXl),
        boxShadow: AppTheme.cardShadow,
        border: Border.all(
          color: Colors.grey.withOpacity(0.1),
          width: 1,
        ),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Label with icon
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
                  icon,
                  size: 20,
                  color: AppTheme.accentOrange,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Input field
          TextField(
            controller: controller,
            keyboardType: keyboardType,
            textCapitalization: textCapitalization,
            maxLength: maxLength,
            inputFormatters: inputFormatters,
            enabled: !isDisabled,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: AppTheme.textPrimary,
            ),
            decoration: InputDecoration(
              hintText: hint,
              counterText: '',
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
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 20,
                vertical: 16,
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Search button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: isDisabled ? null : onSearch,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryRed,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(50),
                ),
                elevation: 0,
              ),
              child: isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text(
                      'Search / खोजें',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
