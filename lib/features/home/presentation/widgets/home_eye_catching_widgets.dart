import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Data model for Hot Deals matching the eye-catching promo banner
class HotDealItem {
  const HotDealItem({
    required this.id,
    required this.tag,
    required this.timeTag,
    required this.title,
    required this.subtitle,
    required this.promoCode,
    required this.gradientColors,
    required this.targetSectionId,
    this.targetCategorySlug,
  });

  final String id;
  final String tag;
  final String timeTag;
  final String title;
  final String subtitle;
  final String promoCode;
  final List<Color> gradientColors;
  final String targetSectionId;
  final String? targetCategorySlug;
}

/// 1. ⚠️ Top Dismissible Status Banner matching reference screenshot
class DismissibleSyncBanner extends StatefulWidget {
  const DismissibleSyncBanner({
    super.key,
    this.message = 'Cloud sync is temporarily disconnected. Local cache active.',
  });

  final String message;

  @override
  State<DismissibleSyncBanner> createState() => _DismissibleSyncBannerState();
}

class _DismissibleSyncBannerState extends State<DismissibleSyncBanner> {
  bool _isDismissed = false;

  @override
  Widget build(BuildContext context) {
    if (_isDismissed) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF451A1A).withValues(alpha: 0.85),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFFEF4444).withValues(alpha: 0.45),
        ),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.warning_amber_rounded,
            color: Color(0xFFF87171),
            size: 18,
          ),
          const SizedBox(width: 8),
          const Icon(
            Icons.cloud_off_rounded,
            color: Colors.white70,
            size: 16,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              widget.message,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close, color: Colors.white70, size: 16),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(minWidth: 24, minHeight: 24),
            onPressed: () => setState(() => _isDismissed = true),
          ),
        ],
      ),
    );
  }
}

/// 2. 🔥 Eye-Catching Hot Deals & Flash Offers Carousel
class HotDealsCarouselWidget extends StatefulWidget {
  const HotDealsCarouselWidget({
    super.key,
    required this.onClaimDeal,
  });

  final ValueChanged<HotDealItem> onClaimDeal;

  @override
  State<HotDealsCarouselWidget> createState() => _HotDealsCarouselWidgetState();
}

class _HotDealsCarouselWidgetState extends State<HotDealsCarouselWidget> {
  late final PageController _pageController;
  Timer? _autoScrollTimer;
  int _currentPage = 0;

