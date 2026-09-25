import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/localization/app_localizations.dart';
import '../../../../core/location/presentation/user_location_provider.dart';
import '../../../../core/location/presentation/widgets/hierarchical_location_picker_dialog.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/animated_category_chip.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/error_view.dart';
import '../../../../core/widgets/skeleton.dart';
import '../../../venues/domain/venue.dart';
import '../../../venues/presentation/venue_providers.dart';
import '../../../venues/presentation/widgets/venue_card.dart';

/// Cluster representation for grouping closely situated venue markers.
class VenueCluster {
  const VenueCluster({
    required this.id,
    required this.position,
    required this.venues,
  });

  final String id;
  final LatLng position;
  final List<Venue> venues;

  bool get isSingle => venues.length == 1;
  Venue get singleVenue => venues.first;
}

/// An interactive live map discovery screen powered by OpenStreetMap & flutter_map.
///
/// Features:
/// - Cross-platform Flutter map (Android, iOS, Web, Desktop) via OpenStreetMap.
/// - Venue pins with dynamic clustering based on map zoom levels.
/// - Map/List split view (side-by-side on Web/Desktop, layered sheet on Mobile).
/// - Category and text search filtering with debounced reactivity.
/// - Synchronized two-way selection:
///     * Selecting a pin highlights the venue in the list and scrolls it into view.
///     * Clicking a venue in the list centers and zooms the map onto the venue.
/// - Venue detail navigation on card or callout tap.
class VenueMapScreen extends ConsumerStatefulWidget {
  const VenueMapScreen({
    super.key,
    this.initialVenueId,
    this.initialCategory,
  });

  final String? initialVenueId;
  final String? initialCategory;

  @override
  ConsumerState<VenueMapScreen> createState() => _VenueMapScreenState();
}

class _VenueMapScreenState extends ConsumerState<VenueMapScreen> {
  final MapController _mapController = MapController();
  late final TextEditingController _searchController;
  Timer? _searchDebounce;

  // Selected venue identifier for two-way synchronization
  String? _selectedVenueId;

  // Current map zoom level tracked for dynamic clustering
  double _currentZoom = 12.0;

  // Default coordinate center (Hyderabad tech & culture hub)
  static const LatLng _defaultCenter = LatLng(17.3850, 78.4867);

  // Scroll controller for the list view to scroll selected item into view
  final ScrollController _listScrollController = ScrollController();

  // Keep track of venue list keys for automatic scrolling
  final Map<String, GlobalKey> _itemKeys = {};

  bool _isMapReady = false;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
    _selectedVenueId = widget.initialVenueId;

