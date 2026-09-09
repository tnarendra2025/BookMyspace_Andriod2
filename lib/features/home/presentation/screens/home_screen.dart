import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/localization/app_localizations.dart';
import '../../../../core/location/domain/location_hierarchy.dart';
import '../../../../core/location/presentation/user_location_provider.dart';
import '../../../../core/location/presentation/widgets/hierarchical_location_picker_dialog.dart';
import '../../../../core/router/app_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/app_network_image.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/animated_category_chip.dart';
import '../../../../core/widgets/error_view.dart';
import '../../../../core/widgets/responsive_layout.dart';
import '../../../../core/widgets/skeleton.dart';
import '../../../auth/presentation/auth_providers.dart';
import '../../../venues/domain/venue.dart';
import '../../../venues/presentation/venue_providers.dart';
import '../../../venues/presentation/widgets/venue_badges.dart';
import '../../search/presentation/widgets/voice_search_bottom_sheet.dart';
import '../widgets/home_eye_catching_widgets.dart';

/// The 5 primary sections of BookMySpace
enum MainHomeSection {
  functionHalls,
  lodgeRooms,
  pgHostels,
  institutesClasses,
  sportsWorkspaces;

  String get id {
    switch (this) {
      case MainHomeSection.functionHalls:
        return 'function_halls';
      case MainHomeSection.lodgeRooms:
        return 'lodge_rooms';
      case MainHomeSection.pgHostels:
        return 'pg_hostels';
      case MainHomeSection.institutesClasses:
        return 'institutes_classes';
      case MainHomeSection.sportsWorkspaces:
        return 'sports_workspaces';
    }
  }

  String get title {
    switch (this) {
      case MainHomeSection.functionHalls:
        return 'Function Halls';
      case MainHomeSection.lodgeRooms:
        return 'Lodge / Rooms';
      case MainHomeSection.pgHostels:
        return 'PG / Hostels';
      case MainHomeSection.institutesClasses:
        return 'Institutes / Classes';
      case MainHomeSection.sportsWorkspaces:
        return 'Sports & Workspaces';
    }
  }

  String get subtitle {
    switch (this) {
      case MainHomeSection.functionHalls:
        return 'Marriage, Convention, Party, Community & Govt Halls';
      case MainHomeSection.lodgeRooms:
        return 'Hotels, Lodges, Guest Houses & Hourly Rooms';
      case MainHomeSection.pgHostels:
        return 'Gents, Ladies, Co-Living & Student Hostels';
      case MainHomeSection.institutesClasses:
        return 'Coaching, Tuition, IT Academies, Dance & Music';
      case MainHomeSection.sportsWorkspaces:
        return 'Box Cricket, Turfs, Gyms, Co-Working & Photo Studios';
    }
  }

  IconData get icon {
    switch (this) {
      case MainHomeSection.functionHalls:
        return Icons.account_balance_rounded;
      case MainHomeSection.lodgeRooms:
        return Icons.hotel_rounded;
      case MainHomeSection.pgHostels:
        return Icons.apartment_rounded;
      case MainHomeSection.institutesClasses:
        return Icons.school_rounded;
      case MainHomeSection.sportsWorkspaces:
        return Icons.sports_soccer_rounded;
    }
  }

  String get emoji {
    switch (this) {
      case MainHomeSection.functionHalls:
        return '🏛️';
      case MainHomeSection.lodgeRooms:
        return '🏨';
      case MainHomeSection.pgHostels:
        return '🏠';
      case MainHomeSection.institutesClasses:
        return '🎓';
      case MainHomeSection.sportsWorkspaces:
        return '⚡';
    }
  }

  String get imageUrl {
    switch (this) {
      case MainHomeSection.functionHalls:
        return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&auto=format&fit=crop&q=80';
      case MainHomeSection.lodgeRooms:
        return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&auto=format&fit=crop&q=80';
      case MainHomeSection.pgHostels:
        return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&auto=format&fit=crop&q=80';
      case MainHomeSection.institutesClasses:
        return 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&auto=format&fit=crop&q=80';
      case MainHomeSection.sportsWorkspaces:
        return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80';
    }
  }

