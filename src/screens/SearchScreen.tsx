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
  ArrowLeft,
  RotateCcw,
  Database,
  RefreshCw,
  Server,
  Zap,
  Navigation,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { SAMPLE_CATEGORIES, FUNCTION_HALL_CATEGORIES, isFunctionHallCategory, FUNCTION_HALL_RELATED_SLUGS } from '../data/mockData';
import { VenueCard } from './HomeScreen';
import { CategoryIcon, getCategoryMeta } from '../components/CategoryIcon';
import { VenueSortOption } from '../types';

export const SearchScreen: React.FC = () => {
  const {
    venues,
    backendFilteredVenues,
    isVenuesLoading,
    backendVenueQueryInfo,
    fetchVenuesByBackendCategory,
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
    selectedCity,
    setSelectedCity,
    sortBy,
    setSortBy,
    userCoordinates,
  } = useApp();

  // Secondary Slider Filters State
  const [maxPrice, setMaxPrice] = useState<number>(350000);
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Check if current category filter belongs to Function Halls domain
  const isFunctionHallMode = useMemo(() => {
    return isFunctionHallCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  // Categories displayed in the strip: if function hall clicked, ONLY function hall related categories are displayed!
  const displayedCategories = useMemo(() => {
    if (isFunctionHallMode) {
      return FUNCTION_HALL_CATEGORIES;
    }
    return SAMPLE_CATEGORIES;
  }, [isFunctionHallMode]);

  // Efficient backend query source: When backend results exist, use backend-retrieved listings
  // where category_id, search, and intelligent multi-factor ranking were evaluated directly on the server database layer
  const isUsingBackendResults = Boolean(backendFilteredVenues && backendFilteredVenues.length > 0);
  const sourceVenues = useMemo(() => {
    if (isUsingBackendResults && backendFilteredVenues) {
      return backendFilteredVenues;
    }
    return venues;
  }, [isUsingBackendResults, backendFilteredVenues, venues]);

  // Filter & Sort Logic:
  // When backendFilteredVenues is active, the backend has ALREADY performed category filtering,
  // search querying, and intelligent multi-factor ranking (distance, popularity, availability).
  // Redundant client-side filtering and sorting is completely avoided!
  const filteredResults = useMemo(() => {
    if (isUsingBackendResults && backendFilteredVenues) {
      // If user specified secondary in-memory budget/capacity sliders, filter without re-sorting
      if (maxPrice < 350000 || minCapacity > 0) {
        return backendFilteredVenues.filter((v) => {
          if (v.pricingBaseAmount > maxPrice) return false;
          if (minCapacity > 0 && v.capacity < minCapacity) return false;
          return true;
        });
      }
      return backendFilteredVenues;
    }

    // Local / offline fallback when backend is unavailable
    return venues.filter((v) => {
      // Must be approved or public
      if (v.status && v.status !== 'APPROVED') return false;

      // Fallback category match if backend did not filter (e.g. offline/cache)
      if (selectedCategoryId !== 'all') {
        if (selectedCategoryId === 'function_hall' || selectedCategoryId === 'all_function_halls') {
          const isFhCategory = isFunctionHallCategory(v.category.slug) || v.category.parentSection === 'function_halls';
          if (!isFhCategory) return false;
        } else if (v.category.slug !== selectedCategoryId) {
          if (!(selectedCategoryId === 'marriage_hall' && (v.category.slug === 'marriage_hall' || v.category.slug === 'function_hall'))) {
            return false;
          }
        }
      }

      // City filter
      if (selectedCity !== 'All' && selectedCity !== 'All Cities' && v.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Price filter
      if (v.pricingBaseAmount > maxPrice) return false;

      // Capacity filter
      if (minCapacity > 0 && v.capacity < minCapacity) return false;

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
      if (sortBy === 'popularity') return (b.avgRating * Math.log10(b.ratingCount + 1)) - (a.avgRating * Math.log10(a.ratingCount + 1));
      if (sortBy === 'distance' && a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      return (b.intelligentScore || 0) - (a.intelligentScore || 0);
    });
  }, [backendFilteredVenues, isUsingBackendResults, venues, searchQuery, selectedCategoryId, selectedCity, maxPrice, minCapacity, sortBy]);

  const uniqueCities = ['All', ...Array.from(new Set(venues.map((v) => v.city)))];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId('all');
    setSelectedCity('All');
    setMaxPrice(350000);
    setMinCapacity(0);
    setSortBy('intelligent');
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

        {/* Function Hall Filter Mode Active Banner */}
        {isFunctionHallMode && (
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/80 rounded-xl px-3.5 py-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🏛️</span>
              <div>
                <p className="text-xs font-bold text-rose-900">
                  Function Halls Mode Active
                </p>
                <p className="text-[10px] text-rose-600">
                  Displaying only Function Hall related categories (Marriage Halls, Banquets, Convention Centers, Mini Halls, Party Lawns)
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategoryId('all')}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shrink-0 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show All Categories</span>
            </button>
          </div>
        )}

        {/* Category Horizontal Filter Strip (Colorful, Simple & Eye-Catching) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {/* Back to All Categories button if in Function Hall Mode */}
          {isFunctionHallMode && (
            <button
              onClick={() => setSelectedCategoryId('all')}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-all shadow-xs"
              title="Return to all main categories"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </button>
          )}

          {displayedCategories.map((cat) => {
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

      {/* Results Header with Intelligent Sorting Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="text-slate-500">
              Showing <span className="font-bold text-slate-900">{filteredResults.length}</span> matching spaces
              {searchQuery && <span> for "{searchQuery}"</span>}
            </div>
            {selectedCategoryId !== 'all' && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium shadow-2xs">
                <Database className="w-3 h-3 text-emerald-600" />
                <span>
                  Backend Query: <code className="font-semibold text-emerald-800">category_id="{selectedCategoryId}"</code>
                </span>
              </div>
            )}
            {isVenuesLoading && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-medium animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                <span>Querying database & ranking...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-slate-500 font-medium shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as VenueSortOption)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="intelligent">🧠 Intelligent Match (Distance + Popularity + Slots)</option>
              <option value="distance">📍 Distance: Nearest First</option>
              <option value="popularity">🔥 Popularity & Bookings</option>
              <option value="availability">⚡ Availability: Open Slots First</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="price_low">₹ Price: Low to High</option>
              <option value="price_high">₹ Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Quick Sorting Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Sort:</span>
          {[
            { id: 'intelligent', label: 'Intelligent Match', icon: Sparkles, color: 'text-amber-600' },
            { id: 'distance', label: 'Nearest First', icon: MapPin, color: 'text-rose-600' },
            { id: 'popularity', label: 'Most Popular', icon: TrendingUp, color: 'text-blue-600' },
            { id: 'availability', label: 'Open Slots', icon: Zap, color: 'text-emerald-600' },
            { id: 'rating', label: 'Top Rated', icon: Star, color: 'text-amber-500' },
          ].map((item) => {
            const isSelected = sortBy === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSortBy(item.id as VenueSortOption)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all duration-150 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs scale-102'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Multi-factor Intelligent Scoring Explanation Banner */}
        {sortBy === 'intelligent' && (
          <div className="p-3 bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-indigo-50/70 border border-amber-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-950 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-extrabold text-amber-900">Multi-Factor Intelligent Sorting Active</span>
                <span className="text-amber-700 block sm:inline sm:ml-2">
                  Weighted by <strong>35% Proximity</strong>, <strong>40% Popularity & Ratings</strong>, and <strong>25% Slot Availability</strong>.
                </span>
              </div>
            </div>
            {userCoordinates && (
              <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-200/50">
                <Navigation className="w-3 h-3 text-indigo-600" />
                <span>Reference: {selectedCity !== 'All' ? selectedCity : 'Hyderabad Center'}</span>
              </div>
            )}
          </div>
        )}

        {/* Proximity Distance Banner */}
        {sortBy === 'distance' && (
          <div className="p-3 bg-indigo-50/80 border border-indigo-200/70 rounded-2xl flex items-center justify-between gap-2 text-xs text-indigo-950 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-extrabold text-indigo-950">Nearest First Sorting</span>
                <span className="text-indigo-700 ml-2">
                  Calculating real-time geodesic distance from your reference location.
                </span>
              </div>
            </div>
          </div>
        )}
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
