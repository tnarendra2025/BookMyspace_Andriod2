import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Home, Search, MapPin, Ticket, Sparkles, User } from 'lucide-react';
import { ActiveScreen } from '../types';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, bookings, setIsAIBookingOpen } = useApp();
  const { t } = useLanguage();

  const activeBookingsCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 flex items-center justify-around">
      <button
        onClick={() => setActiveScreen('home')}
        className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
          activeScreen === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] tracking-tight mt-0.5">{t.explore}</span>
      </button>

      <button
        onClick={() => setActiveScreen('map')}
        className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
          activeScreen === 'map' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <MapPin className="w-5 h-5 text-rose-500" />
        <span className="text-[10px] tracking-tight mt-0.5">{t.mapBooking}</span>
      </button>

      {/* Center Floating AI Booking Action */}
      <button
        onClick={() => setIsAIBookingOpen(true)}
        className="flex flex-col items-center justify-center -mt-4 py-1.5 px-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-white transition-transform active:scale-95"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className="text-[9px] font-black tracking-tight mt-0.5">{t.aiBooking}</span>
      </button>

      <button
        onClick={() => setActiveScreen('bookings')}
        className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
          activeScreen === 'bookings' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative">
          <Ticket className="w-5 h-5" />
          {activeBookingsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {activeBookingsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{t.myBookings}</span>
      </button>

      <button
        onClick={() => setActiveScreen('profile')}
        className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
          activeScreen === 'profile' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] tracking-tight mt-0.5">Profile</span>
      </button>
    </nav>
  );
};

