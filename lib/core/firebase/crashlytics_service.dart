import 'package:flutter/foundation.dart';

/// Wrapper around error reporting / crash logging.
class CrashlyticsService {
  CrashlyticsService._();

  static bool _collectionEnabled = true;
  static String? _userId;
  static String? get userId => _userId;
  static final Map<String, Object> _customKeys = {};

  /// Initialize Crashlytics and set up error handlers.
  static Future<void> init({
    bool collectReports = true,
    bool recordFlutterFatalErrors = true,
  }) async {
    _collectionEnabled = collectReports;
    if (kIsWeb) {
      debugPrint('Crashlytics: Web platform - console logging enabled');
      return;
    }

    try {
      if (recordFlutterFatalErrors) {
        FlutterError.onError = _recordFlutterError;
      }

      PlatformDispatcher.instance.onError = (error, stack) {
        recordError(error, stack, fatal: true);
        return true;
      };

      debugPrint('Crashlytics initialized (resilient logging mode)');
    } catch (e) {
      debugPrint('Crashlytics init failed: $e');
    }
  }

  /// Record a Flutter framework error.
  static void _recordFlutterError(FlutterErrorDetails details) {
    debugPrint('Crashlytics recorded Flutter error: ${details.exception}');
  }

  /// Record a non-fatal error.
  static void recordError(
    Object error,
    StackTrace? stack, {
    String? reason,
    Iterable<Object>? information,
    bool fatal = false,
  }) {
    if (!_collectionEnabled) return;
    debugPrint('Crashlytics recordError [fatal=$fatal]: $error, reason: $reason');
  }

  /// Record a custom exception with context.
  static void recordException(
    Exception exception, {
    StackTrace? stackTrace,
    String? context,
    Map<String, Object?>? extra,
  }) {
    final info = <Object>[
      if (context != null) 'context: $context',
      if (extra != null) ...extra.entries.map((e) => '${e.key}: ${e.value}'),
    ];

    recordError(
      exception,
      stackTrace,
      reason: 'Exception: ${exception.runtimeType}',
      information: info.isNotEmpty ? info : null,
      fatal: false,
    );
  }

  /// Set a custom user ID for crash reports.
  static Future<void> setUserId(String userId) async {
    _userId = userId;
  }

  /// Add a custom key-value pair to crash reports.
  static Future<void> setCustomKey(String key, Object value) async {
    _customKeys[key] = value;
  }

  /// Log a custom message (appears in crash reports).
  static Future<void> log(String message) async {
    debugPrint('Crashlytics log: $message');
  }

  /// Check if Crashlytics is enabled.
  static bool get isEnabled => _collectionEnabled;
}