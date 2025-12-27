/// Owner (Person) Model
class Owner {
  final String id;
  final String name;
  final String fatherName;
  final String? gender;
  final String phone;
  final String aadhaar;

  Owner({
    required this.id,
    required this.name,
    required this.fatherName,
    this.gender,
    required this.phone,
    required this.aadhaar,
  });

  factory Owner.fromJson(Map<String, dynamic> json) {
    return Owner(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      fatherName: json['fatherName'] ?? '',
      gender: json['gender'],
      phone: json['phone'] ?? '',
      aadhaar: json['aadhaar'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'fatherName': fatherName,
      'gender': gender,
      'phone': phone,
      'aadhaar': aadhaar,
    };
  }

  /// Returns masked Aadhaar number (XXXX-XXXX-1234)
  String get maskedAadhaar {
    if (aadhaar.length >= 4) {
      return 'XXXX-XXXX-${aadhaar.substring(aadhaar.length - 4)}';
    }
    return aadhaar;
  }
}
