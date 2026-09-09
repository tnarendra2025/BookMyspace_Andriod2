import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Mic,
  X,
  Building2,
  Users,
  Star,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_CATEGORIES } from '../data/mockData';
import { VenueCard } from './HomeScreen';
import { CategoryIcon, getCategoryMeta } from '../components/CategoryIcon';

export const SearchScreen: React.FC = () => {
  const {
    venues,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    setSelectedVenueId,
    setBookingModalVenue,
    toggleFavoriteVenue,
    setActiveScreen,
    setIsVoiceSearchOpen,
    allLocations,
  } = useApp();

  // Filters State
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(350000);
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating'>('relevance');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredResults = useMemo(() => {
    return venues.filter((v) => {
      // Must be approved or public
      if (v.status && v.status !== 'APPROVED') return false;

      // Category match
      if (selectedCategoryId !== 'all' && v.category.slug !== selectedCategoryId) {
        if (!(selectedCategoryId === 'marriage_hall' && v.category.slug === 'function_hall')) {
          return false;
        }
      }

      // City filter
      if (selectedCity !== 'All' && v.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Price filter
      if (v.pricingBaseAmount > maxPrice) {
        return false;
      }

      // Capacity filter
      if (minCapacity > 0 && v.capacity < minCapacity) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchDesc = v.description.toLowerCase().includes(q);
        const matchCity = v.city.toLowerCase().includes(q);
        const matchCat = v.category.name.toLowerCase().includes(q);
        const matchFacility = v.facilities.some((f) => f.facility.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCity && !matchCat && !matchFacility) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.pricingBaseAmount - b.pricingBaseAmount;
      if (sortBy === 'price_high') return b.pricingBaseAmount - a.pricingBaseAmount;
      if (sortBy === 'rating') return b.avgRating - a.avgRating;
      return 0; // relevance default
    });
  }, [venues, searchQuery, selectedCategoryId, selectedCity, maxPrice, minCapacity, sortBy]);

  const uniqueCities = ['All', ...Array.from(new Set(venues.map((v) => v.city)))];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId('all');
    setSelectedCity('All');
    setMaxPrice(350000);
    setMinCapacity(0);
    setSortBy('relevance');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12">
      {/* Search Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by venue name, amenities, badminton turf, PG..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsVoiceSearchOpen(true)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
              title="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
              showFilterDrawer || minCapacity > 0 || maxPrice < 350000 || selectedCity !== 'All'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Category Horizontal Filter Strip (Colorful, Simple & Eye-Catching) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {SAMPLE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.slug;
            const meta = getCategoryMeta(cat.slug);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.slug)}
                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 ${
                  isSelected
                    ? `${meta.activeBg} ${meta.activeBorder} ${meta.activeGlow} scale-[1.02]`
                    : `${meta.cardBg} ${meta.borderColor} text-slate-700 hover:shadow-xs`
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-transform ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : `bg-gradient-to-br ${meta.iconGradient}`
                  }`}
                >
                  <CategoryIcon slug={cat.slug} className="w-3.5 h-3.5" />
                </div>
                <span>{cat.name}</span>
                {meta.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : `${meta.badgeBg} ${meta.badgeText}`
                    }`}
                  >
                    {meta.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showFilterDrawer && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs animate-in fade-in duration-150">
            {/* City Dropdown */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Location / City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:border-indigo-500 focus:outline-hidden"
              >
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city === 'All' ? 'All Cities & Regions' : city}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                <span>Max Budget:</span>
                <span className="text-indigo-600">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={500}
                max={350000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Min Capacity */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Guest Capacity</label>
              <select
                value={minCapacity}
                onChange={(e) => setMinCapacity(parseInt(e.target.value))}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:border-indigo-500 focus:outline-hidden"
              >
                <option value={0}>Any Capacity</option>
                <option value={50}>50+ Guests</option>
                <option value={200}>200+ Guests</option>
                <option value={500}>500+ Guests</option>
                <option value={1000}>1000+ Guests (Grand Wedding)</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Header with Sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredResults.length}</span> matching spaces
          {searchQuery && <span> for "{searchQuery}"</span>}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="relevance">Relevance & Verified</option>
            <option value="rating">Highest Rated</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResults.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onSelect={() => {
                setSelectedVenueId(venue.id);
                setActiveScreen('venue-detail');
              }}
              onBookNow={() => setBookingModalVenue(venue)}
              onToggleFavorite={() => toggleFavoriteVenue(venue.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No spaces matched your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your budget slider, changing category, or clearing search keywords.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