    if (widget.initialCategory != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final current = ref.read(searchQueryProvider);
        ref.read(searchQueryProvider.notifier).state = current.copyWith(
          categorySlug: () => widget.initialCategory,
        );
      });
    }
  }

  @override
  void dispose() {
    _searchDebounce?.cancel();
    _searchController.dispose();
    _listScrollController.dispose();
    _mapController.dispose();
    super.dispose();
  }

  void _onSearchQueryChanged(String text) {
    _searchDebounce?.cancel();
    _searchDebounce = Timer(const Duration(milliseconds: 350), () {
      if (!mounted) return;
      final current = ref.read(searchQueryProvider);
      ref.read(searchQueryProvider.notifier).state = current.copyWith(
        query: text.trim(),
      );
    });
  }

  /// Centers the map on the selected venue and updates active selection.
  void _selectVenue(Venue venue, {bool animateMap = true}) {
    setState(() {
      _selectedVenueId = venue.id;
    });

    if (animateMap && venue.latitude != 0.0) {
      final targetZoom = math.max(_currentZoom, 14.5);
      _mapController.move(LatLng(venue.latitude, venue.longitude), targetZoom);
    }

    _scrollToVenueInList(venue.id);
  }

  void _scrollToVenueInList(String venueId) {
    final key = _itemKeys[venueId];
    if (key != null && key.currentContext != null) {
      Scrollable.ensureVisible(
        key.currentContext!,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        alignment: 0.3,
      );
    }
  }

  /// Clusters venues using a simple grid-based distance metric according to zoom level.
  List<VenueCluster> _computeClusters(List<Venue> venues, double zoom) {
    final validVenues = venues.where((v) => v.latitude != 0.0 && v.longitude != 0.0).toList();
    if (validVenues.isEmpty) return const [];

    final clusterRadius = 40.0 / math.pow(2, zoom);

    final List<VenueCluster> clusters = [];
    final Set<String> visitedIds = {};

    for (final venue in validVenues) {
      if (visitedIds.contains(venue.id)) continue;

      final nearby = <Venue>[venue];
      visitedIds.add(venue.id);

      for (final other in validVenues) {
        if (visitedIds.contains(other.id)) continue;
        final dLat = (venue.latitude - other.latitude).abs();
        final dLng = (venue.longitude - other.longitude).abs();
        final dist = math.sqrt(dLat * dLat + dLng * dLng);

        if (dist < clusterRadius) {
          nearby.add(other);
          visitedIds.add(other.id);
        }
      }

      double avgLat = 0;
      double avgLng = 0;
      for (final v in nearby) {
        avgLat += v.latitude;
        avgLng += v.longitude;
      }
      avgLat /= nearby.length;
      avgLng /= nearby.length;

      clusters.add(
        VenueCluster(
          id: nearby.length == 1 ? nearby.first.id : 'cluster_${venue.id}',
          position: LatLng(avgLat, avgLng),
          venues: nearby,
        ),
      );
    }

    return clusters;
  }

  List<Marker> _buildMarkers(List<VenueCluster> clusters) {
    final markers = <Marker>[];

    for (final cluster in clusters) {
      if (cluster.isSingle) {
        final venue = cluster.singleVenue;
        final isSelected = venue.id == _selectedVenueId;

        markers.add(
          Marker(
            point: LatLng(venue.latitude, venue.longitude),
            width: isSelected ? 52.0 : 42.0,
            height: isSelected ? 52.0 : 42.0,
            child: GestureDetector(
              onTap: () => _selectVenue(venue, animateMap: false),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: isSelected ? Colors.cyan.shade600 : AppTheme.brand,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.white,
                    width: isSelected ? 3.0 : 2.0,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: (isSelected ? Colors.cyan : AppTheme.brand).withValues(alpha: 0.4),
                      blurRadius: isSelected ? 12 : 6,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Center(
                  child: Icon(
                    Icons.location_on_rounded,
                    color: Colors.white,
                    size: isSelected ? 28 : 22,
                  ),
                ),
              ),
            ),
          ),
        );
      } else {
        // Multi-venue cluster pin
        final count = cluster.venues.length;
        markers.add(
          Marker(
            point: cluster.position,
            width: 48.0,
            height: 48.0,
            child: GestureDetector(
              onTap: () {
                _mapController.move(cluster.position, _currentZoom + 2.0);
              },
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.deepOrange.shade600,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.deepOrange.withValues(alpha: 0.35),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    '$count',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      }
    }

    return markers;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final locState = ref.watch(userLocationProvider);
    final query = ref.watch(searchQueryProvider);
    final categoriesAsync = ref.watch(venueCategoriesProvider);

    // Watch venues: when text or category filters are active, run filtered search;
    // otherwise, query nearby venues using Supabase nearby_venues RPC with active latitude & longitude!
    final venuesAsync = query.hasFilters
        ? ref.watch(searchResultsProvider)
        : ref.watch(nearbyVenuesProvider);

    // Re-center map automatically when user selects a new location
    ref.listen<SelectedLocationState>(userLocationProvider, (prev, next) {
      if (next.location.latitude != 0.0 && next.location.longitude != 0.0) {
        _mapController.move(
          LatLng(next.location.latitude, next.location.longitude),
          13.0,
        );
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: Text('Live Map Discovery', style: theme.textTheme.titleLarge),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/home');
            }
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.pin_drop_rounded),
            tooltip: 'Search PIN or Town',
            onPressed: () => HierarchicalLocationPickerDialog.show(context),
          ),
          if (query.hasFilters)
            IconButton(
              icon: const Icon(Icons.filter_alt_off_rounded),
              tooltip: l10n.clearFilters,
              onPressed: () {
                _searchController.clear();
                ref.read(searchQueryProvider.notifier).state =
                    const VenueSearchQuery();
              },
            ),
          IconButton(
            icon: const Icon(Icons.my_location_rounded),
            tooltip: 'Re-center to Selected Location',
            onPressed: () {
              if (locState.location.latitude != 0.0 && locState.location.longitude != 0.0) {
                _mapController.move(
                  LatLng(locState.location.latitude, locState.location.longitude),
                  13.0,
                );
              } else {
                _mapController.move(_defaultCenter, 12.0);
              }
            },
          ),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isWideScreen = constraints.maxWidth >= 840;

          return Column(
            children: [
              // Active Location Banner Strip
              _buildLocationBanner(theme, locState),

              // Search text box & category chips filter bar
              _buildFilterHeader(theme, l10n, query, categoriesAsync),

              // Main content area: split-view for wide screens (Web/Desktop),
              // or responsive vertical split for mobile screens
              Expanded(
                child: venuesAsync.when(
                  data: (venues) {
                    final clusters = _computeClusters(venues, _currentZoom);
                    final markers = _buildMarkers(clusters);

                    // Ensure item keys for scrolling
                    for (final v in venues) {
                      _itemKeys.putIfAbsent(v.id, () => GlobalKey());
                    }

                    if (isWideScreen) {
                      // Desktop Web Layout: Side-by-side split view
                      return Row(
                        children: [
                          // Left side: Interactive Map (55% width)
                          Expanded(
                            flex: 55,
                            child: _buildFlutterMap(markers, venues),
                          ),
                          // Vertical divider
                          const VerticalDivider(width: 1, thickness: 1),
                          // Right side: Venue list with two-way selection (45% width)
                          Expanded(
                            flex: 45,
                            child: _buildVenueList(venues, theme, l10n),
                          ),
                        ],
                      );
                    } else {
                      // Mobile View: Split layout with map on top, venue cards list on bottom
                      return Column(
                        children: [
                          Expanded(
                            flex: 55,
                            child: _buildFlutterMap(markers, venues),
                          ),
                          const Divider(height: 1, thickness: 1),
                          Expanded(
                            flex: 45,
                            child: _buildVenueList(venues, theme, l10n),
                          ),
                        ],
                      );
                    }
                  },
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CircularProgressIndicator(),
                          SizedBox(height: 16),
                          Text('Loading interactive map and venues...'),
                        ],
                      ),
                    ),
                  ),
                  error: (e, _) => ErrorView(
                    message: e.toString(),
                    onRetry: () {
                      if (query.hasFilters) {
                        ref.invalidate(searchResultsProvider);
                      } else {
                        ref.invalidate(nearbyVenuesProvider);
                      }
                    },
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  /// Interactive banner strip showing the currently selected location & radius.
  Widget _buildLocationBanner(ThemeData theme, SelectedLocationState locState) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppTheme.brand.withValues(alpha: 0.08),
        border: Border(
          bottom: BorderSide(
            color: AppTheme.brand.withValues(alpha: 0.18),
          ),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: AppTheme.brand,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              locState.isAutoGps ? Icons.my_location_rounded : Icons.location_on_rounded,
              color: Colors.white,
              size: 16,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        locState.location.townOrVillage,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (locState.location.pincode.isNotEmpty) ...[
                      const SizedBox(width: 4),
                      Text(
                        '(${locState.location.pincode})',
                        style: TextStyle(
                          fontSize: 12,
                          color: theme.colorScheme.onSurfaceVariant,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: theme.dividerColor, width: 0.8),
                      ),
                      child: Text(
                        locState.radiusLabel,
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                Text(
                  '${locState.location.mandal}, ${locState.location.district} · ${locState.location.state}',
                  style: TextStyle(fontSize: 11, color: theme.colorScheme.onSurfaceVariant),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          OutlinedButton.icon(
            onPressed: () => HierarchicalLocationPickerDialog.show(context),
            icon: const Icon(Icons.tune_rounded, size: 14),
            label: const Text('Change', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.brand,
              side: const BorderSide(color: AppTheme.brand, width: 1),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              minimumSize: const Size(60, 32),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterHeader(
    ThemeData theme,
    AppLocalizations l10n,
    VenueSearchQuery query,
    AsyncValue<List<VenueCategory>> categoriesAsync,
  ) {
    return Container(
      color: theme.colorScheme.surface,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Search input field
          TextField(
            controller: _searchController,
            onChanged: _onSearchQueryChanged,
            decoration: InputDecoration(
              hintText: l10n.searchHint,
              prefixIcon: const Icon(Icons.search_rounded, size: 20),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear_rounded, size: 18),
                      onPressed: () {
                        _searchController.clear();
                        _onSearchQueryChanged('');
                      },
                    )
                  : null,
              filled: true,
              fillColor: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 8),
          // Category horizontal scroll chips
          SizedBox(
            height: 38,
            child: categoriesAsync.when(
              data: (categories) {
                return ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: categories.length + 1,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    if (index == 0) {
                      final isAll = query.categorySlug == null;
                      return AnimatedCategoryChip(
                        selected: isAll,
                        label: l10n.allCategories,
                        emoji: '🌐',
                        onTap: () {
                          ref.read(searchQueryProvider.notifier).state =
                              query.copyWith(categorySlug: () => null);
                        },
                      );
                    }
                    final cat = categories[index - 1];
                    final isSelected = query.categorySlug == cat.slug;
                    return AnimatedCategoryChip(
                      selected: isSelected,
                      label: cat.name,
                      emoji: cat.icon,
                      onTap: () {
                        ref.read(searchQueryProvider.notifier).state =
                            query.copyWith(
                          categorySlug: () => isSelected ? null : cat.slug,
                        );
                      },
                    );
                  },
                );
              },
              loading: () => const SizedBox(
                height: 36,
                child: Row(
                  children: [
                    SkeletonBox(width: 80, height: 32, radius: 16),
                    SizedBox(width: 8),
                    SkeletonBox(width: 100, height: 32, radius: 16),
                    SizedBox(width: 8),
                    SkeletonBox(width: 90, height: 32, radius: 16),
                  ],
                ),
              ),
              error: (_, __) => const SizedBox.shrink(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFlutterMap(List<Marker> markers, List<Venue> venues) {
    LatLng initialTarget = _defaultCenter;
    if (_selectedVenueId != null) {
      final selected = venues.where((v) => v.id == _selectedVenueId).firstOrNull;
      if (selected != null && selected.latitude != 0.0) {
        initialTarget = LatLng(selected.latitude, selected.longitude);
      }
    } else if (venues.isNotEmpty) {
      final firstWithCoords = venues.where((v) => v.latitude != 0.0).firstOrNull;
      if (firstWithCoords != null) {
        initialTarget = LatLng(firstWithCoords.latitude, firstWithCoords.longitude);
      }
    }

    return Stack(
      children: [
        FlutterMap(
          mapController: _mapController,
          options: MapOptions(
            initialCenter: initialTarget,
            initialZoom: _currentZoom,
            minZoom: 3.0,
            maxZoom: 18.0,
            onPositionChanged: (camera, hasGesture) {
              if (_currentZoom != camera.zoom) {
                setState(() {
                  _currentZoom = camera.zoom;
                });
              }
            },
            onMapReady: () {
              if (!_isMapReady && mounted) {
                setState(() {
                  _isMapReady = true;
                });
              }
            },
          ),
          children: [
            TileLayer(
              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'com.allindia.discover',
              maxZoom: 19,
            ),
            MarkerLayer(
              markers: markers,
            ),
          ],
        ),

        // Floating Zoom and Navigation Controls
        Positioned(
          right: 16,
          bottom: 16,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              FloatingActionButton.small(
                heroTag: 'map_zoom_in',
                backgroundColor: Colors.white,
                foregroundColor: Colors.black87,
                onPressed: () {
                  final newZoom = math.min(_currentZoom + 1.0, 18.0);
                  _mapController.move(_mapController.camera.center, newZoom);
                },
                child: const Icon(Icons.add_rounded),
              ),
              const SizedBox(height: 8),
              FloatingActionButton.small(
                heroTag: 'map_zoom_out',
                backgroundColor: Colors.white,
                foregroundColor: Colors.black87,
                onPressed: () {
                  final newZoom = math.max(_currentZoom - 1.0, 3.0);
                  _mapController.move(_mapController.camera.center, newZoom);
                },
                child: const Icon(Icons.remove_rounded),
              ),
            ],
          ),
        ),

        if (!_isMapReady)
          const Center(
            child: CircularProgressIndicator(),
          ),
      ],
    );
  }

  Widget _buildVenueList(
    List<Venue> venues,
    ThemeData theme,
    AppLocalizations l10n,
  ) {
    if (venues.isEmpty) {
      return Center(
        child: EmptyState(
          icon: Icons.location_off_rounded,
          title: l10n.noResults,
          message: l10n.noResultsMessage,
        ),
      );
    }

    return ListView.separated(
      controller: _listScrollController,
      padding: const EdgeInsets.all(12),
      itemCount: venues.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final venue = venues[index];
        final isSelected = venue.id == _selectedVenueId;

        return KeyedSubtree(
          key: _itemKeys[venue.id],
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isSelected
                    ? AppTheme.brand
                    : theme.colorScheme.outlineVariant.withValues(alpha: 0.4),
                width: isSelected ? 2.5 : 1.0,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: AppTheme.brand.withValues(alpha: 0.25),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ]
                  : null,
            ),
            child: InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: () => _selectVenue(venue, animateMap: true),
              child: VenueCard(venue: venue),
            ),
          ),
        );
      },
    );
  }
}
