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

const MainLayout: React.FC = () => {
  const { activeScreen, isAIBookingOpen, setIsAIBookingOpen } = useApp();

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
        {activeScreen === 'events' && <EventsCoursesScreen />}
        {(activeScreen === 'qr-scanner' || (activeScreen as string) === 'scanner') && <QrScannerScreen />}
        {activeScreen === 'owner' && <OwnerDashboardScreen />}
        {activeScreen === 'admin-audit' && <AdminAuditScreen />}
        {activeScreen === 'admin-sections' && <AdminSectionsScreen />}
      </main>

      {/* Bottom Floating Navigation for Mobile & Fast Switching */}
      <BottomNav />

      {/* Global Modals & Overlay Drawers */}
      <BookingModal />
      <InvoiceModal />
      <QrPassModal />
      <VoiceSearchModal />
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


