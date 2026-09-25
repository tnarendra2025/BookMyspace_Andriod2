import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/location/presentation/user_location_provider.dart';
import '../../auth/presentation/auth_providers.dart';
import '../domain/venue.dart';
import '../domain/venue_repository.dart';
import '../infrastructure/supabase_venue_repository.dart';

/// Venue repository provider backed by SupabaseClient.
final venueRepositoryProvider = Provider<VenueRepository>((ref) {
  final client = ref.watch(supabaseProvider);
  return SupabaseVenueRepository(client);
});

/// Categories provider (active categories for discovery/browsing).
final venueCategoriesProvider = FutureProvider<List<VenueCategory>>((ref) {
  return ref.watch(venueRepositoryProvider).categories(activeOnly: true);
});

/// All categories provider for management screens (including inactive ones).
final allVenueCategoriesProvider = FutureProvider<List<VenueCategory>>((ref) {
  return ref.watch(venueRepositoryProvider).categories(activeOnly: false);
});

/// Popular venues provider.
final popularVenuesProvider = FutureProvider<List<Venue>>((ref) {
  return ref.watch(venueRepositoryProvider).popularVenues();
});

/// Nearby venues provider driven dynamically by the user's selected hierarchical location & radius.
final nearbyVenuesProvider = FutureProvider<List<Venue>>((ref) async {
  final locState = ref.watch(userLocationProvider);
  final repo = ref.watch(venueRepositoryProvider);

  try {
    final venues = await repo.nearbyVenues(
      latitude: locState.location.latitude,
      longitude: locState.location.longitude,
      maxDistanceKm: locState.radiusKm,
    );
    if (venues.isNotEmpty) {
      return venues;
    }
  } catch (_) {}

  // Fallback to popular venues and calculate geodesic distance from chosen town/PIN
  final allVenues = await repo.popularVenues();
  final withDistances = allVenues.map((v) {
    final d = locState.location.distanceTo(v.latitude, v.longitude);
    return v.copyWith(distanceKm: d);
  }).toList();

  withDistances.sort((a, b) => (a.distanceKm ?? 9999).compareTo(b.distanceKm ?? 9999));
  return withDistances;
});

/// Search query state provider.
final searchQueryProvider = StateProvider<VenueSearchQuery>((ref) {
  return const VenueSearchQuery();
});

/// Search results provider driven by [searchQueryProvider] (user-applied
/// filters + text query).
///
/// Home category taps pass their slug via `SearchScreen.initialCategory`;
/// that path must NOT write the provider during build/navigation (it aborted
/// the Home->Search push back to /home in tests and blinked in prod).
final searchResultsProvider = FutureProvider<List<Venue>>((ref) {
  final query = ref.watch(searchQueryProvider);
  return ref.watch(venueRepositoryProvider).search(query);
});

/// Search results provider for an explicit query (e.g. Home category taps pass
/// the slug via SearchScreen.initialCategory). Lets SearchScreen display
/// category-filtered results without writing to [searchQueryProvider] during
/// build/navigation.
final searchResultsForProvider =
    FutureProvider.autoDispose.family<List<Venue>, VenueSearchQuery>((
  ref,
  query,
) {
  return ref.watch(venueRepositoryProvider).search(query);
});

/// Category-based venue fetch service provider passing category_id as filter parameter
final venuesByCategoryIdProvider = FutureProvider.family<List<Venue>, String>((
  ref,
  categoryId,
) {
  return ref.watch(venueRepositoryProvider).fetchVenuesByCategory(categoryId: categoryId);
});

/// Venue details provider by venue ID.
final venueDetailsProvider = FutureProvider.autoDispose.family<Venue, String>((
  ref,
  venueId,
) {
  return ref.watch(venueRepositoryProvider).venueById(venueId);
});

/// Favorite IDs provider.
final favoriteVenueIdsProvider = FutureProvider<List<String>>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return [];
  return ref.watch(venueRepositoryProvider).favoriteIds();
});

/// Favorite status for a specific venue.
final isFavoriteProvider = FutureProvider.autoDispose.family<bool, String>((
  ref,
  venueId,
) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return false;
  final ids = await ref.watch(venueRepositoryProvider).favoriteIds();
  return ids.contains(venueId);
});

/// Toggle favorite action.
final toggleFavoriteProvider = FutureProvider.autoDispose.family<void, String>((
  ref,
  venueId,
) async {
  final repo = ref.watch(venueRepositoryProvider);
  final isFav = await repo.favoriteIds();
  if (isFav.contains(venueId)) {
    await repo.removeFavorite(venueId);
  } else {
    await repo.addFavorite(venueId);
  }
  ref.invalidate(favoriteVenueIdsProvider);
  ref.invalidate(isFavoriteProvider(venueId));
});

/// Saved venues list provider.
final savedVenuesProvider = FutureProvider<List<Venue>>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return [];
  return ref.watch(venueRepositoryProvider).favorites();
});

/// Alias for savedVenuesProvider.
final favoritesProvider = savedVenuesProvider;
