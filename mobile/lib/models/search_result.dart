import 'owner.dart';
import 'property.dart';

/// Search Result Model - Contains owner and their properties
class SearchResult {
  final Owner owner;
  final List<Property> properties;
  final int propertiesCount;

  SearchResult({
    required this.owner,
    required this.properties,
    required this.propertiesCount,
  });

  factory SearchResult.fromJson(Map<String, dynamic> json) {
    final ownerData = json['owner'];
    final propertiesData = json['properties'] as List<dynamic>? ?? [];

    return SearchResult(
      owner: Owner.fromJson(ownerData ?? {}),
      properties: propertiesData
          .map((p) => Property.fromJson(p as Map<String, dynamic>))
          .toList(),
      propertiesCount: json['propertiesCount'] ?? propertiesData.length,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'owner': owner.toJson(),
      'properties': properties.map((p) => p.toJson()).toList(),
      'propertiesCount': propertiesCount,
    };
  }
}
