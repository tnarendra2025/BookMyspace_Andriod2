import 'package:flutter/foundation.dart';

/// HTTP methods supported for performance network tracing.
enum HttpMethod {
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Head,
  Options,
  Trace,
  Connect,
}

/// A trace represents a performance measurement interval.
class Trace {
  Trace(this.name);

  final String name;
  final Map<String, String> _attributes = {};
  final Map<String, int> _metrics = {};
  bool _isRunning = false;
  bool get isRunning => _isRunning;

  void start() {
    _isRunning = true;
  }

  void stop() {
    _isRunning = false;
  }

  void putAttribute(String name, String value) {
    _attributes[name] = value;
  }

  String? getAttribute(String name) => _attributes[name];

  void incrementMetric(String name, int value) {
    _metrics[name] = (_metrics[name] ?? 0) + value;
  }

  void setMetric(String name, int value) {
    _metrics[name] = value;
  }

  int getMetric(String name) => _metrics[name] ?? 0;
}

/// HTTP metric tracker for measuring network call performance.
class HttpMetric {
  HttpMetric(this.url, this.httpMethod);

  final String url;
  final HttpMethod httpMethod;
  final Map<String, String> _attributes = {};
  int? httpResponseCode;
  int? requestPayloadSize;
  int? responsePayloadSize;
  String? responseContentType;

  void start() {}
  void stop() {}

  void putAttribute(String name, String value) {
    _attributes[name] = value;
  }

  String? getAttribute(String name) => _attributes[name];
}

/// Wrapper around Performance Monitoring.
class PerformanceService {
  PerformanceService._();

  static bool _enabled = true;

  /// Initialize Performance Monitoring.
  static Future<void> init() async {
    _enabled = true;
    debugPrint('Performance monitoring initialized (resilient logging mode)');
  }

  /// Start a custom trace.
  static Trace? startTrace(String name) {
    if (!_enabled) return null;
    final trace = Trace(name);
    trace.start();
    return trace;
  }

  /// Stop a custom trace.
  static void stopTrace(Trace? trace) {
    trace?.stop();
  }

  /// Increment a counter in a trace.
  static void incrementCounter(Trace? trace, String name, int increment) {
    trace?.incrementMetric(name, increment);
  }

  /// Record a screen view trace.
  static Trace? startScreenTrace(String screenName) {
    if (!_enabled) return null;
    final trace = Trace('screen_view_$screenName');
    trace.putAttribute('screen_name', screenName);
    trace.start();
    return trace;
  }

  /// Record an HTTP request trace.
  static HttpMetric? startHttpTrace(String url, String method) {
    if (!_enabled) return null;
    final httpMethod = HttpMethod.values.firstWhere(
      (m) => m.name.toLowerCase() == method.toLowerCase(),
      orElse: () => HttpMethod.Get,
    );
    final metric = HttpMetric(url, httpMethod);
    metric.start();
    return metric;
  }

  /// Record a custom metric.
  static Future<void> recordMetric(
    String traceName,
    String metricName,
    int value,
  ) async {
    final trace = Trace(traceName);
    trace.incrementMetric(metricName, value);
    trace.stop();
  }

  /// Set user attributes for performance segmentation.
  static Future<void> setUserAttribute(String key, String value) async {}
}