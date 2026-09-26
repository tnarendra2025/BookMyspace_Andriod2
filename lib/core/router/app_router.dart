import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/admin/presentation/screens/admin_audit_screen.dart';
import '../../features/admin/presentation/screens/admin_integrations_screen.dart';
import '../../features/admin/presentation/screens/admin_mcp_screen.dart';
import '../../features/analytics/presentation/screens/analytics_screen.dart';
import '../../features/auth/domain/auth_user.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/profile_screen.dart';
import '../../features/booking/domain/booking.dart';
import '../../features/booking/presentation/screens/booking_screen.dart';
import '../../features/booking/presentation/screens/my_bookings_screen.dart';
import '../../features/courses/presentation/screens/course_detail_screen.dart';
import '../../features/courses/presentation/screens/courses_list_screen.dart';
import '../../features/debug/presentation/screens/debug_menu_screen.dart';
import '../../features/events/presentation/screens/event_detail_screen.dart';
import '../../features/events/presentation/screens/events_list_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/legal/presentation/screens/privacy_policy_screen.dart';
import '../../features/legal/presentation/screens/terms_of_service_screen.dart';
import '../../features/map/presentation/screens/venue_map_screen.dart';
import '../../features/notifications/presentation/screens/notifications_screen.dart';
import '../../features/onboarding/presentation/screens/onboarding_screen.dart';
import '../../features/owner/presentation/screens/owner_categories_screen.dart';
import '../../features/owner/presentation/screens/owner_dashboard_screen.dart';
import '../../features/owner/presentation/screens/owner_registration_screen.dart';
import '../../features/owner_venues/presentation/screens/create_venue_screen.dart';
import '../../features/owner_venues/presentation/screens/owner_venues_screen.dart';
import '../../features/payments/presentation/screens/payment_screen.dart';
import '../../features/qr_checkin/presentation/screens/qr_check_in_scanner_screen.dart';
import '../../features/search/presentation/screens/search_screen.dart';
import '../../features/settings/presentation/screens/settings_screen.dart';
import '../../features/support/presentation/screens/support_screen.dart';
import '../../features/venues/domain/venue.dart';
import '../../features/venues/presentation/screens/venue_details_screen.dart';
import '../localization/app_localizations.dart';

/// Route names used for navigation.
abstract class AppRoutes {
  static const onboarding = '/onboarding';
  static const shell = '/home';
  static const home = '/home';
  static const search = '/search';
  static const map = '/map';
  static const bookings = '/bookings';
  static const saved = '/saved';
  static const profile = '/profile';
  static const settings = '/settings';
  static const debug = '/debug';
  static const login = '/login';
  static const venueDetails = '/venues/:id';
  static const bookingFlow = '/venues/:id/book';
  static const paymentFlow = '/bookings/:id/pay';
  static const eventsList = '/events';
  static const eventDetails = '/events/:id';
  static const coursesList = '/courses';
  static const courseDetails = '/courses/:id';
  static const notifications = '/notifications';
  static const analytics = '/analytics';
  static const support = '/support';
  static const adminAudit = '/admin/audit';
  static const adminIntegrations = '/admin/integrations';
  static const adminMcp = '/admin/mcp';
  static const ownerRegistration = '/owner/register';
  static const ownerDashboard = '/owner';
  static const ownerCategories = '/owner/categories';
  static const ownerVenues = '/owner/venues';
  static const ownerVenueCreate = '/owner/venues/create';
  static const privacyPolicy = '/privacy';
  static const termsOfService = '/terms';
  static const qrScanner = '/qr-scanner';
}

final rootNavigatorKey = GlobalKey<NavigatorState>();
final shellNavigatorKey = GlobalKey<NavigatorState>();

/// Live auth inputs consumed by the router's `redirect`.
///
/// The router must be created exactly once and outlive auth resolution.
/// Supabase restores the session asynchronously, so for a short window after
/// launch `authStateProvider` is still `loading` with no user; when it finally
/// resolves, the app used to dispose the old GoRouter and build a new one at
/// [AppRoutes.shell], which threw the user back to Home mid-navigation and
/// collided on the shared navigator [GlobalKey]s.
///
/// Holding the auth values in [ValueNotifier]s lets [GoRouter.refreshListenable]
/// re-run `redirect` in place instead, so guards stay enforced while the
/// navigation stack is preserved.
class AuthGate {
  AuthGate({AuthUser? user, bool ready = false})
    : _user = ValueNotifier<AuthUser?>(user),
      _ready = ValueNotifier<bool>(ready);

