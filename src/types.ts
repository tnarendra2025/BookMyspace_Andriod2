// BookMySpace Core TypeScript Definitions

export type UserRole = 'USER' | 'VENUE_OWNER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface VenueCategory {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  icon: string;
  isActive: boolean;
  isUnifiedRegistrationEnabled: boolean;
  customEmoji?: string;
  parentSection?: string;
}

export interface VenueImage {
  id: string;
  url: string;
  altText: string;
  isCover: boolean;
  tag?: string;
}

export interface VenueVideo {
  id: string;
  url: string;
  title: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  aspectRatio?: '9:16' | '16:9';
  isShort?: boolean;
  viewsCount?: number;
  uploadedAt?: string;
}

export interface VenueFacility {
  facility: string;
  isAvailable: boolean;
}

export interface VenuePackage {
  id: string;
  name: string;
  priceAmount: number;
  description: string;
  itemsIncluded: string[];
  vegPlatePrice?: number;
  nonVegPlatePrice?: number;
}

export interface VenueAddon {
  id: string;
  name: string;
  priceAmount: number;
  description: string;
}

export interface PgSharingOption {
  id: string;
  typeName: string;
  monthlyRent: number;
  depositAmount: number;
  isAvailable: boolean;
  roomFeatures: string[];
}

export interface PgDetails {
  pgType: string;
  sharingOptions: PgSharingOption[];
  gateLockTime: string;
  noticePeriodDays: number;
  securityDepositMonths: number;
  mealPlan: string;
  preferredOccupants: string;
  electricityCharges: string;
  maintenanceFee: number;
}

export interface HotelDetails {
  starRating: number;
  propertyType: string;
  roomTypes: string[];
  checkInTime: string;
  checkOutTime: string;
  allowsFlexiStay: boolean;
}

export interface TimeSlot {
  id: string;
  venueId?: string;
  label: string;
  startTime: string;
  endTime: string;
  priceAmount: number;
  isAvailable: boolean;
}

export interface LocationHierarchy {
  state: string;
  district: string;
  mandal?: string;
  city: string;
  area: string;
  pincode: string;
  fullAddressText: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  description: string;
  addressLine1: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  capacity: number;
  minGuests?: number;
  maxGuests?: number;
  distanceKm: number;
  pricingBaseAmount: number;
  taxRate: number;
  parkingCapacity: number;
  foodOptions: string;
  rules: string;
  isVerified: boolean;
  isActive: boolean;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  avgRating: number;
  ratingCount: number;
  category: VenueCategory;
  images: VenueImage[];
  videos?: VenueVideo[];
  facilities: VenueFacility[];
  packages: VenuePackage[];
  addons: VenueAddon[];
  pgDetails?: PgDetails;
  hotelDetails?: HotelDetails;
  timeSlots: TimeSlot[];
  contactPhone: string;
  contactWhatsapp: string;
  isSaved?: boolean;
  locationHierarchy?: LocationHierarchy;
  featuredImageUrl?: string;
  ownerId?: string;
}

export type BookingStatus =
  | 'CONFIRMED'
  | 'HELD'
  | 'PENDING'
  | 'PENDING_OWNER_APPROVAL'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'REJECTED';

export interface Booking {
  id: string;
  bookingRef: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  venueId: string;
  venueName: string;
  venueCoverUrl: string;
  venueCity?: string;
  date: string;
  startTime: string;
  endTime: string;
  slotLabel: string;
  baseAmount: number;
  taxAmount: number;
  platformFee: number;
  discountAmount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
  paymentMethod: string;
  paymentId?: string;
  qrCodeToken: string;
  createdAt: number;
  guestCount: number;
  packageId?: string;
  packageName?: string;
  selectedAddons?: string[];
  customerNotes?: string;
  isHeld?: boolean;
  holdExpiresAtMillis?: number;
  isCheckedIn?: boolean;
  isAdvancePayment?: boolean;
  advanceAmountPaid?: number;
  remainingBalanceDue?: number;
  cancellationReason?: string;
  refundAmount?: number;
  customerRegistration?: CustomerRegistrationData;
}

export type RegistrationFieldCategoryScope =
  | 'ALL'
  | 'PG_HOSTEL'
  | 'HOTEL'
  | 'FUNCTION_HALL'
  | 'RESORT'
  | 'SPORTS_TURF';

export type RegistrationFieldType =
  | 'TEXT'
  | 'PHONE'
  | 'EMAIL'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'DROPDOWN'
  | 'IMAGE_UPLOAD'
  | 'LIVE_PHOTO'
  | 'BOOLEAN'
  | 'DATE'
  | 'AADHAAR'
  | 'FILE_UPLOAD';

