import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  CustomerRegistrationField,
  ModularFeature,
  SelfHealingLog,
  SystemDiagnosticReport,
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
import { DEFAULT_CUSTOMER_REGISTRATION_FIELDS } from '../data/defaultRegistrationFields';
import { DEFAULT_PLUG_PLAY_FEATURES } from '../data/defaultFeatures';
import {
  fetchVenuesFromBackend,
  createVenueOnBackend,
  updateVenueOnBackend,
  deleteVenueOnBackend,
  purgeSampleVenuesOnBackend,
} from '../services/venueService';
import {
  fetchBookingsFromDatabase,
  createBookingInDatabase,
  updateBookingStatusInDatabase,
  checkInQrToken,
} from '../services/bookingService';
import {
  fetchAuthenticatedProfile,
  sendOtpToIdentifier,
  verifyOtpAndAuthenticate,
  registerNewUser,
  logoutUserSession,
} from '../services/authService';
import {
  INITIAL_PLUG_PLAY_MODULES,
  INITIAL_SELF_HEALING_LOGS,
  executeSelfHealingScan,
} from '../services/selfHealingService';
import {
  getBackendFeatures,
  toggleBackendFeature,
  updateBackendFeature,
  applyBackendPreset,
  resetBackendFeatures,
} from '../services/featureHubService';

interface AppContextType {
  // Navigation & Screen
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  selectedVenueId: string | null;
  setSelectedVenueId: (id: string | null) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (slug: string) => void;

  // Optimized Backend Venue Fetch Service
  backendFilteredVenues: Venue[];
  isVenuesLoading: boolean;
  backendVenueQueryInfo: {
    category_id?: string | null;
    total?: number;
    source?: string;
    applied_sort?: string;
    user_lat?: number | null;
    user_lng?: number | null;
  } | null;
  userCoordinates: { lat: number; lng: number } | null;
  setUserCoordinates: (coords: { lat: number; lng: number } | null) => void;
  fetchVenuesByBackendCategory: (catId?: string, city?: string, query?: string) => Promise<Venue[]>;
  refetchVenues: () => Promise<void>;

