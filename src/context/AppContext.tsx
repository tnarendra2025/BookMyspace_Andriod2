import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuthUser,
  UserRole,
  Venue,
  VenueCategory,
  Booking,
  AppNotification,
  AuditLog,
  EventItem,
  InstituteItem,
  AppFeatureToggle,
  LocationHierarchy,
  ActiveScreen,
} from '../types';
import {
  SAMPLE_CATEGORIES,
  SAMPLE_VENUES,
  SAMPLE_BOOKINGS,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_AUDIT_LOGS,
  SAMPLE_EVENTS,
  SAMPLE_INSTITUTES,
  INITIAL_FEATURE_TOGGLES,
  POPULAR_LOCATIONS,
} from '../data/mockData';

interface AppContextType {
  // Navigation & Screen
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  selectedVenueId: string | null;
  setSelectedVenueId: (id: string | null) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (slug: string) => void;

  // Auth & Roles
  currentUser: AuthUser;
  switchRole: (role: UserRole) => void;

  // Locations
  selectedLocation: LocationHierarchy;
  setSelectedLocation: (loc: LocationHierarchy) => void;
  allLocations: LocationHierarchy[];

  // Venues
  venues: Venue[];
  addVenue: (venue: Partial<Venue>) => Venue;
  updateVenue: (id: string, updates: Partial<Venue>) => void;
  approveVenue: (id: string) => void;
  rejectVenue: (id: string, reason: string) => void;
  toggleFavoriteVenue: (id: string) => void;

  // Bookings
  bookings: Booking[];
  createBooking: (newBooking: Partial<Booking>) => Booking;
  cancelBooking: (bookingId: string, reason: string) => void;
  checkInBooking: (qrOrId: string) => { success: boolean; message: string; booking?: Booking };

  // Active Hold
  activeHold: { bookingId: string; venueName: string; expiresAt: number; totalAmount: number } | null;
  clearActiveHold: () => void;

  // Events & Institutes
  events: EventItem[];
  institutes: InstituteItem[];

  // Notifications & Audits
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  auditLogs: AuditLog[];

  // Feature Flags
  featureToggles: AppFeatureToggle[];
  toggleFeature: (key: string) => void;
  isFeatureEnabled: (key: string) => boolean;

  // Search State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // Active Modals
  bookingModalVenue: Venue | null;
  setBookingModalVenue: (v: Venue | null) => void;
  invoiceModalBooking: Booking | null;
  setInvoiceModalBooking: (b: Booking | null) => void;
  qrModalBooking: Booking | null;
  setQrModalBooking: (b: Booking | null) => void;
  isVoiceSearchOpen: boolean;
  setIsVoiceSearchOpen: (open: boolean) => void;
  isHelpChatOpen: boolean;
  setIsHelpChatOpen: (open: boolean) => void;
  isAIBookingOpen: boolean;
  setIsAIBookingOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Screen and Route state
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // User & RBAC state
  const [currentUser, setCurrentUser] = useState<AuthUser>({
    id: 'user_user',
    fullName: 'Narendra Reddy',
    email: 'tnarendra2025@gmail.com',
    phone: '+91 98765 43210',
    role: 'USER',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  });

  const switchRole = (role: UserRole) => {
    if (role === 'ADMIN') {
      setCurrentUser({
        id: 'user_admin',
        fullName: 'Platform Administrator',
        email: 'admin@bookmyspace.com',
        phone: '+91 99001 12233',
        role: 'ADMIN',
      });
      addAuditLog({
        actorName: 'System',
        actorRole: 'ADMIN',
        action: 'ROLE_SWITCHED_ADMIN',
        entityType: 'AUTH_SESSION',
        entityId: 'user_admin',
        details: 'Admin session activated with full moderation & audit permissions.',
        status: 'SUCCESS',
      });
    } else if (role === 'VENUE_OWNER') {
      setCurrentUser({
        id: 'user_venue_owner',
        fullName: 'Vikram Oberoi (Property Host)',
        email: 'owner@grandpalace.com',
        phone: '+91 98765 99887',
        role: 'VENUE_OWNER',
      });
      addAuditLog({
        actorName: 'System',
        actorRole: 'VENUE_OWNER',
        action: 'ROLE_SWITCHED_OWNER',
        entityType: 'AUTH_SESSION',
        entityId: 'user_venue_owner',
        details: 'Owner portal session activated for listing & offline inventory control.',
        status: 'SUCCESS',
      });
    } else {
      setCurrentUser({
        id: 'user_user',
        fullName: 'Narendra Reddy',
        email: 'tnarendra2025@gmail.com',
        phone: '+91 98765 43210',
        role: 'USER',
      });
    }
  };

