import 'dart:convert';
import 'dart:math' as math;
import 'package:http/http.dart' as http;

/// Represents a hierarchical administrative unit in the location tree:
/// Country -> State -> District -> Mandal/Taluk -> Town/Village or PIN Code.
class AdministrativeLocation {
  const AdministrativeLocation({
    required this.country,
    required this.state,
    required this.district,
    required this.mandal,
    required this.townOrVillage,
    required this.pincode,
    required this.latitude,
    required this.longitude,
    this.countryCode = 'IN',
    this.isCustomOrEstimated = false,
  });

  final String country;
  final String state;
  final String district;
  final String mandal;
  final String townOrVillage;
  final String pincode;
  final double latitude;
  final double longitude;
  final String countryCode;
  final bool isCustomOrEstimated;

  /// Returns a concise display title (e.g. "Madhapur, Serilingampally").
  String get shortLabel => '$townOrVillage, $mandal';

  /// Returns a detailed hierarchical label with PIN code.
  String get fullLabel => '$townOrVillage, $mandal, $district, $state - $pincode';

  /// Returns full hierarchical breadcrumb path:
  /// "Country > State > District > Mandal > Town (PIN)"
  String get breadcrumb => '$country > $state > $district > $mandal > $townOrVillage ($pincode)';

  /// Returns a compact tag suitable for header pills.
  String get headerTag => '$townOrVillage ($pincode)';

  /// Calculates geodesic distance (in kilometers) from this location to a target coordinate
  /// using the standard Haversine formula.
  double distanceTo(double targetLat, double targetLng) {
    const double earthRadiusKm = 6371.0;
    final double dLat = _degreesToRadians(targetLat - latitude);
    final double dLng = _degreesToRadians(targetLng - longitude);

    final double a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(_degreesToRadians(latitude)) *
            math.cos(_degreesToRadians(targetLat)) *
            math.sin(dLng / 2) *
            math.sin(dLng / 2);

    final double c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  static double _degreesToRadians(double degrees) {
    return degrees * (math.pi / 180.0);
  }

  AdministrativeLocation copyWith({
    String? country,
    String? state,
    String? district,
    String? mandal,
    String? townOrVillage,
    String? pincode,
    double? latitude,
    double? longitude,
    String? countryCode,
    bool? isCustomOrEstimated,
  }) {
    return AdministrativeLocation(
      country: country ?? this.country,
      state: state ?? this.state,
      district: district ?? this.district,
      mandal: mandal ?? this.mandal,
      townOrVillage: townOrVillage ?? this.townOrVillage,
      pincode: pincode ?? this.pincode,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      countryCode: countryCode ?? this.countryCode,
      isCustomOrEstimated: isCustomOrEstimated ?? this.isCustomOrEstimated,
    );
  }

  Map<String, dynamic> toJson() => {
    'country': country,
    'state': state,
    'district': district,
    'mandal': mandal,
    'townOrVillage': townOrVillage,
    'pincode': pincode,
    'latitude': latitude,
    'longitude': longitude,
    'countryCode': countryCode,
    'isCustomOrEstimated': isCustomOrEstimated,
  };

  factory AdministrativeLocation.fromJson(Map<String, dynamic> json) {
    return AdministrativeLocation(
      country: json['country'] as String? ?? 'India',
      state: json['state'] as String? ?? 'Telangana',
      district: json['district'] as String? ?? 'Hyderabad',
      mandal: json['mandal'] as String? ?? 'Serilingampally',
      townOrVillage: json['townOrVillage'] as String? ?? 'Madhapur',
      pincode: json['pincode'] as String? ?? '500081',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 17.4483,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 78.3915,
      countryCode: json['countryCode'] as String? ?? 'IN',
      isCustomOrEstimated: json['isCustomOrEstimated'] as bool? ?? false,
    );
  }

  /// Default seed location: Madhapur, Serilingampally Mandal, Hyderabad.
  static const AdministrativeLocation defaultLocation = AdministrativeLocation(
    country: 'India',
    countryCode: 'IN',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: 'Serilingampally',
    townOrVillage: 'Madhapur',
    pincode: '500081',
    latitude: 17.4483,
    longitude: 78.3915,
  );
}

/// In-memory repository containing authoritative hierarchical administrative divisions
/// for seamless Country -> State -> District -> Mandal -> Town/Village selection and PIN resolution.
class LocationHierarchyRepository {
  LocationHierarchyRepository._();

  static final List<AdministrativeLocation> allLocations = [
    // =========================================================================
    // 🇮🇳 TELANGANA - HYDERABAD DISTRICT
    // =========================================================================
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Serilingampally',
      townOrVillage: 'Madhapur',
      pincode: '500081',
      latitude: 17.4483,
      longitude: 78.3915,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Serilingampally',
      townOrVillage: 'Gachibowli',
      pincode: '500032',
      latitude: 17.4401,
      longitude: 78.3489,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Serilingampally',
      townOrVillage: 'Hitec City',
      pincode: '500081',
      latitude: 17.4435,
      longitude: 78.3772,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Serilingampally',
      townOrVillage: 'Kondapur',
      pincode: '500084',
      latitude: 17.4699,
      longitude: 78.3578,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Serilingampally',
      townOrVillage: 'Financial District',
      pincode: '500075',
      latitude: 17.4156,
      longitude: 78.3427,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Serilingampally',
      townOrVillage: 'Hafeezpet',
      pincode: '500049',
      latitude: 17.4933,
      longitude: 78.3458,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Shaikpet',
      townOrVillage: 'Jubilee Hills',
      pincode: '500033',
      latitude: 17.4319,
      longitude: 78.4073,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Shaikpet',
      townOrVillage: 'Film Nagar',
      pincode: '500096',
      latitude: 17.4150,
      longitude: 78.4110,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Shaikpet',
      townOrVillage: 'Tolichowki',
      pincode: '500008',
      latitude: 17.3995,
      longitude: 78.4167,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Shaikpet',
      townOrVillage: 'Manikonda',
      pincode: '500089',
      latitude: 17.4024,
      longitude: 78.3776,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Khairatabad',
      townOrVillage: 'Banjara Hills',
      pincode: '500034',
      latitude: 17.4156,
      longitude: 78.4350,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Khairatabad',
      townOrVillage: 'Somajiguda',
      pincode: '500082',
      latitude: 17.4265,
      longitude: 78.4578,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Khairatabad',
      townOrVillage: 'Panjagutta',
      pincode: '500082',
      latitude: 17.4278,
      longitude: 78.4489,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Secunderabad',
      townOrVillage: 'Begumpet',
      pincode: '500016',
      latitude: 17.4447,
      longitude: 78.4664,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Secunderabad',
      townOrVillage: 'Paradise / Clock Tower',
      pincode: '500003',
      latitude: 17.4411,
      longitude: 78.4909,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Secunderabad',
      townOrVillage: 'Marredpally',
      pincode: '500026',
      latitude: 17.4475,
      longitude: 78.5100,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Secunderabad',
      townOrVillage: 'Trimulgherry',
      pincode: '500015',
      latitude: 17.4789,
      longitude: 78.5022,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Ameerpet',
      townOrVillage: 'Ameerpet',
      pincode: '500016',
      latitude: 17.4375,
      longitude: 78.4482,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Ameerpet',
      townOrVillage: 'SR Nagar',
      pincode: '500038',
      latitude: 17.4439,
      longitude: 78.4426,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Ameerpet',
      townOrVillage: 'Sanathnagar',
      pincode: '500018',
      latitude: 17.4563,
      longitude: 78.4437,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Charminar',
      townOrVillage: 'Old City (Charminar)',
      pincode: '500002',
      latitude: 17.3616,
      longitude: 78.4747,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Charminar',
      townOrVillage: 'Bahadurpura',
      pincode: '500064',
      latitude: 17.3540,
      longitude: 78.4550,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Himayatnagar',
      townOrVillage: 'Narayanguda',
      pincode: '500029',
      latitude: 17.3985,
      longitude: 78.4901,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      mandal: 'Musheerabad',
      townOrVillage: 'Kavadiguda / Lower Tank Bund',
      pincode: '500080',
      latitude: 17.4120,
      longitude: 78.4950,
    ),