  final ValueNotifier<AuthUser?> _user;
  final ValueNotifier<bool> _ready;

  AuthUser? get user => _user.value;

  /// False while the auth session is still being restored; the redirect
  /// stays inert until then, exactly as before.
  bool get ready => _ready.value;

  /// Fires whenever a value the redirect depends on actually changes.
  Listenable get listenable => Listenable.merge([_user, _ready]);

  /// Pushes new auth state into the gate. No-ops when nothing the redirect
  /// reads has changed, so a token refresh for the same user/roles does not
  /// trigger a redirect re-evaluation at all.
  void update({AuthUser? user, bool? ready}) {
    if (ready != null && ready != _ready.value) {
      _ready.value = ready;
    }
    final previous = _user.value;
    if (user?.id != previous?.id ||
        user?.isAdmin != previous?.isAdmin ||
        user?.isOwner != previous?.isOwner) {
      _user.value = user;
    }
  }

  void dispose() {
    _user.dispose();
    _ready.dispose();
  }
}

/// Creates the application router. [initialLocation] is overridable in tests.
///
/// When [currentUser] is provided, protected routes redirect to the login
/// screen for unauthenticated users, and signed-in users are bounced away from
/// the onboarding/login screens. A `null` [currentUser] disables gating.
///
/// Pass [authGate] to keep the same router across auth changes; the gate is
/// then the live source of truth and [currentUser]/[authReady] only seed it.
GoRouter createAppRouter({
  String initialLocation = AppRoutes.shell,
  AuthUser? currentUser,
  bool authReady = true,
  AuthGate? authGate,
}) {
  final gate = authGate ?? AuthGate(user: currentUser, ready: authReady);
  return GoRouter(
    navigatorKey: rootNavigatorKey,
    initialLocation: initialLocation,
    refreshListenable: gate.listenable,
    redirect: (context, state) {
      // Read the gate on every evaluation, never a captured snapshot.
      final user = gate.user;
      if (!gate.ready) return null;
      final location = state.matchedLocation;
      final isPublic =
          location == AppRoutes.onboarding || location == AppRoutes.login;
      if (user == null) {
        return isPublic ? null : AppRoutes.login;
      }
      if (isPublic) {
        return AppRoutes.shell;
      }

      // Role-based route gating (strictly based on authenticated user's role without hardcoding IDs)
      final isAdminRoute =
          location == AppRoutes.adminAudit || location.startsWith('/admin');
      if (isAdminRoute && !user.isAdmin) {
        // Redirect unauthorized non-admin users to home
        return AppRoutes.home;
      }

      final isOwnerRoute = location == AppRoutes.ownerDashboard ||
          location == AppRoutes.ownerVenues ||
          location == AppRoutes.ownerCategories ||
          location == AppRoutes.ownerVenueCreate ||
          (location.startsWith('/owner') &&
              location != AppRoutes.ownerRegistration);
      if (isOwnerRoute && !user.isOwner) {
        // Redirect unauthorized non-owner users to home
        return AppRoutes.home;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: AppRoutes.login,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.settings,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: AppRoutes.debug,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const DebugMenuScreen(),
      ),
      GoRoute(
        path: AppRoutes.map,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) {
          final extra = state.extra;
          final initialVenueId = extra is Map<String, dynamic>
              ? extra['venueId'] as String?
              : null;
          final initialCategory = extra is Map<String, dynamic>
              ? extra['category'] as String?
              : null;
          return VenueMapScreen(
            initialVenueId: initialVenueId,
            initialCategory: initialCategory,
          );
        },
      ),
      GoRoute(
        path: AppRoutes.venueDetails,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) =>
            VenueDetailsScreen(venueId: state.pathParameters['id'] ?? ''),
      ),
      GoRoute(
        path: AppRoutes.bookingFlow,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) {
          final extra = state.extra;
          final venue = extra is Venue ? extra : null;
          if (venue == null) {
            // Bookmark/refresh navigation without a venue object — fall back
            // to the details screen which can re-fetch the venue.
            return VenueDetailsScreen(
              venueId: state.pathParameters['id'] ?? '',
            );
          }
          return BookingScreen(venue: venue);
        },
      ),
      // /courses (list) and /notifications are shell tabs, so they are defined
      // ONLY inside the shell branches below. They used to also exist as
      // top-level routes, which gave go_router two matches for one location
      // and made navigation resolve back to the shell tab. One canonical route
      // per location. /events, /events/:id and /courses/:id are not shell tabs,
      // so they stay here as the single definition.
      GoRoute(
        path: AppRoutes.eventsList,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const EventsListScreen(),
      ),
      GoRoute(
        path: AppRoutes.eventDetails,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) =>
            EventDetailScreen(eventId: state.pathParameters['id'] ?? ''),
      ),
      GoRoute(
        path: AppRoutes.courseDetails,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => CourseDetailScreen(
          courseId: state.pathParameters['id'] ?? '',
        ),
      ),
      GoRoute(
        path: AppRoutes.analytics,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const AnalyticsScreen(),
      ),
      GoRoute(
        path: AppRoutes.support,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const SupportTicketsScreen(),
      ),
      GoRoute(
        path: AppRoutes.adminAudit,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const AdminAuditScreen(),
      ),
      GoRoute(
        path: AppRoutes.adminIntegrations,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const AdminIntegrationsScreen(),
      ),
      GoRoute(
        path: AppRoutes.adminMcp,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const AdminMcpScreen(),
      ),
      GoRoute(
        path: AppRoutes.ownerRegistration,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const OwnerRegistrationScreen(),
      ),
      GoRoute(
        path: AppRoutes.ownerDashboard,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const OwnerDashboardScreen(),
      ),
      GoRoute(
        path: AppRoutes.ownerCategories,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const OwnerCategoriesScreen(),
      ),
      GoRoute(
        path: AppRoutes.ownerVenues,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const OwnerVenuesScreen(),
      ),
      GoRoute(
        path: AppRoutes.ownerVenueCreate,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) {
          final extraVenue = state.extra as Venue?;
          return CreateVenueScreen(existingVenue: extraVenue);
        },
      ),
      GoRoute(
        path: AppRoutes.privacyPolicy,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const PrivacyPolicyScreen(),
      ),
      GoRoute(
        path: AppRoutes.termsOfService,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const TermsOfServiceScreen(),
      ),
      GoRoute(
        path: AppRoutes.paymentFlow,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) {
          final extra = state.extra;
          final booking = extra is Booking ? extra : null;
          if (booking == null) {
            // Deep link without a booking object — show the bookings tab.
            return const MyBookingsScreen();
          }
          return PaymentScreen(booking: booking);
        },
      ),
      GoRoute(
        path: AppRoutes.qrScanner,
        parentNavigatorKey: rootNavigatorKey,
        builder: (context, state) => const QrCheckInScannerScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return _AppShell(
            navigationShell: navigationShell,
            branchCount: _shellBranches.length,
          );
        },
        branches: _shellBranches,
      ),
    ],
  );
}

