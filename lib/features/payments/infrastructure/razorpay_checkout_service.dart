import 'native_razorpay_checkout_service.dart';

/// Platform-aware Razorpay Checkout implementation.
///
/// Delegates to [NativeRazorpayCheckoutService] to support Android & iOS platform
/// channels and Web browser checkout without requiring the razorpay_flutter plugin.
class RazorpayCheckoutService extends NativeRazorpayCheckoutService {
  RazorpayCheckoutService();
}
