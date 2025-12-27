/// Land Property Model
class Property {
  final String id;
  final String propertyUniqueId;
  final String plotNo;
  final String khataNo;
  final double? acres;
  final double? decimals;
  final String? northBoundary;
  final String? southBoundary;
  final String? eastBoundary;
  final String? westBoundary;
  final String? district;
  final String? village;
  final String? ownerId;
  final int documentsCount;

  Property({
    required this.id,
    required this.propertyUniqueId,
    required this.plotNo,
    required this.khataNo,
    this.acres,
    this.decimals,
    this.northBoundary,
    this.southBoundary,
    this.eastBoundary,
    this.westBoundary,
    this.district,
    this.village,
    this.ownerId,
    this.documentsCount = 0,
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    // Handle documentsCount from different possible fields
    int docCount = 0;
    if (json['documentsCount'] != null) {
      docCount = json['documentsCount'] is int ? json['documentsCount'] : int.tryParse(json['documentsCount'].toString()) ?? 0;
    } else if (json['_count'] != null && json['_count']['documents'] != null) {
      docCount = json['_count']['documents'] is int ? json['_count']['documents'] : int.tryParse(json['_count']['documents'].toString()) ?? 0;
    }

    return Property(
      id: json['id']?.toString() ?? '',
      propertyUniqueId: json['propertyUniqueId'] ?? '',
      plotNo: json['plotNo'] ?? '',
      khataNo: json['khataNo'] ?? '',
      acres: json['acres'] != null ? (json['acres'] is num ? json['acres'].toDouble() : double.tryParse(json['acres'].toString())) : null,
      decimals: json['decimals'] != null ? (json['decimals'] is num ? json['decimals'].toDouble() : double.tryParse(json['decimals'].toString())) : (json['decimal'] != null ? (json['decimal'] is num ? json['decimal'].toDouble() : double.tryParse(json['decimal'].toString())) : null),
      northBoundary: json['northBoundary'],
      southBoundary: json['southBoundary'],
      eastBoundary: json['eastBoundary'],
      westBoundary: json['westBoundary'],
      district: json['district'],
      village: json['village'],
      ownerId: json['ownerId']?.toString(),
      documentsCount: docCount,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'propertyUniqueId': propertyUniqueId,
      'plotNo': plotNo,
      'khataNo': khataNo,
      'acres': acres,
      'decimals': decimals,
      'northBoundary': northBoundary,
      'southBoundary': southBoundary,
      'eastBoundary': eastBoundary,
      'westBoundary': westBoundary,
      'district': district,
      'village': village,
      'ownerId': ownerId,
      'documentsCount': documentsCount,
    };
  }

  /// Returns formatted area string
  String get formattedArea {
    if (acres != null && acres! > 0) {
      return '$acres ऐकर';
    }
    if (decimals != null && decimals! > 0) {
      return '$decimals डिसमिल';
    }
    return 'N/A';
  }
}