/// Bottom-nav tab order. MUST stay index-aligned with the `NavigationBar`
/// destinations in [_AppShell]; `_AppShell` asserts the two counts match.
/// 0 Home, 1 Notifications, 2 Search, 3 Bookings, 4 Courses, 5 Profile.
final List<StatefulShellBranch> _shellBranches = [
  StatefulShellBranch(
    routes: [
      GoRoute(
        path: AppRoutes.home,
        builder: (context, state) => const HomeScreen(),
      ),
    ],
  ),
  StatefulShellBranch(
    routes: [
      GoRoute(
        path: AppRoutes.notifications,
        builder: (context, state) => const NotificationsScreen(),
      ),
    ],
  ),
  StatefulShellBranch(
    routes: [
      GoRoute(
        path: AppRoutes.search,
        builder: (context, state) {
          final extra = state.extra;
          final extraCategory = extra is Map<String, dynamic>
              ? extra['category'] as String?
              : null;
          // Home navigates with `?category=<slug>`; support both that
          // deep-linkable query param and the legacy extra map.
          final queryCategory = state.uri.queryParameters['category'];
          return SearchScreen(
            initialCategory: extraCategory ?? queryCategory,
          );
        },
      ),
    ],
  ),
  StatefulShellBranch(
    routes: [
      GoRoute(
        path: AppRoutes.bookings,
        builder: (context, state) => const MyBookingsScreen(),
      ),
    ],
  ),
  StatefulShellBranch(
    routes: [
      GoRoute(
        path: AppRoutes.coursesList,
        builder: (context, state) => const CoursesListScreen(),
      ),
    ],
  ),
  StatefulShellBranch(
    routes: [
      GoRoute(
        path: AppRoutes.profile,
        builder: (context, state) => const ProfileScreen(),
      ),
    ],
  ),
];

