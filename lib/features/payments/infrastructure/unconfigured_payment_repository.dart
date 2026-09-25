import '../../../core/errors/app_exceptions.dart';
import '../../booking/domain/booking.dart';
import '../domain/payment.dart';
import '../domain/payment_repository.dart';

/// Fail-closed [PaymentRepository] used when the secure backend
/// (Supabase Edge Functions) is not available for the current build or
/// environment.
///
/// Every operation reports the missing configuration instead of simulating a
/// payment, so a booking is never treated as paid without a real provider
/// capture from the configured payment provider.
class UnconfiguredPaymentRepository implements PaymentRepository {
  const UnconfiguredPaymentRepository();

  static const ConfigurationException _unavailable = ConfigurationException(
    'Payment service is not configured on this build. Add the Supabase project '
    'keys to enable online payments — pay at venue still works.',
    code: 'payment_not_configured',
  );

  @override
  Future<PaymentOrder> createOrder({required String bookingId}) async {
    throw _unavailable;
  }

  @override
  Future<BookingStatus> bookingStatus(String bookingId) async {
    throw _unavailable;
  }

  @override
  Future<Refund> requestRefund({
    required String bookingId,
    required double amount,
    String reason = '',
  }) async {
    throw _unavailable;
  }

  @override
  Future<List<Payment>> myPayments() async {
    throw _unavailable;
  }

  @override
  Future<bool> verifyPayment({
    required String bookingId,
    required String orderId,
    required String paymentId,
    required String signature,
  }) async {
    throw _unavailable;
  }
}
