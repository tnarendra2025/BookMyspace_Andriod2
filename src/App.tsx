import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { AmbientThemeProvider, AmbientBackgroundCanvas } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { BookingModal } from './components/BookingModal';
import { InvoiceModal } from './components/InvoiceModal';
import { QrPassModal } from './components/QrPassModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { AIBookingModal } from './components/AIBookingModal';
import { ContextAwareHelpFab } from './components/ContextAwareHelpFab';
import { AccessDeniedView } from './components/AccessDeniedView';
import { CustomerRegistrationCardModal } from './components/CustomerRegistrationCardModal';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { VenueDetailScreen } from './screens/VenueDetailScreen';
import { VenueMapScreen } from './screens/VenueMapScreen';
import { MyBookingsScreen } from './screens/MyBookingsScreen';
import { EventsCoursesScreen } from './screens/EventsCoursesScreen';
import { QrScannerScreen } from './screens/QrScannerScreen';
import { OwnerDashboardScreen } from './screens/OwnerDashboardScreen';
import { AdminAuditScreen } from './screens/AdminAuditScreen';
import { AdminSectionsScreen } from './screens/AdminSectionsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DailyWeeklyReportsScreen } from './screens/DailyWeeklyReportsScreen';
import { SupportScreen } from './screens/SupportScreen';
import { SavedVenuesScreen } from './screens/SavedVenuesScreen';
import { InstitutesAndClassesScreen } from './screens/InstitutesAndClassesScreen';
import { InstituteOwnerDashboardScreen } from './screens/InstituteOwnerDashboardScreen';
import { CreateVenueScreen } from './screens/CreateVenueScreen';
import { ExternalAppsAndMcpScreen } from './screens/ExternalAppsAndMcpScreen';
import { PaymentHealthAndConfigScreen } from './screens/PaymentHealthAndConfigScreen';
import { ThemeCustomizerScreen } from './screens/ThemeCustomizerScreen';
import { FirebaseMigrationScreen } from './screens/FirebaseMigrationScreen';
import { UnifiedRegistrationScreen } from './screens/UnifiedRegistrationScreen';
import { ReferralScreen } from './screens/ReferralScreen';
import { AdminSettingsScreen } from './screens/AdminSettingsScreen';
import { AdminLiveElementEditorScreen } from './screens/AdminLiveElementEditorScreen';
import { DynamicRegistrationBuilder } from './components/DynamicRegistrationBuilder';
import { ListingFieldsConfigScreen } from './screens/ListingFieldsConfigScreen';
import { TaxInvoiceCustomizerScreen } from './screens/TaxInvoiceCustomizerScreen';
import { PlugAndPlayFeaturesHubScreen } from './screens/PlugAndPlayFeaturesHubScreen';
import { AdminVenueUploadScreen } from './screens/AdminVenueUploadScreen';

