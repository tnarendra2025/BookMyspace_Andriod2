import 'package:bookmyspace/app.dart';
import 'package:bookmyspace/features/auth/domain/auth_user.dart';
import 'package:bookmyspace/features/auth/presentation/auth_providers.dart';
import 'package:bookmyspace/features/courses/presentation/course_providers.dart';
import 'package:bookmyspace/features/events/presentation/event_providers.dart';
import 'package:bookmyspace/features/notifications/infrastructure/push_notification_service.dart';
import 'package:bookmyspace/features/notifications/presentation/notification_providers.dart';
import 'package:bookmyspace/features/venues/presentation/venue_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/mock_auth_repository.dart';
import '../features/courses/mock_course_repository.dart';
import '../features/events/mock_event_repository.dart';
import '../features/notifications/mock_notification_repository.dart';
import '../features/venues/mock_venue_repository.dart';

const _user = AuthUser(id: 'u1', email: 'a@b.com');

/// Real widget-tap coverage for "tap a Home category -> back to Home".
///
/// These drive the real [BookMySpaceApp] (so the production router lifecycle
/// in app.dart is exercised) at 390x844, and tap the real Home affordances.
List<Override> _overrides([MockAuthRepository? authRepo]) => [
  authRepositoryProvider.overrideWithValue(
    authRepo ?? MockAuthRepository(initialUser: _user),
  ),
  venueRepositoryProvider.overrideWithValue(MockVenueRepository()),
  eventRepositoryProvider.overrideWithValue(MockEventRepository()),
  courseRepositoryProvider.overrideWithValue(MockCourseRepository()),
  notificationRepositoryProvider.overrideWithValue(MockNotificationRepository()),
  // Skip PushNotificationService.initialize() (platform channels).
  pushNotificationServiceProvider.overrideWith(
    (ref) => PushNotificationService(
      repository: ref.watch(notificationRepositoryProvider),
    ),
  ),
];

Widget _app() => ProviderScope(
  overrides: _overrides(),
  child: const BookMySpaceApp(initialLocation: '/home'),
);

