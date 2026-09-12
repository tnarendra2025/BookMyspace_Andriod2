import 'dart:async';
import 'package:flutter/foundation.dart';

/// Service for generating and launching platform-neutral external links and deep links (Section 89).
class DeepLinkService {
  const DeepLinkService();

  /// Formats a phone call URI.
  static String buildCallUri(String phoneNumber) {
    final cleanNumber = phoneNumber.replaceAll(RegExp(r'[^\d+]'), '');
    return 'tel:$cleanNumber';
  }

  /// Formats an official WhatsApp conversation deep link with optional message.
  static String buildWhatsAppUri({
    required String phoneNumber,
    String? message,
  }) {
    final cleanNumber = phoneNumber.replaceAll(RegExp(r'[^\d]'), '');
    final query = message != null && message.isNotEmpty
        ? '?text=${Uri.encodeComponent(message)}'
        : '';
    return 'https://wa.me/$cleanNumber$query';
  }

  /// Formats a Google Maps / Geo location URI.
  static String buildMapsUri({
    required double latitude,
    required double longitude,
    String? label,
  }) {
    if (kIsWeb) {
      return 'https://www.google.com/maps/search/?api=1&query=$latitude,$longitude';
    }
    final encodedLabel = label != null ? '($label)' : '';
    return 'geo:$latitude,$longitude?q=$latitude,$longitude$encodedLabel';
  }

  /// Formats an email URI with recipient, subject, and body.
  static String buildEmailUri({
    required String email,
    String? subject,
    String? body,
  }) {
    final queryParams = <String>[];
    if (subject != null) queryParams.add('subject=${Uri.encodeComponent(subject)}');
    if (body != null) queryParams.add('body=${Uri.encodeComponent(body)}');
    final query = queryParams.isNotEmpty ? '?${queryParams.join('&')}' : '';
    return 'mailto:$email$query';
  }

  /// Formats a partner booking handoff link (Section 71 & 88).
  /// Note: The UI must clearly display "Continue on partner website".
  static String buildPartnerBookingUri({
    required String partnerBaseUrl,
    required String venueId,
    String? referralCode,
  }) {
    final uri = Uri.parse(partnerBaseUrl);
    final query = Map<String, String>.from(uri.queryParameters);
    query['venue_id'] = venueId;
    query['source'] = 'bookmyspace_app';
    if (referralCode != null) query['ref'] = referralCode;
    return uri.replace(queryParameters: query).toString();
  }

  /// Formats social sharing URI for venue details.
  static String buildShareUri({
    required String venueId,
    required String venueName,
  }) {
    return 'https://bookmyspace.app/venues/$venueId?utm_source=app_share&utm_medium=mobile';
  }
}
