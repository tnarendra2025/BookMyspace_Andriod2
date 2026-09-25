import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/config/settings_controller.dart';
import 'core/localization/app_localizations.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/auth_providers.dart';
import 'features/notifications/presentation/notification_providers.dart';

/// Root widget that wires together providers, theming, localization and routing.
class BookMySpaceApp extends ConsumerStatefulWidget {
  const BookMySpaceApp({super.key, this.initialLocation});

  /// Overridable initial route (used in tests).
  final String? initialLocation;

  @override
  ConsumerState<BookMySpaceApp> createState() => _BookMySpaceAppState();
}

class _BookMySpaceAppState extends ConsumerState<BookMySpaceApp> {
  GoRouter? _router;
  String? _routerKey;

  @override
  void dispose() {
    _router?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Initialize system-level push notification service (APNs for iOS, Web Push for Web)
    ref.watch(pushNotificationServiceProvider);

    final authAsync = ref.watch(authStateProvider);
    final currentUser = authAsync.value;
    final authReady = !authAsync.isLoading;

    // Keep the GoRouter instance stable across rebuilds (theme/locale changes,
    // provider invalidations). Recreating GoRouter on every build resets the
    // navigation stack to initialLocation, which surfaces as "tap a category
    // -> back to Home" plus UI blinking. Only recreate when the auth gate
    // inputs actually change.
    final key =
        '${widget.initialLocation}|$authReady|${currentUser?.id}|${currentUser?.roles.join(',')}';
    if (_router == null || _routerKey != key) {
      _router?.dispose();
      _router = createAppRouter(
        initialLocation: widget.initialLocation ?? AppRoutes.shell,
        currentUser: currentUser,
        authReady: authReady,
      );
      _routerKey = key;
    }
    final router = _router!;

    return MaterialApp.router(
      title: 'BookMySpace',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ref.watch(themeModeProvider),
      locale: ref.watch(localeProvider),
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
    );
  }
}
