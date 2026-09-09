import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../features/venues/domain/venue.dart';
import '../../../features/venues/presentation/venue_providers.dart';
import '../domain/location_hierarchy.dart';

/// State encapsulating active administrative location, selected radius, and GPS mode.
class SelectedLocationState {
  const SelectedLocationState({
    required this.location,
    this.radiusKm = 10.0,
    this.isAutoGps = false,
  });

  final AdministrativeLocation location;
  final double radiusKm;
  final bool isAutoGps;

  /// Short display text for app bars and compact headers (e.g. "Madhapur, Serilingampally").
  String get displayTitle => location.shortLabel;

  /// Full administrative hierarchy breadcrumb:
  /// "India > Telangana > Hyderabad > Serilingampally > Madhapur (500081)"
  String get breadcrumb => location.breadcrumb;

  /// Formatted radius string (e.g. "Within 10 km").
  String get radiusLabel {
    if (radiusKm >= 100) return 'Entire City';
    return 'Within ${radiusKm.toInt()} km';
  }

  /// Compact header label with town & PIN.
  String get headerTag => '${location.townOrVillage} (${location.pincode})';

  SelectedLocationState copyWith({
    AdministrativeLocation? location,
    double? radiusKm,
    bool? isAutoGps,
  }) {
    return SelectedLocationState(
      location: location ?? this.location,
      radiusKm: radiusKm ?? this.radiusKm,
      isAutoGps: isAutoGps ?? this.isAutoGps,
    );
  }
}

/// State notifier managing the user's active geographic and administrative location.
class UserLocationNotifier extends StateNotifier<SelectedLocationState> {
  UserLocationNotifier()
      : super(const SelectedLocationState(
          location: AdministrativeLocation.defaultLocation,
          radiusKm: 10.0,
        ));

  /// Selects a specific hierarchical administrative location.
  void setLocation(AdministrativeLocation location, {double? radiusKm}) {
    state = state.copyWith(
      location: location,
      radiusKm: radiusKm ?? state.radiusKm,
      isAutoGps: false,
    );
  }

  /// Selects location by 6-digit PIN code.
  void setByPincode(String pincode, {double? radiusKm}) {
    final resolved = LocationHierarchyRepository.resolveOrEstimatePin(pincode);
    setLocation(resolved, radiusKm: radiusKm);
  }

  /// Selects location by 6-digit PIN code using real-time online lookup with fallback.
  Future<AdministrativeLocation> setByPincodeAsync(String pincode, {double? radiusKm}) async {
    final resolved = await LocationHierarchyRepository.resolvePinAsync(pincode);
    setLocation(resolved, radiusKm: radiusKm);
    return resolved;
  }

  /// Sets location based on live device GPS coordinates with graceful fallback.
  void setLiveGps({
    required double latitude,
    required double longitude,
    String? areaName,
    String? pincode,
  }) {
    final gpsLoc = AdministrativeLocation(
      country: 'India',
      state: 'Live GPS',
      district: 'Device Coordinates',
      mandal: 'GPS Fix',
      townOrVillage: areaName ?? 'Current GPS Location',
      pincode: pincode ?? '',
      latitude: latitude,
      longitude: longitude,
      isCustomOrEstimated: false,
    );
    state = state.copyWith(
      location: gpsLoc,
      isAutoGps: true,
    );
  }

  /// Updates the search radius (e.g. 5, 10, 25, 50 km).
  void setRadius(double radiusKm) {
    state = state.copyWith(radiusKm: radiusKm);
  }

  /// Resets to default location (Madhapur, Hyderabad).
  void resetToDefault() {
    state = const SelectedLocationState(
      location: AdministrativeLocation.defaultLocation,
      radiusKm: 10.0,
    );
  }
}

/// Riverpod provider for active user location selection across the application.
final userLocationProvider =
    StateNotifierProvider<UserLocationNotifier, SelectedLocationState>((ref) {
  return UserLocationNotifier();
});

/// Computes nearby venues filtered by distance to the user's selected location,
/// with calculated distance in kilometers attached to each venue.
final locationFilteredVenuesProvider = FutureProvider<List<Venue>>((ref) async {
  final locState = ref.watch(userLocationProvider);
  final repo = ref.watch(venueRepositoryProvider);

  // Fetch venues from repository (nearby RPC or popular fallback)
  List<Venue> rawVenues;
  try {
    rawVenues = await repo.nearbyVenues(
      latitude: locState.location.latitude,
      longitude: locState.location.longitude,
      maxDistanceKm: locState.radiusKm <= 50 ? locState.radiusKm * 2 : 100,
    );
  } catch (_) {
    // If nearby RPC fails, fall back to all popular venues
    rawVenues = await repo.popularVenues();
  }

  if (rawVenues.isEmpty) {
    rawVenues = await repo.popularVenues();
  }

  // Calculate geodesic distance from user's selected town/village/mandal coordinates
  final enriched = rawVenues.map((v) {
    final dist = locState.location.distanceTo(v.latitude, v.longitude);
    return v.copyWith(distanceKm: dist);
  }).toList();

  // Sort by closest proximity to user
  enriched.sort((a, b) => (a.distanceKm ?? 9999).compareTo(b.distanceKm ?? 9999));

  return enriched;
});