const MainLayout: React.FC = () => {
  const {
    activeScreen,
    isAIBookingOpen,
    setIsAIBookingOpen,
    currentUser,
    registrationCardBooking,
    setRegistrationCardBooking,
  } = useApp();

  // Dynamic role evaluation without hardcoding IDs
  const isOwnerOrAdmin = currentUser.role === 'VENUE_OWNER' || currentUser.role === 'ADMIN';
  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="min-h-screen relative text-slate-900 flex flex-col antialiased">
      {/* Dynamic Animated Ambient Color Canvas */}
      <AmbientBackgroundCanvas />

      {/* Top Universal Navbar */}
      <Navbar />

      {/* Main Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {activeScreen === 'home' && <HomeScreen />}
        {activeScreen === 'search' && <SearchScreen />}
        {activeScreen === 'venue-detail' && <VenueDetailScreen />}
        {activeScreen === 'map' && <VenueMapScreen />}
        {activeScreen === 'bookings' && <MyBookingsScreen />}
        {activeScreen === 'saved' && <SavedVenuesScreen />}
        {activeScreen === 'events' && <EventsCoursesScreen />}
        {activeScreen === 'institutes' && <InstitutesAndClassesScreen />}
        {activeScreen === 'institute-owner' && (
          !isOwnerOrAdmin
            ? <AccessDeniedView requiredRole="VENUE_OWNER" screenTitle="Academy Host Dashboard" />
            : <InstituteOwnerDashboardScreen />
        )}
        {activeScreen === 'create-venue' && (
          !isOwnerOrAdmin
            ? <AccessDeniedView requiredRole="VENUE_OWNER" screenTitle="Create Space Listing" />
            : <CreateVenueScreen />
        )}
        {activeScreen === 'admin-venue-upload' && (
          !isAdmin
            ? <AccessDeniedView requiredRole="ADMIN" screenTitle="Bulk Venue Upload" />
            : <AdminVenueUploadScreen />
        )}
        {activeScreen === 'mcp-integrations' && <ExternalAppsAndMcpScreen />}
        {activeScreen === 'payment-health' && <PaymentHealthAndConfigScreen />}
        {activeScreen === 'theme-customizer' && <ThemeCustomizerScreen />}
        {activeScreen === 'cloud-sync' && <FirebaseMigrationScreen />}
        {activeScreen === 'unified-registration' && <UnifiedRegistrationScreen />}
        {activeScreen === 'referrals' && <ReferralScreen />}
        {(activeScreen === 'qr-scanner' || (activeScreen as string) === 'scanner') && <QrScannerScreen />}
        {activeScreen === 'owner' && (
          !isOwnerOrAdmin
            ? <AccessDeniedView requiredRole="VENUE_OWNER" screenTitle="Venue Host Dashboard" />
            : <OwnerDashboardScreen />
        )}
        {activeScreen === 'tax-invoice-customizer' && <TaxInvoiceCustomizerScreen />}
        {activeScreen === 'listing-fields-config' && <ListingFieldsConfigScreen />}
        {activeScreen === 'registration-builder' && <DynamicRegistrationBuilder />}
        {activeScreen === 'admin-audit' && (
          !isAdmin
            ? <AccessDeniedView requiredRole="ADMIN" screenTitle="Admin Audit Trail & Governance" />
            : <AdminAuditScreen />
        )}
        {activeScreen === 'admin-sections' && (
          !isAdmin
            ? <AccessDeniedView requiredRole="ADMIN" screenTitle="Section Architecture Manager" />
            : <AdminSectionsScreen />
        )}
        {activeScreen === 'admin-settings' && (
          !isAdmin
            ? <AccessDeniedView requiredRole="ADMIN" screenTitle="Platform Governance Settings" />
            : <AdminSettingsScreen />
        )}
        {activeScreen === 'admin-element-editor' && (
          !isAdmin
            ? <AccessDeniedView requiredRole="ADMIN" screenTitle="Live UI Element Editor" />
            : <AdminLiveElementEditorScreen />
        )}
        {(activeScreen === 'admin-plug-play' || activeScreen === 'plug-play' || activeScreen === 'self-healing') && (
          <PlugAndPlayFeaturesHubScreen />
        )}
        {activeScreen === 'reports' && (
          !isOwnerOrAdmin
            ? <AccessDeniedView requiredRole="VENUE_OWNER" screenTitle="Daily & Weekly Financial Reports" />
            : <DailyWeeklyReportsScreen />
        )}
        {activeScreen === 'profile' && <ProfileScreen />}
        {activeScreen === 'support' && <SupportScreen />}
      </main>

      {/* Bottom Floating Navigation for Mobile & Fast Switching */}
      <BottomNav />

      {/* Global Modals & Overlay Drawers */}
      <BookingModal />
      <InvoiceModal />
      <QrPassModal />
      <VoiceSearchModal />
      <CustomerRegistrationCardModal
        booking={registrationCardBooking}
        onClose={() => setRegistrationCardBooking(null)}
      />
      <AIBookingModal isOpen={isAIBookingOpen} onClose={() => setIsAIBookingOpen(false)} />
      <ContextAwareHelpFab />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AmbientThemeProvider>
          <MainLayout />
        </AmbientThemeProvider>
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;


