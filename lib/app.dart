import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

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
  /// Created once. The router owns the navigation stack, so rebuilding it
  /// would discard the user's place in the app.
  final AuthGate _authGate = AuthGate();
  GoRouter? _router;

  @override
  void dispose() {
    _router?.dispose();
    _authGate.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Initialize system-level push notification service (APNs for iOS, Web Push for Web)
    ref.watch(pushNotificationServiceProvider);

    final authAsync = ref.watch(authStateProvider);

    // Feed auth into the existing router. Supabase restores the session
    // asynchronously, so this flips from (loading, no user) to (ready, user)
    // shortly after launch. Pushing it through the gate makes GoRouter
    // re-run `redirect` in place; previously the key change below disposed the
    // router and rebuilt it at /home, which reset the stack and collided on
    // the shared navigator GlobalKeys.
    _authGate.update(user: authAsync.value, ready: !authAsync.isLoading);

    _router ??= createAppRouter(
      initialLocation: widget.initialLocation ?? AppRoutes.shell,
      authGate: _authGate,
    );
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