export interface CustomerRegistrationField {
  id: string;
  key: string;
  label: string;
  type: RegistrationFieldType;
  isRequired: boolean;
  isEnabled: boolean;
  helpText?: string;
  options?: string[];
  placeholder?: string;
  categoryScope: RegistrationFieldCategoryScope;
  displayOrder: number;
  venueId?: string; // Target specific venue if set, otherwise applies to all in category
  venueName?: string;
  defaultValue?: string | number | boolean;
  fileAccept?: string;
  minNumber?: number;
  maxNumber?: number;
}

export interface CustomerRegistrationData {
  fullName?: string;
  phone?: string;
  emergencyPhone?: string;
  email?: string;
  address?: string;
  permanentAddress?: string;
  cityStatePincode?: string;
  idProofType?: string;
  idProofNumber?: string;
  idProofFrontUrl?: string;
  idProofBackUrl?: string;
  livePhotoUrl?: string;
  dob?: string;
  gender?: string;
  guardianName?: string;
  guardianPhone?: string;
  purposeOfStay?: string;
  occupationWorkplace?: string;
  vehicleNumber?: string;
  guestsCountSplit?: string;
  stayDurationMonths?: string;
  stayDuration?: string;
  policeVerificationConsent?: boolean;
  customFields?: Record<string, any>;
  submittedAt?: string;
}

export interface ReviewItem {
  id: string;
  venueId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'admin' | 'promo';
  timestamp: number;
  read: boolean;
  linkRoute?: string;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

export interface EventItem {
  id: string;
  title: string;
  organizer: string;
  category: string;
  date: string;
  time: string;
  venueName: string;
  city: string;
  price: number;
  imageUrl: string;
  seatsTotal: number;
  seatsBooked: number;
  description: string;
}

export interface InstituteItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  city: string;
  address: string;
  rating: number;
  ratingCount: number;
  logoUrl: string;
  coverImageUrl: string;
  coursesCount: number;
  phone: string;
  email: string;
  verified: boolean;
  popularCourse: string;
  feeRange: string;
}

export interface AppFeatureToggle {
  key: string;
  title: string;
  description: string;
  category: 'core' | 'ai' | 'payment' | 'booking';
  isEnabled: boolean;
}

export interface InstituteClass {
  id: string;
  instituteId: string;
  instituteName: string;
  title: string;
  category: string;
  subject: string;
  batchTiming: string;
  deliveryMode: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  totalSeats: number;
  availableSeats: number;
  monthlyFee: number;
  facultyName: string;
  facultyBio: string;
  facultyExperience: string;
  location: string;
  isTodayOngoing: boolean;
  isUpcomingBatch: boolean;
  enrollmentOpen: boolean;
  imageUrl: string;
  rating: number;
}

export interface ConfirmedClassBooking {
  id: string;
  studentName: string;
  studentPhone: string;
  className: string;
  instituteName: string;
  timing: string;
  amount: number;
  status: 'CONFIRMED' | 'TRIAL_BOOKED';
  date: string;
}

export interface McpToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  category: string;
}

export interface CustomSiteIntegration {
  id: string;
  siteName: string;
  domain: string;
  embedType: 'IFRAME' | 'POPUP_BUTTON' | 'DIRECT_LINK';
  apiKey: string;
  status: 'ACTIVE' | 'PENDING';
}

export interface PaymentTransactionRecord {
  id: string;
  bookingRef: string;
  venueName: string;
  guestName: string;
  amount: number;
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH';
  status: 'CAPTURED' | 'REFUNDED' | 'FAILED' | 'RECONCILED';
  timestamp: number;
  utrOrRrn: string;
}

export type ActiveScreen =
  | 'home'
  | 'search'
  | 'venue-detail'
  | 'map'
  | 'bookings'
  | 'saved'
  | 'events'
  | 'institutes'
  | 'institute-owner'
  | 'create-venue'
  | 'admin-venue-upload'
  | 'owner'
  | 'admin-audit'
  | 'admin-sections'
  | 'admin-settings'
  | 'admin-element-editor'
  | 'admin-plug-play'
  | 'listing-fields-config'
  | 'registration-builder'
  | 'tax-invoice-customizer'
  | 'mcp-integrations'
  | 'payment-health'
  | 'theme-customizer'
  | 'cloud-sync'
  | 'unified-registration'
  | 'referrals'
  | 'reports'
  | 'qr-scanner'
  | 'profile'
  | 'support';
