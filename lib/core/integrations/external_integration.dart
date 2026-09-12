import 'dart:async';

/// Status of an external integration connector according to Section 68.
enum IntegrationStatus {
  connected,
  disconnected,
  configurationRequired,
  authenticationRequired,
  rateLimited,
  unavailable,
  maintenance,
}

extension IntegrationStatusX on IntegrationStatus {
  String get label {
    switch (this) {
      case IntegrationStatus.connected:
        return 'Connected';
      case IntegrationStatus.disconnected:
        return 'Disconnected';
      case IntegrationStatus.configurationRequired:
        return 'Configuration Required';
      case IntegrationStatus.authenticationRequired:
        return 'Authentication Required';
      case IntegrationStatus.rateLimited:
        return 'Rate Limited';
      case IntegrationStatus.unavailable:
        return 'Unavailable';
      case IntegrationStatus.maintenance:
        return 'Maintenance';
    }
  }

  bool get isOperational => this == IntegrationStatus.connected;
}

/// Health monitoring model for external connectors (Section 78).
class IntegrationHealth {
  const IntegrationHealth({
    required this.status,
    required this.latencyMs,
    required this.failureRatePercent,
    this.httpStatus = 200,
    this.lastSuccessfulSync,
    this.lastError,
    this.rateLimited = false,
  });

  final String status;
  final int latencyMs;
  final double failureRatePercent;
  final int httpStatus;
  final DateTime? lastSuccessfulSync;
  final String? lastError;
  final bool rateLimited;