  List<SubCategoryOption> get categoryOptions {
    switch (this) {
      case MainHomeSection.functionHalls:
        return const [
          SubCategoryOption('all', 'All Halls', '🏛️'),
          SubCategoryOption('marriage_hall', 'Marriage Hall', '💍'),
          SubCategoryOption('convention_center', 'Convention Hall', '🏢'),
          SubCategoryOption('party_hall', 'Party Hall', '🎉'),
          SubCategoryOption('community_hall', 'Community Hall', '👥'),
          SubCategoryOption('govt_hall', 'Govt Hall', '🏛️'),
          SubCategoryOption('auditorium', 'Auditorium', '🎭'),
        ];
      case MainHomeSection.lodgeRooms:
        return const [
          SubCategoryOption('all', 'All Rooms', '🏨'),
          SubCategoryOption('hotel', 'Hotel', '🛎️'),
          SubCategoryOption('lodge', 'Lodge', '🛏️'),
          SubCategoryOption('guest_house', 'Guest House', '🏡'),
          SubCategoryOption('homestay', 'Homestay', '🌿'),
          SubCategoryOption('resort', 'Resort', '🌴'),
          SubCategoryOption('hourly_room', 'Hourly Room', '⏱️'),
        ];
      case MainHomeSection.pgHostels:
        return const [
          SubCategoryOption('all', 'All PGs', '🏠'),
          SubCategoryOption('gents_pg', 'Gents PG', '👨'),
          SubCategoryOption('ladies_pg', 'Ladies PG', '👩'),
          SubCategoryOption('student_hostel', 'Student Hostel', '🎒'),
          SubCategoryOption('coliving', 'Co-Living', '🛋️'),
          SubCategoryOption('working_men', 'Working Men', '💼'),
          SubCategoryOption('working_women', 'Working Women', '👩‍💼'),
        ];
      case MainHomeSection.institutesClasses:
        return const [
          SubCategoryOption('all', 'All Classes', '🎓'),
          SubCategoryOption('coaching', 'Coaching', '📚'),
          SubCategoryOption('tuition', 'Tuition', '✏️'),
          SubCategoryOption('computer', 'Computer / IT', '💻'),
          SubCategoryOption('dance', 'Dance Academy', '💃'),
          SubCategoryOption('music', 'Music School', '🎵'),
          SubCategoryOption('sports', 'Sports & Fitness', '🏋️'),
        ];
      case MainHomeSection.sportsWorkspaces:
        return const [
          SubCategoryOption('all', 'All Spaces', '⚡'),
          SubCategoryOption('turf', 'Box Turf & Cricket', '⚽'),
          SubCategoryOption('gym', 'Gym & Fitness', '🏋️'),
          SubCategoryOption('coworking', 'Co-Working & Desks', '💼'),
          SubCategoryOption('studios', 'Photo & Film Studios', '📸'),
          SubCategoryOption('meeting', 'Meeting & Board Rooms', '🤝'),
        ];
    }
  }
}

class SubCategoryOption {
  const SubCategoryOption(this.id, this.label, this.emoji);
  final String id;
  final String label;
  final String emoji;
}

class AmenityFilter {
  const AmenityFilter(this.id, this.label, this.emoji);
  final String id;
  final String label;
  final String emoji;
}

const _homeAmenities = [
  AmenityFilter('wifi', 'WiFi', '📶'),
  AmenityFilter('ac', 'Air Conditioned', '❄️'),
  AmenityFilter('parking', 'Parking', '🚗'),
  AmenityFilter('food', 'Food / Catering', '🍽️'),
  AmenityFilter('generator', 'Power Backup', '⚡'),
  AmenityFilter('cctv', 'CCTV Security', '📹'),
  AmenityFilter('lift', 'Elevator', '🛗'),
];