void main() {
  setUp(() {
    // iPhone 12/13/14 logical size.
    TestWidgetsFlutterBinding.ensureInitialized();
  });

  Future<Uri> bootHome(WidgetTester tester) async {
    tester.view.physicalSize = const Size(1170, 2532);
    tester.view.devicePixelRatio = 3.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(_app());
    await tester.pumpAndSettle();
    expect(
      _location(tester).path,
      '/home',
      reason: 'must boot on Home',
    );
    return _location(tester);
  }

  // ---- Real tap flow, one test per category so a failure names the culprit.

  for (final entry in const [
    ('Function Hall', 'function_hall'),
    ('Meeting Room', 'meeting_room'),
    ('Party Hall', 'party_hall'),
  ]) {
    final label = entry.$1;
    final slug = entry.$2;

    testWidgets('tap trending "$label" -> /search?category=$slug and stays', (
      tester,
    ) async {
      await bootHome(tester);

      // The trending row is a horizontal ListView; on a 390pt phone the
      // third chip is off-viewport, so scroll it in the way a user would.
      final target = find.text(label);
      if (target.evaluate().isEmpty) {
        await tester.dragUntilVisible(
          target,
          _trendingRow(),
          const Offset(-120, 0),
        );
        await tester.pumpAndSettle();
      }
      expect(target, findsWidgets, reason: 'trending chip "$label" must exist');

      await tester.tap(target.first);
      await tester.pumpAndSettle();

      final uri = _location(tester);
      expect(uri.path, '/search', reason: 'tap "$label" must open /search');
      expect(
        uri.queryParameters['category'],
        slug,
        reason: 'tap "$label" must carry its slug',
      );

      // "remain there without blinking/resetting to Home": settle further and
      // make sure nothing rewinds the location or rebuilds the router.
      for (var i = 0; i < 6; i++) {
        await tester.pump(const Duration(milliseconds: 120));
      }
      await tester.pumpAndSettle();

      final after = _location(tester);
      expect(
        after.toString(),
        uri.toString(),
        reason: 'location drifted after settling (reset/blink)',
      );
      expect(after.path, '/search', reason: 'must not bounce back to /home');
    });
  }

  // ---- Hero-card sub-section chips: one per MainHomeSection.

  for (final card in const [
    ('Function Halls & Celebrations', 'Marriage Halls', 'marriage_hall'),
    ('Hotels, Lodges & Rooms', 'Hotels & Suites', 'hotel'),
    ('PG Hostels & Co-Living', 'Gents PG', 'gents_pg'),
    ('Institutes & Academy Classes', 'Coaching Centers', 'coaching'),
    ('Sports Turfs & Workspaces', 'Box Cricket & Turf', 'sports'),
  ]) {
    final cardTitle = card.$1;
    final chipLabel = card.$2;
    final slug = card.$3;

    testWidgets('tap "$chipLabel" on the "$cardTitle" card -> /search and stays', (
      tester,
    ) async {
      await bootHome(tester);

      // Cards are 620pt tall in a single column; scroll the card into view.
      await tester.scrollUntilVisible(
        find.text(cardTitle),
        400.0,
        scrollable: find.byType(Scrollable).first,
      );
      await tester.pumpAndSettle();

      final chip = find.text(chipLabel);
      expect(
        chip,
        findsWidgets,
        reason: 'sub-section chip "$chipLabel" must be on the "$cardTitle" card',
      );
      await tester.ensureVisible(chip.first);
      await tester.pumpAndSettle();
      await tester.tap(chip.first);
      await tester.pumpAndSettle();

      final uri = _location(tester);
      expect(
        uri.path,
        '/search',
        reason: 'tap "$chipLabel" must open /search',
      );
      expect(
        uri.queryParameters['category'],
        slug,
        reason: 'tap "$chipLabel" must carry its slug',
      );

      for (var i = 0; i < 6; i++) {
        await tester.pump(const Duration(milliseconds: 120));
      }
      await tester.pumpAndSettle();
      expect(
        _location(tester).toString(),
        uri.toString(),
        reason: 'location drifted after settling (reset/blink)',
      );
      expect(_location(tester).path, '/search', reason: 'must not bounce Home');
    });
  }

  // ---- Router lifecycle: a late auth emission must not reset the stack.

  testWidgets('auth re-emit while on /search does not reset to /home', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1170, 2532);
    tester.view.devicePixelRatio = 3.0;
    addTearDown(tester.view.reset);

    final authRepo = MockAuthRepository(initialUser: _user);
    await tester.pumpWidget(
      ProviderScope(
        overrides: _overrides(authRepo),
        child: const BookMySpaceApp(initialLocation: '/home'),
      ),
    );
    await tester.pumpAndSettle();
    expect(_location(tester).path, '/home');

    // Navigate somewhere real, then let auth emit again (token refresh).
    final chip = find.text('Function Hall');
    if (chip.evaluate().isEmpty) {
      await tester.dragUntilVisible(
        chip,
        _trendingRow(),
        const Offset(-120, 0),
      );
      await tester.pumpAndSettle();
    }
    await tester.tap(chip.first);
    await tester.pumpAndSettle();
    final before = _location(tester);
    expect(before.path, '/search');

    // Same user, fresh emission - the router key must not change.
    // containerOf walks up from the given context, so use a descendant.
    final container = ProviderScope.containerOf(
      tester.element(find.byType(NavigationBar).first),
    );
    expect(
      container.read(authStateProvider).isLoading,
      isTrue,
      reason: 'precondition: session has not resolved yet, mirroring launch',
    );

    final routerBefore = _routerOf(tester);
    await authRepo.updateProfile(fullName: 'U One');
    await tester.pumpAndSettle();
    for (var i = 0; i < 6; i++) {
      await tester.pump(const Duration(milliseconds: 120));
    }
    await tester.pumpAndSettle();

    // The session resolved. The router must NOT have been rebuilt: a rebuild
    // resets the stack to /home and collides on the shared navigator keys.
    expect(
      identical(routerBefore, _routerOf(tester)),
      isTrue,
      reason: 'auth resolving must not recreate the GoRouter',
    );
    expect(container.read(authStateProvider).isLoading, isFalse);

    expect(
      _location(tester).toString(),
      before.toString(),
      reason: 'auth re-emit must not recreate the router and reset to /home',
    );
  });

  // ---- Explore Spaces -> section-view search bar, one per section.
  //
  // This path navigates with `_selectedSection.id` (e.g. `function_halls`),
  // which is a different slug space from the trending categories and the
  // card sub-sections, so it needs its own coverage.

  for (final card in const [
    ('Function Halls & Celebrations', 'Explore Spaces', 'function_halls'),
    ('Hotels, Lodges & Rooms', 'Explore Spaces', 'lodge_rooms'),
    ('PG Hostels & Co-Living', 'Explore Spaces', 'pg_hostels'),
    ('Institutes & Academy Classes', 'Explore Spaces', 'institutes_classes'),
    ('Sports Turfs & Workspaces', 'Explore Spaces', 'sports_turfs'),
  ]) {
    final cardTitle = card.$1;
    final slug = card.$3;

    testWidgets('Explore "$cardTitle" then tap its search bar -> /search and stays', (
      tester,
    ) async {
      await bootHome(tester);

      await tester.scrollUntilVisible(
        find.text(cardTitle),
        400.0,
        scrollable: find.byType(Scrollable).first,
      );
      await tester.pumpAndSettle();

      // "Explore Spaces" opens the section view in place (no navigation).
      await tester.tap(
        find
            .descendant(
              of: _cardRoot(cardTitle),
              matching: find.text('Explore Spaces'),
            )
            .first,
      );
      await tester.pumpAndSettle();
      expect(
        _location(tester).path,
        '/home',
        reason: 'Explore must not navigate, it only switches the view',
      );

      // The section view keeps the grid's scroll offset, so its header,
      // chips and search bar start off-screen above. A user scrolls back up.
      await _scrollToTop(tester, find.textContaining('Search ${_titleOf(cardTitle)}'));

      // The section view's search bar is the thing that navigates.
      final searchBar = find.textContaining('Search ${_titleOf(cardTitle)}');
      expect(
        searchBar,
        findsOneWidget,
        reason: 'section view must show its search bar',
      );
      await tester.ensureVisible(searchBar);
      await tester.pumpAndSettle();
      await tester.tap(searchBar);
      await tester.pumpAndSettle();

      final uri = _location(tester);
      expect(uri.path, '/search', reason: 'search bar must open /search');
      expect(
        uri.queryParameters['category'],
        slug,
        reason: 'search bar must carry the section id',
      );

      for (var i = 0; i < 6; i++) {
        await tester.pump(const Duration(milliseconds: 120));
      }
      await tester.pumpAndSettle();
      expect(
        _location(tester).toString(),
        uri.toString(),
        reason: 'location drifted after settling (reset/blink)',
      );
      expect(_location(tester).path, '/search', reason: 'must not bounce Home');
    });
  }
}

