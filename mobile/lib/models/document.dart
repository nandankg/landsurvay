/// Document Model (PDF or Image attached to property)
class PropertyDocument {
  final String id;
  final String propertyId;
  final String fileName;
  final String originalName;
  final String fileType;
  final String filePath;
  final int? fileSize;
  final String? description;

  PropertyDocument({
    required this.id,
    required this.propertyId,
    required this.fileName,
    required this.originalName,
    required this.fileType,
    required this.filePath,
    this.fileSize,
    this.description,
  });

  factory PropertyDocument.fromJson(Map<String, dynamic> json) {
    return PropertyDocument(
      id: json['id']?.toString() ?? '',
      propertyId: json['propertyId']?.toString() ?? '',
      fileName: json['fileName'] ?? '',
      originalName: json['originalName'] ?? '',
      fileType: json['fileType'] ?? '',
      filePath: json['filePath'] ?? '',
      fileSize: json['fileSize'] is int ? json['fileSize'] : (json['fileSize'] != null ? int.tryParse(json['fileSize'].toString()) : null),
      description: json['description'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'propertyId': propertyId,
      'fileName': fileName,
      'originalName': originalName,
      'fileType': fileType,
      'filePath': filePath,
      'fileSize': fileSize,
      'description': description,
    };
  }

  /// Returns true if document is a PDF
  bool get isPdf => fileType.toLowerCase() == 'pdf';

  /// Returns true if document is an image
  bool get isImage =>
      ['jpg', 'jpeg', 'png', 'gif', 'webp'].contains(fileType.toLowerCase());

  /// Returns display name for the document
  String get displayName {
    if (description != null && description!.isNotEmpty) return description!;
    if (originalName.isNotEmpty) return originalName;
    if (fileName.isNotEmpty) return fileName;
    return 'Document';
  }

  /// Returns formatted file size
  String get formattedSize {
    if (fileSize == null) return '';
    if (fileSize! < 1024) return '$fileSize B';
    if (fileSize! < 1024 * 1024) return '${(fileSize! / 1024).toStringAsFixed(1)} KB';
    return '${(fileSize! / (1024 * 1024)).toStringAsFixed(1)} MB';
  }
}
