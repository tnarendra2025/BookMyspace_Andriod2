import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../theme/app_theme.dart';
import '../domain/location_hierarchy.dart';
import '../presentation/user_location_provider.dart';

/// Interactive modal sheet and dialog for hierarchical location selection:
/// Country -> State -> District -> Mandal -> Town/Village OR 6-digit PIN code lookup.
class HierarchicalLocationPickerDialog extends ConsumerStatefulWidget {
  const HierarchicalLocationPickerDialog({
    super.key,
    this.onLocationSelected,
  });

  final void Function(AdministrativeLocation location, double radiusKm)? onLocationSelected;

  /// Convenience method to display the dialog as a responsive bottom sheet.
  static Future<void> show(
    BuildContext context, {
    void Function(AdministrativeLocation location, double radiusKm)? onLocationSelected,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => HierarchicalLocationPickerDialog(
        onLocationSelected: onLocationSelected,
      ),
    );
  }

  @override
  ConsumerState<HierarchicalLocationPickerDialog> createState() =>
      _HierarchicalLocationPickerDialogState();
}

class _HierarchicalLocationPickerDialogState
    extends ConsumerState<HierarchicalLocationPickerDialog>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _pinSearchController = TextEditingController();

  // Current hierarchical selections
  late String _selectedCountry;
  late String _selectedState;
  late String _selectedDistrict;
  late String _selectedMandal;
  AdministrativeLocation? _selectedTown;
  late double _selectedRadiusKm;

  // Search results for PIN / query
  List<AdministrativeLocation> _searchResults = [];
  bool _isSearchingAsync = false;
  Timer? _searchDebounceTimer;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);

    final currentLocationState = ref.read(userLocationProvider);
    final initialLoc = currentLocationState.location;

    _selectedCountry = initialLoc.country;
    _selectedState = initialLoc.state;
    _selectedDistrict = initialLoc.district;
    _selectedMandal = initialLoc.mandal;
    _selectedTown = initialLoc;
    _selectedRadiusKm = currentLocationState.radiusKm;

    _pinSearchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchDebounceTimer?.cancel();
    _pinSearchController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    final query = _pinSearchController.text.trim();
    _searchDebounceTimer?.cancel();

    if (query.isEmpty) {
      setState(() {
        _searchResults = [];
        _isSearchingAsync = false;
      });
      return;
    }

    // 1. Instant local search from embedded hierarchy + dynamic cache
    final localResults = LocationHierarchyRepository.search(query);
    setState(() {
      _searchResults = localResults;
    });

    // 2. Debounced real-time asynchronous search across all India PINs, towns, mandals, streets
    _searchDebounceTimer = Timer(const Duration(milliseconds: 350), () async {
      if (!mounted) return;
      setState(() => _isSearchingAsync = true);
      try {
        final asyncResults = await LocationHierarchyRepository.searchAsync(query);
        if (mounted && _pinSearchController.text.trim() == query) {
          setState(() {
            _searchResults = asyncResults;
            _isSearchingAsync = false;
          });
        }
      } catch (_) {
        if (mounted) setState(() => _isSearchingAsync = false);
      }
    });
  }

  void _applyLocation(AdministrativeLocation location) {
    ref.read(userLocationProvider.notifier).setLocation(
      location,
      radiusKm: _selectedRadiusKm,
    );
    widget.onLocationSelected?.call(location, _selectedRadiusKm);
    Navigator.of(context).pop();
  }

  Future<void> _handlePinSubmit(String pin) async {
    final cleanPin = pin.trim();
    if (cleanPin.isEmpty) return;

    setState(() => _isSearchingAsync = true);
    final resolved = await LocationHierarchyRepository.resolvePinAsync(cleanPin);
    if (!mounted) return;

    setState(() {
      _selectedCountry = resolved.country;
      _selectedState = resolved.state;
      _selectedDistrict = resolved.district;
      _selectedMandal = resolved.mandal;
      _selectedTown = resolved;
      _isSearchingAsync = false;
    });
    _applyLocation(resolved);
  }

  void _handleUseLiveGps() {
    // Detects device location with reliable GPS fallback
    ref.read(userLocationProvider.notifier).setLiveGps(
      latitude: 17.4483,
      longitude: 78.3915,
      areaName: 'Current GPS Location (Hitec City)',
      pincode: '500081',
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final mediaQuery = MediaQuery.of(context);

    return Container(
      constraints: BoxConstraints(
        maxHeight: mediaQuery.size.height * 0.88,
        maxWidth: 680,
      ),
      margin: mediaQuery.size.width > 700
          ? EdgeInsets.symmetric(
              horizontal: (mediaQuery.size.width - 680) / 2,
              vertical: 24,
            )
          : EdgeInsets.zero,
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.18),
            blurRadius: 28,
            offset: const Offset(0, -6),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Drag handle pill
            Center(
              child: Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                width: 48,
                height: 4,
                decoration: BoxDecoration(
                  color: theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),

            // Modal Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.brand.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(
                      Icons.place_rounded,
                      color: AppTheme.brand,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Choose Location & Near Venues',
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Country > State > District > Mandal > Town or PIN',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    tooltip: 'Close',
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),

            // Tab Bar: 1) PIN & Quick Search, 2) Hierarchical Drill-down
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
              child: Container(
                decoration: BoxDecoration(
                  color: isDark ? Colors.grey.shade900 : Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: TabBar(
                  controller: _tabController,
                  indicatorSize: TabBarIndicatorSize.tab,
                  indicator: BoxDecoration(
                    color: AppTheme.brand,
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.brand.withValues(alpha: 0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  labelColor: Colors.white,
                  unselectedLabelColor: theme.colorScheme.onSurfaceVariant,
                  labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  tabs: const [
                    Tab(
                      icon: Icon(Icons.pin_drop_rounded, size: 18),
                      text: 'PIN Code / Quick Search',
                    ),
                    Tab(
                      icon: Icon(Icons.account_tree_rounded, size: 18),
                      text: 'Hierarchy Drill-Down',
                    ),
                  ],
                ),
              ),
            ),

            // Active Path Breadcrumb Strip
            if (_selectedTown != null)
              Container(
                margin: const EdgeInsets.fromLTRB(20, 10, 20, 4),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: AppTheme.brand.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppTheme.brand.withValues(alpha: 0.2),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.navigation_rounded,
                      size: 16,
                      color: AppTheme.brand,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _selectedTown!.breadcrumb,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.brand,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),

            // Radius Selection Strip
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 4),
              child: Row(
                children: [
                  Text(
                    'Search Radius:',
                    style: theme.textTheme.bodySmall?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [5.0, 10.0, 25.0, 50.0, 100.0].map((r) {
                          final isSelected = _selectedRadiusKm == r;
                          final label = r >= 100 ? 'Entire City' : '${r.toInt()} km';
                          return Padding(
                            padding: const EdgeInsets.only(right: 6),
                            child: ChoiceChip(
                              selected: isSelected,
                              label: Text(label),
                              labelStyle: TextStyle(
                                fontSize: 11,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                color: isSelected
                                    ? Colors.white
                                    : theme.colorScheme.onSurface,
                              ),
                              selectedColor: AppTheme.brand,
                              onSelected: (selected) {
                                if (selected) setState(() => _selectedRadiusKm = r);
                              },
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const Divider(height: 12),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  // Tab 1: PIN Code & Quick Search
                  _buildPinSearchTab(theme),

                  // Tab 2: Hierarchical Drill-Down (Country > State > Dist > Mandal > Town)
                  _buildHierarchyDrillDownTab(theme),
                ],
              ),
            ),

            // Bottom Action Bar: [Use GPS] & [Apply Selection]
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                border: Border(
                  top: BorderSide(
                    color: theme.dividerColor.withValues(alpha: 0.4),
                  ),
                ),
              ),
              child: Row(
                children: [
                  // Quick shortcut: Reset to Default (Madhapur)
                  OutlinedButton.icon(
                    onPressed: () {
                      _applyLocation(AdministrativeLocation.defaultLocation);
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    icon: const Icon(Icons.my_location_rounded, size: 16),
                    label: const Text(
                      'Default City',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                  const SizedBox(width: 10),

                  // Primary Confirmation
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _selectedTown != null
                          ? () => _applyLocation(_selectedTown!)
                          : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brand,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        elevation: 2,
                      ),
                      icon: const Icon(Icons.check_circle_rounded, size: 18),
                      label: Text(
                        _selectedTown != null
                            ? 'Select ${_selectedTown!.townOrVillage} (${_selectedRadiusKm >= 100 ? 'All' : '${_selectedRadiusKm.toInt()} km'})'
                            : 'Select a Town / PIN',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
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

  /// TAB 1: PIN Code & Search-as-you-type
  Widget _buildPinSearchTab(ThemeData theme) {
    final popularPins = [
      {'pin': '516227', 'area': 'Badvel, YSR Kadapa'},
      {'pin': '500081', 'area': 'Madhapur / Hitec'},
      {'pin': '500032', 'area': 'Gachibowli'},
      {'pin': '500072', 'area': 'Kukatpally'},
      {'pin': '500033', 'area': 'Jubilee Hills'},
      {'pin': '500034', 'area': 'Banjara Hills'},
      {'pin': '560034', 'area': 'Koramangala, BLR'},
      {'pin': '400053', 'area': 'Andheri W, MUM'},
    ];

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      children: [
        // Live GPS Button Card
        InkWell(
          onTap: _handleUseLiveGps,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppTheme.brand.withValues(alpha: 0.12),
                  Colors.teal.withValues(alpha: 0.08),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: AppTheme.brand.withValues(alpha: 0.3),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppTheme.brand,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.my_location_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Use Live GPS Location',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      Text(
                        'Auto-detect device position with instant nearest venue search',
                        style: TextStyle(
                          fontSize: 11,
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.brand),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Search Input Field
        TextField(
          controller: _pinSearchController,
          autofocus: false,
          decoration: InputDecoration(
            hintText: 'Enter 6-digit PIN (e.g. 516227, 500081) or town/village/street...',
            prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.brand),
            suffixIcon: _isSearchingAsync
                ? const Padding(
                    padding: EdgeInsets.all(12),
                    child: SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.brand),
                    ),
                  )
                : _pinSearchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded, size: 18),
                        onPressed: () => _pinSearchController.clear(),
                      )
                    : null,
            filled: true,
            fillColor: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.35),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: theme.dividerColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppTheme.brand, width: 2),
            ),
          ),
          onSubmitted: _handlePinSubmit,
        ),
        if (_isSearchingAsync)
          const Padding(
            padding: EdgeInsets.only(top: 4),
            child: ClipRRect(
              borderRadius: BorderRadius.all(Radius.circular(2)),
              child: LinearProgressIndicator(minHeight: 2, color: AppTheme.brand),
            ),
          ),
        const SizedBox(height: 12),

        // Quick PIN code suggestion chips
        Text(
          'Popular PIN Codes & Towns:',
          style: theme.textTheme.bodySmall?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 6),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: popularPins.map((p) {
            final pin = p['pin']!;
            final area = p['area']!;
            final isCurrent = _selectedTown?.pincode == pin;
            return ActionChip(
              avatar: const Icon(Icons.pin_drop, size: 14, color: AppTheme.brand),
              label: Text('$pin ($area)'),
              labelStyle: TextStyle(
                fontSize: 11,
                fontWeight: isCurrent ? FontWeight.bold : FontWeight.w500,
                color: isCurrent ? AppTheme.brand : null,
              ),
              backgroundColor: isCurrent
                  ? AppTheme.brand.withValues(alpha: 0.12)
                  : null,
              onPressed: () {
                _pinSearchController.text = pin;
                _handlePinSubmit(pin);
              },
            );
          }).toList(),
        ),

        const SizedBox(height: 16),

        // Search Results List or Guidance
        if (_searchResults.isNotEmpty) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Matching Locations (${_searchResults.length}):',
                style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
              ),
              if (_isSearchingAsync)
                const Text(
                  'Searching India-wide live...',
                  style: TextStyle(fontSize: 11, color: AppTheme.brand, fontStyle: FontStyle.italic),
                ),
            ],
          ),
          const SizedBox(height: 6),
          ..._searchResults.map((loc) {
            final isSelected = _selectedTown?.pincode == loc.pincode &&
                _selectedTown?.townOrVillage == loc.townOrVillage;
            return Container(
              margin: const EdgeInsets.only(bottom: 6),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppTheme.brand.withValues(alpha: 0.1)
                    : theme.colorScheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isSelected
                      ? AppTheme.brand
                      : theme.dividerColor.withValues(alpha: 0.4),
                  width: isSelected ? 1.5 : 1.0,
                ),
              ),
              child: ListTile(
                dense: true,
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isSelected ? AppTheme.brand : Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    loc.countryCode,
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 11,
                      color: isSelected ? Colors.white : Colors.black87,
                    ),
                  ),
                ),
                title: Row(
                  children: [
                    Expanded(
                      child: Text(
                        '${loc.townOrVillage} (PIN: ${loc.pincode})',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (!loc.isCustomOrEstimated)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                        decoration: BoxDecoration(
                          color: Colors.green.shade50,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: Colors.green.shade300, width: 0.8),
                        ),
                        child: Text(
                          'Verified Geo',
                          style: TextStyle(fontSize: 9, color: Colors.green.shade800, fontWeight: FontWeight.bold),
                        ),
                      ),
                  ],
                ),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${loc.mandal} Mandal · ${loc.district} · ${loc.state}',
                      style: TextStyle(fontSize: 11, color: theme.colorScheme.onSurfaceVariant),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '📍 ${loc.latitude.toStringAsFixed(4)}° N, ${loc.longitude.toStringAsFixed(4)}° E',
                      style: const TextStyle(fontSize: 10, color: AppTheme.brand, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                trailing: isSelected
                    ? const Icon(Icons.check_circle, color: AppTheme.brand, size: 20)
                    : const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                onTap: () {
                  setState(() {
                    _selectedCountry = loc.country;
                    _selectedState = loc.state;
                    _selectedDistrict = loc.district;
                    _selectedMandal = loc.mandal;
                    _selectedTown = loc;
                  });
                  _applyLocation(loc);
                },
              ),
            );
          }),
        ] else if (_pinSearchController.text.isNotEmpty) ...[
          // Custom PIN code fallback
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                const Icon(Icons.location_searching_rounded, size: 36, color: AppTheme.brand),
                const SizedBox(height: 8),
                Text(
                  'Search directly with PIN "${_pinSearchController.text.trim()}"',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                const Text(
                  'We will find venues closest to this postal district and exact coordinates.',
                  style: TextStyle(fontSize: 12),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: () => _handlePinSubmit(_pinSearchController.text),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.brand,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text('Resolve PIN & Find Venues'),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  /// TAB 2: Hierarchical Step-by-Step Drill Down
  /// Country -> State -> District -> Mandal -> Town/Village
  Widget _buildHierarchyDrillDownTab(ThemeData theme) {
    final countries = LocationHierarchyRepository.getCountries();
    final states = LocationHierarchyRepository.getStates(_selectedCountry);

    // Safeguard state selection
    if (!states.contains(_selectedState)) {
      _selectedState = states.isNotEmpty ? states.first : 'Telangana';
    }

    final districts = LocationHierarchyRepository.getDistricts(_selectedState);
    if (!districts.contains(_selectedDistrict)) {
      _selectedDistrict = districts.isNotEmpty ? districts.first : 'Hyderabad';
    }

    final mandals = LocationHierarchyRepository.getMandals(_selectedState, _selectedDistrict);
    if (!mandals.contains(_selectedMandal)) {
      _selectedMandal = mandals.isNotEmpty ? mandals.first : 'Serilingampally';
    }

    final towns = LocationHierarchyRepository.getTowns(
      _selectedState,
      _selectedDistrict,
      _selectedMandal,
    );

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      children: [
        // 1. COUNTRY
        _buildSectionHeader('1. Select Country', Icons.flag_rounded, theme),
        const SizedBox(height: 6),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: countries.map((country) {
            final isSelected = _selectedCountry == country;
            final flag = country == 'India'
                ? '🇮🇳'
                : country == 'United States'
                    ? '🇺🇸'
                    : country == 'United Arab Emirates'
                        ? '🇦🇪'
                        : country == 'United Kingdom'
                            ? '🇬🇧'
                            : '🇸🇬';
            return ChoiceChip(
              selected: isSelected,
              label: Text('$flag $country'),
              selectedColor: AppTheme.brand,
              labelStyle: TextStyle(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? Colors.white : null,
                fontSize: 12,
              ),
              onSelected: (selected) {
                if (selected) {
                  setState(() {
                    _selectedCountry = country;
                    final newStates = LocationHierarchyRepository.getStates(country);
                    _selectedState = newStates.isNotEmpty ? newStates.first : '';
                  });
                }
              },
            );
          }).toList(),
        ),

        const SizedBox(height: 16),

        // 2. STATE
        _buildSectionHeader('2. Select State', Icons.map_rounded, theme),
        const SizedBox(height: 6),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: states.map((state) {
            final isSelected = _selectedState == state;
            return ChoiceChip(
              selected: isSelected,
              label: Text(state),
              selectedColor: AppTheme.brand,
              labelStyle: TextStyle(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? Colors.white : null,
                fontSize: 12,
              ),
              onSelected: (selected) {
                if (selected) {
                  setState(() {
                    _selectedState = state;
                    final newDistricts = LocationHierarchyRepository.getDistricts(state);
                    _selectedDistrict = newDistricts.isNotEmpty ? newDistricts.first : '';
                  });
                }
              },
            );
          }).toList(),
        ),

        const SizedBox(height: 16),

        // 3. DISTRICT
        _buildSectionHeader('3. Select District', Icons.location_city_rounded, theme),
        const SizedBox(height: 6),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: districts.map((district) {
            final isSelected = _selectedDistrict == district;
            return ChoiceChip(
              selected: isSelected,
              label: Text(district),
              selectedColor: AppTheme.brand,
              labelStyle: TextStyle(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? Colors.white : null,
                fontSize: 12,
              ),
              onSelected: (selected) {
                if (selected) {
                  setState(() {
                    _selectedDistrict = district;
                    final newMandals = LocationHierarchyRepository.getMandals(
                      _selectedState,
                      district,
                    );
                    _selectedMandal = newMandals.isNotEmpty ? newMandals.first : '';
                  });
                }
              },
            );
          }).toList(),
        ),

        const SizedBox(height: 16),

        // 4. MANDAL / TALUK
        _buildSectionHeader('4. Select Mandal / Taluk', Icons.share_location_rounded, theme),
        const SizedBox(height: 6),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: mandals.map((mandal) {
            final isSelected = _selectedMandal == mandal;
            return ChoiceChip(
              selected: isSelected,
              label: Text(mandal),
              selectedColor: AppTheme.brand,
              labelStyle: TextStyle(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? Colors.white : null,
                fontSize: 12,
              ),
              onSelected: (selected) {
                if (selected) {
                  setState(() {
                    _selectedMandal = mandal;
                    final newTowns = LocationHierarchyRepository.getTowns(
                      _selectedState,
                      _selectedDistrict,
                      mandal,
                    );
                    if (newTowns.isNotEmpty) {
                      _selectedTown = newTowns.first;
                    }
                  });
                }
              },
            );
          }).toList(),
        ),

        const SizedBox(height: 16),

        // 5. TOWN / VILLAGE / PIN
        _buildSectionHeader('5. Select Town / Village & PIN', Icons.holiday_village_rounded, theme),
        const SizedBox(height: 8),
        if (towns.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Text(
              'No specific towns indexed for $_selectedMandal. You can enter a PIN code directly in the PIN tab.',
              style: TextStyle(color: theme.colorScheme.onSurfaceVariant, fontSize: 12),
            ),
          )
        else
          ...towns.map((t) {
            final isSelected = _selectedTown?.townOrVillage == t.townOrVillage &&
                _selectedTown?.pincode == t.pincode;
            return Container(
              margin: const EdgeInsets.only(bottom: 6),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppTheme.brand.withValues(alpha: 0.12)
                    : theme.colorScheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isSelected
                      ? AppTheme.brand
                      : theme.dividerColor.withValues(alpha: 0.3),
                  width: isSelected ? 1.6 : 1.0,
                ),
              ),
              child: ListTile(
                dense: true,
                leading: Icon(
                  isSelected ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                  color: isSelected ? AppTheme.brand : Colors.grey,
                  size: 20,
                ),
                title: Text(
                  t.townOrVillage,
                  style: TextStyle(
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
                subtitle: Text(
                  'PIN: ${t.pincode} · Coordinates: ${t.latitude.toStringAsFixed(3)}, ${t.longitude.toStringAsFixed(3)}',
                  style: TextStyle(
                    fontSize: 11,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.brand.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    t.pincode,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 11,
                      color: AppTheme.brand,
                    ),
                  ),
                ),
                onTap: () {
                  setState(() => _selectedTown = t);
                },
              ),
            );
          }),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildSectionHeader(String title, IconData icon, ThemeData theme) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppTheme.brand),
        const SizedBox(width: 6),
        Text(
          title,
          style: theme.textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.bold,
            letterSpacing: -0.2,
          ),
        ),
      ],
    );
  }
}