/// Drags the main scroll view to the top until [target] is built and visible.
Future<void> _scrollToTop(WidgetTester tester, Finder target) async {
  final scrollable = find.byType(Scrollable).first;
  for (var i = 0; i < 40; i++) {
    if (target.evaluate().isNotEmpty) break;
    await tester.drag(scrollable, const Offset(0, 400));
    await tester.pumpAndSettle();
  }
}

/// Root of the hero card whose title is [cardTitle]. The card is wrapped in
/// the GestureDetector that handles onTapExplore, so the nearest
/// GestureDetector ancestor scopes to the card itself.
Finder _cardRoot(String cardTitle) =>
    find
        .ancestor(of: find.text(cardTitle), matching: find.byType(GestureDetector))
        .first;

/// 'Function Halls & Celebrations' -> 'Function Halls' (the search-bar label
/// uses MainHomeSection.title, not displayTitle).
String _titleOf(String cardTitle) => switch (cardTitle) {
  'Function Halls & Celebrations' => 'Function Halls',
  'Hotels, Lodges & Rooms' => 'Lodge / Rooms',
  'PG Hostels & Co-Living' => 'PG / Hostels',
  'Institutes & Academy Classes' => 'Institutes / Classes',
  'Sports Turfs & Workspaces' => 'Sports / Turfs',
  _ => cardTitle,
};

/// The horizontal ListView holding the trending category chips, scoped via
/// the 'Trending Categories' header above it.
Finder _trendingRow() {
  final section = find
      .ancestor(
        of: find.text('Trending Categories'),
        matching: find.byType(Column),
      )
      .first;
  return find.descendant(of: section, matching: find.byType(Scrollable)).first;
}

/// Reads the live go_router location from the mounted widget tree.
Uri _location(WidgetTester tester) => _routerOf(tester).routerDelegate
    .currentConfiguration
    .uri;

/// The live GoRouter instance backing the mounted tree.
GoRouter _routerOf(WidgetTester tester) =>
    GoRouter.of(tester.element(find.byType(NavigationBar).first));