    // =========================================================================
    // 🇮🇳 TELANGANA - MEDCHAL-MALKAJGIRI DISTRICT
    // =========================================================================
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Medchal-Malkajgiri',
      mandal: 'Kukatpally',
      townOrVillage: 'KPHB Colony',
      pincode: '500072',
      latitude: 17.4932,
      longitude: 78.3995,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Medchal-Malkajgiri',
      mandal: 'Kukatpally',
      townOrVillage: 'Nizampet',
      pincode: '500090',
      latitude: 17.5190,
      longitude: 78.3780,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Medchal-Malkajgiri',
      mandal: 'Kukatpally',
      townOrVillage: 'Bachupally',
      pincode: '500090',
      latitude: 17.5348,
      longitude: 78.3664,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Medchal-Malkajgiri',
      mandal: 'Quthbullapur',
      townOrVillage: 'Kompally',
      pincode: '500100',
      latitude: 17.5389,
      longitude: 78.4855,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Medchal-Malkajgiri',
      mandal: 'Quthbullapur',
      townOrVillage: 'Jeedimetla',
      pincode: '500055',
      latitude: 17.5133,
      longitude: 78.4556,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Medchal-Malkajgiri',
      mandal: 'Alwal',
      townOrVillage: 'Alwal Town',
      pincode: '500010',
      latitude: 17.5022,
      longitude: 78.5089,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Medchal-Malkajgiri',
      mandal: 'Alwal',
      townOrVillage: 'Yapral',
      pincode: '500087',
      latitude: 17.5067,
      longitude: 78.5378,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Medchal-Malkajgiri',
      mandal: 'Uppal',
      townOrVillage: 'Uppal',
      pincode: '500039',
      latitude: 17.4010,
      longitude: 78.5600,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Medchal-Malkajgiri',
      mandal: 'Ghatkesar',
      townOrVillage: 'Pocharam / IT Corridor',
      pincode: '500088',
      latitude: 17.4580,
      longitude: 78.6720,
    ),