/// Redesigned BookMySpace customer Home Screen:
/// - First Screen: ONLY 4 Main Sections in a fast, responsive, attractive layout
/// - Section Drill-Down: Category Index -> Location -> Search & Voice Booking -> Results -> Direct Booking/Call/WhatsApp
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  MainHomeSection? _selectedSection;
  String _selectedCategorySlug = 'all';
  String _currentLocation = 'Hyderabad (Madhapur)';
  String _searchRadius = 'Within 10 km';
  final Set<String> _selectedAmenities = {};
  String _searchQuery = '';

  void _handleClaimDeal(HotDealItem deal) {
    setState(() {
      switch (deal.targetSectionId) {
        case 'function_halls':
          _selectedSection = MainHomeSection.functionHalls;
          break;
        case 'lodge_rooms':
          _selectedSection = MainHomeSection.lodgeRooms;
          break;
        case 'pg_hostels':
          _selectedSection = MainHomeSection.pgHostels;
          break;
        case 'institutes_classes':
          _selectedSection = MainHomeSection.institutesClasses;
          break;
        case 'sports_workspaces':
          _selectedSection = MainHomeSection.sportsWorkspaces;
          break;
      }
      _selectedCategorySlug = deal.targetCategorySlug ?? 'all';
    });
  }

  void _handleQuickRadarCategory(String categorySlug) {
    setState(() {
      if (categorySlug == 'marriage_hall' || categorySlug == 'party_lawn') {
        _selectedSection = MainHomeSection.functionHalls;
        _selectedCategorySlug = categorySlug;
      } else if (categorySlug == 'hourly_room' || categorySlug == 'hotel') {
        _selectedSection = MainHomeSection.lodgeRooms;
        _selectedCategorySlug = categorySlug;
      } else if (categorySlug == 'gents_pg' || categorySlug == 'ladies_pg') {
        _selectedSection = MainHomeSection.pgHostels;
        _selectedCategorySlug = categorySlug;
      } else if (categorySlug == 'dance') {
        _selectedSection = MainHomeSection.institutesClasses;
        _selectedCategorySlug = categorySlug;
      } else if (categorySlug == 'sports' || categorySlug == 'turf' || categorySlug == 'coworking') {
        _selectedSection = MainHomeSection.sportsWorkspaces;
        _selectedCategorySlug = categorySlug;
      } else {
        _selectedCategorySlug = categorySlug;
      }
    });
  }

  void _handleSelectStripSection(String sectionId) {
    if (sectionId == 'other_custom') {
      _showAddCustomCategoryModal();
      return;
    }
    setState(() {
      switch (sectionId) {
        case 'function_halls':
          _selectedSection = MainHomeSection.functionHalls;
          break;
        case 'lodge_rooms':
          _selectedSection = MainHomeSection.lodgeRooms;
          break;
        case 'pg_hostels':
          _selectedSection = MainHomeSection.pgHostels;
          break;
        case 'institutes_classes':
          _selectedSection = MainHomeSection.institutesClasses;
          break;
        case 'sports_workspaces':
          _selectedSection = MainHomeSection.sportsWorkspaces;
          break;
      }
      _selectedCategorySlug = 'all';
    });
  }

  void _showAddCustomCategoryModal() {
    final textController = TextEditingController();
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[400],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF7C3AED).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.add_circle_outline, color: Color(0xFF7C3AED)),
                  ),
                  const SizedBox(width: 12),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Add Custom Category',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'E.g. Studios, Gaming, Ashrams, Pet Care',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextField(
                controller: textController,
                autofocus: true,
                decoration: InputDecoration(
                  hintText: 'Category Name (e.g. Yoga Studio, Turf Ground)',
                  filled: true,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    final val = textController.text.trim();
                    if (val.isNotEmpty) {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Category "$val" requested! Our team will verify spaces.'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7C3AED),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: const Text('Submit Category Request', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final authState = ref.watch(authNotifierProvider);
    final user = authState.user;
    final popularVenuesAsync = ref.watch(popularVenuesProvider);
    final nearbyVenuesAsync = ref.watch(nearbyVenuesProvider);
    final locationState = ref.watch(userLocationProvider);

    // Keep local fields in sync with location state
    _currentLocation = locationState.displayTitle;
    _searchRadius = locationState.radiusLabel;

    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      floatingActionButton: _selectedSection == null
          ? FloatingAiHelpButton(
              onTap: () => context.push(AppRoutes.support),
            )
          : null,
      body: SafeArea(
        child: ResponsiveLayoutBuilder(
          builder: (context, responsive) {
            return RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(popularVenuesProvider);
                ref.invalidate(nearbyVenuesProvider);
                ref.invalidate(venueCategoriesProvider);
              },
              child: CustomScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                slivers: [
                  // Top App Bar
                  SliverToBoxAdapter(
                    child: _TopHeaderBar(
                      user: user,
                      responsive: responsive,
                      onLoginTap: () => context.push(AppRoutes.login),
                      onProfileTap: () => context.push(AppRoutes.profile),
                      onNotificationsTap: () => context.push(AppRoutes.notifications),
                    ),
                  ),

                  // Persistent Hierarchical Location Banner
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: EdgeInsets.symmetric(
                        horizontal: responsive.horizontalPadding,
                        vertical: 4,
                      ),
                      child: _LocationTopBanner(
                        location: locationState.displayTitle,
                        breadcrumb: locationState.breadcrumb,
                        radius: locationState.radiusLabel,
                        pincode: locationState.location.pincode,
                        onTap: _showLocationPickerModal,
                      ),
                    ),
                  ),

                  // =========================================================
                  // 🌟 FIRST SCREEN: EXACTLY 5 MAIN SECTIONS + NESTED SUB-SECTIONS
                  // =========================================================
                  if (_selectedSection == null) ...[
                    // 1. Top status notice (cloud sync notice)
                    const SliverToBoxAdapter(
                      child: DismissibleSyncBanner(),
                    ),

                    // 2. Eye-catching Hot Deals carousel
                    SliverToBoxAdapter(
                      child: HotDealsCarouselWidget(
                        onClaimDeal: _handleClaimDeal,
                      ),
                    ),

                    const SliverToBoxAdapter(
                      child: SizedBox(height: 12),
                    ),

                    // 3. Section Header & Grid
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: EdgeInsets.symmetric(
                          horizontal: responsive.horizontalPadding,
                          vertical: 8,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Book Your Space',
                                  style: theme.textTheme.headlineMedium?.copyWith(
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: -0.5,
                                    color: theme.colorScheme.onSurface,
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppTheme.brand.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: AppTheme.brand.withValues(alpha: 0.2),
                                    ),
                                  ),
                                  child: const Text(
                                    '5 Core Sections',
                                    style: TextStyle(
                                      color: AppTheme.brand,
                                      fontWeight: FontWeight.w800,
                                      fontSize: 11,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Browse our 5 core sections. All space sub-types are organized under each section:',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                            const SizedBox(height: 14),
                          ],
                        ),
                      ),
                    ),

                    // Dynamic Aspect Ratio Responsive Grid for the 5 Main Sections
                    SliverPadding(
                      padding: EdgeInsets.symmetric(
                        horizontal: responsive.horizontalPadding,
                      ),
                      sliver: SliverGrid(
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: responsive.categoryColumns,
                          mainAxisSpacing: responsive.gridSpacing,
                          crossAxisSpacing: responsive.gridSpacing,
                          childAspectRatio: responsive.categoryAspectRatio,
                        ),
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            final section = MainHomeSection.values[index];
                            return _MainSectionHeroCard(
                              section: section,
                              isTabletOrWide: responsive.isTabletOrLandscape,
                              onTap: () {
                                setState(() {
                                  _selectedSection = section;
                                  _selectedCategorySlug = 'all';
                                });
                              },
                            );
                          },
                          childCount: MainHomeSection.values.length,
                        ),
                      ),
                    ),

                    // Location bar at bottom of first screen
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: EdgeInsets.symmetric(
                          horizontal: responsive.horizontalPadding,
                          vertical: 24,
                        ),
                        child: _LocationFooterCard(
                          currentLocation: _currentLocation,
                          searchRadius: _searchRadius,
                          onTap: _showLocationPickerModal,
                        ),
                      ),
                    ),
                  ]

                  // =========================================================
                  // 🚀 SECTION DRILL-DOWN: Category Index -> Location -> Results
                  // =========================================================
                  else ...[
                    // Section Back & Title Header
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: EdgeInsets.symmetric(
                          horizontal: responsive.horizontalPadding,
                          vertical: 8,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                OutlinedButton.icon(
                                  onPressed: () {
                                    setState(() {
                                      _selectedSection = null;
                                      _selectedCategorySlug = 'all';
                                    });
                                  },
                                  style: OutlinedButton.styleFrom(
                                    minimumSize: const Size(120, 44),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 14,
                                      vertical: 8,
                                    ),
                                  ),
                                  icon: const Icon(Icons.arrow_back_rounded, size: 18),
                                  label: const Text(
                                    'All Spaces',
                                    style: TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: theme.colorScheme.primaryContainer,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(_selectedSection!.emoji, style: const TextStyle(fontSize: 16)),
                                      const SizedBox(width: 6),
                                      Text(
                                        _selectedSection!.title,
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13,
                                          color: theme.colorScheme.onPrimaryContainer,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              '${_selectedSection!.emoji} ${_selectedSection!.title}',
                              style: theme.textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            Text(
                              _selectedSection!.subtitle,
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                            const SizedBox(height: 12),

                            // Location selector
                            _LocationSelectorBar(
                              location: _currentLocation,
                              radius: _searchRadius,
                              onTap: _showLocationPickerModal,
                            ),
                          ],
                        ),
                      ),
                    ),

                    // 1. Relevant Index / Categories (Horizontal Row)
                    SliverToBoxAdapter(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: EdgeInsets.symmetric(
                              horizontal: responsive.horizontalPadding,
                              vertical: 4,
                            ),
                            child: Text(
                              'Choose Category',
                              style: theme.textTheme.titleSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(height: 6),
                          SizedBox(
                            height: 44,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              padding: EdgeInsets.symmetric(
                                horizontal: responsive.horizontalPadding,
                              ),
                              itemCount: _selectedSection!.categoryOptions.length,
                              separatorBuilder: (_, __) => const SizedBox(width: 8),
                              itemBuilder: (context, index) {
                                final cat = _selectedSection!.categoryOptions[index];
                                final isSelected = _selectedCategorySlug == cat.id;
                                return AnimatedCategoryChip(
                                  selected: isSelected,
                                  label: cat.label,
                                  emoji: cat.emoji,
                                  onTap: () {
                                    setState(() {
                                      _selectedCategorySlug = cat.id;
                                    });
                                  },
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ),

                    // 2. Unified Search & Discovery Bar (with inline Voice & Filter)
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: EdgeInsets.symmetric(
                          horizontal: responsive.horizontalPadding,
                          vertical: 10,
                        ),
                        child: Container(
                          decoration: BoxDecoration(
                            color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
                            ),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: InkWell(
                                  onTap: () {
                                    context.push(
                                      AppRoutes.search,
                                      extra: {
                                        'category': _selectedCategorySlug == 'all'
                                            ? _selectedSection!.id
                                            : _selectedCategorySlug,
                                      },
                                    );
                                  },
                                  borderRadius: const BorderRadius.horizontal(
                                    left: Radius.circular(16),
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 14,
                                      vertical: 12,
                                    ),
                                    child: Row(
                                      children: [
                                        Icon(
                                          Icons.search_rounded,
                                          color: theme.colorScheme.primary,
                                        ),
                                        const SizedBox(width: 10),
                                        Expanded(
                                          child: Text(
                                            'Search ${_selectedSection!.title} in $_currentLocation...',
                                            style: TextStyle(
                                              color: theme.colorScheme.onSurfaceVariant,
                                              fontSize: 13.5,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                              // Inline Voice Search button
                              IconButton(
                                icon: const Icon(Icons.mic_rounded),
                                tooltip: 'Voice Search & Booking',
                                color: AppTheme.brand,
                                onPressed: () => _showVoiceBookingDialog(context),
                              ),
                              // Inline Filter button
                              Padding(
                                padding: const EdgeInsets.only(right: 6),
                                child: IconButton(
                                  icon: const Icon(Icons.tune_rounded, size: 18),
                                  tooltip: 'Filter Spaces',
                                  color: theme.colorScheme.primary,
                                  onPressed: () {
                                    context.push(
                                      AppRoutes.search,
                                      extra: {
                                        'category': _selectedCategorySlug == 'all'
                                            ? _selectedSection!.id
                                            : _selectedCategorySlug,
                                      },
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    // 3. Amenity Filter Chips
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: EdgeInsets.symmetric(
                          horizontal: responsive.horizontalPadding,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Filter by Amenities',
                                  style: theme.textTheme.titleSmall?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                if (_selectedAmenities.isNotEmpty)
                                  TextButton(
                                    onPressed: () {
                                      setState(() {
                                        _selectedAmenities.clear();
                                      });
                                    },
                                    child: const Text('Clear Filters'),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            SizedBox(
                              height: 38,
                              child: ListView.separated(
                                scrollDirection: Axis.horizontal,
                                itemCount: _homeAmenities.length,
                                separatorBuilder: (_, __) => const SizedBox(width: 8),
                                itemBuilder: (context, index) {
                                  final amenity = _homeAmenities[index];
                                  final isSelected = _selectedAmenities.contains(amenity.id);
                                  return AnimatedCategoryChip(
                                    selected: isSelected,
                                    label: amenity.label,
                                    emoji: amenity.emoji,
                                    height: 34,
                                    selectedColor: theme.colorScheme.primaryContainer,
                                    selectedTextColor: theme.colorScheme.onPrimaryContainer,
                                    onTap: () {
                                      setState(() {
                                        if (isSelected) {
                                          _selectedAmenities.remove(amenity.id);
                                        } else {
                                          _selectedAmenities.add(amenity.id);
                                        }
                                      });
                                    },
                                  );
                                },
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Available Spaces Near ${locationState.location.townOrVillage} (${locationState.radiusLabel})',
                              style: theme.textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                          ],
                        ),
                      ),
                    ),

                    // 4. Venues List / Grid in Responsive Layout (Closest to chosen Town/PIN first)
                    nearbyVenuesAsync.when(
                      data: (venues) {
                        // Filter by selected category if not 'all'
                        final filtered = _selectedCategorySlug == 'all'
                            ? venues
                            : venues.where((v) => v.categorySlug == _selectedCategorySlug).toList();

                        final displayList = filtered.isNotEmpty ? filtered : venues;

                        if (displayList.isEmpty) {
                          return const SliverToBoxAdapter(
                            child: Padding(
                              padding: EdgeInsets.all(32),
                              child: EmptyState(
                                icon: Icons.search_off_rounded,
                                title: 'No spaces found nearby',
                                message: 'Try expanding the search radius or choosing another town/PIN.',
                              ),
                            ),
                          );
                        }

                        return SliverPadding(
                          padding: EdgeInsets.symmetric(
                            horizontal: responsive.horizontalPadding,
                            vertical: 8,
                          ),
                          sliver: SliverGrid(
                            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: responsive.resultsColumns,
                              mainAxisSpacing: responsive.gridSpacing,
                              crossAxisSpacing: responsive.gridSpacing,
                              childAspectRatio: responsive.resultsAspectRatio,
                            ),
                            delegate: SliverChildBuilderDelegate(
                              (context, index) {
                                final venue = displayList[index % displayList.length];
                                return _SectionVenueCard(
                                  venue: venue,
                                  onTap: () => context.push(
                                    AppRoutes.venueDetails.replaceAll(':id', venue.id),
                                  ),
                                  onBookTap: () => context.push(
                                    AppRoutes.bookingFlow.replaceAll(':id', venue.id),
                                  ),
                                  onCallTap: () => _handleCall(context, venue),
                                  onWhatsAppTap: () => _handleWhatsApp(context, venue),
                                );
                              },
                              childCount: displayList.length,
                            ),
                          ),
                        );
                      },
                      loading: () => SliverToBoxAdapter(
                        child: Padding(
                          padding: EdgeInsets.all(responsive.horizontalPadding),
                          child: const Row(
                            children: [
                              Expanded(child: SkeletonBox(height: 220, radius: 16)),
                              SizedBox(width: 12),
                              Expanded(child: SkeletonBox(height: 220, radius: 16)),
                            ],
                          ),
                        ),
                      ),
                      error: (err, _) => SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: ErrorView(
                            message: err.toString(),
                            onRetry: () => ref.invalidate(popularVenuesProvider),
                          ),
                        ),
                      ),
                    ),

                    const SliverToBoxAdapter(
                      child: SizedBox(height: 48),
                    ),
                  ],
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  void _showLocationPickerModal() {
    HierarchicalLocationPickerDialog.show(
      context,
      onLocationSelected: (location, radiusKm) {
        setState(() {
          _currentLocation = location.shortLabel;
          _searchRadius = radiusKm >= 100 ? 'Entire City' : 'Within ${radiusKm.toInt()} km';
        });
      },
    );
  }

  void _showVoiceBookingDialog(BuildContext context) {
    VoiceSearchBottomSheet.show(
      context,
      onFilterApplied: (voiceResult) {
        final newQuery = voiceResult.toVenueSearchQuery();
        ref.read(searchQueryProvider.notifier).state = newQuery;
        context.push(AppRoutes.search);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Text('🎙️ '),
                Expanded(
                  child: Text(
                    voiceResult.spokenFeedback.isNotEmpty
                        ? voiceResult.spokenFeedback
                        : 'Voice search filter applied!',
                  ),
                ),
              ],
            ),
            duration: const Duration(seconds: 3),
            behavior: SnackBarBehavior.floating,
          ),
        );
      },
      onFallbackToText: () {
        context.push(AppRoutes.search);
      },
    );
  }

  void _handleCall(BuildContext context, Venue venue) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Calling ${venue.name} contact desk...'),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _handleWhatsApp(BuildContext context, Venue venue) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Opening WhatsApp chat with ${venue.name}...'),
        duration: const Duration(seconds: 2),
      ),
    );
  }
}

/// Header Bar with Logo and Profile Actions
class _TopHeaderBar extends StatelessWidget {
  const _TopHeaderBar({
    required this.user,
    required this.responsive,
    required this.onLoginTap,
    required this.onProfileTap,
    required this.onNotificationsTap,
  });

  final dynamic user;
  final ResponsiveInfo responsive;
  final VoidCallback onLoginTap;
  final VoidCallback onProfileTap;
  final VoidCallback onNotificationsTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: responsive.horizontalPadding,
        vertical: 12,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppTheme.brand, Color(0xFF757DE8)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.domain_rounded,
                  color: Colors.white,
                  size: 22,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'BookMySpace',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.5,
                  color: AppTheme.brand,
                ),
              ),
            ],
          ),
          Row(
            children: [
              if (user == null)
                FilledButton.tonalIcon(
                  onPressed: onLoginTap,
                  style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    minimumSize: const Size(80, 40),
                  ),
                  icon: const Icon(Icons.login_rounded, size: 16),
                  label: const Text('Sign In', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                )
              else
                InkWell(
                  onTap: onProfileTap,
                  borderRadius: BorderRadius.circular(20),
                  child: CircleAvatar(
                    radius: 18,
                    backgroundColor: theme.colorScheme.primaryContainer,
                    child: Text(
                      user?.email?.isNotEmpty == true ? user.email[0].toUpperCase() : 'U',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.onPrimaryContainer,
                      ),
                    ),
                  ),
                ),
              const SizedBox(width: 8),
              IconButton.filledTonal(
                onPressed: () => context.push(AppRoutes.map),
                tooltip: 'Live Map Discovery',
                icon: const Icon(Icons.map_rounded, size: 20),
              ),
              const SizedBox(width: 8),
              IconButton.filledTonal(
                onPressed: () => context.push(AppRoutes.qrScanner),
                tooltip: 'QR Check-In',
                icon: const Icon(Icons.qr_code_scanner_rounded, size: 20),
              ),
              const SizedBox(width: 8),
              IconButton.filledTonal(
                onPressed: onNotificationsTap,
                icon: const Icon(Icons.notifications_none_rounded, size: 20),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// Large, eye-catching, extremely simple Hero Card for the 4 Main Sections on the first screen.
/// Adapts dynamically on phone single-column, tablet 2-column, and extra-wide landscape 4-column layouts.
/// Uses [AnimatedContainer] and [AnimatedOpacity] to deliver smooth visual feedback on tap and hover.
class _MainSectionHeroCard extends StatefulWidget {
  const _MainSectionHeroCard({
    required this.section,
    required this.isTabletOrWide,
    required this.onTap,
  });

  final MainHomeSection section;
  final bool isTabletOrWide;
  final VoidCallback onTap;

  @override
  State<_MainSectionHeroCard> createState() => _MainSectionHeroCardState();
}

class _MainSectionHeroCardState extends State<_MainSectionHeroCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AnimatedScale(
      scale: _isPressed ? 0.97 : 1.0,
      duration: const Duration(milliseconds: 150),
      curve: Curves.easeOutCubic,
      child: AnimatedOpacity(
        opacity: _isPressed ? 0.92 : 1.0,
        duration: const Duration(milliseconds: 150),
        curve: Curves.easeInOut,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOutCubic,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(widget.isTabletOrWide ? 22 : 18),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: _isPressed ? 0.08 : 0.16),
                blurRadius: _isPressed ? 4 : 12,
                offset: Offset(0, _isPressed ? 2 : 5),
              ),
            ],
          ),
          child: Card(
            clipBehavior: Clip.antiAlias,
            elevation: 0,
            margin: EdgeInsets.zero,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(widget.isTabletOrWide ? 22 : 18),
              side: BorderSide(
                color: theme.colorScheme.outlineVariant.withValues(alpha: 0.4),
              ),
            ),
            child: InkWell(
              onTap: widget.onTap,
              onHighlightChanged: (highlighted) {
                setState(() => _isPressed = highlighted);
              },
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Background Image
                  AppNetworkImage(
                    url: widget.section.imageUrl,
                    fit: BoxFit.cover,
                  ),

                  // High-Contrast Gradient Scrim
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.black.withValues(alpha: 0.90),
                          Colors.black.withValues(alpha: 0.74),
                          Colors.black.withValues(alpha: 0.35),
                        ],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                    ),
                  ),

                  // Content
                  Padding(
                    padding: EdgeInsets.symmetric(
                      horizontal: widget.isTabletOrWide ? 18 : 16,
                      vertical: 12,
                    ),
                    child: Row(
                      children: [
                        // Icon / Landmark Badge
                        Container(
                          width: widget.isTabletOrWide ? 56 : 48,
                          height: widget.isTabletOrWide ? 56 : 48,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.22),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.3),
                            ),
                          ),
                          alignment: Alignment.center,
                          child: Icon(
                            widget.section.icon,
                            color: Colors.white,
                            size: widget.isTabletOrWide ? 28 : 24,
                          ),
                        ),
                        const SizedBox(width: 14),

                        // Text Info
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                widget.section.title,
                                style: TextStyle(
                                  fontSize: widget.isTabletOrWide ? 18 : 16.5,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  letterSpacing: -0.3,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 3),
                              Text(
                                widget.section.subtitle,
                                style: TextStyle(
                                  fontSize: widget.isTabletOrWide ? 12 : 11.5,
                                  color: Colors.white.withValues(alpha: 0.85),
                                  height: 1.25,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 6),
                              // Sub-sections preview chips
                              Wrap(
                                spacing: 4,
                                runSpacing: 4,
                                children: widget.section.categoryOptions
                                    .where((c) => c.id != 'all')
                                    .take(widget.isTabletOrWide ? 5 : 3)
                                    .map((c) => Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 6,
                                            vertical: 2,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.white.withValues(alpha: 0.18),
                                            borderRadius: BorderRadius.circular(6),
                                            border: Border.all(
                                              color: Colors.white.withValues(alpha: 0.25),
                                              width: 0.5,
                                            ),
                                          ),
                                          child: Text(
                                            '${c.emoji} ${c.label}',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 9.5,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ))
                                    .toList(),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(width: 8),

                        // Circular Action Arrow
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 180),
                          transform: _isPressed
                              ? Matrix4.translationValues(3, 0, 0)
                              : Matrix4.identity(),
                          width: widget.isTabletOrWide ? 42 : 36,
                          height: widget.isTabletOrWide ? 42 : 36,
                          decoration: const BoxDecoration(
                            color: AppTheme.brand,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.arrow_forward_rounded,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Top Banner displaying active administrative location with breadcrumb and PIN
class _LocationTopBanner extends StatelessWidget {
  const _LocationTopBanner({
    required this.location,
    required this.breadcrumb,
    required this.radius,
    required this.pincode,
    required this.onTap,
  });

  final String location;
  final String breadcrumb;
  final String radius;
  final String pincode;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: isDark
                ? AppTheme.brand.withValues(alpha: 0.15)
                : const Color(0xFFF0F4FF),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: AppTheme.brand.withValues(alpha: 0.3),
              width: 1.2,
            ),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.brand,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.brand.withValues(alpha: 0.3),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.place_rounded,
                  color: Colors.white,
                  size: 18,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            location,
                            style: theme.textTheme.labelLarge?.copyWith(
                              fontWeight: FontWeight.w800,
                              fontSize: 13.5,
                              color: isDark ? Colors.white : const Color(0xFF1E293B),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.brand.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'PIN $pincode',
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.brand,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '$breadcrumb · $radius',
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontSize: 11,
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.brand.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Change',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.brand,
                      ),
                    ),
                    SizedBox(width: 2),
                    Icon(
                      Icons.keyboard_arrow_down_rounded,
                      size: 16,
                      color: AppTheme.brand,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Location Footer Card at the bottom of the first screen
class _LocationFooterCard extends StatelessWidget {
  const _LocationFooterCard({
    required this.currentLocation,
    required this.searchRadius,
    required this.onTap,
  });

  final String currentLocation;
  final String searchRadius;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.4),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: theme.colorScheme.outlineVariant.withValues(alpha: 0.4),
          ),
        ),
        child: Row(
          children: [
            const Text('📍', style: TextStyle(fontSize: 20)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Selected Area: $currentLocation',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  Text(
                    'Tap to choose Country > State > District > Mandal > Town ($searchRadius)',
                    style: TextStyle(
                      fontSize: 11.5,
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.edit_location_alt_rounded,
              color: theme.colorScheme.primary,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}

/// Location Selector Bar inside Section Drill-Down
class _LocationSelectorBar extends StatelessWidget {
  const _LocationSelectorBar({
    required this.location,
    required this.radius,
    required this.onTap,
  });

  final String location;
  final String radius;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: theme.colorScheme.primaryContainer.withValues(alpha: 0.4),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: theme.colorScheme.primary.withValues(alpha: 0.2),
          ),
        ),
        child: Row(
          children: [
            Icon(Icons.location_on, color: theme.colorScheme.primary, size: 18),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                '$location • $radius',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 12.5,
                  color: theme.colorScheme.primary,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Text(
              'Change (Country/State/Town/PIN)',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 11.5,
                color: theme.colorScheme.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Voice Booking Banner
class _VoiceBookingBanner extends StatelessWidget {
  const _VoiceBookingBanner({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF283593), Color(0xFF3F51B5)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: AppTheme.brand.withValues(alpha: 0.2),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.mic_rounded, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '🎙️ Bol-ke-Book (Voice Search)',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 13.5,
                    ),
                  ),
                  Text(
                    'Tap to speak and book in Telugu, Hindi or English',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white70, size: 14),
          ],
        ),
      ),
    );
  }
}