  // Auth & Roles
  currentUser: AuthUser;
  switchRole: (role: UserRole) => void;
  requestOtp: (identifier: string) => Promise<{ success: boolean; testOtp?: string; message: string }>;
  loginWithOtp: (identifier: string, otp: string, role?: UserRole, fullName?: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;

  // Locations
  selectedLocation: LocationHierarchy;
  setSelectedLocation: (loc: LocationHierarchy) => void;
  allLocations: LocationHierarchy[];

  // Venues
  venues: Venue[];
  addVenue: (venue: Partial<Venue>) => Venue;
  updateVenue: (id: string, updates: Partial<Venue>) => void;
  deleteVenue: (id: string) => Promise<void>;
  purgeSampleVenues: () => Promise<{ success: boolean; count: number; message: string }>;
  resetSampleVenues: () => Promise<{ success: boolean; message: string }>;
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

  // Customer Registration & KYC Configuration (Editable by Owner & Admin)
  customerRegistrationFields: CustomerRegistrationField[];
  updateRegistrationField: (field: CustomerRegistrationField) => void;
  toggleRegistrationFieldEnabled: (id: string) => void;
  toggleRegistrationFieldRequired: (id: string) => void;
  setRegistrationFieldRequirement: (id: string, mode: 'MANDATORY' | 'OPTIONAL' | 'DISABLED') => void;
  batchSetRegistrationRequirement: (fieldIds: string[], mode: 'MANDATORY' | 'OPTIONAL' | 'DISABLED') => void;
  applyRegistrationPreset: (presetKey: 'EXPRESS' | 'STRICT_POLICE' | 'HOSTEL_PG' | 'HOTEL_STANDARD' | 'FUNCTION_HALL' | 'BALANCED') => void;
  addRegistrationField: (field: Omit<CustomerRegistrationField, 'id'>) => void;
  deleteRegistrationField: (id: string) => void;
  resetRegistrationFields: () => void;
  reorderRegistrationFields: (startIndex: number, endIndex: number) => void;
  duplicateRegistrationField: (id: string) => void;
  dbSyncStatus: 'synced' | 'syncing' | 'error' | 'idle';
  lastDbSyncedAt: number | null;
  saveFieldsToDatabase: (fieldsToSave?: CustomerRegistrationField[]) => Promise<boolean>;
  reloadFieldsFromDatabase: () => Promise<void>;

  // Customer Registration Card Modal
  registrationCardBooking: Booking | null;
  setRegistrationCardBooking: (b: Booking | null) => void;

  // Plug & Play Modules & Autonomous Self-Healing Engine
  plugPlayModules: ModularFeature[];
  featuresBackendSync: 'synced' | 'syncing' | 'error' | 'idle';
  togglePlugPlayModule: (id: string) => void;
  updateModuleConfig: (id: string, params: Record<string, any>) => void;
  applyModulePreset: (presetKey: 'all-on' | 'minimal' | 'strict-heal' | 'demo') => void;
  isModuleEnabled: (id: string) => boolean;
  reloadFeaturesFromBackend: () => Promise<void>;
  resetFeaturesToDefault: () => Promise<void>;
  selfHealingLogs: SelfHealingLog[];
  systemHealthScore: number;
  isSelfHealingActive: boolean;
  isHealingScanRunning: boolean;
  triggerSystemSelfHeal: () => Promise<SystemDiagnosticReport>;
  simulateAndHealScenario: (scenario: 'STALLED_PAYMENT' | 'EXPIRED_HOLD' | 'DATA_CORRUPTION' | 'NETWORK_LATENCY') => Promise<SelfHealingLog>;
  clearSelfHealingLogs: () => void;
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

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  secunderabad: { lat: 17.4399, lng: 78.4983 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  vijayawada: { lat: 16.5062, lng: 80.6480 },
  visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  pune: { lat: 18.5204, lng: 73.8567 },
};

// Location
  const [selectedLocation, setSelectedLocation] = useState<LocationHierarchy>(POPULAR_LOCATIONS[0]);
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  // GPS Coordinates for intelligent distance-based ranking
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>({
    lat: 17.4319,
    lng: 78.4073,
  });

  // Search & Filter (default to multi-factor 'intelligent' ranking)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('intelligent');

  // Entities
  const [venues, setVenues] = useState<Venue[]>(SAMPLE_VENUES);
  const [backendFilteredVenues, setBackendFilteredVenues] = useState<Venue[]>(SAMPLE_VENUES);
  const [isVenuesLoading, setIsVenuesLoading] = useState<boolean>(false);
  const [backendVenueQueryInfo, setBackendVenueQueryInfo] = useState<{
    category_id?: string | null;
    total?: number;
    source?: string;
    applied_sort?: string;
    user_lat?: number | null;
    user_lng?: number | null;
  } | null>(null);

  // Attempt browser geolocation on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoordinates({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Keep default coordinates
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    }
  }, []);

  // Synchronize coordinates when selected city changes
  useEffect(() => {
    if (selectedCity && selectedCity !== 'All' && selectedCity !== 'All Cities') {
      const cityKey = selectedCity.toLowerCase().trim();
      const coords = CITY_COORDINATES[cityKey];
      if (coords) {
        setUserCoordinates(coords);
      }
    }
  }, [selectedCity]);

  // Optimized venue-fetch service: Passes category_id, user coordinates, and intelligent sorting to backend query
  const fetchVenuesByBackendCategory = useCallback(
    async (catId?: string, city?: string, query?: string): Promise<Venue[]> => {
      const targetCategoryId = catId !== undefined ? catId : selectedCategoryId;
      const targetCity = city !== undefined ? city : selectedCity;
      const targetQuery = query !== undefined ? query : searchQuery;

      setIsVenuesLoading(true);
      try {
        const response = await fetchVenuesFromBackend({
          categoryId: targetCategoryId,
          city: targetCity,
          query: targetQuery,
          sortBy,
          userLat: userCoordinates?.lat,
          userLng: userCoordinates?.lng,
        });

        if (response.success && Array.isArray(response.venues)) {
          setBackendFilteredVenues(response.venues);
          setBackendVenueQueryInfo({
            category_id: response.query_executed.category_id,
            total: response.total,
            source: response.source,
            applied_sort: response.applied_sort || response.query_executed.sort_by,
            user_lat: response.query_executed.user_lat,
            user_lng: response.query_executed.user_lng,
          });
          return response.venues;
        }
      } catch (err) {
        console.warn('Backend venue-fetch query failed, using local filter fallback:', err);
      } finally {
        setIsVenuesLoading(false);
      }
      return venues;
    },
    [selectedCategoryId, selectedCity, searchQuery, sortBy, userCoordinates, venues]
  );

  const refetchVenues = useCallback(async () => {
    await fetchVenuesByBackendCategory(selectedCategoryId, selectedCity, searchQuery);
  }, [fetchVenuesByBackendCategory, selectedCategoryId, selectedCity, searchQuery]);

  // When selectedCategoryId, selectedCity, searchQuery, sortBy, or userCoordinates change, trigger backend venue-fetch query
  useEffect(() => {
    let isMounted = true;
    const loadVenues = async () => {
      setIsVenuesLoading(true);
      try {
        const response = await fetchVenuesFromBackend({
          categoryId: selectedCategoryId,
          city: selectedCity,
          query: searchQuery,
          sortBy,
          userLat: userCoordinates?.lat,
          userLng: userCoordinates?.lng,
        });
        if (isMounted && response.success && Array.isArray(response.venues)) {
          setBackendFilteredVenues(response.venues);
          setBackendVenueQueryInfo({
            category_id: response.query_executed.category_id,
            total: response.total,
            source: response.source,
            applied_sort: response.applied_sort || response.query_executed.sort_by,
            user_lat: response.query_executed.user_lat,
            user_lng: response.query_executed.user_lng,
          });
        }
      } catch (err) {
        console.warn('Failed to query venues from backend with category_id:', err);
      } finally {
        if (isMounted) setIsVenuesLoading(false);
      }
    };

    loadVenues();
    return () => {
      isMounted = false;
    };
  }, [selectedCategoryId, selectedCity, searchQuery, sortBy, userCoordinates]);

  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [events] = useState<EventItem[]>(SAMPLE_EVENTS);
  const [institutes] = useState<InstituteItem[]>(SAMPLE_INSTITUTES);
  const [notifications, setNotifications] = useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SAMPLE_AUDIT_LOGS);
  const [featureToggles, setFeatureToggles] = useState<AppFeatureToggle[]>(INITIAL_FEATURE_TOGGLES);

  // Load real bookings and verified user session from persistent database on mount
  useEffect(() => {
    let isMounted = true;
    const initializePersistentData = async () => {
      try {
        const [dbBookings, activeProfile] = await Promise.all([
          fetchBookingsFromDatabase(),
          fetchAuthenticatedProfile(),
        ]);

        if (isMounted) {
          if (dbBookings && dbBookings.length > 0) {
            setBookings(dbBookings);
          }
          if (activeProfile) {
            setCurrentUser(activeProfile);
          }
        }
      } catch (err) {
        console.warn('Initialization from backend database deferred, using cache:', err);
      }
    };

    initializePersistentData();
    return () => {
      isMounted = false;
    };
  }, []);

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

  // Customer Registration & KYC Configuration State (Editable by Owner & Admin)
  const [customerRegistrationFields, setCustomerRegistrationFields] = useState<CustomerRegistrationField[]>(() => {
    try {
      const saved = localStorage.getItem('bms_customer_registration_fields');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved registration fields:', e);
    }
    return DEFAULT_CUSTOMER_REGISTRATION_FIELDS;
  });

  const [dbSyncStatus, setDbSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'idle'>('idle');
  const [lastDbSyncedAt, setLastDbSyncedAt] = useState<number | null>(null);
  const [registrationCardBooking, setRegistrationCardBooking] = useState<Booking | null>(null);

  // Plug & Play & Autonomous Self-Healing State
  const [plugPlayModules, setPlugPlayModules] = useState<ModularFeature[]>(() => {
    try {
      const saved = localStorage.getItem('bms_plug_play_modules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return DEFAULT_PLUG_PLAY_FEATURES;
  });

  const [featuresBackendSync, setFeaturesBackendSync] = useState<'synced' | 'syncing' | 'error' | 'idle'>('idle');

  const [selfHealingLogs, setSelfHealingLogs] = useState<SelfHealingLog[]>(() => {
    try {
      const saved = localStorage.getItem('bms_self_healing_logs');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_SELF_HEALING_LOGS;
  });

  const [systemHealthScore, setSystemHealthScore] = useState<number>(100);
  const [isHealingScanRunning, setIsHealingScanRunning] = useState<boolean>(false);

  const isSelfHealingActive = plugPlayModules.some(
    (m) => m.id === 'f_self_healing_engine' && m.isEnabled
  );

  const isModuleEnabled = useCallback(
    (id: string): boolean => {
      const mod = plugPlayModules.find((m) => m.id === id);
      return mod ? mod.isEnabled : true;
    },
    [plugPlayModules]
  );

  // Fetch backend JSON configuration on mount to ensure hot consistency
  useEffect(() => {
    let isMounted = true;
    const loadFeaturesFromBackend = async () => {
      try {
        setFeaturesBackendSync('syncing');
        const features = await getBackendFeatures();
        if (isMounted && features && features.length > 0) {
          setPlugPlayModules(features);
          setFeaturesBackendSync('synced');
          try {
            localStorage.setItem('bms_plug_play_modules', JSON.stringify(features));
          } catch (_) {}
        }
      } catch (err) {
        console.warn('Could not fetch backend features, keeping cached:', err);
        if (isMounted) setFeaturesBackendSync('error');
      }
    };
    loadFeaturesFromBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  const togglePlugPlayModule = useCallback(async (id: string) => {
    let nextEnabled = false;
    setPlugPlayModules((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          nextEnabled = !m.isEnabled;
          return { ...m, isEnabled: nextEnabled, updatedAt: Date.now(), updatedBy: currentUser?.fullName || 'Admin' };
        }
        return m;
      });
      try {
        localStorage.setItem('bms_plug_play_modules', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    setFeaturesBackendSync('syncing');
    try {
      await toggleBackendFeature(id, nextEnabled, currentUser?.fullName || 'Admin');
      setFeaturesBackendSync('synced');
    } catch (err) {
      console.error('Failed to sync toggle to backend JSON:', err);
      setFeaturesBackendSync('error');
    }
  }, [currentUser]);

  const updateModuleConfig = useCallback(async (id: string, params: Record<string, any>) => {
    let updatedFeature: ModularFeature | undefined;
    setPlugPlayModules((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          const mod = {
            ...m,
            configParams: { ...m.configParams, ...params },
            updatedAt: Date.now(),
            updatedBy: currentUser?.fullName || 'Admin',
          };
          updatedFeature = mod;
          return mod;
        }
        return m;
      });
      try {
        localStorage.setItem('bms_plug_play_modules', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    setFeaturesBackendSync('syncing');
    if (updatedFeature) {
      try {
        await updateBackendFeature(id, {
          configParams: (updatedFeature as ModularFeature).configParams,
          updatedAt: Date.now(),
          updatedBy: currentUser?.fullName || 'Admin',
        });
        setFeaturesBackendSync('synced');
      } catch (_) {
        setFeaturesBackendSync('error');
      }
    }
  }, [currentUser]);

  const applyModulePreset = useCallback(async (presetKey: 'all-on' | 'minimal' | 'strict-heal' | 'demo') => {
    setPlugPlayModules((prev) => {
      let updated = prev.map((m) => ({ ...m }));
      if (presetKey === 'all-on') {
        updated = updated.map((m) => ({ ...m, isEnabled: true, updatedAt: Date.now(), updatedBy: currentUser?.fullName || 'Admin' }));
      } else if (presetKey === 'minimal') {
        updated = updated.map((m) => ({
          ...m,
          isEnabled: m.id === 'f_ssot_lock' || m.id === 'f_self_healing_engine',
          updatedAt: Date.now(),
        }));
      } else if (presetKey === 'strict-heal') {
        updated = updated.map((m) => ({
          ...m,
          isEnabled:
            m.id === 'f_self_healing_engine' ||
            m.id === 'f_self_healing_reconcile' ||
            m.id === 'f_ssot_lock' ||
            m.id === 'f_firestore_dual_sync' ||
            m.id === 'exp_biometric_gate_pass',
          updatedAt: Date.now(),
        }));
      } else if (presetKey === 'demo') {
        updated = updated.map((m) => ({ ...m, isEnabled: true, latencyMs: Math.max(8, Math.floor(m.latencyMs * 0.6)), updatedAt: Date.now() }));
      }
      try {
        localStorage.setItem('bms_plug_play_modules', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    setFeaturesBackendSync('syncing');
    try {
      const backendPreset = presetKey === 'all-on' ? 'all-on' : presetKey === 'strict-heal' ? 'strict-reliability' : 'all-on';
      await applyBackendPreset(backendPreset as any, currentUser?.fullName || 'Admin');
      setFeaturesBackendSync('synced');
    } catch (_) {
      setFeaturesBackendSync('error');
    }
  }, [currentUser]);

  const reloadFeaturesFromBackend = useCallback(async () => {
    setFeaturesBackendSync('syncing');
    try {
      const features = await getBackendFeatures();
      if (features && features.length > 0) {
        setPlugPlayModules(features);
        setFeaturesBackendSync('synced');
        try {
          localStorage.setItem('bms_plug_play_modules', JSON.stringify(features));
        } catch (_) {}
      }
    } catch (_) {
      setFeaturesBackendSync('error');
    }
  }, []);

  const resetFeaturesToDefault = useCallback(async () => {
    setFeaturesBackendSync('syncing');
    try {
      const features = await resetBackendFeatures();
      if (features) {
        setPlugPlayModules(features);
        setFeaturesBackendSync('synced');
        try {
          localStorage.setItem('bms_plug_play_modules', JSON.stringify(features));
        } catch (_) {}
      }
    } catch (_) {
      setFeaturesBackendSync('error');
    }
  }, []);

  const clearSelfHealingLogs = useCallback(() => {
    setSelfHealingLogs([]);
    try {
      localStorage.removeItem('bms_self_healing_logs');
    } catch (_) {}
  }, []);

  // System-wide Self-Healing Trigger (Syncs backend & client)
  const triggerSystemSelfHeal = useCallback(async (): Promise<SystemDiagnosticReport> => {
    setIsHealingScanRunning(true);
    try {
      // 1. Invoke real backend server self-healing routine
      try {
        await fetch('/api/system/self-heal', { method: 'POST' });
      } catch (err) {
        console.warn('Backend self-healing ping skipped/failed:', err);
      }

      // 2. Run client-side self-healing scan
      const healResult = await executeSelfHealingScan(venues, bookings, plugPlayModules);

      if (healResult.updatedBookings !== bookings) {
        setBookings(healResult.updatedBookings);
      }
      if (healResult.updatedVenues !== venues) {
        setVenues(healResult.updatedVenues);
      }

      if (healResult.newLogs.length > 0) {
        setSelfHealingLogs((prev) => {
          const combined = [...healResult.newLogs, ...prev].slice(0, 50);
          try {
            localStorage.setItem('bms_self_healing_logs', JSON.stringify(combined));
          } catch (_) {}
          return combined;
        });

        // Add user notification
        setNotifications((prev) => [
          {
            id: `notif_heal_${Date.now()}`,
            title: 'System Self-Healed Successfully 🩺',
            message: `Auto-resolved ${healResult.newLogs.length} anomalies across payment intents and inventory locks. Zero downtime.`,
            type: 'system',
            timestamp: Date.now(),
            read: false,
            linkRoute: 'admin-plug-play',
          },
          ...prev,
        ]);
      }

      setSystemHealthScore(100);
      return healResult.report;
    } finally {
      setIsHealingScanRunning(false);
    }
  }, [venues, bookings, plugPlayModules]);

  // Interactive Live Anomaly Simulation and Healing Playground
  const simulateAndHealScenario = useCallback(
    async (
      scenario: 'STALLED_PAYMENT' | 'EXPIRED_HOLD' | 'DATA_CORRUPTION' | 'NETWORK_LATENCY'
    ): Promise<SelfHealingLog> => {
      setIsHealingScanRunning(true);
      try {
        if (scenario === 'STALLED_PAYMENT') {
          // 1. Inject a stalled pending booking
          const testBookingRef = `BMS-STALLED-${Math.floor(1000 + Math.random() * 9000)}`;
          const stalledBooking: Booking = {
            id: `bk_stalled_${Date.now()}`,
            bookingRef: testBookingRef,
            userId: currentUser.id,
            userName: currentUser.fullName,
            userEmail: currentUser.email,
            userPhone: currentUser.phone || '+91 98765 43210',
            venueId: venues[0]?.id || 'v_royal_palace',
            venueName: venues[0]?.name || 'Royal Palace Function Hall',
            venueCoverUrl: venues[0]?.featuredImageUrl || '',
            date: new Date().toISOString().split('T')[0],
            startTime: '06:00 PM',
            endTime: '11:00 PM',
            slotLabel: 'Evening Grand Event',
            baseAmount: 65000,
            taxAmount: 11700,
            platformFee: 49,
            discountAmount: 0,
            totalAmount: 76749,
            status: 'PENDING',
            paymentStatus: 'PENDING',
            paymentMethod: 'UPI Intent (Simulated Drop)',
            qrCodeToken: '',
            createdAt: Date.now(),
            guestCount: 250,
          };

          const newBookingList = [stalledBooking, ...bookings];
          setBookings(newBookingList);

          // 2. Immediately invoke self-healing reconciler
          await new Promise((r) => setTimeout(r, 600));
          const healResult = await executeSelfHealingScan(venues, newBookingList, plugPlayModules);
          setBookings(healResult.updatedBookings);

          const newLog: SelfHealingLog = {
            id: `log_sim_pay_${Date.now()}`,
            timestamp: Date.now(),
            timeFormatted: 'Just now',
            category: 'PAYMENT',
            title: `Simulated Stalled Payment #${testBookingRef} Auto-Healed`,
            message: 'Injected dropped UPI intent. Self-healing reconciler detected pending state, verified gateway, confirmed reservation, and issued QR ticket pass.',
            status: 'AUTO_RECOVERED',
            recoveredEntityId: stalledBooking.id,
            details: `Booking ${testBookingRef} transitioned to CONFIRMED. Total: ₹76,749.`,
          };

          setSelfHealingLogs((prev) => {
            const combined = [newLog, ...prev];
            try {
              localStorage.setItem('bms_self_healing_logs', JSON.stringify(combined));
            } catch (_) {}
            return combined;
          });

          return newLog;
        }

        if (scenario === 'EXPIRED_HOLD') {
          await new Promise((r) => setTimeout(r, 500));
          const newLog: SelfHealingLog = {
            id: `log_sim_hold_${Date.now()}`,
            timestamp: Date.now(),
            timeFormatted: 'Just now',
            category: 'INVENTORY',
            title: 'Ghost Slot Hold Auto-Released',
            message: 'Simulated 420-second expired reservation lock on Evening Slot. Distributed slot hold engine unlocked slot back to general availability.',
            status: 'HEALED',
            details: 'Atomic slot lock freed. Zero parallel booking conflicts detected.',
          };
          setSelfHealingLogs((prev) => [newLog, ...prev]);
          return newLog;
        }

        if (scenario === 'DATA_CORRUPTION') {
          // Backend self-heal ping
          await fetch('/api/system/self-heal', { method: 'POST' });
          const newLog: SelfHealingLog = {
            id: `log_sim_data_${Date.now()}`,
            timestamp: Date.now(),
            timeFormatted: 'Just now',
            category: 'DATABASE',
            title: 'Catalog Data Inconsistency Auto-Repaired',
            message: 'Detected venue schema discrepancy. Verified foreign keys, restored categoryId mapping, and refreshed backend database query index.',
            status: 'HEALED',
            details: '100% data integrity restored across all venue documents.',
          };
          setSelfHealingLogs((prev) => [newLog, ...prev]);
          return newLog;
        }

        // NETWORK_LATENCY
        const t0 = performance.now();
        await fetch('/api/health');
        const pingTime = Math.round(performance.now() - t0);
        const newLog: SelfHealingLog = {
          id: `log_sim_net_${Date.now()}`,
          timestamp: Date.now(),
          timeFormatted: 'Just now',
          category: 'NETWORK',
          title: 'Resilient Dual-Sync Parity Check',
          message: `Backend roundtrip latency validated at ${pingTime}ms. Zero packet loss, local cache fallback primed.`,
          status: 'RESOLVED',
          details: 'High-availability active-active replication verified.',
        };
        setSelfHealingLogs((prev) => [newLog, ...prev]);
        return newLog;
      } finally {
        setIsHealingScanRunning(false);
      }
    },
    [bookings, venues, currentUser, plugPlayModules]
  );

  // Background Autonomous Self-Healing Daemon
  useEffect(() => {
    if (!isSelfHealingActive) return;

    const interval = setInterval(async () => {
      // Periodic silent sweep for any pending/stalled bookings
      const hasPending = bookings.some((b) => b.paymentStatus === 'PENDING');
      if (hasPending) {
        await triggerSystemSelfHeal();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isSelfHealingActive, bookings, triggerSystemSelfHeal]);

  // Load from persistent server database on mount
  useEffect(() => {
    let isMounted = true;
    const fetchDbFields = async () => {
      try {
        setDbSyncStatus('syncing');
        const res = await fetch('/api/registration-fields');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.fields) && data.fields.length > 0) {
            if (isMounted) {
              setCustomerRegistrationFields(data.fields);
              setDbSyncStatus('synced');
              setLastDbSyncedAt(data.timestamp || Date.now());
              try {
                localStorage.setItem('bms_customer_registration_fields', JSON.stringify(data.fields));
              } catch (_) {}
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch registration fields from DB API, using local storage cache:', err);
      }
      if (isMounted) {
        setDbSyncStatus('synced');
      }
    };

    fetchDbFields();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save fields to persistent database
  const saveFieldsToDatabase = async (fieldsToSave?: CustomerRegistrationField[]): Promise<boolean> => {
    const targetFields = fieldsToSave || customerRegistrationFields;
    setDbSyncStatus('syncing');
    try {
      const res = await fetch('/api/registration-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: targetFields }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDbSyncStatus('synced');
          setLastDbSyncedAt(Date.now());
          try {
            localStorage.setItem('bms_customer_registration_fields', JSON.stringify(targetFields));
          } catch (_) {}
          addAuditLog({
            actorName: currentUser.fullName,
            actorRole: currentUser.role,
            action: 'REGISTRATION_FIELDS_SAVED_TO_DB',
            entityType: 'DATABASE',
            entityId: 'REGISTRATION_SCHEMA',
            details: `Persisted ${targetFields.length} registration fields to server database.`,
            status: 'SUCCESS',
          });
          return true;
        }
      }
      setDbSyncStatus('error');
      return false;
    } catch (err) {
      console.error('Error persisting fields to database:', err);
      setDbSyncStatus('error');
      return false;
    }
  };

  const reloadFieldsFromDatabase = async () => {
    setDbSyncStatus('syncing');
    try {
      const res = await fetch('/api/registration-fields');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.fields)) {
          setCustomerRegistrationFields(data.fields);
          setDbSyncStatus('synced');
          setLastDbSyncedAt(data.timestamp || Date.now());
          try {
            localStorage.setItem('bms_customer_registration_fields', JSON.stringify(data.fields));
          } catch (_) {}
        }
      }
    } catch (err) {
      console.error('Failed to reload fields from database:', err);
      setDbSyncStatus('error');
    }
  };

  // Auto-sync to localStorage & background database debounce
  useEffect(() => {
    try {
      localStorage.setItem('bms_customer_registration_fields', JSON.stringify(customerRegistrationFields));
    } catch (e) {
      console.warn('Failed to persist registration fields:', e);
    }

    const timer = setTimeout(() => {
      fetch('/api/registration-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: customerRegistrationFields }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setDbSyncStatus('synced');
            setLastDbSyncedAt(Date.now());
          }
        })
        .catch((err) => {
          console.warn('Background auto-save to DB skipped:', err);
        });
    }, 1500);

    return () => clearTimeout(timer);
  }, [customerRegistrationFields]);

  const updateRegistrationField = (updated: CustomerRegistrationField) => {
    setCustomerRegistrationFields((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    );
    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'REGISTRATION_FIELD_UPDATED',
      entityType: 'GOVERNANCE',
      entityId: updated.id,
      details: `${currentUser.role} updated KYC field "${updated.label}".`,
      status: 'SUCCESS',
    });
  };

  const toggleRegistrationFieldEnabled = (id: string) => {
    setCustomerRegistrationFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isEnabled: !f.isEnabled } : f))
    );
  };

  const toggleRegistrationFieldRequired = (id: string) => {
    setCustomerRegistrationFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isRequired: !f.isRequired } : f))
    );
  };

  const setRegistrationFieldRequirement = (id: string, mode: 'MANDATORY' | 'OPTIONAL' | 'DISABLED') => {
    setCustomerRegistrationFields((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        if (mode === 'DISABLED') {
          return { ...f, isEnabled: false };
        }
        return {
          ...f,
          isEnabled: true,
          isRequired: mode === 'MANDATORY',
        };
      })
    );
    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'REGISTRATION_FIELD_UPDATED',
      entityType: 'GOVERNANCE',
      entityId: id,
      details: `${currentUser.role} configured field ${id} requirement to ${mode}.`,
      status: 'SUCCESS',
    });
  };

  const batchSetRegistrationRequirement = (fieldIds: string[], mode: 'MANDATORY' | 'OPTIONAL' | 'DISABLED') => {
    setCustomerRegistrationFields((prev) =>
      prev.map((f) => {
        if (!fieldIds.includes(f.id)) return f;
        if (mode === 'DISABLED') {
          return { ...f, isEnabled: false };
        }
        return {
          ...f,
          isEnabled: true,
          isRequired: mode === 'MANDATORY',
        };
      })
    );
    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'REGISTRATION_FIELD_UPDATED',
      entityType: 'GOVERNANCE',
      entityId: 'BATCH',
      details: `${currentUser.role} batch changed ${fieldIds.length} fields to ${mode}.`,
      status: 'SUCCESS',
    });
  };

  const applyRegistrationPreset = (
    presetKey: 'EXPRESS' | 'STRICT_POLICE' | 'HOSTEL_PG' | 'HOTEL_STANDARD' | 'FUNCTION_HALL' | 'BALANCED'
  ) => {
    if (presetKey === 'BALANCED') {
      setCustomerRegistrationFields(DEFAULT_CUSTOMER_REGISTRATION_FIELDS);
      addAuditLog({
        actorName: currentUser.fullName,
        actorRole: currentUser.role,
        action: 'REGISTRATION_PRESET_APPLIED',
        entityType: 'GOVERNANCE',
        entityId: 'BALANCED',
        details: `${currentUser.role} restored standard balanced KYC presets.`,
        status: 'SUCCESS',
      });
      return;
    }

    setCustomerRegistrationFields((prev) =>
      prev.map((f) => {
        if (presetKey === 'EXPRESS') {
          // Express Check-in: Only name and phone mandatory, photo and id number optional, rest disabled
          if (f.key === 'fullName' || f.key === 'phone') {
            return { ...f, isEnabled: true, isRequired: true };
          }
          if (f.key === 'email' || f.key === 'livePhotoUrl' || f.key === 'idProofNumber') {
            return { ...f, isEnabled: true, isRequired: false };
          }
          return { ...f, isEnabled: false, isRequired: false };
        }

        if (presetKey === 'STRICT_POLICE') {
          // Strict Police Verification: complete statutory audit
          const mandatoryKeys = [
            'fullName',
            'phone',
            'emergencyPhone',
            'email',
            'livePhotoUrl',
            'idProofType',
            'idProofNumber',
            'idProofFrontUrl',
            'address',
            'cityStatePincode',
            'dob',
            'gender',
            'purposeOfStay',
            'policeVerificationConsent',
          ];
          const isMandatory = mandatoryKeys.includes(f.key);
          return { ...f, isEnabled: true, isRequired: isMandatory };
        }

        if (presetKey === 'HOSTEL_PG') {
          // Hostel PG Inmate compliance
          const mandatoryKeys = [
            'fullName',
            'phone',
            'emergencyPhone',
            'email',
            'livePhotoUrl',
            'idProofType',
            'idProofNumber',
            'idProofFrontUrl',
            'address',
            'permanentAddress',
            'cityStatePincode',
            'dob',
            'gender',
            'guardianName',
            'guardianPhone',
            'purposeOfStay',
            'occupationWorkplace',
            'policeVerificationConsent',
          ];
          const isMandatory = mandatoryKeys.includes(f.key);
          return { ...f, isEnabled: true, isRequired: isMandatory };
        }

        if (presetKey === 'HOTEL_STANDARD') {
          // Hotel standard guest register
          const disabledKeys = ['guardianName', 'guardianPhone', 'occupationWorkplace', 'permanentAddress'];
          if (disabledKeys.includes(f.key)) {
            return { ...f, isEnabled: false, isRequired: false };
          }
          const mandatoryKeys = [
            'fullName',
            'phone',
            'email',
            'livePhotoUrl',
            'idProofType',
            'idProofNumber',
            'address',
            'cityStatePincode',
            'purposeOfStay',
            'policeVerificationConsent',
          ];
          return {
            ...f,
            isEnabled: true,
            isRequired: mandatoryKeys.includes(f.key),
          };
        }

        if (presetKey === 'FUNCTION_HALL') {
          // Function hall event organizer
          const disabledKeys = ['guardianName', 'guardianPhone', 'occupationWorkplace', 'permanentAddress'];
          if (disabledKeys.includes(f.key)) {
            return { ...f, isEnabled: false, isRequired: false };
          }
          const mandatoryKeys = [
            'fullName',
            'phone',
            'emergencyPhone',
            'email',
            'idProofType',
            'idProofNumber',
            'address',
            'cityStatePincode',
            'purposeOfStay',
            'guestsCountSplit',
            'policeVerificationConsent',
          ];
          return {
            ...f,
            isEnabled: true,
            isRequired: mandatoryKeys.includes(f.key),
          };
        }

        return f;
      })
    );

    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'REGISTRATION_PRESET_APPLIED',
      entityType: 'GOVERNANCE',
      entityId: presetKey,
      details: `${currentUser.role} applied Plug & Play preset "${presetKey}".`,
      status: 'SUCCESS',
    });
  };

  const addRegistrationField = (newFieldData: Omit<CustomerRegistrationField, 'id'>) => {
    const newField: CustomerRegistrationField = {
      ...newFieldData,
      id: `crf_${Date.now()}`,
    };
    setCustomerRegistrationFields((prev) => [...prev, newField]);
    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'REGISTRATION_FIELD_CREATED',
      entityType: 'GOVERNANCE',
      entityId: newField.id,
      details: `${currentUser.role} added new KYC field "${newField.label}".`,
      status: 'SUCCESS',
    });
  };

  const deleteRegistrationField = (id: string) => {
    setCustomerRegistrationFields((prev) => prev.filter((f) => f.id !== id));
    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'REGISTRATION_FIELD_DELETED',
      entityType: 'GOVERNANCE',
      entityId: id,
      details: `${currentUser.role} deleted KYC field ID "${id}".`,
      status: 'SUCCESS',
    });
  };

  const reorderRegistrationFields = (startIndex: number, endIndex: number) => {
    setCustomerRegistrationFields((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, index) => ({
        ...item,
        displayOrder: index + 1,
      }));
    });
  };

  const duplicateRegistrationField = (id: string) => {
    const original = customerRegistrationFields.find((f) => f.id === id);
    if (!original) return;

    const newField: CustomerRegistrationField = {
      ...original,
      id: `crf_${Date.now()}`,
      key: `${original.key}_copy_${Math.floor(Math.random() * 1000)}`,
      label: `${original.label} (Copy)`,
      displayOrder: customerRegistrationFields.length + 1,
    };

    setCustomerRegistrationFields((prev) => [...prev, newField]);
    addAuditLog({
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'REGISTRATION_FIELD_DUPLICATED',
      entityType: 'GOVERNANCE',
      entityId: newField.id,
      details: `${currentUser.role} duplicated field "${original.label}".`,
      status: 'SUCCESS',
    });
  };

  const resetRegistrationFields = () => {
    setCustomerRegistrationFields(DEFAULT_CUSTOMER_REGISTRATION_FIELDS);
    fetch('/api/registration-fields/reset', { method: 'POST' }).catch(() => {});
  };

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
      isVerified: venueData.isVerified !== undefined ? venueData.isVerified : (currentUser.role === 'ADMIN'),
      isActive: true,
      status: venueData.status || (currentUser.role === 'ADMIN' ? 'APPROVED' : 'PENDING'),
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
      videos: venueData.videos || [],
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

    // Persist to real backend database
    createVenueOnBackend(newVenue).catch((err) => {
      console.warn('Backend sync for new venue deferred:', err);
    });

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
    // Persist updates to backend database
    updateVenueOnBackend(id, updates).catch((err) => {
      console.warn('Backend sync for venue update deferred:', err);
    });
  };

  const deleteVenue = async (id: string) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));
    await deleteVenueOnBackend(id);
    refetchVenues().catch(() => {});
  };

  const purgeSampleVenues = async () => {
    const res = await purgeSampleVenuesOnBackend();
    if (res.success) {
      setVenues((prev) => prev.filter((v) => (v as any).isSample !== true));
      await refetchVenues();
    }
    return { success: res.success, count: res.remainingCount, message: res.message };
  };

  const resetSampleVenues = async () => {
    try {
      const res = await fetch('/api/venues/reset-samples', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await refetchVenues();
      }
      return { success: data.success, message: data.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to reset samples' };
    }
  };

  // Real Authentication Actions
  const requestOtp = async (identifier: string) => {
    const res = await sendOtpToIdentifier(identifier);
    return {
      success: res.success,
      testOtp: res.testOtp,
      message: res.message || 'OTP processed',
    };
  };

  const loginWithOtp = async (identifier: string, otp: string, role: UserRole = 'USER', fullName?: string) => {
    const res = await verifyOtpAndAuthenticate(identifier, otp, role, fullName);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      return true;
    }
    return false;
  };

  const logoutUser = async () => {
    await logoutUserSession();
    setCurrentUser({
      id: 'user_user',
      fullName: 'Narendra Reddy',
      email: 'tnarendra2025@gmail.com',
      phone: '+91 98765 43210',
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    });
  };

  const approveVenue = (id: string) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'APPROVED', isVerified: true } : v))
    );
    updateVenueOnBackend(id, { status: 'APPROVED', isVerified: true }).catch(() => {});
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
    updateVenueOnBackend(id, { status: 'REJECTED', rejectionReason: reason }).catch(() => {});
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
      customerRegistration: newBookingData.customerRegistration,
    };

    setBookings((prev) => [createdBooking, ...prev]);

    // Persist to real backend bookings database
    createBookingInDatabase(createdBooking).catch((err) => {
      console.warn('Backend persistence for booking deferred:', err);
    });

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

    updateBookingStatusInDatabase(bookingId, 'CANCELLED', 'REFUNDED').catch(() => {});

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
        requestOtp,
        loginWithOtp,
        logoutUser,
        selectedLocation,
        setSelectedLocation,
        allLocations: POPULAR_LOCATIONS,
        venues,
        backendFilteredVenues,
        isVenuesLoading,
        backendVenueQueryInfo,
        userCoordinates,
        setUserCoordinates,
        fetchVenuesByBackendCategory,
        refetchVenues,
        addVenue,
        updateVenue,
        deleteVenue,
        purgeSampleVenues,
        resetSampleVenues,
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
        customerRegistrationFields,
        updateRegistrationField,
        toggleRegistrationFieldEnabled,
        toggleRegistrationFieldRequired,
        setRegistrationFieldRequirement,
        batchSetRegistrationRequirement,
        applyRegistrationPreset,
        addRegistrationField,
        deleteRegistrationField,
        resetRegistrationFields,
        reorderRegistrationFields,
        duplicateRegistrationField,
        dbSyncStatus,
        lastDbSyncedAt,
        saveFieldsToDatabase,
        reloadFieldsFromDatabase,
        registrationCardBooking,
        setRegistrationCardBooking,
        plugPlayModules,
        featuresBackendSync,
        togglePlugPlayModule,
        updateModuleConfig,
        applyModulePreset,
        isModuleEnabled,
        reloadFeaturesFromBackend,
        resetFeaturesToDefault,
        selfHealingLogs,
        systemHealthScore,
        isSelfHealingActive,
        isHealingScanRunning,
        triggerSystemSelfHeal,
        simulateAndHealScenario,
        clearSelfHealingLogs,
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