    // =========================================================================
    // 🇮🇳 TELANGANA - RANGAREDDY DISTRICT
    // =========================================================================
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Rangareddy',
      mandal: 'Rajendranagar',
      townOrVillage: 'Attapur',
      pincode: '500048',
      latitude: 17.3689,
      longitude: 78.4289,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Rangareddy',
      mandal: 'Rajendranagar',
      townOrVillage: 'Shamshabad / RGI Airport',
      pincode: '501218',
      latitude: 17.2403,
      longitude: 78.4294,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Rangareddy',
      mandal: 'Gandipet',
      townOrVillage: 'Narsingi',
      pincode: '500075',
      latitude: 17.3820,
      longitude: 78.3580,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Rangareddy',
      mandal: 'Gandipet',
      townOrVillage: 'Kokapet',
      pincode: '500075',
      latitude: 17.3980,
      longitude: 78.3310,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Rangareddy',
      mandal: 'Saroornagar',
      townOrVillage: 'L.B. Nagar',
      pincode: '500074',
      latitude: 17.3457,
      longitude: 78.5522,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Rangareddy',
      mandal: 'Saroornagar',
      townOrVillage: 'Dilsukhnagar',
      pincode: '500060',
      latitude: 17.3688,
      longitude: 78.5247,
    ),

    // =========================================================================
    // 🇮🇳 TELANGANA - OTHER DISTRICTS (Warangal, Karimnagar, Nizamabad)
    // =========================================================================
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Warangal',
      mandal: 'Hanamkonda',
      townOrVillage: 'Hanamkonda Town',
      pincode: '506001',
      latitude: 17.9950,
      longitude: 79.5600,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Warangal',
      mandal: 'Kazipet',
      townOrVillage: 'Kazipet Junction',
      pincode: '506003',
      latitude: 17.9780,
      longitude: 79.5180,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Karimnagar',
      mandal: 'Karimnagar Urban',
      townOrVillage: 'Karimnagar Main City',
      pincode: '505001',
      latitude: 18.4386,
      longitude: 79.1288,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Telangana',
      district: 'Nizamabad',
      mandal: 'Nizamabad Urban',
      townOrVillage: 'Nizamabad City',
      pincode: '503001',
      latitude: 18.6725,
      longitude: 78.0941,
    ),

    // =========================================================================
    // 🇮🇳 ANDHRA PRADESH (Visakhapatnam, Vijayawada, Guntur, Tirupati)
    // =========================================================================
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Visakhapatnam',
      mandal: 'Visakhapatnam Urban',
      townOrVillage: 'MVP Colony',
      pincode: '530017',
      latitude: 17.7420,
      longitude: 83.3320,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Visakhapatnam',
      mandal: 'Visakhapatnam Urban',
      townOrVillage: 'Gajuwaka',
      pincode: '530026',
      latitude: 17.6900,
      longitude: 83.2100,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Visakhapatnam',
      mandal: 'Visakhapatnam Urban',
      townOrVillage: 'Madhurawada',
      pincode: '530048',
      latitude: 17.8100,
      longitude: 83.3500,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'NTR (Vijayawada)',
      mandal: 'Vijayawada Urban',
      townOrVillage: 'Benz Circle',
      pincode: '520010',
      latitude: 16.5020,
      longitude: 80.6480,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'NTR (Vijayawada)',
      mandal: 'Vijayawada Urban',
      townOrVillage: 'Suryaraopeta',
      pincode: '520002',
      latitude: 16.5110,
      longitude: 80.6280,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      mandal: 'Guntur Urban',
      townOrVillage: 'Brodipet',
      pincode: '522002',
      latitude: 16.3067,
      longitude: 80.4365,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Tirupati',
      mandal: 'Tirupati Urban',
      townOrVillage: 'Alipiri / Bypass',
      pincode: '517501',
      latitude: 13.6520,
      longitude: 79.4010,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Badvel',
      townOrVillage: 'Badvel',
      pincode: '516227',
      latitude: 14.7434,
      longitude: 79.0610,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Badvel',
      townOrVillage: 'Badvel Bazaar',
      pincode: '516227',
      latitude: 14.7400,
      longitude: 79.0580,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Badvel',
      townOrVillage: 'Boyanapalli',
      pincode: '516227',
      latitude: 14.7150,
      longitude: 79.0400,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Badvel',
      townOrVillage: 'Chinthalacheruvu',
      pincode: '516227',
      latitude: 14.7600,
      longitude: 79.0700,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Badvel',
      townOrVillage: 'Ethirajupalli',
      pincode: '516227',
      latitude: 14.7500,
      longitude: 79.0500,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Badvel',
      townOrVillage: 'Gudem',
      pincode: '516227',
      latitude: 14.7300,
      longitude: 79.0800,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Badvel',
      townOrVillage: 'Kamalakur',
      pincode: '516227',
      latitude: 14.7200,
      longitude: 79.0300,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Badvel',
      townOrVillage: 'Mannemavaripalli',
      pincode: '516227',
      latitude: 14.7700,
      longitude: 79.0600,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Badvel',
      townOrVillage: 'Valleruvaripalli',
      pincode: '516227',
      latitude: 14.7450,
      longitude: 79.0900,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Kadapa Urban',
      townOrVillage: 'Kadapa (Cuddapah)',
      pincode: '516001',
      latitude: 14.4673,
      longitude: 78.8242,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Annamayya',
      mandal: 'Rajampet',
      townOrVillage: 'Rajampet',
      pincode: '516115',
      latitude: 14.1923,
      longitude: 79.1583,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Proddatur',
      townOrVillage: 'Proddatur',
      pincode: '516360',
      latitude: 14.7509,
      longitude: 78.5528,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      mandal: 'Pulivendula',
      townOrVillage: 'Pulivendula',
      pincode: '516390',
      latitude: 14.4230,
      longitude: 78.2323,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Annamayya',
      mandal: 'Rayachoti',
      townOrVillage: 'Rayachoti',
      pincode: '516269',
      latitude: 14.0560,
      longitude: 78.7520,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Kurnool',
      mandal: 'Kurnool Urban',
      townOrVillage: 'Kurnool City',
      pincode: '518001',
      latitude: 15.8281,
      longitude: 78.0373,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Nandyal',
      mandal: 'Nandyal Urban',
      townOrVillage: 'Nandyal',
      pincode: '518501',
      latitude: 15.4859,
      longitude: 78.4839,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Anantapur',
      mandal: 'Anantapur Urban',
      townOrVillage: 'Anantapur Town',
      pincode: '515001',
      latitude: 14.6819,
      longitude: 77.6006,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Sri Sathya Sai',
      mandal: 'Hindupur',
      townOrVillage: 'Hindupur',
      pincode: '515201',
      latitude: 13.8290,
      longitude: 77.4930,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'SPSR Nellore',
      mandal: 'Nellore Urban',
      townOrVillage: 'Nellore City',
      pincode: '524001',
      latitude: 14.4426,
      longitude: 79.9865,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Prakasam',
      mandal: 'Ongole Urban',
      townOrVillage: 'Ongole',
      pincode: '523001',
      latitude: 15.5057,
      longitude: 80.0499,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Kakinada',
      mandal: 'Kakinada Urban',
      townOrVillage: 'Kakinada',
      pincode: '533001',
      latitude: 16.9891,
      longitude: 82.2475,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'East Godavari',
      mandal: 'Rajahmundry Urban',
      townOrVillage: 'Rajahmundry',
      pincode: '533101',
      latitude: 17.0005,
      longitude: 81.8040,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'Eluru',
      mandal: 'Eluru Urban',
      townOrVillage: 'Eluru',
      pincode: '534001',
      latitude: 16.7107,
      longitude: 81.0952,
    ),

    // =========================================================================
    // 🇮🇳 KARNATAKA (Bengaluru Urban, Mysuru)
    // =========================================================================
    const AdministrativeLocation(
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      mandal: 'Bengaluru South',
      townOrVillage: 'Koramangala',
      pincode: '560034',
      latitude: 12.9352,
      longitude: 77.6245,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      mandal: 'Bengaluru South',
      townOrVillage: 'HSR Layout',
      pincode: '560102',
      latitude: 12.9121,
      longitude: 77.6446,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      mandal: 'Bengaluru South',
      townOrVillage: 'Indiranagar',
      pincode: '560038',
      latitude: 12.9784,
      longitude: 77.6408,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      mandal: 'Bengaluru East',
      townOrVillage: 'Whitefield',
      pincode: '560066',
      latitude: 12.9698,
      longitude: 77.7499,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      mandal: 'Bengaluru East',
      townOrVillage: 'Bellandur / Outer Ring Rd',
      pincode: '560103',
      latitude: 12.9260,
      longitude: 77.6762,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      mandal: 'Bengaluru North',
      townOrVillage: 'Hebbal',
      pincode: '560024',
      latitude: 13.0358,
      longitude: 77.5970,
    ),

    // =========================================================================
    // 🇮🇳 MAHARASHTRA (Mumbai, Pune)
    // =========================================================================
    const AdministrativeLocation(
      country: 'India',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      mandal: 'Andheri',
      townOrVillage: 'Andheri West',
      pincode: '400053',
      latitude: 19.1363,
      longitude: 72.8277,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      mandal: 'Andheri',
      townOrVillage: 'Andheri East',
      pincode: '400069',
      latitude: 19.1136,
      longitude: 72.8697,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      mandal: 'Bandra',
      townOrVillage: 'Bandra West (BKC Link)',
      pincode: '400050',
      latitude: 19.0596,
      longitude: 72.8295,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune',
      mandal: 'Haveli',
      townOrVillage: 'Hinjawadi IT Park',
      pincode: '411057',
      latitude: 18.5913,
      longitude: 73.7389,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Maharashtra',
      district: 'Pune',
      mandal: 'Haveli',
      townOrVillage: 'Kothrud',
      pincode: '411038',
      latitude: 18.5074,
      longitude: 73.8077,
    ),

    // =========================================================================
    // 🇮🇳 TAMIL NADU (Chennai, Coimbatore)
    // =========================================================================
    const AdministrativeLocation(
      country: 'India',
      state: 'Tamil Nadu',
      district: 'Chennai',
      mandal: 'Guindy',
      townOrVillage: 'Guindy Industrial Estate',
      pincode: '600032',
      latitude: 13.0067,
      longitude: 80.2025,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Tamil Nadu',
      district: 'Chennai',
      mandal: 'Mylapore',
      townOrVillage: 'T. Nagar',
      pincode: '600017',
      latitude: 13.0418,
      longitude: 80.2341,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Tamil Nadu',
      district: 'Chennai',
      mandal: 'Velachery',
      townOrVillage: 'Velachery',
      pincode: '600042',
      latitude: 12.9815,
      longitude: 80.2180,
    ),

    // =========================================================================
    // 🇮🇳 DELHI NCR (New Delhi, Gurugram, Noida)
    // =========================================================================
    const AdministrativeLocation(
      country: 'India',
      state: 'Delhi NCR',
      district: 'New Delhi',
      mandal: 'Connaught Place',
      townOrVillage: 'Connaught Place',
      pincode: '110001',
      latitude: 28.6315,
      longitude: 77.2167,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Delhi NCR',
      district: 'Gurugram',
      mandal: 'Gurugram',
      townOrVillage: 'Cyber Hub / DLF Phase 2',
      pincode: '122002',
      latitude: 28.4950,
      longitude: 77.0895,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Delhi NCR',
      district: 'Gautam Buddha Nagar',
      mandal: 'Noida',
      townOrVillage: 'Sector 62 (IT Hub)',
      pincode: '201301',
      latitude: 28.6258,
      longitude: 77.3688,
    ),

    // =========================================================================
    // 🇮🇳 ALL-INDIA STATES & UNION TERRITORIES (COMPLETE COVERAGE)
    // =========================================================================
    // KERALA
    const AdministrativeLocation(
      country: 'India',
      state: 'Kerala',
      district: 'Ernakulam',
      mandal: 'Kochi',
      townOrVillage: 'Marine Drive / Kakkanad',
      pincode: '682030',
      latitude: 9.9312,
      longitude: 76.2673,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Kerala',
      district: 'Thiruvananthapuram',
      mandal: 'Thiruvananthapuram',
      townOrVillage: 'Technopark / Kazhakkoottam',
      pincode: '695581',
      latitude: 8.5241,
      longitude: 76.9366,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Kerala',
      district: 'Kozhikode',
      mandal: 'Kozhikode',
      townOrVillage: 'Mananchira / Mavoor Road',
      pincode: '673001',
      latitude: 11.2588,
      longitude: 75.7804,
    ),

    // GUJARAT
    const AdministrativeLocation(
      country: 'India',
      state: 'Gujarat',
      district: 'Ahmedabad',
      mandal: 'Daskroi',
      townOrVillage: 'SG Highway / Bodakdev',
      pincode: '380054',
      latitude: 23.0225,
      longitude: 72.5714,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Gujarat',
      district: 'Surat',
      mandal: 'Chorasi',
      townOrVillage: 'Athwa Lines / Vesu',
      pincode: '395007',
      latitude: 21.1702,
      longitude: 72.8311,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Gujarat',
      district: 'Vadodara',
      mandal: 'Vadodara Urban',
      townOrVillage: 'Alkapuri / Sayajigunj',
      pincode: '390007',
      latitude: 22.3072,
      longitude: 73.1812,
    ),

    // RAJASTHAN
    const AdministrativeLocation(
      country: 'India',
      state: 'Rajasthan',
      district: 'Jaipur',
      mandal: 'Jaipur Sadar',
      townOrVillage: 'C-Scheme / Malviya Nagar',
      pincode: '302017',
      latitude: 26.9124,
      longitude: 75.7873,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Rajasthan',
      district: 'Jodhpur',
      mandal: 'Jodhpur',
      townOrVillage: 'Ratanada / Shastri Nagar',
      pincode: '342001',
      latitude: 26.2389,
      longitude: 73.0243,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Rajasthan',
      district: 'Udaipur',
      mandal: 'Girwa',
      townOrVillage: 'Panchwati / City Palace Area',
      pincode: '313001',
      latitude: 24.5854,
      longitude: 73.7125,
    ),

    // UTTAR PRADESH
    const AdministrativeLocation(
      country: 'India',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      mandal: 'Lucknow Sadar',
      townOrVillage: 'Gomti Nagar / Hazratganj',
      pincode: '226010',
      latitude: 26.8467,
      longitude: 80.9462,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      mandal: 'Varanasi Sadar',
      townOrVillage: 'Assi Ghat / Cantt',
      pincode: '221005',
      latitude: 25.3176,
      longitude: 82.9739,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Uttar Pradesh',
      district: 'Kanpur Nagar',
      mandal: 'Kanpur Sadar',
      townOrVillage: 'Civil Lines / Swaroop Nagar',
      pincode: '208001',
      latitude: 26.4499,
      longitude: 80.3319,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Uttar Pradesh',
      district: 'Prayagraj',
      mandal: 'Sadar',
      townOrVillage: 'Civil Lines / Sangam Area',
      pincode: '211001',
      latitude: 25.4358,
      longitude: 81.8463,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Uttar Pradesh',
      district: 'Agra',
      mandal: 'Agra Sadar',
      townOrVillage: 'Tajganj / Sanjay Place',
      pincode: '282001',
      latitude: 27.1767,
      longitude: 78.0081,
    ),

    // WEST BENGAL
    const AdministrativeLocation(
      country: 'India',
      state: 'West Bengal',
      district: 'Kolkata',
      mandal: 'Kolkata South',
      townOrVillage: 'Park Street / Salt Lake Sector V',
      pincode: '700091',
      latitude: 22.5726,
      longitude: 88.3639,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'West Bengal',
      district: 'Darjeeling',
      mandal: 'Darjeeling Sadar',
      townOrVillage: 'Mall Road / Chowrasta',
      pincode: '734101',
      latitude: 27.0410,
      longitude: 88.2663,
    ),

    // PUNJAB
    const AdministrativeLocation(
      country: 'India',
      state: 'Punjab',
      district: 'Ludhiana',
      mandal: 'Ludhiana East',
      townOrVillage: 'Civil Lines / Model Town',
      pincode: '141002',
      latitude: 30.9010,
      longitude: 75.8573,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Punjab',
      district: 'Amritsar',
      mandal: 'Amritsar-I',
      townOrVillage: 'Golden Temple Area / Ranjit Avenue',
      pincode: '143001',
      latitude: 31.6340,
      longitude: 74.8723,
    ),

    // HARYANA
    const AdministrativeLocation(
      country: 'India',
      state: 'Haryana',
      district: 'Gurugram',
      mandal: 'Gurugram',
      townOrVillage: 'Cyber Hub / DLF Phase 2',
      pincode: '122002',
      latitude: 28.4595,
      longitude: 77.0266,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Haryana',
      district: 'Faridabad',
      mandal: 'Faridabad',
      townOrVillage: 'Sector 15 / NIT',
      pincode: '121007',
      latitude: 28.4089,
      longitude: 77.3178,
    ),

    // MADHYA PRADESH
    const AdministrativeLocation(
      country: 'India',
      state: 'Madhya Pradesh',
      district: 'Indore',
      mandal: 'Indore',
      townOrVillage: 'Vijay Nagar / Palasia',
      pincode: '452010',
      latitude: 22.7196,
      longitude: 75.8577,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Madhya Pradesh',
      district: 'Bhopal',
      mandal: 'Huzur',
      townOrVillage: 'Arera Colony / MP Nagar',
      pincode: '462016',
      latitude: 23.2599,
      longitude: 77.4126,
    ),

    // BIHAR
    const AdministrativeLocation(
      country: 'India',
      state: 'Bihar',
      district: 'Patna',
      mandal: 'Patna Sadar',
      townOrVillage: 'Boring Road / Fraser Road',
      pincode: '800001',
      latitude: 25.5941,
      longitude: 85.1376,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Bihar',
      district: 'Gaya',
      mandal: 'Gaya Town',
      townOrVillage: 'Bodh Gaya / Civil Lines',
      pincode: '824231',
      latitude: 24.7914,
      longitude: 85.0002,
    ),

    // ODISHA
    const AdministrativeLocation(
      country: 'India',
      state: 'Odisha',
      district: 'Khordha',
      mandal: 'Bhubaneswar',
      townOrVillage: 'Patia (Infocity) / Saheed Nagar',
      pincode: '751024',
      latitude: 20.2961,
      longitude: 85.8245,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Odisha',
      district: 'Puri',
      mandal: 'Puri Sadar',
      townOrVillage: 'Grand Road / Sea Beach',
      pincode: '752001',
      latitude: 19.8135,
      longitude: 85.8312,
    ),

    // ASSAM
    const AdministrativeLocation(
      country: 'India',
      state: 'Assam',
      district: 'Kamrup Metropolitan',
      mandal: 'Guwahati',
      townOrVillage: 'GS Road / Dispur Capital',
      pincode: '781005',
      latitude: 26.1445,
      longitude: 91.7362,
    ),

    // JHARKHAND
    const AdministrativeLocation(
      country: 'India',
      state: 'Jharkhand',
      district: 'Ranchi',
      mandal: 'Ranchi Sadar',
      townOrVillage: 'Main Road / Morabadi',
      pincode: '834001',
      latitude: 23.3441,
      longitude: 85.3096,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Jharkhand',
      district: 'East Singhbhum',
      mandal: 'Jamshedpur',
      townOrVillage: 'Bistupur / Sakchi',
      pincode: '831001',
      latitude: 22.8046,
      longitude: 86.2029,
    ),

    // CHHATTISGARH
    const AdministrativeLocation(
      country: 'India',
      state: 'Chhattisgarh',
      district: 'Raipur',
      mandal: 'Raipur',
      townOrVillage: 'Pandri / Shankar Nagar',
      pincode: '492001',
      latitude: 21.2514,
      longitude: 81.6296,
    ),

    // UTTARAKHAND
    const AdministrativeLocation(
      country: 'India',
      state: 'Uttarakhand',
      district: 'Dehradun',
      mandal: 'Dehradun Sadar',
      townOrVillage: 'Rajpur Road / Mussoorie Diversion',
      pincode: '248001',
      latitude: 30.3165,
      longitude: 78.0322,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Uttarakhand',
      district: 'Nainital',
      mandal: 'Nainital',
      townOrVillage: 'Mallital / Tallital',
      pincode: '263001',
      latitude: 29.3919,
      longitude: 79.4542,
    ),

    // HIMACHAL PRADESH
    const AdministrativeLocation(
      country: 'India',
      state: 'Himachal Pradesh',
      district: 'Shimla',
      mandal: 'Shimla Urban',
      townOrVillage: 'The Mall / Ridge',
      pincode: '171001',
      latitude: 31.1048,
      longitude: 77.1734,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Himachal Pradesh',
      district: 'Kullu',
      mandal: 'Manali',
      townOrVillage: 'Mall Road Manali / Old Manali',
      pincode: '175131',
      latitude: 32.2432,
      longitude: 77.1892,
    ),

    // GOA
    const AdministrativeLocation(
      country: 'India',
      state: 'Goa',
      district: 'North Goa',
      mandal: 'Tiswadi',
      townOrVillage: 'Panaji / Miramar',
      pincode: '403001',
      latitude: 15.4909,
      longitude: 73.8278,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Goa',
      district: 'South Goa',
      mandal: 'Salcete',
      townOrVillage: 'Margao / Colva',
      pincode: '403601',
      latitude: 15.2832,
      longitude: 73.9862,
    ),

    // JAMMU AND KASHMIR & LADAKH
    const AdministrativeLocation(
      country: 'India',
      state: 'Jammu and Kashmir',
      district: 'Srinagar',
      mandal: 'Srinagar Central',
      townOrVillage: 'Lal Chowk / Dal Lake Boulevard',
      pincode: '190001',
      latitude: 34.0837,
      longitude: 74.7973,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Jammu and Kashmir',
      district: 'Jammu',
      mandal: 'Jammu South',
      townOrVillage: 'Gandhi Nagar / Bahu Plaza',
      pincode: '180004',
      latitude: 32.7266,
      longitude: 74.8570,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Ladakh',
      district: 'Leh',
      mandal: 'Leh',
      townOrVillage: 'Main Bazaar Leh',
      pincode: '194101',
      latitude: 34.1526,
      longitude: 77.5771,
    ),

    // CHANDIGARH
    const AdministrativeLocation(
      country: 'India',
      state: 'Chandigarh',
      district: 'Chandigarh',
      mandal: 'Chandigarh',
      townOrVillage: 'Sector 17 / Sector 35',
      pincode: '160017',
      latitude: 30.7333,
      longitude: 76.7794,
    ),

    // NORTH EAST STATES
    const AdministrativeLocation(
      country: 'India',
      state: 'Tripura',
      district: 'West Tripura',
      mandal: 'Agartala',
      townOrVillage: 'Agartala Main / Palace Compound',
      pincode: '799001',
      latitude: 23.8315,
      longitude: 91.2868,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Meghalaya',
      district: 'East Khasi Hills',
      mandal: 'Shillong',
      townOrVillage: 'Police Bazar / Laitumkhrah',
      pincode: '793001',
      latitude: 25.5788,
      longitude: 91.8933,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Manipur',
      district: 'Imphal West',
      mandal: 'Imphal',
      townOrVillage: 'Thangal Bazar / Kangla',
      pincode: '795001',
      latitude: 24.8170,
      longitude: 93.9368,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Nagaland',
      district: 'Kohima',
      mandal: 'Kohima',
      townOrVillage: 'Main Town / PR Hill',
      pincode: '797001',
      latitude: 25.6751,
      longitude: 94.1086,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Mizoram',
      district: 'Aizawl',
      mandal: 'Aizawl',
      townOrVillage: 'Zarkawt / Dawrpui',
      pincode: '796001',
      latitude: 23.7271,
      longitude: 92.7176,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Arunachal Pradesh',
      district: 'Papum Pare',
      mandal: 'Itanagar',
      townOrVillage: 'Ganga Market / Secretariat Area',
      pincode: '791111',
      latitude: 27.0844,
      longitude: 93.6053,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Sikkim',
      district: 'Gangtok',
      mandal: 'Gangtok',
      townOrVillage: 'MG Marg / Deorali',
      pincode: '737101',
      latitude: 27.3389,
      longitude: 88.6065,
    ),

    // UNION TERRITORIES
    const AdministrativeLocation(
      country: 'India',
      state: 'Puducherry',
      district: 'Puducherry',
      mandal: 'Puducherry',
      townOrVillage: 'White Town / Promenade Beach',
      pincode: '605001',
      latitude: 11.9416,
      longitude: 79.8083,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Andaman and Nicobar Islands',
      district: 'South Andaman',
      mandal: 'Port Blair',
      townOrVillage: 'Aberdeen Bazaar / Marina Park',
      pincode: '744101',
      latitude: 11.6234,
      longitude: 92.7265,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Dadra and Nagar Haveli and Daman and Diu',
      district: 'Daman',
      mandal: 'Daman',
      townOrVillage: 'Nani Daman / Devka Beach',
      pincode: '396210',
      latitude: 20.3974,
      longitude: 72.8328,
    ),
    const AdministrativeLocation(
      country: 'India',
      state: 'Lakshadweep',
      district: 'Lakshadweep',
      mandal: 'Kavaratti',
      townOrVillage: 'Kavaratti Island',
      pincode: '682555',
      latitude: 10.5669,
      longitude: 72.6420,
    ),

    // =========================================================================
    // 🌍 INTERNATIONAL DESTINATIONS (For global travelers & event planners)
    // =========================================================================
    const AdministrativeLocation(
      country: 'United Arab Emirates',
      countryCode: 'AE',
      state: 'Dubai',
      district: 'Dubai',
      mandal: 'Downtown',
      townOrVillage: 'Downtown Dubai / Burj Khalifa',
      pincode: '00000',
      latitude: 25.1972,
      longitude: 55.2744,
    ),
    const AdministrativeLocation(
      country: 'United States',
      countryCode: 'US',
      state: 'California',
      district: 'Santa Clara',
      mandal: 'Silicon Valley',
      townOrVillage: 'San Jose / Sunnyvale',
      pincode: '95113',
      latitude: 37.3382,
      longitude: -121.8863,
    ),
    const AdministrativeLocation(
      country: 'United Kingdom',
      countryCode: 'GB',
      state: 'England',
      district: 'Greater London',
      mandal: 'City of London',
      townOrVillage: 'Central London',
      pincode: 'EC1A',
      latitude: 51.5074,
      longitude: -0.1278,
    ),
    const AdministrativeLocation(
      country: 'Singapore',
      countryCode: 'SG',
      state: 'Central Region',
      district: 'Marina Bay',
      mandal: 'Downtown Core',
      townOrVillage: 'Marina Bay Sands',
      pincode: '018956',
      latitude: 1.2847,
      longitude: 103.8610,
    ),
  ];

  /// Get distinct countries.
  static List<String> getCountries() {
    return allLocations.map((l) => l.country).toSet().toList();
  }

  /// Get distinct states for a given country.
  static List<String> getStates(String country) {
    return allLocations
        .where((l) => l.country.toLowerCase() == country.toLowerCase())
        .map((l) => l.state)
        .toSet()
        .toList();
  }

  /// Get distinct districts for a given state.
  static List<String> getDistricts(String state) {
    return allLocations
        .where((l) => l.state.toLowerCase() == state.toLowerCase())
        .map((l) => l.district)
        .toSet()
        .toList();
  }

  /// Get distinct mandals for a given state and district.
  static List<String> getMandals(String state, String district) {
    return allLocations
        .where((l) =>
            l.state.toLowerCase() == state.toLowerCase() &&
            l.district.toLowerCase() == district.toLowerCase())
        .map((l) => l.mandal)
        .toSet()
        .toList();
  }

  /// Get distinct towns/villages for a given state, district, and mandal.
  static List<AdministrativeLocation> getTowns(
    String state,
    String district,
    String mandal,
  ) {
    return allLocations
        .where((l) =>
            l.state.toLowerCase() == state.toLowerCase() &&
            l.district.toLowerCase() == district.toLowerCase() &&
            l.mandal.toLowerCase() == mandal.toLowerCase())
        .toList();
  }

  static final Map<String, AdministrativeLocation> _dynamicLocationCache = {};

  /// Searches for matching locations across PIN code, town, mandal, district, and state.
  static List<AdministrativeLocation> search(String query) {
    final clean = query.trim().toLowerCase();
    if (clean.isEmpty) return [];

    // Check dynamic cache first
    final cached = _dynamicLocationCache.values
        .where((l) =>
            l.pincode.startsWith(clean) ||
            l.townOrVillage.toLowerCase().contains(clean) ||
            l.mandal.toLowerCase().contains(clean) ||
            l.district.toLowerCase().contains(clean) ||
            l.state.toLowerCase().contains(clean))
        .toList();

    // Exact or prefix PIN search priority
    final pinMatches = allLocations.where((l) => l.pincode.startsWith(clean)).toList();
    final combinedPin = [...pinMatches, ...cached.where((c) => c.pincode.startsWith(clean))];
    if (clean.length >= 3 && combinedPin.isNotEmpty) {
      return _deduplicate(combinedPin);
    }

    // Keyword search across hierarchical names
    final textMatches = allLocations.where((l) {
      return l.pincode.contains(clean) ||
          l.townOrVillage.toLowerCase().contains(clean) ||
          l.mandal.toLowerCase().contains(clean) ||
          l.district.toLowerCase().contains(clean) ||
          l.state.toLowerCase().contains(clean);
    }).toList();

    final allMatches = _deduplicate([...textMatches, ...cached]);
    if (allMatches.isNotEmpty) {
      return allMatches;
    }

    // If query is a 6-digit PIN code and no exact match is found yet,
    // infer immediate accurate location so search NEVER returns 0 results!
    if (RegExp(r'^\d{6}$').hasMatch(clean)) {
      final inferred = _inferFromPin(clean);
      return [inferred];
    }

    return [];
  }

  /// Resolves any 6-digit Indian PIN code synchronously with fallback.
  static AdministrativeLocation resolveOrEstimatePin(String pin) {
    final clean = pin.trim();
    if (_dynamicLocationCache.containsKey(clean)) {
      return _dynamicLocationCache[clean]!;
    }
    final exact = allLocations.firstWhere(
      (l) => l.pincode == clean,
      orElse: () => _inferFromPin(clean),
    );
    return exact;
  }

  /// Real-time asynchronous search supporting PIN code, town, village, area, colony, ward, or street.
  /// Resolves to correct latitude and longitude across all India.
  static Future<List<AdministrativeLocation>> searchAsync(String query) async {
    final clean = query.trim();
    if (clean.isEmpty) return [];

    final localResults = search(clean);

    // If 6 digits, resolve full PIN and all post offices
    if (RegExp(r'^\d{6}$').hasMatch(clean)) {
      try {
        final offices = await fetchPincodeOffices(clean);
        if (offices.isNotEmpty) {
          for (final o in offices) {
            _dynamicLocationCache['${o.townOrVillage}-${o.pincode}'] = o;
          }
          return offices;
        }
      } catch (_) {}
      final pinResult = await resolvePinAsync(clean);
      return [pinResult];
    }

    // If text query, perform online geocoding query
    if (clean.length >= 2) {
      try {
        final onlineResults = await _queryOnlineGeocoding(clean);
        if (onlineResults.isNotEmpty) {
          for (final loc in onlineResults) {
            _dynamicLocationCache['${loc.townOrVillage}-${loc.pincode}'] = loc;
          }
          return _deduplicate([...onlineResults, ...localResults]);
        }
      } catch (_) {}
    }

    return localResults;
  }

  /// Resolves any 6-digit Indian PIN code to exact coordinates,
  /// post office, mandal, district, and state using live directory lookups.
  static Future<AdministrativeLocation> resolvePinAsync(String pin) async {
    final clean = pin.trim();
    if (_dynamicLocationCache.containsKey(clean)) {
      return _dynamicLocationCache[clean]!;
    }

    // Check local catalog
    final localMatch = allLocations.where((l) => l.pincode == clean).firstOrNull;
    if (localMatch != null && !localMatch.isCustomOrEstimated) {
      _dynamicLocationCache[clean] = localMatch;
      return localMatch;
    }

    // Query backend or India Post + Nominatim
    try {
      final client = http.Client();

      // 1. Try local backend
      try {
        final res = await client
            .get(Uri.parse('/api/location/pincode/$clean'))
            .timeout(const Duration(seconds: 3));
        if (res.statusCode == 200) {
          final data = jsonDecode(res.body);
          if (data['success'] == true) {
            final loc = AdministrativeLocation(
              country: data['country'] ?? 'India',
              state: data['state'] ?? 'India',
              district: data['district'] ?? '',
              mandal: data['mandal'] ?? '',
              townOrVillage: data['townOrVillage'] ?? 'PIN $clean',
              pincode: clean,
              latitude: (data['latitude'] as num?)?.toDouble() ?? 0.0,
              longitude: (data['longitude'] as num?)?.toDouble() ?? 0.0,
              isCustomOrEstimated: false,
            );
            if (loc.latitude != 0.0) {
              _dynamicLocationCache[clean] = loc;
              return loc;
            }
          }
        }
      } catch (_) {}

      // 2. Direct India Post API
      final postalRes = await client
          .get(Uri.parse('https://api.postalpincode.in/pincode/$clean'))
          .timeout(const Duration(seconds: 4));
      if (postalRes.statusCode == 200) {
        final postalData = jsonDecode(postalRes.body);
        if (postalData is List &&
            postalData.isNotEmpty &&
            postalData[0]['Status'] == 'Success' &&
            postalData[0]['PostOffice'] is List) {
          final offices = postalData[0]['PostOffice'] as List;
          final primary = offices[0];
          final state = primary['State']?.toString() ?? 'India';
          final district = primary['District']?.toString() ?? '';
          final block = primary['Block']?.toString();
          final mandal = (block != null && block != 'NA') ? block : district;
          final name = primary['Name']?.toString() ?? 'PIN $clean';

          double lat = 0.0;
          double lon = 0.0;
          try {
            final nomRes = await client
                .get(
                  Uri.parse(
                      'https://nominatim.openstreetmap.org/search?postalcode=$clean&country=India&format=json'),
                  headers: {'User-Agent': 'BookMySpace-App/1.0'},
                )
                .timeout(const Duration(seconds: 3));
            if (nomRes.statusCode == 200) {
              final nomData = jsonDecode(nomRes.body);
              if (nomData is List && nomData.isNotEmpty) {
                lat = double.tryParse(nomData[0]['lat']?.toString() ?? '') ?? 0.0;
                lon = double.tryParse(nomData[0]['lon']?.toString() ?? '') ?? 0.0;
              }
            }
          } catch (_) {}

          if (lat == 0.0) {
            final fb = _inferFromPin(clean);
            lat = fb.latitude;
            lon = fb.longitude;
          }

          final loc = AdministrativeLocation(
            country: 'India',
            state: state,
            district: district,
            mandal: mandal,
            townOrVillage: name,
            pincode: clean,
            latitude: lat,
            longitude: lon,
            isCustomOrEstimated: false,
          );
          _dynamicLocationCache[clean] = loc;
          return loc;
        }
      }
    } catch (_) {}

    final inferred = _inferFromPin(clean);
    _dynamicLocationCache[clean] = inferred;
    return inferred;
  }

  /// Fetches all post offices associated with a PIN code.
  static Future<List<AdministrativeLocation>> fetchPincodeOffices(String pin) async {
    final clean = pin.trim();
    final client = http.Client();

    // 1. Try local backend first
    try {
      final res = await client
          .get(Uri.parse('/api/location/pincode/$clean'))
          .timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['success'] == true && data['offices'] is List) {
          final List offices = data['offices'];
          final lat = (data['latitude'] as num?)?.toDouble() ?? 0.0;
          final lng = (data['longitude'] as num?)?.toDouble() ?? 0.0;
          return offices.map((o) {
            return AdministrativeLocation(
              country: 'India',
              state: o['state']?.toString() ?? data['state'] ?? 'India',
              district: o['district']?.toString() ?? data['district'] ?? '',
              mandal: o['mandal']?.toString() ?? data['mandal'] ?? '',
              townOrVillage: o['name']?.toString() ?? '',
              pincode: clean,
              latitude: (o['latitude'] as num?)?.toDouble() ?? lat,
              longitude: (o['longitude'] as num?)?.toDouble() ?? lng,
              isCustomOrEstimated: false,
            );
          }).toList();
        }
      }
    } catch (_) {}

    // 2. Direct India Post API
    try {
      final postalRes = await client
          .get(Uri.parse('https://api.postalpincode.in/pincode/$clean'))
          .timeout(const Duration(seconds: 4));
      if (postalRes.statusCode == 200) {
        final postalData = jsonDecode(postalRes.body);
        if (postalData is List &&
            postalData.isNotEmpty &&
            postalData[0]['Status'] == 'Success' &&
            postalData[0]['PostOffice'] is List) {
          final offices = postalData[0]['PostOffice'] as List;

          // Query coordinates
          double lat = 0.0;
          double lon = 0.0;
          try {
            final nomRes = await client
                .get(
                  Uri.parse(
                      'https://nominatim.openstreetmap.org/search?postalcode=$clean&country=India&format=json'),
                  headers: {'User-Agent': 'BookMySpace-App/1.0'},
                )
                .timeout(const Duration(seconds: 3));
            if (nomRes.statusCode == 200) {
              final nomData = jsonDecode(nomRes.body);
              if (nomData is List && nomData.isNotEmpty) {
                lat = double.tryParse(nomData[0]['lat']?.toString() ?? '') ?? 0.0;
                lon = double.tryParse(nomData[0]['lon']?.toString() ?? '') ?? 0.0;
              }
            }
          } catch (_) {}

          if (lat == 0.0) {
            final fb = _inferFromPin(clean);
            lat = fb.latitude;
            lon = fb.longitude;
          }

          return offices.map((o) {
            final state = o['State']?.toString() ?? 'India';
            final district = o['District']?.toString() ?? '';
            final block = o['Block']?.toString();
            final mandal = (block != null && block != 'NA') ? block : district;
            final name = o['Name']?.toString() ?? 'PIN $clean';
            return AdministrativeLocation(
              country: 'India',
              state: state,
              district: district,
              mandal: mandal,
              townOrVillage: name,
              pincode: clean,
              latitude: lat,
              longitude: lon,
              isCustomOrEstimated: false,
            );
          }).toList();
        }
      }
    } catch (_) {}

    return [];
  }

  /// Online geocoding query across Nominatim and backend
  static Future<List<AdministrativeLocation>> _queryOnlineGeocoding(String query) async {
    final client = http.Client();
    final results = <AdministrativeLocation>[];

    // 1. Try local backend search
    try {
      final res = await client
          .get(Uri.parse('/api/location/search?q=${Uri.encodeComponent(query)}'))
          .timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['success'] == true && data['results'] is List) {
          final List list = data['results'];
          for (final item in list) {
            final lat = (item['latitude'] as num?)?.toDouble() ?? 0.0;
            final lng = (item['longitude'] as num?)?.toDouble() ?? 0.0;
            if (lat != 0.0 && lng != 0.0) {
              results.add(AdministrativeLocation(
                country: item['country']?.toString() ?? 'India',
                state: item['state']?.toString() ?? 'India',
                district: item['district']?.toString() ?? '',
                mandal: item['mandal']?.toString() ?? '',
                townOrVillage: item['townOrVillage']?.toString() ?? query,
                pincode: item['pincode']?.toString() ?? '',
                latitude: lat,
                longitude: lng,
                isCustomOrEstimated: false,
              ));
            }
          }
          if (results.isNotEmpty) return results;
        }
      }
    } catch (_) {}

    // 2. Direct Nominatim OpenStreetMap query
    try {
      final nomUrl =
          'https://nominatim.openstreetmap.org/search?format=json&q=${Uri.encodeComponent('$query, India')}&addressdetails=1&limit=10';
      final nomRes = await client
          .get(Uri.parse(nomUrl), headers: {'User-Agent': 'BookMySpace-App/1.0'})
          .timeout(const Duration(seconds: 4));
      if (nomRes.statusCode == 200) {
        final nomData = jsonDecode(nomRes.body);
        if (nomData is List) {
          for (final item in nomData) {
            final addr = item['address'] as Map<String, dynamic>? ?? {};
            final townOrVillage = addr['village']?.toString() ??
                addr['town']?.toString() ??
                addr['city']?.toString() ??
                addr['suburb']?.toString() ??
                addr['neighbourhood']?.toString() ??
                addr['road']?.toString() ??
                item['name']?.toString() ??
                query;
            final mandal = addr['county']?.toString() ??
                addr['city_district']?.toString() ??
                addr['suburb']?.toString() ??
                addr['neighbourhood']?.toString() ??
                addr['road']?.toString() ??
                townOrVillage;
            final district = addr['state_district']?.toString() ??
                addr['county']?.toString() ??
                addr['city']?.toString() ??
                '';
            final state = addr['state']?.toString() ?? 'India';
            final pincode = addr['postcode']?.toString() ?? '';
            final lat = double.tryParse(item['lat']?.toString() ?? '') ?? 0.0;
            final lon = double.tryParse(item['lon']?.toString() ?? '') ?? 0.0;

            if (lat != 0.0 && lon != 0.0) {
              results.add(AdministrativeLocation(
                country: 'India',
                state: state,
                district: district,
                mandal: mandal,
                townOrVillage: townOrVillage,
                pincode: pincode,
                latitude: lat,
                longitude: lon,
                isCustomOrEstimated: false,
              ));
            }
          }
        }
      }
    } catch (_) {}

    return results;
  }

  static List<AdministrativeLocation> _deduplicate(List<AdministrativeLocation> list) {
    final seen = <String>{};
    final unique = <AdministrativeLocation>[];
    for (final item in list) {
      final key = '${item.townOrVillage.toLowerCase()}_${item.pincode}_${item.latitude.toStringAsFixed(3)}';
      if (!seen.contains(key)) {
        seen.add(key);
        unique.add(item);
      }
    }
    return unique;
  }

  static AdministrativeLocation _inferFromPin(String pin) {
    if (pin.length < 2) {
      return AdministrativeLocation.defaultLocation;
    }
    final prefix2 = pin.substring(0, 2);

    switch (prefix2) {
      // 🇮🇳 ZONE 1 (NORTH)
      case '11':
        return AdministrativeLocation(
          country: 'India',
          state: 'Delhi (NCT)',
          district: 'New Delhi',
          mandal: 'Delhi Postal Zone $prefix2',
          townOrVillage: 'Delhi PIN $pin',
          pincode: pin,
          latitude: 28.6139,
          longitude: 77.2090,
          isCustomOrEstimated: true,
        );
      case '12':
      case '13':
        return AdministrativeLocation(
          country: 'India',
          state: 'Haryana',
          district: prefix2 == '12' ? 'Gurugram / Faridabad' : 'Ambala / Panipat',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Haryana PIN $pin',
          pincode: pin,
          latitude: 28.4595,
          longitude: 77.0266,
          isCustomOrEstimated: true,
        );
      case '14':
      case '15':
        return AdministrativeLocation(
          country: 'India',
          state: 'Punjab',
          district: prefix2 == '14' ? 'Ludhiana / Amritsar' : 'Bathinda / Firozpur',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Punjab PIN $pin',
          pincode: pin,
          latitude: 31.1471,
          longitude: 75.3412,
          isCustomOrEstimated: true,
        );
      case '16':
        return AdministrativeLocation(
          country: 'India',
          state: 'Chandigarh',
          district: 'Chandigarh',
          mandal: 'Chandigarh',
          townOrVillage: 'Sector PIN $pin',
          pincode: pin,
          latitude: 30.7333,
          longitude: 76.7794,
          isCustomOrEstimated: true,
        );
      case '17':
        return AdministrativeLocation(
          country: 'India',
          state: 'Himachal Pradesh',
          district: 'Shimla / Kangra',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Himachal PIN $pin',
          pincode: pin,
          latitude: 31.1048,
          longitude: 77.1734,
          isCustomOrEstimated: true,
        );
      case '18':
      case '19':
        return AdministrativeLocation(
          country: 'India',
          state: 'Jammu and Kashmir',
          district: prefix2 == '18' ? 'Jammu' : 'Srinagar',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'J&K PIN $pin',
          pincode: pin,
          latitude: 34.0837,
          longitude: 74.7973,
          isCustomOrEstimated: true,
        );

      // 🇮🇳 ZONE 2 (NORTH-CENTRAL)
      case '20':
      case '21':
      case '22':
      case '23':
      case '24':
      case '25':
      case '26':
      case '27':
      case '28':
        final isUttarakhand = prefix2 == '24' || prefix2 == '26';
        return AdministrativeLocation(
          country: 'India',
          state: isUttarakhand ? 'Uttarakhand' : 'Uttar Pradesh',
          district: isUttarakhand ? 'Dehradun / Nainital' : 'Lucknow / Kanpur / Varanasi',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Locality PIN $pin',
          pincode: pin,
          latitude: isUttarakhand ? 30.3165 : 26.8467,
          longitude: isUttarakhand ? 78.0322 : 80.9462,
          isCustomOrEstimated: true,
        );

      // 🇮🇳 ZONE 3 (WEST)
      case '30':
      case '31':
      case '32':
      case '33':
      case '34':
        return AdministrativeLocation(
          country: 'India',
          state: 'Rajasthan',
          district: prefix2 == '30' ? 'Jaipur' : prefix2 == '34' ? 'Jodhpur' : 'Udaipur / Kota',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Rajasthan PIN $pin',
          pincode: pin,
          latitude: 26.9124,
          longitude: 75.7873,
          isCustomOrEstimated: true,
        );
      case '36':
      case '37':
      case '38':
      case '39':
        return AdministrativeLocation(
          country: 'India',
          state: 'Gujarat',
          district: prefix2 == '38' ? 'Ahmedabad' : prefix2 == '39' ? 'Surat / Vadodara' : 'Rajkot / Kutch',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Gujarat PIN $pin',
          pincode: pin,
          latitude: 23.0225,
          longitude: 72.5714,
          isCustomOrEstimated: true,
        );

      // 🇮🇳 ZONE 4 (WEST & CENTRAL)
      case '40':
      case '41':
      case '42':
      case '43':
      case '44':
        final isGoa = prefix2 == '40' && (pin.startsWith('403'));
        return AdministrativeLocation(
          country: 'India',
          state: isGoa ? 'Goa' : 'Maharashtra',
          district: isGoa ? 'North / South Goa' : (prefix2 == '40' ? 'Mumbai / Thane' : prefix2 == '41' ? 'Pune' : 'Nagpur / Nashik'),
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Locality PIN $pin',
          pincode: pin,
          latitude: isGoa ? 15.4909 : 19.0760,
          longitude: isGoa ? 73.8278 : 72.8777,
          isCustomOrEstimated: true,
        );
      case '45':
      case '46':
      case '47':
      case '48':
        return AdministrativeLocation(
          country: 'India',
          state: 'Madhya Pradesh',
          district: prefix2 == '45' ? 'Indore' : prefix2 == '46' ? 'Bhopal' : 'Gwalior / Jabalpur',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'MP PIN $pin',
          pincode: pin,
          latitude: 22.7196,
          longitude: 75.8577,
          isCustomOrEstimated: true,
        );
      case '49':
        return AdministrativeLocation(
          country: 'India',
          state: 'Chhattisgarh',
          district: 'Raipur / Bilaspur / Durg',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Chhattisgarh PIN $pin',
          pincode: pin,
          latitude: 21.2514,
          longitude: 81.6296,
          isCustomOrEstimated: true,
        );

      // 🇮🇳 ZONE 5 (SOUTH)
      case '50':
        return AdministrativeLocation(
          country: 'India',
          state: 'Telangana',
          district: 'Hyderabad Region',
          mandal: 'Postal Zone $prefix2',
          townOrVillage: 'Area PIN $pin',
          pincode: pin,
          latitude: 17.3850,
          longitude: 78.4867,
          isCustomOrEstimated: true,
        );
      case '51':
        final prefix3_51 = pin.length >= 3 ? pin.substring(0, 3) : '516';
        if (prefix3_51 == '515') {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'Anantapur / Sri Sathya Sai',
            mandal: 'Anantapur Urban',
            townOrVillage: 'Anantapur PIN $pin',
            pincode: pin,
            latitude: 14.6819,
            longitude: 77.6006,
            isCustomOrEstimated: true,
          );
        } else if (prefix3_51 == '516') {
          final isBadvel = pin == '516227';
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'YSR Kadapa',
            mandal: isBadvel
                ? 'Badvel'
                : pin.startsWith('5161')
                    ? 'Rajampet'
                    : pin.startsWith('5163')
                        ? 'Proddatur'
                        : 'Kadapa Urban',
            townOrVillage: isBadvel
                ? 'Badvel'
                : pin.startsWith('5161')
                    ? 'Rajampet'
                    : 'Kadapa Area ($pin)',
            pincode: pin,
            latitude: isBadvel ? 14.7434 : 14.4673,
            longitude: isBadvel ? 79.0610 : 78.8242,
            isCustomOrEstimated: !isBadvel,
          );
        } else if (prefix3_51 == '517') {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'Tirupati / Chittoor',
            mandal: 'Tirupati Urban',
            townOrVillage: 'Tirupati PIN $pin',
            pincode: pin,
            latitude: 13.6288,
            longitude: 79.4192,
            isCustomOrEstimated: true,
          );
        } else {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'Kurnool / Nandyal',
            mandal: 'Kurnool Urban',
            townOrVillage: 'Kurnool PIN $pin',
            pincode: pin,
            latitude: 15.8281,
            longitude: 78.0373,
            isCustomOrEstimated: true,
          );
        }

      case '52':
        final prefix3_52 = pin.length >= 3 ? pin.substring(0, 3) : '520';
        if (prefix3_52 == '520' || prefix3_52 == '521') {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'NTR (Vijayawada) / Krishna',
            mandal: 'Vijayawada Urban',
            townOrVillage: 'Vijayawada PIN $pin',
            pincode: pin,
            latitude: 16.5062,
            longitude: 80.6480,
            isCustomOrEstimated: true,
          );
        } else if (prefix3_52 == '522') {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'Guntur / Palnadu',
            mandal: 'Guntur Urban',
            townOrVillage: 'Guntur PIN $pin',
            pincode: pin,
            latitude: 16.3067,
            longitude: 80.4365,
            isCustomOrEstimated: true,
          );
        } else if (prefix3_52 == '523') {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'Prakasam (Ongole)',
            mandal: 'Ongole Urban',
            townOrVillage: 'Ongole PIN $pin',
            pincode: pin,
            latitude: 15.5057,
            longitude: 80.0499,
            isCustomOrEstimated: true,
          );
        } else {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'SPSR Nellore',
            mandal: 'Nellore Urban',
            townOrVillage: 'Nellore PIN $pin',
            pincode: pin,
            latitude: 14.4426,
            longitude: 79.9865,
            isCustomOrEstimated: true,
          );
        }

      case '53':
        final prefix3_53 = pin.length >= 3 ? pin.substring(0, 3) : '530';
        if (prefix3_53 == '530' || prefix3_53 == '531') {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'Visakhapatnam / Anakapalle',
            mandal: 'Visakhapatnam Urban',
            townOrVillage: 'Vizag PIN $pin',
            pincode: pin,
            latitude: 17.6868,
            longitude: 83.2185,
            isCustomOrEstimated: true,
          );
        } else if (prefix3_53 == '532') {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'Srikakulam',
            mandal: 'Srikakulam Urban',
            townOrVillage: 'Srikakulam PIN $pin',
            pincode: pin,
            latitude: 18.2949,
            longitude: 83.8938,
            isCustomOrEstimated: true,
          );
        } else if (prefix3_53 == '533') {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'Kakinada / East Godavari',
            mandal: 'Kakinada Urban',
            townOrVillage: 'Kakinada PIN $pin',
            pincode: pin,
            latitude: 16.9891,
            longitude: 82.2475,
            isCustomOrEstimated: true,
          );
        } else if (prefix3_53 == '534') {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'Eluru / West Godavari',
            mandal: 'Eluru Urban',
            townOrVillage: 'Eluru PIN $pin',
            pincode: pin,
            latitude: 16.7107,
            longitude: 81.0952,
            isCustomOrEstimated: true,
          );
        } else {
          return AdministrativeLocation(
            country: 'India',
            state: 'Andhra Pradesh',
            district: 'Vizianagaram',
            mandal: 'Vizianagaram Urban',
            townOrVillage: 'Vizianagaram PIN $pin',
            pincode: pin,
            latitude: 18.1124,
            longitude: 83.4079,
            isCustomOrEstimated: true,
          );
        }
      case '56':
      case '57':
      case '58':
      case '59':
        return AdministrativeLocation(
          country: 'India',
          state: 'Karnataka',
          district: prefix2 == '56' ? 'Bengaluru Urban' : prefix2 == '57' ? 'Mysuru / Mangaluru' : 'Hubballi / Belagavi',
          mandal: 'Postal Zone $prefix2',
          townOrVillage: 'Area PIN $pin',
          pincode: pin,
          latitude: 12.9716,
          longitude: 77.5946,
          isCustomOrEstimated: true,
        );

      // 🇮🇳 ZONE 6 (SOUTH)
      case '60':
      case '61':
      case '62':
      case '63':
      case '64':
        return AdministrativeLocation(
          country: 'India',
          state: 'Tamil Nadu',
          district: prefix2 == '60' ? 'Chennai' : prefix2 == '64' ? 'Coimbatore' : 'Madurai / Tiruchirappalli',
          mandal: 'Postal Zone $prefix2',
          townOrVillage: 'Area PIN $pin',
          pincode: pin,
          latitude: 13.0827,
          longitude: 80.2707,
          isCustomOrEstimated: true,
        );
      case '67':
      case '68':
      case '69':
        return AdministrativeLocation(
          country: 'India',
          state: 'Kerala',
          district: prefix2 == '68' ? 'Ernakulam (Kochi)' : prefix2 == '69' ? 'Thiruvananthapuram' : 'Kozhikode',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Kerala PIN $pin',
          pincode: pin,
          latitude: 9.9312,
          longitude: 76.2673,
          isCustomOrEstimated: true,
        );

      // 🇮🇳 ZONE 7 (EAST & NORTH-EAST)
      case '70':
      case '71':
      case '72':
      case '73':
      case '74':
        final isSikkim = pin.startsWith('737');
        final isAndaman = pin.startsWith('744');
        return AdministrativeLocation(
          country: 'India',
          state: isSikkim ? 'Sikkim' : isAndaman ? 'Andaman and Nicobar Islands' : 'West Bengal',
          district: isSikkim ? 'Gangtok' : isAndaman ? 'Port Blair' : (prefix2 == '70' ? 'Kolkata' : 'Darjeeling / Howrah'),
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Locality PIN $pin',
          pincode: pin,
          latitude: isSikkim ? 27.3389 : isAndaman ? 11.6234 : 22.5726,
          longitude: isSikkim ? 88.6065 : isAndaman ? 92.7265 : 88.3639,
          isCustomOrEstimated: true,
        );
      case '75':
      case '76':
      case '77':
        return AdministrativeLocation(
          country: 'India',
          state: 'Odisha',
          district: prefix2 == '75' ? 'Bhubaneswar / Puri' : prefix2 == '76' ? 'Berhampur' : 'Rourkela / Sambalpur',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Odisha PIN $pin',
          pincode: pin,
          latitude: 20.2961,
          longitude: 85.8245,
          isCustomOrEstimated: true,
        );
      case '78':
        return AdministrativeLocation(
          country: 'India',
          state: 'Assam',
          district: 'Guwahati / Kamrup',
          mandal: 'Kamrup Metropolitan',
          townOrVillage: 'Assam PIN $pin',
          pincode: pin,
          latitude: 26.1445,
          longitude: 91.7362,
          isCustomOrEstimated: true,
        );
      case '79':
        return AdministrativeLocation(
          country: 'India',
          state: 'North East India',
          district: 'Shillong / Agartala / Imphal',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'NE PIN $pin',
          pincode: pin,
          latitude: 25.5788,
          longitude: 91.8933,
          isCustomOrEstimated: true,
        );

      // 🇮🇳 ZONE 8 (EAST-CENTRAL)
      case '80':
      case '81':
      case '82':
        return AdministrativeLocation(
          country: 'India',
          state: 'Bihar',
          district: prefix2 == '80' ? 'Patna' : prefix2 == '82' ? 'Gaya' : 'Bhagalpur / Muzaffarpur',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Bihar PIN $pin',
          pincode: pin,
          latitude: 25.5941,
          longitude: 85.1376,
          isCustomOrEstimated: true,
        );
      case '83':
      case '84':
      case '85':
        final isJharkhand = prefix2 == '83';
        return AdministrativeLocation(
          country: 'India',
          state: isJharkhand ? 'Jharkhand' : 'Bihar',
          district: isJharkhand ? 'Ranchi / Jamshedpur' : 'Darbhanga / Purnia',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Locality PIN $pin',
          pincode: pin,
          latitude: isJharkhand ? 23.3441 : 25.5941,
          longitude: isJharkhand ? 85.3096 : 85.1376,
          isCustomOrEstimated: true,
        );

      default:
        return AdministrativeLocation(
          country: 'India',
          state: 'India Postal Zone',
          district: 'District $prefix2',
          mandal: 'Mandal $prefix2',
          townOrVillage: 'Town/Village ($pin)',
          pincode: pin,
          latitude: 17.3850,
          longitude: 78.4867,
          isCustomOrEstimated: true,
        );
    }
  }
}