/// Quick 1-Tap Booking Card
class _QuickBookCard extends StatelessWidget {
  const _QuickBookCard({
    required this.sectionTitle,
    required this.onQuickBookTap,
  });

  final String sectionTitle;
  final VoidCallback onQuickBookTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppTheme.accent.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text('⚡', style: TextStyle(fontSize: 20)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '1-Tap Fast Booking',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                ),
                Text(
                  'Instant confirmation for top-rated $sectionTitle',
                  style: TextStyle(
                    fontSize: 11,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
          FilledButton.tonal(
            onPressed: onQuickBookTap,
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              minimumSize: const Size(70, 36),
            ),
            child: const Text('Book', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}

/// Venue / Space Result Card with Direct Book, Call, and WhatsApp Buttons
class _SectionVenueCard extends StatelessWidget {
  const _SectionVenueCard({
    required this.venue,
    required this.onTap,
    required this.onBookTap,
    required this.onCallTap,
    required this.onWhatsAppTap,
  });

  final Venue venue;
  final VoidCallback onTap;
  final VoidCallback onBookTap;
  final VoidCallback onCallTap;
  final VoidCallback onWhatsAppTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: theme.colorScheme.outlineVariant.withValues(alpha: 0.4),
        ),
      ),
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Venue Cover Image & Badges
            SizedBox(
              height: 130,
              width: double.infinity,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  AppNetworkImage(url: venue.coverImageUrl, fit: BoxFit.cover),
                  if (venue.avgRating > 0)
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.7),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: RatingBadge(
                          rating: venue.avgRating,
                          count: venue.ratingCount,
                        ),
                      ),
                    ),
                  if (venue.distanceKm != null)
                    Positioned(
                      left: 8,
                      bottom: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.7),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.near_me_rounded, size: 12, color: Colors.white),
                            const SizedBox(width: 4),
                            Text(
                              formatDistance(venue.distanceKm),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),

            // Venue Details
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    venue.name,
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${venue.addressLine1.isNotEmpty ? venue.addressLine1 : venue.city}, ${venue.city}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                      fontSize: 11.5,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),

                  // Pricing & Capacity
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '₹${venue.pricingBaseAmount.toInt()}/day',
                        style: TextStyle(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.w900,
                          fontSize: 13.5,
                        ),
                      ),
                      if (venue.capacity > 0)
                        Text(
                          '👥 ${venue.capacity} Guests',
                          style: TextStyle(
                            fontSize: 11,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Action Buttons: Book Now, Call, WhatsApp
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton(
                          onPressed: onBookTap,
                          style: FilledButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            minimumSize: const Size(0, 38),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: const Text(
                            'Book Now',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      IconButton.outlined(
                        onPressed: onCallTap,
                        style: IconButton.outlinedFrom(
                          minimumSize: const Size(38, 38),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        icon: const Icon(Icons.phone_rounded, size: 16),
                      ),
                      const SizedBox(width: 6),
                      IconButton.filledTonal(
                        onPressed: onWhatsAppTap,
                        style: IconButton.filledTonalFrom(
                          minimumSize: const Size(38, 38),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        icon: const Text('💬', style: TextStyle(fontSize: 14)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
