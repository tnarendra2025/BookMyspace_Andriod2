import 'dart:async';

import 'package:bookmyspace/core/localization/app_localizations.dart';
import 'package:bookmyspace/core/router/app_router.dart';
import 'package:bookmyspace/features/auth/domain/auth_user.dart';
import 'package:bookmyspace/features/auth/presentation/auth_providers.dart';
import 'package:bookmyspace/features/courses/presentation/course_providers.dart';
import 'package:bookmyspace/features/events/presentation/event_providers.dart';
import 'package:bookmyspace/features/notifications/presentation/notification_providers.dart';
import 'package:bookmyspace/features/venues/presentation/venue_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/mock_auth_repository.dart';
import '../features/courses/mock_course_repository.dart';
import '../features/events/mock_event_repository.dart';
import '../features/notifications/mock_notification_repository.dart';
import '../features/venues/mock_venue_repository.dart';

const _signedInUser = AuthUser(id: 'u1', email: 'a@b.com');

Widget _harness(GoRouter router) {
  return ProviderScope(
    overrides: [
      // Every shell tab is built by the tab-mapping test; without these mocks
      // they fall through to the Supabase-backed repositories and throw.
      venueRepositoryProvider.overrideWithValue(MockVenueRepository()),
      eventRepositoryProvider.overrideWithValue(MockEventRepository()),
      courseRepositoryProvider.overrideWithValue(MockCourseRepository()),
      notificationRepositoryProvider.overrideWithValue(
        MockNotificationRepository(),
      ),
      authRepositoryProvider.overrideWithValue(
        MockAuthRepository(initialUser: _signedInUser),
      ),
    ],
    child: MaterialApp.router(
      routerConfig: router,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: AppLocalizations.supportedLocales,
    ),
  );
}

Future<String> _redirectTo(
  WidgetTester tester, {
  required String initialLocation,
  required AuthUser? currentUser,
  required bool authReady,
}) async {
  final router = createAppRouter(
    initialLocation: initialLocation,
    currentUser: currentUser,
    authReady: authReady,
  );
  await tester.pumpWidget(_harness(router));
  await tester.pumpAndSettle();
  final uri = router.routeInformationProvider.value.uri.path;
  router.dispose();
  return uri;
}

/// Boots the real router at [initialLocation] and returns it.
Future<GoRouter> _boot(WidgetTester tester, String initialLocation) async {
  final router = createAppRouter(
    initialLocation: initialLocation,
    currentUser: _signedInUser,
    authReady: true,
  );
  addTearDown(router.dispose);
  await tester.pumpWidget(_harness(router));
  await tester.pumpAndSettle();
  return router;
}

/// Regression coverage for "tap a Home category -> back to Home": from /home,
/// navigating to /search?category=<slug> must land on /search and stay there
/// (no bounce back to /home, no redirect loop).
///
/// Home uses `go`, not `push`: go_router silently drops a `push` aimed at a
/// sibling StatefulShellBranch, which is exactly the reported symptom.
Future<String> _goSearchFromHome(
  WidgetTester tester, {
  required String slug,
}) async {
  final router = await _boot(tester, AppRoutes.home);
  expect(router.routeInformationProvider.value.uri.path, AppRoutes.home);

  router.go('${AppRoutes.search}?category=$slug');
  await tester.pumpAndSettle();

  final uri = router.routeInformationProvider.value.uri;
  expect(uri.path, AppRoutes.search);
  expect(uri.queryParameters['category'], slug);
  // Settle again: proves no redirect loop bounces back to /home.
  await tester.pump(const Duration(milliseconds: 100));
  await tester.pumpAndSettle();
  return router.routeInformationProvider.value.uri.toString();
}

