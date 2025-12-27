import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_theme.dart';
import '../../models/models.dart';
import '../../services/api_service.dart';

/// Document Viewer Screen - View PDF and Image documents
class DocumentViewerScreen extends StatefulWidget {
  final String documentId;
  final PropertyDocument? document;
  final List<PropertyDocument>? documents;
  final int initialIndex;

  const DocumentViewerScreen({
    super.key,
    required this.documentId,
    this.document,
    this.documents,
    this.initialIndex = 0,
  });

  @override
  State<DocumentViewerScreen> createState() => _DocumentViewerScreenState();
}

class _DocumentViewerScreenState extends State<DocumentViewerScreen> {
  late PageController _pageController;
  int _currentIndex = 0;
  bool _isLoading = true;
  String? _error;

  List<PropertyDocument> get _documents =>
      widget.documents ?? (widget.document != null ? [widget.document!] : []);

  PropertyDocument get _currentDocument => _documents[_currentIndex];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: _currentIndex);
    _isLoading = false;
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  String _getViewUrl(PropertyDocument doc) {
    final apiService = Provider.of<ApiService>(context, listen: false);
    return apiService.getDocumentViewUrl(doc.id);
  }

  String _getDownloadUrl(PropertyDocument doc) {
    final apiService = Provider.of<ApiService>(context, listen: false);
    return apiService.getDocumentDownloadUrl(doc.id);
  }

  Future<void> _downloadDocument() async {
    final url = Uri.parse(_getDownloadUrl(_currentDocument));
    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      } else {
        _showError('Cannot open download link');
      }
    } catch (e) {
      _showError('Download failed');
    }
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

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            _buildHeader(context),

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
            onPressed: () => context.pop(),
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

          // Download button
          IconButton(
            icon: const Icon(Icons.download, color: Colors.white),
            onPressed: _downloadDocument,
          ),
        ],
      ),
    );
  }

  Widget _buildPdfViewer() {
    final url = _getViewUrl(_currentDocument);

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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ElevatedButton.icon(
                        onPressed: () async {
                          final uri = Uri.parse(url);
                          if (await canLaunchUrl(uri)) {
                            await launchUrl(
                              uri,
                              mode: LaunchMode.externalApplication,
                            );
                          }
                        },
                        icon: const Icon(Icons.open_in_new),
                        label: const Text('Open PDF'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.gradientMid,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 12,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      ElevatedButton.icon(
                        onPressed: _downloadDocument,
                        icon: const Icon(Icons.download),
                        label: const Text('Download'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryRed,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 12,
                          ),
                        ),
                      ),
                    ],
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
      return PhotoView(
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
      );
    }

    // Gallery for multiple images
    return PhotoViewGallery.builder(
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
            ElevatedButton.icon(
              onPressed: () async {
                final uri = Uri.parse(_getViewUrl(doc));
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
              icon: const Icon(Icons.open_in_new),
              label: const Text('Open PDF'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gradientMid,
                foregroundColor: Colors.white,
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
