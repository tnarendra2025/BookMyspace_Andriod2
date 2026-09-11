import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Star,
  MapPin,
  Building2,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { Venue } from '../types';

export const SavedVenuesScreen: React.FC = () => {
  const {
    venues,
    toggleFavoriteVenue,
    setActiveScreen,
    setSelectedVenueId,
    setBookingModalVenue,
  } = useApp();

  const [filterSection, setFilterSection] = useState<string>('all');

  const savedVenues = venues.filter((v) => v.isSaved);

  const filteredVenues = savedVenues.filter((v) => {
    if (filterSection === 'all') return true;
    return (v.category?.slug || v.category?.name || '').toLowerCase().includes(filterSection.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('home')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Saved Spaces & Wishlist</span>
              <span className="text-xs bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-bold">
                {savedVenues.length} Saved
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Quickly compare, inspect availability, and book your bookmarked venues
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveScreen('home')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Explore More Spaces</span>
        </button>
      </div>

      {/* Filter Category Chips */}
      {savedVenues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Saved Spaces' },
            { id: 'function', label: 'Function Halls' },
            { id: 'lodge', label: 'Lodge & Rooms' },
            { id: 'pg', label: 'PG & Hostels' },
            { id: 'institute', label: 'Institutes & Classes' },
            { id: 'sport', label: 'Sports Turfs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSection(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterSection === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Venues Grid / Empty State */}
      {filteredVenues.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">No Saved Spaces Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Tap the heart icon on any convention center, box cricket turf, or room to save it here for fast booking.
            </p>
          </div>
          <button
            onClick={() => setActiveScreen('home')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            Start Exploring Spaces
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={venue.images[0]?.url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleFavoriteVenue(venue.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full text-rose-500 hover:scale-110 transition-all shadow-xs"
                  title="Remove from Saved"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                </button>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>{venue.city}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-slate-900 truncate">{venue.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{venue.avgRating || 4.8}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{venue.description}</p>

                  <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Up to {venue.capacity} Guests
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">Instant Hold Available</span>
                  </div>
                </div>

                {/* Pricing & Booking CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Starts from</span>
                    <span className="text-sm font-black text-slate-900">
                      ₹{venue.pricingBaseAmount?.toLocaleString('en-IN') || '9,999'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedVenueId(venue.id);
                        setActiveScreen('venue-detail');
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVenueId(venue.id);
                        setBookingModalVenue(venue);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
