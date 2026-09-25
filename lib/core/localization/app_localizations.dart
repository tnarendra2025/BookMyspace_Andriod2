import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// Application localizations providing strings in English and Telugu/Hindi.
class AppLocalizations {
  AppLocalizations(this.locale);

  final Locale locale;

  static AppLocalizations of(BuildContext context) {
    final l10n = Localizations.of<AppLocalizations>(context, AppLocalizations);
    return l10n ?? AppLocalizations(const Locale('en'));
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static const List<Locale> supportedLocales = [
    Locale('en'),
    Locale('te'),
    Locale('hi'),
  ];

  String get appName => locale.languageCode == 'te' ? 'బుక్‌మైస్పేస్' : 'BookMySpace';
  String get tagline => 'Discover and book spaces with ease';
  String get navHome => 'Home';
  String get navSearch => 'Search';
  String get navBookings => 'Bookings';
  String get navSaved => 'Saved';
  String get navProfile => 'Profile';
  String get notifications => 'Notifications';
  String get courses => 'Courses';
  String get venues => 'Venues';
  String get venueDetails => 'Venue Details';
  String get aboutThisVenue => 'About this venue';
  String get amenities => 'Amenities';
  String get operatingHours => 'Operating Hours';
  String get details => 'Details';
  String get foodOptions => 'Food Options';
  String get parking => 'Parking';
  String get taxRate => 'Tax Rate';
  String get address => 'Address';
  String get basePrice => 'Base Price';
  String get capacity => 'Capacity';
  String get pricing => 'Starting at';
  String get bookNow => 'Book now';
  String get search => 'Search';
  String get searchHint => 'Search venues, cities or categories...';
  String get filters => 'Filters';
  String get clearFilters => 'Clear Filters';
  String get apply => 'Apply';
  String get allCategories => 'All Categories';
  String get minPrice => 'Min Price';
  String get maxPrice => 'Max Price';
  String get sortBy => 'Sort By';
  String get relevance => 'Relevance';
  String get priceLowToHigh => 'Price: Low to High';
  String get priceHighToLow => 'Price: High to Low';
  String get topRated => 'Top Rated';
  String get noResults => 'No results found';
  String get noResultsMessage => 'Try a different keyword, category or price range.';
  String get tryAgain => 'Try again';
  String get loading => 'Loading...';
  String get cancel => 'Cancel';
  String get confirm => 'Confirm';
  String get delete => 'Delete';
  String get done => 'Done';
  String get keep => 'Keep booking';
  String get next => 'Next';
  String get skip => 'Skip';
  String get getStarted => 'Get Started';
  String get total => 'Total';
  String get selectDate => 'Select Date';
  String get selectTimeSlot => 'Select Time Slot';
  String get noSlotsForDate => 'No slots available for this date';
  String get confirmBooking => 'Confirm booking';
  String get cancelBooking => 'Cancel booking';
  String get cancelBookingConfirm => 'Are you sure you want to cancel this booking?';
  String get myBookings => 'My Bookings';
  String get noBookings => 'No bookings yet';
  String get noBookingsMessage => 'Your booked venues and passes will appear here.';
  String get requestRefund => 'Request refund';
  String get requestRefundConfirm =>
      'Request a full refund for this booking? The amount is returned to your original payment method.';
  String get refundRequested => 'Refund requested successfully';
  String get savedVenues => 'Saved Venues';
  String get upcomingEvents => 'Upcoming Events';
  String get noUpcomingEvents => 'No upcoming events';
  String get noUpcomingEventsMessage => 'Check back later for new workshops and events.';
  String get freeEvent => 'Free';
  String get seatsLeft => '{count} seats left';
  String get soldOut => 'Sold out';
  String get registered => 'Registered';
  String get registerNow => 'Register now';
  String get cancelRegistration => 'Cancel registration';
  String get cancelRegistrationConfirm => 'Are you sure you want to cancel your event registration?';
  String get registrationCancelled => 'Registration cancelled successfully';
  String get noCourses => 'No courses available';
  String get noCoursesMessage => 'Explore new courses and batches coming soon.';
  String get courseFee => 'Course Fee';
  String get enrollNow => 'Enroll now';
  String get dropEnrollment => 'Drop Enrollment';
  String get durationWeeks => '{weeks} weeks';
  String get instructor => 'Instructor';
  String get enrollInCourse => 'Enroll now';
  String get dropEnrollmentConfirm => 'Are you sure you want to drop your enrollment?';
  String get enrollmentDropped => 'Enrollment dropped successfully';
  String get enrolled => 'Enrolled';
  String get batchStartsOn => 'Starts on';
  String get modeOnline => 'Online';
  String get modeOffline => 'Offline';
  String get modeHybrid => 'Hybrid';
  String get analytics => 'Analytics';
  String get reviews => 'Reviews';
  String get settings => 'Settings';
  String get themeMode => 'Theme Mode';
  String get language => 'Language';
  String get support => 'Support';
  String get privacyPolicy => 'Privacy Policy';
  String get termsAndConditions => 'Terms & Conditions';
  String get deleteAccount => 'Delete Account';
  String get name => 'Name';
  String get email => 'Email';
  String get password => 'Password';
  String get errorInvalidEmail => 'Please enter a valid email address';
  String get signUp => 'Sign Up';
  String get priority => 'Priority';
  String get about => 'About';
  String get auditLog => 'Audit Log';
  String get ownerDashboard => 'Owner Dashboard';
  String get myVenues => 'My Venues';
  String get onboardingTitle1 => 'Discover venues';
  String get onboardingSubtitle1 => 'Discover convention halls, party venues, sports grounds, and classrooms near you.';
  String get onboardingTitle2 => 'Real-Time Availability';
  String get onboardingSubtitle2 => 'Check open slots, transparent pricing, and instant booking confirmations.';
  String get onboardingTitle3 => 'Seamless & Secure';
  String get onboardingSubtitle3 => 'Pay securely with instant tax invoices and easy booking management.';

  // Auth / login screen
  String get errorRequired => 'This field is required';
  String get errorInvalidPhone => 'Please enter a valid phone number';
  String get continueWithGoogle => 'Continue with Google';
  String get continueWithApple => 'Continue with Apple';
  String get phone => 'Phone';
  String get resendOtp => 'Resend OTP';
  String get sendOtp => 'Send code';
  String get otpSent => 'We sent a verification code to your email';
  String get otpPlaceholder => 'Enter OTP';
  String get verifyOtp => 'Verify & log in';
  String get back => 'Back';
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) =>
      AppLocalizations.supportedLocales.map((l) => l.languageCode).contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) =>
      SynchronousFuture<AppLocalizations>(AppLocalizations(locale));

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