void main() {
  testWidgets('unauth user on shell is redirected to login', (tester) async {
    final uri = await _redirectTo(
      tester,
      initialLocation: AppRoutes.shell,
      currentUser: null,
      authReady: true,
    );
    expect(uri, AppRoutes.login);
  });

  testWidgets('unauth user can stay on public login route', (tester) async {
    final uri = await _redirectTo(
      tester,
      initialLocation: AppRoutes.login,
      currentUser: null,
      authReady: true,
    );
    expect(uri, AppRoutes.login);
  });

  testWidgets('authenticated user on login is redirected to shell', (
    tester,
  ) async {
    final uri = await _redirectTo(
      tester,
      initialLocation: AppRoutes.login,
      currentUser: const AuthUser(id: 'u1', email: 'a@b.com'),
      authReady: true,
    );
    expect(uri, AppRoutes.shell);
  });

  testWidgets('auth not ready skips gating', (tester) async {
    final uri = await _redirectTo(
      tester,
      initialLocation: AppRoutes.login,
      currentUser: null,
      authReady: false,
    );
    expect(uri, AppRoutes.login);
  });

  group('home category -> search regression (no bounce back to Home)', () {
    for (final slug in ['all', 'marriage_hall', 'hotel', 'gents_pg']) {
      testWidgets('go /search?category=$slug from /home stays on search', (
        tester,
      ) async {
        final uri = await _goSearchFromHome(tester, slug: slug);
        expect(uri, '${AppRoutes.search}?category=$slug');
      });
    }

    testWidgets('slugs needing escaping survive the round trip', (
      tester,
    ) async {
      const slug = 'Function Halls & Parties';
      final router = await _boot(tester, AppRoutes.home);
      router.go(
        '${AppRoutes.search}?category=${Uri.encodeQueryComponent(slug)}',
      );
      await tester.pumpAndSettle();

      final uri = router.routeInformationProvider.value.uri;
      expect(uri.path, AppRoutes.search);
      // go_router percent-encodes on the way in; the app must read the decoded
      // value, not the encoded one.
      expect(uri.queryParameters['category'], slug);
    });

    testWidgets('rapid double go still lands on search exactly once', (
      tester,
    ) async {
      final router = await _boot(tester, AppRoutes.home);
      router.go('${AppRoutes.search}?category=hotel');
      router.go('${AppRoutes.search}?category=hotel');
      await tester.pumpAndSettle();

      final uri = router.routeInformationProvider.value.uri;
      expect(uri.path, AppRoutes.search);
      expect(uri.queryParameters['category'], 'hotel');
      await tester.pump(const Duration(milliseconds: 100));
      await tester.pumpAndSettle();
      expect(
        router.routeInformationProvider.value.uri.path,
        AppRoutes.search,
      );
    });

    // go_router drops a `push` aimed at a sibling StatefulShellBranch: the URI
    // snaps back to the current tab. Pin that so nobody reintroduces `push`
    // for a shell destination.
    testWidgets('push to a sibling shell branch is dropped (use go)', (
      tester,
    ) async {
      final router = await _boot(tester, AppRoutes.home);
      unawaited(router.push('${AppRoutes.search}?category=hotel'));
      await tester.pumpAndSettle();
      expect(
        router.routeInformationProvider.value.uri.path,
        AppRoutes.home,
        reason: 'push across shell branches does not navigate; use go',
      );
    });

    // Guards the branch-index == destination-index contract. A mismatch means
    // tapping a bottom-nav tab silently opens a different tab.
    testWidgets('every bottom-nav tab maps to its own route', (tester) async {
      const expected = <String>[
        AppRoutes.home,
        AppRoutes.notifications,
        AppRoutes.search,
        AppRoutes.bookings,
        AppRoutes.coursesList,
        AppRoutes.profile,
      ];
      final router = await _boot(tester, AppRoutes.home);
      expect(find.byType(NavigationBar), findsOneWidget);

      for (var i = 0; i < expected.length; i++) {
        router.go(expected[i]);
        await tester.pumpAndSettle();
        expect(
          router.routeInformationProvider.value.uri.path,
          expected[i],
          reason: 'tab $i must open ${expected[i]}',
        );
      }
    });

    testWidgets('guards still hold: unauth /search -> /login', (tester) async {
      final uri = await _redirectTo(
        tester,
        initialLocation: AppRoutes.search,
        currentUser: null,
        authReady: true,
      );
      expect(uri, AppRoutes.login);
    });

    testWidgets('guards still hold: non-admin /admin/audit -> /home', (
      tester,
    ) async {
      final uri = await _redirectTo(
        tester,
        initialLocation: AppRoutes.adminAudit,
        currentUser: _signedInUser,
        authReady: true,
      );
      expect(uri, AppRoutes.home);
    });
  });
}
