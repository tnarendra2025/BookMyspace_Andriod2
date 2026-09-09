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

export type ActiveScreen =
  | 'home'
  | 'search'
  | 'venue-detail'
  | 'map'
  | 'bookings'
  | 'saved'
  | 'events'
  | 'owner'
  | 'admin-audit'
  | 'admin-sections'
  | 'reports'
  | 'qr-scanner'
  | 'profile'
  | 'support';
