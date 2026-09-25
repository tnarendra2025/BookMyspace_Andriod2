import 'package:bookmyspace/features/notifications/domain/notification.dart';
import 'package:bookmyspace/features/notifications/domain/notification_repository.dart';

/// In-memory mock used for unit tests and widget tests.
class MockNotificationRepository implements NotificationRepository {
  MockNotificationRepository({List<Notification>? initial})
    : _items = [...?initial];

  final List<Notification> _items;

  /// Overridable behaviours for test scenarios.
  bool failRequests = false;

  @override
  Future<List<Notification>> myNotifications() async {
    if (failRequests) throw Exception('Network failure');
    return [..._items];
  }

  @override
  Future<void> markRead(String notificationId) async {
    if (failRequests) throw Exception('Network failure');
    final i = _items.indexWhere((n) => n.id == notificationId);
    if (i != -1) _items[i] = _items[i].copyWith(read: true);
  }

  @override
  Future<void> markAllRead() async {
    if (failRequests) throw Exception('Network failure');
    for (var i = 0; i < _items.length; i++) {
      _items[i] = _items[i].copyWith(read: true);
    }
  }

  @override
  Future<int> unreadCount() async {
    if (failRequests) throw Exception('Network failure');
    return _items.where((n) => !n.read).length;
  }

  @override
  Future<void> addNotification(Notification notification) async {
    if (failRequests) throw Exception('Network failure');
    _items.add(notification);
  }

  @override
  Future<void> registerPushToken(
    String token,
    String platform, {
    Map<String, dynamic>? subscriptionData,
  }) async {
    if (failRequests) throw Exception('Network failure');
  }

  @override
  Future<void> unregisterPushToken(String token) async {
    if (failRequests) throw Exception('Network failure');
  }
}