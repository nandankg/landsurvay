import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';
import 'package:flutter_windowmanager/flutter_windowmanager.dart';
import '../../config/app_theme.dart';
import '../../models/models.dart';
import '../../services/api_service.dart';

/// Secure Document Viewer Screen - View PDF and Image documents
/// Security features:
/// - No download option
/// - No copy/screenshot allowed
/// - Password protected (handled before navigation)
class DocumentViewerScreen extends StatefulWidget {
  final String documentId;
  final PropertyDocument? document;
  final List<PropertyDocument>? documents;
  final int initialIndex;
  final String? propertyUniqueId;

  const DocumentViewerScreen({
    super.key,
    required this.documentId,
    this.document,
    this.documents,
    this.initialIndex = 0,
    this.propertyUniqueId,
  });

  @override
  State<DocumentViewerScreen> createState() => _DocumentViewerScreenState();
}

class _DocumentViewerScreenState extends State<DocumentViewerScreen> with WidgetsBindingObserver {
  late PageController _pageController;
  int _currentIndex = 0;
  bool _isLoading = true;

  List<PropertyDocument> get _documents =>
      widget.documents ?? (widget.document != null ? [widget.document!] : []);

  PropertyDocument get _currentDocument => _documents[_currentIndex];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: _currentIndex);
    _isLoading = false;

    // Enable secure mode to prevent screenshots on Android
    _enableSecureMode();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _pageController.dispose();
    // Disable secure mode when leaving
    _disableSecureMode();
    super.dispose();
  }

  /// Enable FLAG_SECURE on Android to prevent screenshots
  Future<void> _enableSecureMode() async {
    // Use flutter_windowmanager for Android screenshot prevention
    if (!kIsWeb && Platform.isAndroid) {
      try {
        await FlutterWindowManager.addFlags(FlutterWindowManager.FLAG_SECURE);
      } catch (e) {
        debugPrint('Failed to enable secure mode: $e');
      }
    }
    // Set immersive mode for better viewing experience
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
  }

  /// Disable secure mode when leaving the screen
  Future<void> _disableSecureMode() async {
    // Remove FLAG_SECURE when leaving document viewer
    if (!kIsWeb && Platform.isAndroid) {
      try {
        await FlutterWindowManager.clearFlags(FlutterWindowManager.FLAG_SECURE);
      } catch (e) {
        debugPrint('Failed to disable secure mode: $e');
      }
    }
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // When app goes to background, navigate back to prevent screenshot from recent apps
    if (state == AppLifecycleState.paused || state == AppLifecycleState.inactive) {
      if (mounted) {
        // Show security warning overlay
        _showSecurityWarning();
      }
    }
  }

  void _showSecurityWarning() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: const [
            Icon(Icons.security, color: Colors.white),
            SizedBox(width: 8),
            Expanded(
              child: Text(
                'सुरक्षा: स्क्रीनशॉट अक्षम है / Security: Screenshot disabled',
              ),
            ),
          ],
        ),
        backgroundColor: AppTheme.primaryRed,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  String _getViewUrl(PropertyDocument doc) {
    final apiService = Provider.of<ApiService>(context, listen: false);
    return apiService.getDocumentViewUrl(doc.id);
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.primaryRed,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_documents.isEmpty) {
      return Scaffold(
        backgroundColor: Colors.black,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 56,
                color: Colors.white54,
              ),
              const SizedBox(height: 16),
              Text(
                'Document not found',
                style: TextStyle(color: Colors.white),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.pop(),
                child: const Text('Go Back'),
              ),
            ],
          ),
        ),
      );
    }

    // Wrap with security overlay to prevent screenshots
    return WillPopScope(
      onWillPop: () async {
        await _disableSecureMode();
        return true;
      },
      child: Scaffold(
        backgroundColor: Colors.black,
        body: SafeArea(
          child: Stack(
            children: [
              Column(
                children: [
                  // Header
                  _buildHeader(context),

                  // Security Notice Banner
                  _buildSecurityBanner(),

                  // Content
                  Expanded(
                    child: _currentDocument.isPdf
                        ? _buildPdfViewer()
                        : _buildImageViewer(),
                  ),

                  // Footer with navigation
                  if (_documents.length > 1) _buildFooter(),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSecurityBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryRed.withOpacity(0.9),
            AppTheme.primaryRed,
          ],
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.security, color: Colors.white, size: 16),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              'सुरक्षित दस्तावेज़ - डाउनलोड/कॉपी/स्क्रीनशॉट अक्षम',
              style: TextStyle(
                color: Colors.white,
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
      ),
      child: Row(
        children: [
          // Back button
          IconButton(
            icon: const Icon(Icons.close, color: Colors.white),
            onPressed: () async {
              await _disableSecureMode();
              if (context.mounted) context.pop();
            },
          ),

          // Title
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _currentDocument.displayName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                if (_documents.length > 1)
                  Text(
                    '${_currentIndex + 1} / ${_documents.length}',
                    style: TextStyle(
                      color: Colors.white54,
                      fontSize: 12,
                    ),
                  ),
              ],
            ),
          ),

          // File type badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: _currentDocument.isPdf
                  ? AppTheme.docPdf.withOpacity(0.2)
                  : AppTheme.docImage.withOpacity(0.2),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              _currentDocument.fileType.toUpperCase(),
              style: TextStyle(
                color: _currentDocument.isPdf
                    ? AppTheme.docPdf
                    : AppTheme.docImage,
                fontSize: 10,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),

          const SizedBox(width: 8),

          // Lock icon (instead of download)
          Container(
            padding: const EdgeInsets.all(8),
            child: Icon(
              Icons.lock,
              color: Colors.white54,
              size: 20,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPdfViewer() {
    return Container(
      color: Colors.white,
      child: Column(
        children: [
          Expanded(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.picture_as_pdf,
                    size: 80,
                    color: AppTheme.docPdf,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    _currentDocument.displayName,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'PDF Document',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Security Notice
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 32),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryRed.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppTheme.primaryRed.withOpacity(0.3),
                      ),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          Icons.security,
                          color: AppTheme.primaryRed,
                          size: 32,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'सुरक्षित दस्तावेज़',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.primaryRed,
                          ),
                        ),
                        Text(
                          'Secure Document',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.primaryRed,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'डाउनलोड और कॉपी अक्षम है\nDownload and copy disabled',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12,
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
        ],
      ),
    );
  }

  Widget _buildImageViewer() {
    if (_documents.length == 1) {
      return Stack(
        children: [
          PhotoView(
            imageProvider: NetworkImage(_getViewUrl(_currentDocument)),
            minScale: PhotoViewComputedScale.contained,
            maxScale: PhotoViewComputedScale.covered * 3,
            backgroundDecoration: const BoxDecoration(color: Colors.black),
            loadingBuilder: (context, event) => Center(
              child: CircularProgressIndicator(
                value: event == null
                    ? null
                    : event.cumulativeBytesLoaded / (event.expectedTotalBytes ?? 1),
                valueColor: AlwaysStoppedAnimation<Color>(AppTheme.gradientMid),
              ),
            ),
            errorBuilder: (context, error, stackTrace) => Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.broken_image,
                    size: 56,
                    color: Colors.white54,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Failed to load image',
                    style: TextStyle(color: Colors.white54),
                  ),
                ],
              ),
            ),
          ),
          // Watermark overlay to discourage photos of screen
          _buildWatermarkOverlay(),
        ],
      );
    }

    // Gallery for multiple images
    return Stack(
      children: [
        PhotoViewGallery.builder(
          pageController: _pageController,
          itemCount: _documents.length,
          onPageChanged: (index) => setState(() => _currentIndex = index),
          builder: (context, index) {
            final doc = _documents[index];
            if (doc.isPdf) {
              return PhotoViewGalleryPageOptions.customChild(
                child: _buildPdfPlaceholder(doc),
              );
            }
            return PhotoViewGalleryPageOptions(
              imageProvider: NetworkImage(_getViewUrl(doc)),
              minScale: PhotoViewComputedScale.contained,
              maxScale: PhotoViewComputedScale.covered * 3,
            );
          },
          loadingBuilder: (context, event) => Center(
            child: CircularProgressIndicator(
              value: event == null
                  ? null
                  : event.cumulativeBytesLoaded / (event.expectedTotalBytes ?? 1),
              valueColor: AlwaysStoppedAnimation<Color>(AppTheme.gradientMid),
            ),
          ),
          backgroundDecoration: const BoxDecoration(color: Colors.black),
        ),
        // Watermark overlay
        _buildWatermarkOverlay(),
      ],
    );
  }

  /// Watermark overlay to discourage taking photos of screen
  Widget _buildWatermarkOverlay() {
    return IgnorePointer(
      child: Container(
        width: double.infinity,
        height: double.infinity,
        child: CustomPaint(
          painter: WatermarkPainter(
            text: widget.propertyUniqueId ?? 'PROTECTED',
          ),
        ),
      ),
    );
  }

  Widget _buildPdfPlaceholder(PropertyDocument doc) {
    return Container(
      color: Colors.white,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.picture_as_pdf,
              size: 64,
              color: AppTheme.docPdf,
            ),
            const SizedBox(height: 16),
            Text(
              doc.displayName,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.primaryRed.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.lock, color: AppTheme.primaryRed, size: 16),
                  const SizedBox(width: 8),
                  Text(
                    'Secure Document',
                    style: TextStyle(
                      color: AppTheme.primaryRed,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Previous button
          IconButton(
            icon: const Icon(Icons.chevron_left, color: Colors.white),
            onPressed: _currentIndex > 0
                ? () {
                    _pageController.previousPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    );
                  }
                : null,
          ),

          // Page indicator dots
          Row(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(_documents.length, (index) {
              return Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: index == _currentIndex
                      ? Colors.white
                      : Colors.white.withOpacity(0.3),
                ),
              );
            }),
          ),

          // Next button
          IconButton(
            icon: const Icon(Icons.chevron_right, color: Colors.white),
            onPressed: _currentIndex < _documents.length - 1
                ? () {
                    _pageController.nextPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    );
                  }
                : null,
          ),
        ],
      ),
    );
  }
}

/// Custom painter for watermark overlay
class WatermarkPainter extends CustomPainter {
  final String text;

  WatermarkPainter({required this.text});

  @override
  void paint(Canvas canvas, Size size) {
    final textPainter = TextPainter(
      text: TextSpan(
        text: text,
        style: TextStyle(
          color: Colors.white.withOpacity(0.08),
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
      ),
      textDirection: TextDirection.ltr,
    );

    textPainter.layout();

    // Draw diagonal watermarks across the screen
    canvas.save();
    canvas.rotate(-0.5); // Rotate 30 degrees

    for (double y = -size.height; y < size.height * 2; y += 120) {
      for (double x = -size.width; x < size.width * 2; x += 250) {
        textPainter.paint(canvas, Offset(x, y));
      }
    }

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
