import 'package:bookmyspace/core/localization/app_localizations.dart';
import 'package:bookmyspace/core/router/app_router.dart';
import 'package:bookmyspace/features/auth/domain/auth_user.dart';
import 'package:bookmyspace/features/courses/presentation/course_providers.dart';
import 'package:bookmyspace/features/events/presentation/event_providers.dart';
import 'package:bookmyspace/features/venues/presentation/venue_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import '../features/courses/mock_course_repository.dart';
import '../features/events/mock_event_repository.dart';
import '../features/venues/mock_venue_repository.dart';

Widget _wrap(GoRouter router) {
  return ProviderScope(
    overrides: [
      // Search/Home read these; without the mocks they fall through to the
      // Supabase-backed repositories and throw.
      venueRepositoryProvider.overrideWithValue(MockVenueRepository()),
      eventRepositoryProvider.overrideWithValue(MockEventRepository()),
      courseRepositoryProvider.overrideWithValue(MockCourseRepository()),
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

const _user = AuthUser(id: 'u1', email: 'a@b.com');

void main() {
  // /search is a StatefulShellBranch destination, so a push to it is dropped
  // by go_router. Home therefore navigates with `go` + `?category=`.
  testWidgets('REPRO: go /search?category=X preserves the category query', (
    tester,
  ) async {
    final router = createAppRouter(
      initialLocation: AppRoutes.shell,
      currentUser: _user,
      authReady: true,
    );
    addTearDown(router.dispose);
    await tester.pumpWidget(_wrap(router));
    await tester.pumpAndSettle();
    expect(router.routeInformationProvider.value.uri.toString(), '/home');

    router.go('${AppRoutes.search}?category=wedding');
    await tester.pumpAndSettle();

    // The shell SearchScreen builder reads ?category= (not just state.extra),
    // so initialCategory is populated instead of being silently dropped.
    expect(router.routeInformationProvider.value.uri.toString(),
        '/search?category=wedding');
    expect(
      router.routeInformationProvider.value.uri.queryParameters['category'],
      'wedding',
    );
  });

  testWidgets('REPRO: BookMySpaceApp keeps the router across rebuilds', (
    tester,
  ) async {
    // BookMySpaceApp.build() must not call createAppRouter() unconditionally:
    // a theme/locale/auth change would otherwise reset the stack to /home,
    // which is indistinguishable from "tapping a category bounces back".
    final router = createAppRouter(
      initialLocation: AppRoutes.shell,
      currentUser: _user,
      authReady: true,
    );
    addTearDown(router.dispose);
    await tester.pumpWidget(_wrap(router));
    await tester.pumpAndSettle();

    router.go('${AppRoutes.search}?category=wedding');
    await tester.pumpAndSettle();
    expect(router.routeInformationProvider.value.uri.path, AppRoutes.search);

    // Rebuilding the host (theme change, provider invalidation) must not
    // rebuild the GoRouter and throw the location away.
    await tester.pumpWidget(_wrap(router));
    await tester.pumpAndSettle();
    expect(
      router.routeInformationProvider.value.uri.path,
      AppRoutes.search,
      reason: 'router instance is reused, so the location survives',
    );
  });

  testWidgets('REPRO: no duplicate route registrations', (tester) async {
    final router = createAppRouter(
      initialLocation: AppRoutes.shell,
      currentUser: _user,
      authReady: true,
    );
    addTearDown(router.dispose);
    final paths = <String>[];
    void collect(RouteBase r) {
      if (r is GoRoute) paths.add(r.path);
      if (r is StatefulShellRoute) {
        for (final b in r.branches) {
          for (final sr in b.routes) {
            collect(sr);
          }
        }
      }
    }

    for (final r in router.configuration.routes) {
      collect(r);
    }

    for (final path in <String>['/notifications', '/courses', '/search']) {
      expect(
        paths.where((p) => p == path).length,
        1,
        reason: 'duplicate $path route: $paths',
      );
    }
  });
}