  static const List<HotDealItem> _deals = [
    HotDealItem(
      id: 'deal_pg',
      tag: '🛏️ 🏠 MONTHLY SAVE',
      timeTag: '⏱ Limited Beds',
      title: 'Gents & Ladies PG Hostels',
      subtitle: 'Zero Security Deposit + Free High-Speed WiFi Month',
      promoCode: 'ZEROPG',
      gradientColors: [
        Color(0xFFD97706),
        Color(0xFFEA580C),
        Color(0xFFC026D3),
      ],
      targetSectionId: 'pg_hostels',
      targetCategorySlug: 'all',
    ),
    HotDealItem(
      id: 'deal_wedding',
      tag: '💒 🔥 FLASH DEAL',
      timeTag: '⏱ Ends in 03h 45m',
      title: 'Grand Marriage & Banquet Halls',
      subtitle: 'Up to 35% OFF on Advance Bookings + Free AC Suite',
      promoCode: 'ROYALWED35',
      gradientColors: [
        Color(0xFFE11D48),
        Color(0xFF9333EA),
        Color(0xFF4F46E5),
      ],
      targetSectionId: 'function_halls',
      targetCategorySlug: 'marriage_hall',
    ),
    HotDealItem(
      id: 'deal_hotel',
      tag: '⚡ 🏨 INSTANT STAY',
      timeTag: '⏱ Today Only',
      title: 'Hotels, Lodges & Day Rooms',
      subtitle: 'Flat ₹600 OFF on 24-Hour & Hourly Check-ins',
      promoCode: 'FASTSTAY600',
      gradientColors: [
        Color(0xFF0284C7),
        Color(0xFF0D9488),
        Color(0xFF10B981),
      ],
      targetSectionId: 'lodge_rooms',
      targetCategorySlug: 'all',
    ),
    HotDealItem(
      id: 'deal_skills',
      tag: '🎓 🎯 EARLY BIRD',
      timeTag: '⏱ 5 Seats Left',
      title: 'Dance, Music & IT Academies',
      subtitle: '25% Cashback on First Batch Enrolment + Free Demo',
      promoCode: 'SKILL25',
      gradientColors: [
        Color(0xFF7C3AED),
        Color(0xFF2563EB),
        Color(0xFF06B6D4),
      ],
      targetSectionId: 'institutes_classes',
      targetCategorySlug: 'all',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _startAutoScroll();
  }

  void _startAutoScroll() {
    _autoScrollTimer?.cancel();
    _autoScrollTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (!mounted || !_pageController.hasClients) return;
      final nextPage = (_currentPage + 1) % _deals.size;
      _pageController.animateToPage(
        nextPage,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOutCubic,
      );
    });
  }

  @override
  void dispose() {
    _autoScrollTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _copyPromoCode(String code) {
    if (!kIsWeb) {
      HapticFeedback.selectionClick().catchError((_) {});
    }
    Clipboard.setData(ClipboardData(text: code));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Colors.greenAccent, size: 20),
            const SizedBox(width: 8),
            Text('Promo code $code copied!'),
          ],
        ),
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 180,
          child: PageView.builder(
            controller: _pageController,
            itemCount: _deals.length,
            onPageChanged: (index) => setState(() => _currentPage = index),
            itemBuilder: (context, index) {
              final deal = _deals[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: deal.gradientColors,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: deal.gradientColors.first.withValues(alpha: 0.35),
                        blurRadius: 14,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Top Row: Badges
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.22),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.35),
                              ),
                            ),
                            child: Text(
                              deal.tag,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 0.2,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.28),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              deal.timeTag,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),

                      // Title & Subtitle
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            deal.title,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.3,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 3),
                          Text(
                            deal.subtitle,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.90),
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),

                      // Bottom Action Row
                      Row(
                        children: [
                          // Use Code Pill
                          InkWell(
                            onTap: () => _copyPromoCode(deal.promoCode),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.22),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.60),
                                  style: BorderStyle.solid,
                                ),
                              ),
                              child: Text(
                                'USE CODE: ${deal.promoCode}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ),
                          ),
                          const Spacer(),

                          // Claim Deal Button
                          ElevatedButton.icon(
                            onPressed: () => widget.onClaimDeal(deal),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: Colors.black87,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                              ),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            ),
                            iconAlignment: IconAlignment.end,
                            icon: const Icon(Icons.arrow_forward_rounded, size: 14, color: Colors.black),
                            label: const Text(
                              'Claim Deal',
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 12.5,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),

        // Dots indicator
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_deals.length, (index) {
            final isActive = index == _currentPage;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: isActive ? 18 : 6,
              height: 6,
              decoration: BoxDecoration(
                color: isActive
                    ? Theme.of(context).colorScheme.primary
                    : Theme.of(context).colorScheme.outlineVariant.withValues(alpha: 0.5),
                borderRadius: BorderRadius.circular(3),
              ),
            );
          }),
        ),
      ],
    );
  }
}

extension on List {
  int get size => length;
}

/// 3. 📡 Live Space Radar Widget matching reference screenshot
class LiveSpaceRadarWidget extends StatelessWidget {
  const LiveSpaceRadarWidget({
    super.key,
    required this.locationName,
    required this.onSelectCategory,
  });

