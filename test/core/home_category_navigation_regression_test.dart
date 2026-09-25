import 'package:bookmyspace/core/localization/app_localizations.dart';
import 'package:bookmyspace/core/router/app_router.dart';
import 'package:bookmyspace/features/auth/domain/auth_user.dart';
import 'package:bookmyspace/features/auth/presentation/auth_providers.dart';
import 'package:bookmyspace/features/courses/presentation/course_providers.dart';
import 'package:bookmyspace/features/events/presentation/event_providers.dart';
import 'package:bookmyspace/features/search/presentation/screens/search_screen.dart';
import 'package:bookmyspace/features/venues/presentation/venue_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/mock_auth_repository.dart';
import '../features/courses/mock_course_repository.dart';
import '../features/events/mock_event_repository.dart';
import '../features/venues/mock_venue_repository.dart';

const _authedUser = AuthUser(id: 'u1', email: 'a@b.com');

/// Real widget-tap coverage for the reported "tap a Home category -> back to
/// Home" bug. These drive the actual Home widgets (trending chips) rather than
/// calling the router directly, so they fail if the onTap handler regresses to
/// `push` (which go_router drops across sibling shell branches).
Widget _homeApp(MockVenueRepository venueRepo) {
  return ProviderScope(
    overrides: [
      venueRepositoryProvider.overrideWithValue(venueRepo),
      authRepositoryProvider.overrideWithValue(
        MockAuthRepository(initialUser: _authedUser),
      ),
      eventRepositoryProvider.overrideWithValue(MockEventRepository()),
      courseRepositoryProvider.overrideWithValue(MockCourseRepository()),
    ],
    child: MaterialApp.router(
      routerConfig: createAppRouter(
        initialLocation: AppRoutes.home,
        currentUser: _authedUser,
        authReady: true,
      ),
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

void main() {
  for (final category in [
    ('Function Hall', 'function_hall'),
    ('Meeting Room', 'meeting_room'),
    ('Party Hall', 'party_hall'),
  ]) {
    final label = category.$1;
    final slug = category.$2;

    testWidgets('tapping trending "$label" opens Search and stays there', (
      tester,
    ) async {
      final repo = MockVenueRepository();
      await tester.pumpWidget(_homeApp(repo));
      await tester.pumpAndSettle();

      final chip = find.text(label);
      expect(chip, findsWidgets);

      // The chip row can sit below the fold; bring it on screen first.
      await tester.ensureVisible(chip.first);
      await tester.pumpAndSettle();
      await tester.tap(chip.first);
      await tester.pumpAndSettle();

      final uri = GoRouter.of(
        tester.element(find.byType(SearchScreen).first),
      ).routeInformationProvider.value.uri;

      expect(uri.path, AppRoutes.search, reason: 'must land on /search');
      expect(
        uri.queryParameters['category'],
        slug,
        reason: 'the tapped category must survive as ?category=',
      );
      expect(find.byType(SearchScreen), findsOneWidget);
    });
  }

  testWidgets('deep link straight to /search?category=... keeps the filter', (
    tester,
  ) async {
    final repo = MockVenueRepository();
    final router = createAppRouter(
      initialLocation: '${AppRoutes.search}?category=hotel',
      currentUser: _authedUser,
      authReady: true,
    );
    addTearDown(router.dispose);

    await tester.pumpWidget(
      ProviderScope(
        overrides: [venueRepositoryProvider.overrideWithValue(repo)],
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
      ),
    );
    await tester.pumpAndSettle();

    expect(router.routeInformationProvider.value.uri.path, AppRoutes.search);
    expect(
      router.routeInformationProvider.value.uri.queryParameters['category'],
      'hotel',
    );
  });
}