class _AppShell extends StatelessWidget {
  const _AppShell({required this.navigationShell, required this.branchCount});

  final StatefulNavigationShell navigationShell;

  /// Number of branches in the shell, used to fail fast if the bottom bar and
  /// the branch list ever drift apart.
  final int branchCount;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    // Branch index == destination index. Drift here silently retargets the
    // bottom nav (e.g. tapping "Courses" opening Events), so fail loudly.
    assert(
      _shellDestinationSpecs.length == branchCount,
      'Shell has $branchCount branches but the bottom nav has '
      '${_shellDestinationSpecs.length} destinations. Keep _shellBranches and '
      '_shellDestinationSpecs index-aligned.',
    );
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: (index) {
          navigationShell.goBranch(
            index,
            initialLocation: index == navigationShell.currentIndex,
          );
        },
        destinations: [
          for (var i = 0; i < _tabCount; i++)
            NavigationDestination(
              icon: Icon(_shellDestinationSpecs[i].icon),
              selectedIcon: Icon(_shellDestinationSpecs[i].selectedIcon),
              label: _shellTabLabels[i](l10n),
            ),
        ],
      ),
    );
  }

  /// Safe in release builds too, where the [assert] above is stripped.
  int get _tabCount =>
      _shellDestinationSpecs.length < _shellTabLabels.length
      ? _shellDestinationSpecs.length
      : _shellTabLabels.length;
}

/// Icon pair for a bottom-nav destination. MUST stay index-aligned with
/// [_shellBranches] and [_shellTabLabels].
class _ShellDestinationSpec {
  const _ShellDestinationSpec({required this.icon, required this.selectedIcon});

  final IconData icon;
  final IconData selectedIcon;
}

const List<_ShellDestinationSpec> _shellDestinationSpecs = [
  _ShellDestinationSpec(icon: Icons.home_outlined, selectedIcon: Icons.home_rounded),
  _ShellDestinationSpec(
    icon: Icons.notifications_outlined,
    selectedIcon: Icons.notifications_rounded,
  ),
  _ShellDestinationSpec(
    icon: Icons.search_outlined,
    selectedIcon: Icons.search_rounded,
  ),
  _ShellDestinationSpec(
    icon: Icons.receipt_long_outlined,
    selectedIcon: Icons.receipt_long_rounded,
  ),
  _ShellDestinationSpec(
    icon: Icons.school_outlined,
    selectedIcon: Icons.school_rounded,
  ),
  _ShellDestinationSpec(
    icon: Icons.person_outline_rounded,
    selectedIcon: Icons.person_rounded,
  ),
];

/// Localized labels for the bottom-nav destinations, in branch order.
final List<String Function(AppLocalizations)> _shellTabLabels = [
  (l10n) => l10n.navHome,
  (l10n) => l10n.notifications,
  (l10n) => l10n.navSearch,
  (l10n) => l10n.navBookings,
  (l10n) => l10n.courses,
  (l10n) => l10n.navProfile,
];

// Temporary placeholder replaced with a real screen in a later milestone.
class ProfilePlaceholderScreen extends StatelessWidget {
  const ProfilePlaceholderScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('Profile (M7)')));
  }
}
