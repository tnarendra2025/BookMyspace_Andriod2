import 'package:bookmyspace/core/localization/app_localizations.dart';
import 'package:bookmyspace/core/router/app_router.dart';
import 'package:bookmyspace/features/auth/domain/auth_user.dart';
import 'package:bookmyspace/features/auth/presentation/auth_providers.dart';
import 'package:bookmyspace/features/courses/presentation/course_providers.dart';
import 'package:bookmyspace/features/events/presentation/event_providers.dart';
import 'package:bookmyspace/features/venues/presentation/venue_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import '../auth/mock_auth_repository.dart';
import '../courses/mock_course_repository.dart';
import '../events/mock_event_repository.dart';
import '../venues/mock_venue_repository.dart';

/// Viewport sizes required by the responsive layout fix:
/// compact phone, medium tablet, wide desktop and the legacy 800x600 baseline.
const _sizes = <String, Size>{
  'compact 390x844': Size(390, 844),
  'medium 600x900': Size(600, 900),
  'wide 1280x900': Size(1280, 900),
  'baseline 800x600': Size(800, 600),
};

Widget _app({MockAuthRepository? authRepo, AuthUser? currentUser}) {
  final auth =
      authRepo ??
      MockAuthRepository(
        initialUser: const AuthUser(id: 'u1', email: 'a@b.com'),
      );
  return ProviderScope(
    overrides: [
      venueRepositoryProvider.overrideWithValue(MockVenueRepository()),
      authRepositoryProvider.overrideWithValue(auth),
      eventRepositoryProvider.overrideWithValue(MockEventRepository()),
      courseRepositoryProvider.overrideWithValue(MockCourseRepository()),
      if (currentUser != null)
        currentUserProvider.overrideWith((ref) => currentUser),
    ],
    child: MaterialApp.router(
      routerConfig: createAppRouter(
        initialLocation: AppRoutes.home,
        currentUser: const AuthUser(id: 'u1', email: 'a@b.com'),
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

/// Records every error the framework reports while [body] lays out the widget
/// tree, then restores [FlutterError.onError] before the test asserts (the test
/// binding requires the handler to be restored inside the test body).
///
/// Returns the first line of each error message, e.g.
/// `A RenderFlex overflowed by 82 pixels on the right.`
Future<List<String>> _captureErrors(Future<void> Function() body) async {
  final messages = <String>[];
  final previous = FlutterError.onError;
  FlutterError.onError = (details) {
    final first = details.exceptionAsString().split('\n').first.trim();
    final info = details.informationCollector?.call().map((n) => n.toString()).join(' ');
    messages.add(info == null || info.isEmpty ? first : '$first ||| ${info.replaceAll('\n', ' ')}');
  };
  try {
    await body();
  } finally {
    FlutterError.onError = previous;
  }
  for (final message in messages) {
    printOnFailure(message);
  }
  return messages;
}

void _expectNoOverflow(List<String> errors, String context) {
  final overflows = errors
      .where((message) => message.contains('overflowed'))
      .toList();
  expect(
    overflows,
    isEmpty,
    reason: 'render overflow at $context:\n${overflows.join('\n')}',
  );
  expect(errors, isEmpty, reason: 'unexpected errors at $context: $errors');
}

void _setViewport(WidgetTester tester, Size size) {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1.0;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
}

/// Pumps the home screen at [size] with the mock repositories in use.
Future<void> _pumpHomeAt(
  WidgetTester tester,
  Size size, {
  MockAuthRepository? authRepo,
  AuthUser? currentUser,
}) async {
  _setViewport(tester, size);
  await tester.pumpWidget(_app(authRepo: authRepo, currentUser: currentUser));
  await tester.pumpAndSettle();
}

/// Drags the home scroll view so every lazily built 3D category hero card
/// (deep inside the sliver list) is laid out at the current viewport.
Future<void> _revealCategoryHeroCards(WidgetTester tester) async {
  final scrollable = find.byType(CustomScrollView);
  for (var i = 0; i < 8; i++) {
    await tester.drag(scrollable, const Offset(0, -500), warnIfMissed: false);
    await tester.pumpAndSettle();
  }
}

void main() {
  group('_TopHeaderBar responsive layout', () {
    for (final entry in _sizes.entries) {
      testWidgets('renders without overflow at ${entry.key}', (tester) async {
        final errors = await _captureErrors(() => _pumpHomeAt(tester, entry.value));

        expect(find.text('BookMySpace'), findsOneWidget);
        _expectNoOverflow(errors, entry.key);
      });
    }

    testWidgets('keeps every header action reachable at compact width', (
      tester,
    ) async {
      await _pumpHomeAt(tester, const Size(390, 844));

      expect(find.text('BookMySpace'), findsOneWidget);
      expect(find.byIcon(Icons.map_rounded), findsOneWidget);
      expect(find.byIcon(Icons.qr_code_scanner_rounded), findsOneWidget);
      expect(find.byIcon(Icons.notifications_none_rounded), findsOneWidget);
    });

    testWidgets('renders the signed-in avatar header without overflow', (
      tester,
    ) async {
      final errors = await _captureErrors(
        () => _pumpHomeAt(
          tester,
          const Size(390, 844),
          currentUser: const AuthUser(id: 'u1', email: 'a@b.com'),
        ),
      );

      expect(find.byType(CircleAvatar), findsWidgets);
      expect(find.text('BookMySpace'), findsOneWidget);
      expect(find.byIcon(Icons.map_rounded), findsOneWidget);
      _expectNoOverflow(errors, 'compact signed-in header');
    });

    testWidgets('shows the sign-in action without overflow when signed out', (
      tester,
    ) async {
      final errors = await _captureErrors(
        () => _pumpHomeAt(
          tester,
          const Size(390, 844),
          authRepo: MockAuthRepository(),
        ),
      );

      expect(find.text('Sign In'), findsOneWidget);
      expect(find.byIcon(Icons.map_rounded), findsOneWidget);
      _expectNoOverflow(errors, 'compact signed-out header');
    });
  });

  group('3D category hero card responsive layout', () {
    for (final entry in _sizes.entries) {
      testWidgets('renders without overflow at ${entry.key}', (tester) async {
        final errors = await _captureErrors(() async {
          await _pumpHomeAt(tester, entry.value);
          await _revealCategoryHeroCards(tester);
        });

        // The hero cards are reached and laid out at every viewport size.
        expect(find.text('Explore Spaces'), findsWidgets);
        _expectNoOverflow(errors, entry.key);
      });
    }

    testWidgets('hero card exposes sub-section chips at compact width', (
      tester,
    ) async {
      final errors = await _captureErrors(() async {
        await _pumpHomeAt(tester, const Size(390, 844));
        await _revealCategoryHeroCards(tester);
      });

      expect(find.text('SUB-SECTIONS INCLUDED:'), findsWidgets);
      expect(find.text('+ Sub-Section'), findsWidgets);
      expect(find.text('1-CLICK FILTER'), findsWidgets);
      _expectNoOverflow(errors, 'compact hero card');
    });
  });
}