  // Location
  const [selectedLocation, setSelectedLocation] = useState<LocationHierarchy>(POPULAR_LOCATIONS[0]);
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Entities
  const [venues, setVenues] = useState<Venue[]>(SAMPLE_VENUES);
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [events] = useState<EventItem[]>(SAMPLE_EVENTS);
  const [institutes] = useState<InstituteItem[]>(SAMPLE_INSTITUTES);
  const [notifications, setNotifications] = useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SAMPLE_AUDIT_LOGS);
  const [featureToggles, setFeatureToggles] = useState<AppFeatureToggle[]>(INITIAL_FEATURE_TOGGLES);

  // Active Concurrency Hold (10-minute hold expiration)
  const [activeHold, setActiveHold] = useState<{
    bookingId: string;
    venueName: string;
    expiresAt: number;
    totalAmount: number;
  } | null>(null);

  // Modals
  const [bookingModalVenue, setBookingModalVenue] = useState<Venue | null>(null);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState<Booking | null>(null);
  const [qrModalBooking, setQrModalBooking] = useState<Booking | null>(null);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState<boolean>(false);
  const [isHelpChatOpen, setIsHelpChatOpen] = useState<boolean>(false);
  const [isAIBookingOpen, setIsAIBookingOpen] = useState<boolean>(false);

  // Helper for adding audit logs
  const addAuditLog = (entry: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...entry,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Venues CRUD & Moderation
  const addVenue = (venueData: Partial<Venue>): Venue => {
    const newId = `v_${Date.now()}`;
    const newVenue: Venue = {
      id: newId,
      name: venueData.name || 'Untitled Venue',
      slug: (venueData.name || 'venue').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: venueData.description || 'Newly created venue listing.',
      addressLine1: venueData.addressLine1 || selectedLocation.area,
      city: venueData.city || selectedLocation.city,
      state: venueData.state || selectedLocation.state,
      latitude: venueData.latitude || 17.43,
      longitude: venueData.longitude || 78.4,
      capacity: venueData.capacity || 200,
      minGuests: venueData.minGuests || 50,
      maxGuests: venueData.maxGuests || 500,
      distanceKm: 2.5,
      pricingBaseAmount: venueData.pricingBaseAmount || 25000,
      taxRate: 18.0,
      parkingCapacity: venueData.parkingCapacity || 50,
      foodOptions: venueData.foodOptions || 'External Catering Permitted',
      rules: venueData.rules || 'Standard rules apply. Sound permits until 10 PM.',
      isVerified: false,
      isActive: true,
      status: 'PENDING', // Owner listings start as PENDING per Business Rules
      avgRating: 5.0,
      ratingCount: 1,
      category: venueData.category || SAMPLE_CATEGORIES[1],
      images: venueData.images || [
        {
          id: 'img_new_1',
          url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
          altText: 'Main Hall',
          isCover: true,
        },
      ],
      facilities: venueData.facilities || [
        { facility: 'Air Conditioning', isAvailable: true },
        { facility: 'Dedicated Parking', isAvailable: true },
      ],
      packages: venueData.packages || [],
      addons: venueData.addons || [],
      timeSlots: venueData.timeSlots || [
        { id: `ts_${newId}_1`, label: 'Morning Slot (09:00 AM - 02:00 PM)', startTime: '09:00', endTime: '14:00', priceAmount: venueData.pricingBaseAmount || 25000, isAvailable: true },
        { id: `ts_${newId}_2`, label: 'Evening Slot (05:00 PM - 11:00 PM)', startTime: '17:00', endTime: '23:00', priceAmount: (venueData.pricingBaseAmount || 25000) * 1.2, isAvailable: true },
      ],
      contactPhone: venueData.contactPhone || '+91 98765 00000',
      contactWhatsapp: venueData.contactWhatsapp || '919876500000',
      featuredImageUrl: venueData.featuredImageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      ownerId: currentUser.id,
      locationHierarchy: selectedLocation,
    };

    setVenues((prev) => [newVenue, ...prev]);

    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'VENUE_SUBMITTED_PENDING',
      entityType: 'VENUE_LISTING',
      entityId: newVenue.id,
      details: `Owner submitted "${newVenue.name}" for platform admin approval.`,
      status: 'SUCCESS',
    });

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Listing Submitted! 📝',
        message: `"${newVenue.name}" has been sent for admin verification. You will be notified once published.`,
        type: 'admin',
        timestamp: Date.now(),
        read: false,
      },
      ...prev,
    ]);

    return newVenue;
  };

  const updateVenue = (id: string, updates: Partial<Venue>) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const approveVenue = (id: string) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'APPROVED', isVerified: true } : v))
    );
    const target = venues.find((v) => v.id === id);
    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: 'ADMIN',
      action: 'VENUE_APPROVED_PUBLISHED',
      entityType: 'VENUE_LISTING',
      entityId: id,
      details: `Admin approved "${target?.name || id}" and published it to public search.`,
      status: 'SUCCESS',
    });
  };

  const rejectVenue = (id: string, reason: string) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'REJECTED', rejectionReason: reason } : v))
    );
    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: 'ADMIN',
      action: 'VENUE_REJECTED',
      entityType: 'VENUE_LISTING',
      entityId: id,
      details: `Admin rejected venue listing: "${reason}".`,
      status: 'WARNING',
    });
  };

  const toggleFavoriteVenue = (id: string) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isSaved: !v.isSaved } : v))
    );
  };

  // Bookings Creation with Authoritative Price, Hold Expiration & Receipt
  const createBooking = (newBookingData: Partial<Booking>): Booking => {
    const bookingId = `bk_${Date.now()}`;
    const bookingRef = `BMS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const qrToken = `BMS-PASS-${bookingRef.split('-')[2]}`;

    const createdBooking: Booking = {
      id: bookingId,
      bookingRef,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      userPhone: currentUser.phone || '+91 98765 43210',
      venueId: newBookingData.venueId || '',
      venueName: newBookingData.venueName || '',
      venueCoverUrl: newBookingData.venueCoverUrl || '',
      venueCity: newBookingData.venueCity || selectedLocation.city,
      date: newBookingData.date || new Date().toISOString().split('T')[0],
      startTime: newBookingData.startTime || '07:00 AM',
      endTime: newBookingData.endTime || '08:00 AM',
      slotLabel: newBookingData.slotLabel || 'Standard Slot',
      baseAmount: newBookingData.baseAmount || 0,
      taxAmount: newBookingData.taxAmount || 0,
      platformFee: newBookingData.platformFee || 49,
      discountAmount: newBookingData.discountAmount || 0,
      totalAmount: newBookingData.totalAmount || 0,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: newBookingData.paymentMethod || 'Razorpay UPI (Fast)',
      paymentId: `pay_bms_${Date.now()}`,
      qrCodeToken: qrToken,
      createdAt: Date.now(),
      guestCount: newBookingData.guestCount || 1,
      packageName: newBookingData.packageName,
      isAdvancePayment: newBookingData.isAdvancePayment || false,
      advanceAmountPaid: newBookingData.advanceAmountPaid || 0,
      remainingBalanceDue: newBookingData.remainingBalanceDue || 0,
      customerNotes: newBookingData.customerNotes || '',
      isCheckedIn: false,
    };

    setBookings((prev) => [createdBooking, ...prev]);

    // Record audit trail
    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'BOOKING_CONFIRMED',
      entityType: 'BOOKING',
      entityId: bookingId,
      details: `Booking ${bookingRef} confirmed for ₹${createdBooking.totalAmount} at ${createdBooking.venueName}.`,
      status: 'SUCCESS',
    });

    // Send in-app notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Booking Confirmed! 🎉',
        message: `Your booking for ${createdBooking.venueName} on ${createdBooking.date} is confirmed! View your QR pass in My Bookings.`,
        type: 'booking',
        timestamp: Date.now(),
        read: false,
        linkRoute: 'bookings',
      },
      ...prev,
    ]);

    // Clear active hold
    setActiveHold(null);

    return createdBooking;
  };

  // Cancellation State Machine per Business Rules (Rules 17 & 18)
  const cancelBooking = (bookingId: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          // Calculate refund per policy (e.g. 90% refund minus payment processing fee)
          const calculatedRefund = Math.round(b.totalAmount * 0.9);
          return {
            ...b,
            status: 'CANCELLED',
            paymentStatus: 'REFUNDED',
            cancellationReason: reason,
            refundAmount: calculatedRefund,
          };
        }
        return b;
      })
    );

    const targetBooking = bookings.find((b) => b.id === bookingId);
    const refundVal = targetBooking ? Math.round(targetBooking.totalAmount * 0.9) : 0;

    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'BOOKING_CANCELLED_REFUND_ISSUED',
      entityType: 'BOOKING',
      entityId: bookingId,
      details: `Booking cancelled (${reason}). Processed ₹${refundVal} refund to original payment source.`,
      status: 'WARNING',
    });

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Booking Cancelled & Refund Initiated',
        message: `Refund of ₹${refundVal} for ${targetBooking?.venueName || 'booking'} has been credited to your payment method.`,
        type: 'payment',
        timestamp: Date.now(),
        read: false,
      },
      ...prev,
    ]);
  };

  // QR Check-in verification
  const checkInBooking = (qrOrId: string) => {
    const clean = qrOrId.trim().toUpperCase();
    const found = bookings.find(
      (b) =>
        b.id.toUpperCase() === clean ||
        b.bookingRef.toUpperCase() === clean ||
        b.qrCodeToken.toUpperCase() === clean
    );

    if (!found) {
      return { success: false, message: 'Invalid ticket or booking token not found in database.' };
    }

    if (found.status === 'CANCELLED') {
      return { success: false, message: 'This booking was cancelled and is invalid for entry.', booking: found };
    }

    if (found.isCheckedIn) {
      return { success: false, message: 'Attendee has ALREADY been checked in previously!', booking: found };
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === found.id ? { ...b, isCheckedIn: true, status: 'COMPLETED' } : b))
    );

    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'QR_TICKET_CHECKIN',
      entityType: 'BOOKING',
      entityId: found.id,
      details: `Validated QR Pass "${found.qrCodeToken}" for attendee ${found.userName} at ${found.venueName}.`,
      status: 'SUCCESS',
    });

    return {
      success: true,
      message: `Verified successfully! Welcome ${found.userName} (${found.guestCount} guests).`,
      booking: { ...found, isCheckedIn: true },
    };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const toggleFeature = (key: string) => {
    setFeatureToggles((prev) =>
      prev.map((f) => (f.key === key ? { ...f, isEnabled: !f.isEnabled } : f))
    );
  };

  const isFeatureEnabled = (key: string): boolean => {
    const feature = featureToggles.find((f) => f.key === key);
    return feature ? feature.isEnabled : true;
  };

  const clearActiveHold = () => {
    setActiveHold(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        selectedVenueId,
        setSelectedVenueId,
        selectedCategoryId,
        setSelectedCategoryId,
        currentUser,
        switchRole,
        selectedLocation,
        setSelectedLocation,
        allLocations: POPULAR_LOCATIONS,
        venues,
        addVenue,
        updateVenue,
        approveVenue,
        rejectVenue,
        toggleFavoriteVenue,
        bookings,
        createBooking,
        cancelBooking,
        checkInBooking,
        activeHold,
        clearActiveHold,
        events,
        institutes,
        notifications,
        markNotificationRead,
        auditLogs,
        featureToggles,
        toggleFeature,
        isFeatureEnabled,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        selectedCity,
        setSelectedCity,
        bookingModalVenue,
        setBookingModalVenue,
        invoiceModalBooking,
        setInvoiceModalBooking,
        qrModalBooking,
        setQrModalBooking,
        isVoiceSearchOpen,
        setIsVoiceSearchOpen,
        isHelpChatOpen,
        setIsHelpChatOpen,
        isAIBookingOpen,
        setIsAIBookingOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