  final String locationName;
  final void Function(String categorySlug) onSelectCategory;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final quickChips = [
      (slug: 'marriage_hall', label: '💒 Weddings', color: const Color(0xFFF43F5E)),
      (slug: 'hourly_room', label: '🏨 24h Rooms', color: const Color(0xFF0EA5E9)),
      (slug: 'gents_pg', label: '⛺ Men PG', color: const Color(0xFF8B5CF6)),
      (slug: 'ladies_pg', label: '🌸 Ladies PG', color: const Color(0xFFEC4899)),
      (slug: 'party_lawn', label: '🌳 Open Lawns', color: const Color(0xFF10B981)),
      (slug: 'dance', label: '💃 Dance / Music', color: const Color(0xFFF59E0B)),
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? const Color(0xFF1E293B) : const Color(0xFFCBD5E1),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Pulsing Green Dot + Live Space Radar + ACTIVE Badge
          Row(
            children: [
              // Radar Pulse Beacon
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF10B981).withValues(alpha: 0.20),
                ),
                child: Center(
                  child: Container(
                    width: 14,
                    height: 14,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFF10B981),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),

              // Title and verified count
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          'Live Space Radar',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            color: theme.colorScheme.onSurface,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withValues(alpha: 0.18),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'ACTIVE',
                            style: TextStyle(
                              color: Color(0xFF10B981),
                              fontSize: 9.5,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '$locationName • 28+ Spaces Verified',
                      style: TextStyle(
                        fontSize: 11.5,
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // Horizontal Quick Chips Row
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: Row(
              children: quickChips.map((chip) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: InkWell(
                    onTap: () => onSelectCategory(chip.slug),
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                      decoration: BoxDecoration(
                        color: chip.color.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: chip.color.withValues(alpha: 0.35),
                        ),
                      ),
                      child: Text(
                        chip.label,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

/// 4. 🗂️ Available Sections & Categories Strip matching reference screenshot
class AvailableSectionsStripWidget extends StatelessWidget {
  const AvailableSectionsStripWidget({
    super.key,
    required this.onSelectSection,
    required this.onAddOtherCategory,
  });

  final void Function(String sectionId) onSelectSection;
  final VoidCallback onAddOtherCategory;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final sections = [
      (
        id: 'function_halls',
        title: 'Function Halls',
        badge: 'POPULAR',
        badgeColor: const Color(0xFFEC4899),
        subtitle: 'Banquet & Marriage',
        emoji: '🏛️',
      ),
      (
        id: 'lodge_rooms',
        title: 'Lodge / Rooms',
        badge: 'INSTANT',
        badgeColor: const Color(0xFF0EA5E9),
        subtitle: 'Hotels & Hourly Stays',
        emoji: '🏨',
      ),
      (
        id: 'pg_hostels',
        title: 'PG / Hostels',
        badge: 'VERIFIED',
        badgeColor: const Color(0xFF8B5CF6),
        subtitle: 'Gents & Ladies Hostels',
        emoji: '🏠',
      ),
      (
        id: 'institutes_classes',
        title: 'Classes / Sports',
        badge: 'FREE DEMO',
        badgeColor: const Color(0xFFF97316),
        subtitle: 'IT, Dance & Gyms',
        emoji: '🎯',
      ),
      (
        id: 'other_custom',
        title: 'Other & Custom',
        badge: '+ ADD ANY',
        badgeColor: const Color(0xFF0D9488),
        subtitle: 'Studios, Gaming, Ashrams &',
        emoji: '🎪',
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title & Description
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Available Sections & Categories',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.3,
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                'Explore verified spaces or easily add any custom category',
                style: TextStyle(
                  fontSize: 12.5,
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 12),

        // Sub Header: "Available Sections LIVE" and "+ Other Category"
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(
                    'Available Sections',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFF7C3AED).withValues(alpha: 0.20),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Text(
                      'LIVE',
                      style: TextStyle(
                        color: Color(0xFF7C3AED),
                        fontSize: 9.5,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ],
              ),
              InkWell(
                onTap: onAddOtherCategory,
                borderRadius: BorderRadius.circular(8),
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                  child: Row(
                    children: [
                      Icon(Icons.add, size: 14, color: Color(0xFF7C3AED)),
                      SizedBox(width: 3),
                      Text(
                        'Other Category',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF7C3AED),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 10),

        // Horizontal Category Cards
        SizedBox(
          height: 108,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: sections.length + 1,
            itemBuilder: (context, index) {
              // The trailing "+ Add Other / Any Category" card
              if (index == sections.length) {
                return InkWell(
                  onTap: onAddOtherCategory,
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    width: 128,
                    margin: const EdgeInsets.only(right: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF7C3AED).withValues(alpha: 0.16),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: const Color(0xFF7C3AED).withValues(alpha: 0.35),
                      ),
                    ),
                    child: const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircleAvatar(
                          radius: 16,
                          backgroundColor: Color(0xFF7C3AED),
                          child: Icon(Icons.add, color: Colors.white, size: 18),
                        ),
                        SizedBox(height: 8),
                        Text(
                          '+ Add Other',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF7C3AED),
                          ),
                        ),
                        Text(
                          'Any Category',
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }

              final s = sections[index];
              return InkWell(
                onTap: () => onSelectSection(s.id),
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  width: 140,
                  margin: const EdgeInsets.only(right: 10),
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Emoji & Badge
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(s.emoji, style: const TextStyle(fontSize: 20)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                            decoration: BoxDecoration(
                              color: s.badgeColor.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              s.badge,
                              style: TextStyle(
                                color: s.badgeColor,
                                fontSize: 8.5,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ],
                      ),

                      // Title & Subtitle
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            s.title,
                            style: TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w800,
                              color: theme.colorScheme.onSurface,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            s.subtitle,
                            style: TextStyle(
                              fontSize: 10,
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

/// 5. 🤖 Floating AI Help Button matching reference screenshot
class FloatingAiHelpButton extends StatelessWidget {
  const FloatingAiHelpButton({
    super.key,
    required this.onTap,
  });

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: const Color(0xFF7C3AED).withValues(alpha: 0.85),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.35),
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF7C3AED).withValues(alpha: 0.4),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.smart_toy_outlined, color: Colors.white, size: 16),
              SizedBox(width: 6),
              Text(
                'AI Help',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w800,
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