  factory IntegrationHealth.fromJson(Map<String, dynamic> json) {
    return IntegrationHealth(
      status: json['status'] as String? ?? 'HEALTHY',
      latencyMs: (json['latencyMs'] as num?)?.toInt() ?? 80,
      failureRatePercent: (json['failureRate'] as num?)?.toDouble() ?? 0.0,
      httpStatus: (json['httpStatus'] as num?)?.toInt() ?? 200,
      lastSuccessfulSync: json['lastSuccessfulSync'] != null
          ? DateTime.tryParse(json['lastSuccessfulSync'] as String)
          : null,
      lastError: json['lastError'] as String?,
      rateLimited: json['rateLimited'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'status': status,
        'latencyMs': latencyMs,
        'failureRate': failureRatePercent,
        'httpStatus': httpStatus,
        'lastSuccessfulSync': lastSuccessfulSync?.toIso8601String(),
        'lastError': lastError,
        'rateLimited': rateLimited,
      };
}

/// Normalized result of an integration operation (Section 67 & 73).
class IntegrationResult {
  const IntegrationResult({
    required this.success,
    this.data,
    this.error,
    this.isCached = false,
    required this.timestamp,
  });

  final bool success;
  final Map<String, dynamic>? data;
  final String? error;
  final bool isCached;
  final DateTime timestamp;

  factory IntegrationResult.success(Map<String, dynamic> data, {bool isCached = false}) {
    return IntegrationResult(
      success: true,
      data: data,
      isCached: isCached,
      timestamp: DateTime.now(),
    );
  }

  factory IntegrationResult.failure(String error) {
    return IntegrationResult(
      success: false,
      error: error,
      timestamp: DateTime.now(),
    );
  }
}

/// Standard configuration for an external provider (Section 83).
class IntegrationConfig {
  const IntegrationConfig({
    required this.id,
    required this.name,
    required this.provider,
    required this.type,
    required this.baseUrl,
    required this.authType,
    required this.capabilities,
    this.enabled = true,
    this.platforms = const ['iOS', 'Android', 'Web'],
    this.syncIntervalMinutes = 15,
    this.timeoutSeconds = 10,
    this.retryPolicy = 'exponential_backoff',
    this.displayName,
    this.icon,
    this.documentationUrl,
    this.isSecretConfigured = true,
  });

  final String id;
  final String name;
  final String provider;
  final String type;
  final String baseUrl;
  final String authType;
  final List<String> capabilities;
  final bool enabled;
  final List<String> platforms;
  final int syncIntervalMinutes;
  final int timeoutSeconds;
  final String retryPolicy;
  final String? displayName;
  final String? icon;
  final String? documentationUrl;
  final bool isSecretConfigured;

  factory IntegrationConfig.fromJson(Map<String, dynamic> json) {
    return IntegrationConfig(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      provider: json['provider'] as String? ?? '',
      type: json['type'] as String? ?? 'REST_API',
      baseUrl: json['baseUrl'] as String? ?? '',
      authType: json['authType'] as String? ?? 'Bearer',
      capabilities: (json['capabilities'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      enabled: json['enabled'] as bool? ?? true,
      platforms: (json['platforms'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const ['iOS', 'Android', 'Web'],
      syncIntervalMinutes: (json['syncIntervalMinutes'] as num?)?.toInt() ?? 15,
      timeoutSeconds: (json['timeoutSeconds'] as num?)?.toInt() ?? 10,
      retryPolicy: json['retryPolicy'] as String? ?? 'exponential_backoff',
      displayName: json['displayName'] as String?,
      icon: json['icon'] as String?,
      documentationUrl: json['documentationUrl'] as String?,
      isSecretConfigured: json['isSecretConfigured'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'provider': provider,
        'type': type,
        'baseUrl': baseUrl,
        'authType': authType,
        'capabilities': capabilities,
        'enabled': enabled,
        'platforms': platforms,
        'syncIntervalMinutes': syncIntervalMinutes,
        'timeoutSeconds': timeoutSeconds,
        'retryPolicy': retryPolicy,
        'displayName': displayName,
        'icon': icon,
        'documentationUrl': documentationUrl,
        'isSecretConfigured': isSecretConfigured,
      };
}

/// External provider model used in Admin and UI screens (Section 68).
class IntegrationProviderItem {
  const IntegrationProviderItem({
    required this.id,
    required this.name,
    required this.category,
    required this.status,
    required this.apiAvailability,
    required this.health,
    required this.enabledPlatforms,
    this.lastSuccessfulSync,
    this.lastError,
    this.enabled = true,
  });

  final String id;
  final String name;
  final String category;
  final IntegrationStatus status;
  final String apiAvailability;
  final IntegrationHealth health;
  final List<String> enabledPlatforms;
  final DateTime? lastSuccessfulSync;
  final String? lastError;
  final bool enabled;

  factory IntegrationProviderItem.fromJson(Map<String, dynamic> json) {
    IntegrationStatus parsedStatus = IntegrationStatus.connected;
    final statusStr = (json['status'] as String? ?? '').toLowerCase();
    if (statusStr.contains('disconnect')) {
      parsedStatus = IntegrationStatus.disconnected;
    } else if (statusStr.contains('configuration')) {
      parsedStatus = IntegrationStatus.configurationRequired;
    } else if (statusStr.contains('auth')) {
      parsedStatus = IntegrationStatus.authenticationRequired;
    } else if (statusStr.contains('rate')) {
      parsedStatus = IntegrationStatus.rateLimited;
    } else if (statusStr.contains('unavail')) {
      parsedStatus = IntegrationStatus.unavailable;
    } else if (statusStr.contains('maint')) {
      parsedStatus = IntegrationStatus.maintenance;
    }

    final healthMap = json['health'] is Map<String, dynamic>
        ? json['health'] as Map<String, dynamic>
        : {'status': json['health'] ?? 'HEALTHY'};

    return IntegrationProviderItem(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      category: json['category'] as String? ?? 'General',
      status: parsedStatus,
      apiAvailability: json['apiAvailability'] as String? ?? 'Online',
      health: IntegrationHealth.fromJson(healthMap),
      enabledPlatforms: (json['enabledPlatforms'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const ['iOS', 'Android', 'Web'],
      lastSuccessfulSync: json['lastSuccessfulSync'] != null
          ? DateTime.tryParse(json['lastSuccessfulSync'] as String)
          : null,
      lastError: json['lastError'] as String?,
      enabled: json['enabled'] as bool? ?? true,
    );
  }
}

/// Platform-neutral contract required by Section 72.
abstract class ExternalProvider {
  String get providerId;
  String get providerName;
  Future<IntegrationHealth> healthCheck();
  Future<IntegrationResult> execute(String operation, Map<String, dynamic> params);
}

/// Plug-and-play provider registry mandated by Section 84.
class IntegrationRegistry {
  IntegrationRegistry._();
  static final IntegrationRegistry instance = IntegrationRegistry._();

  final Map<String, ExternalProvider> _providers = {};

  void register(ExternalProvider provider) {
    _providers[provider.providerId] = provider;
  }

  ExternalProvider? getProvider(String providerId) {
    return _providers[providerId];
  }

  List<ExternalProvider> get allProviders => _providers.values.toList();

  bool hasProvider(String providerId) => _providers.containsKey(providerId);

  void unregister(String providerId) {
    _providers.remove(providerId);
  }
}
