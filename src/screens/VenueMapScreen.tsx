import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin,
  Star,
  Compass,
  Crosshair,
  Navigation,
  Sliders,
  Sparkles,
  Zap,
  CheckCircle2,
  Search,
  Building2,
  Layers,
  ArrowRight,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import { Venue } from '../types';
import { isFunctionHallCategory, FUNCTION_HALL_CATEGORIES } from '../data/mockData';

export const VenueMapScreen: React.FC = () => {
  const {
    venues,
    backendFilteredVenues,
    fetchVenuesByBackendCategory,
    selectedLocation,
    setSelectedVenueId,
    setActiveScreen,
    setBookingModalVenue,
  } = useApp();
  const { t } = useLanguage();

  // Dual Mode Switch: 'interactive_map' vs 'location_pin'
  const [bookingMode, setBookingMode] = useState<'interactive_map' | 'location_pin'>('interactive_map');

  // Selected Pin Venue for Map mode preview
  const [selectedPinVenue, setSelectedPinVenue] = useState<Venue | null>(venues[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Trigger backend category query whenever category filter changes in map screen
  React.useEffect(() => {
    if (filterCategory !== 'all') {
      fetchVenuesByBackendCategory(filterCategory);
    }
  }, [filterCategory, fetchVenuesByBackendCategory]);

  // Location Pin Drop & Radius State
  const [droppedPin, setDroppedPin] = useState<{ x: number; y: number; label: string; lat: number; lng: number }>({
    x: 45,
    y: 50,
    label: selectedLocation.area || selectedLocation.city,
    lat: selectedLocation.city === 'Bangalore' ? 12.9716 : 17.4319,
    lng: selectedLocation.city === 'Bangalore' ? 77.5946 : 78.4073,
  });
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(10);
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [locationSearchInput, setLocationSearchInput] = useState<string>('');

  // Fixed/projected map coordinates for venues
  const venueCoordinates = useMemo(() => {
    const coordsMap = new Map<string, { x: number; y: number; lat: number; lng: number }>();
    const positions = [
      { x: 38, y: 34, lat: 17.4319, lng: 78.4073 },
      { x: 58, y: 55, lat: 17.4435, lng: 78.3772 },
      { x: 28, y: 62, lat: 17.4239, lng: 78.4485 },
      { x: 70, y: 40, lat: 17.4123, lng: 78.4321 },
      { x: 48, y: 68, lat: 17.4589, lng: 78.3612 },
      { x: 62, y: 26, lat: 17.4699, lng: 78.3499 },
      { x: 22, y: 38, lat: 17.4188, lng: 78.4722 },
      { x: 75, y: 68, lat: 17.4011, lng: 78.4899 },
      { x: 40, y: 82, lat: 17.3850, lng: 78.4867 },
      { x: 82, y: 30, lat: 17.4912, lng: 78.3999 },
    ];

    venues.forEach((v, idx) => {
      const p = positions[idx % positions.length];
      coordsMap.set(v.id, {
        x: p.x,
        y: p.y,
        lat: v.latitude || p.lat,
        lng: v.longitude || p.lng,
      });
    });
    return coordsMap;
  }, [venues]);

  // Calculate distance from dropped pin to each venue
  const venuesWithCalculatedDistance = useMemo(() => {
    return venues.map((v) => {
      const pinCoords = venueCoordinates.get(v.id) || { x: 50, y: 50, lat: 17.43, lng: 78.4 };
      // Euclidean relative distance on canvas scaled to km
      const dx = pinCoords.x - droppedPin.x;
      const dy = pinCoords.y - droppedPin.y;
      const canvasDist = Math.sqrt(dx * dx + dy * dy);
      // approximate 1 canvas unit = 0.35 km
      const calculatedKm = Math.max(0.4, Number((canvasDist * 0.35).toFixed(1)));

      return {
        ...v,
        distanceFromDroppedPin: calculatedKm,
        mapX: pinCoords.x,
        mapY: pinCoords.y,
      };
    });
  }, [venues, droppedPin, venueCoordinates]);

  // Check if active filter category is within the Function Halls domain
  const isFunctionHallActive = useMemo(() => {
    return isFunctionHallCategory(filterCategory);
  }, [filterCategory]);

  // Filtered venues for interactive map mode
  const filteredMapVenues = useMemo(() => {
    if (filterCategory === 'all') return venuesWithCalculatedDistance;
    if (filterCategory === 'function_hall' || filterCategory === 'all_function_halls') {
      return venuesWithCalculatedDistance.filter(
        (v) => isFunctionHallCategory(v.category.slug) || v.category.parentSection === 'function_halls'
      );
    }
    return venuesWithCalculatedDistance.filter((v) => v.category.slug === filterCategory);
  }, [filterCategory, venuesWithCalculatedDistance]);

  // Venues within the chosen radius in pin mode
  const venuesWithinRadius = useMemo(() => {
    return venuesWithCalculatedDistance
      .filter((v) => v.distanceFromDroppedPin <= searchRadiusKm)
      .sort((a, b) => a.distanceFromDroppedPin - b.distanceFromDroppedPin);
  }, [venuesWithCalculatedDistance, searchRadiusKm]);

  // Handle map click to drop pin in pin-booking mode
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (bookingMode !== 'location_pin') return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setDroppedPin({
      x: Math.round(clickX),
      y: Math.round(clickY),
      label: `Pinned Spot (${clickX.toFixed(1)}°, ${clickY.toFixed(1)}°)`,
      lat: 17.43 + (clickX - 50) * 0.005,
      lng: 78.4 + (clickY - 50) * 0.005,
    });
  };

  // Handle HTML5 Geolocation to drop pin at user location
  const handleUseCurrentGPS = () => {
    setIsLocatingGPS(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocatingGPS(false);
          setDroppedPin({
            x: 50,
            y: 50,
            label: 'My GPS Location (High Accuracy)',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          setIsLocatingGPS(false);
          // Fallback to central city pin
          setDroppedPin({
            x: 50,
            y: 50,
            label: `${selectedLocation.city} Center`,
            lat: 17.4319,
            lng: 78.4073,
          });
        },
        { timeout: 6000 }
      );
    } else {
      setIsLocatingGPS(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-12 h-[calc(100vh-8rem)] flex flex-col">
      {/* Top Header & Dual Mode Switcher Banner */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900">
                {selectedLocation.city} • Space Booking Canvas
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                2 Booking Modes
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {bookingMode === 'interactive_map' ? t.mapModeSub : t.pinModeSub}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setBookingMode('interactive_map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              bookingMode === 'interactive_map'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.interactiveMap}</span>
          </button>
          <button
            onClick={() => setBookingMode('location_pin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              bookingMode === 'location_pin'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>{t.locationPin}</span>
          </button>
        </div>
      </div>

      {/* Mode Specific Controls Sub-bar */}
      {bookingMode === 'interactive_map' ? (
        <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-rose-600" />
              {isFunctionHallActive ? 'Hall Category:' : 'Filter Category:'}
            </span>
            {isFunctionHallActive && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                Function Halls Only
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar py-0.5">
            {/* If Function Hall mode active, show Back to All Categories button */}
            {isFunctionHallActive && (
              <button
                onClick={() => setFilterCategory('all')}
                className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 shadow-xs"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>All Categories</span>
              </button>
            )}

            {isFunctionHallActive
              ? [
                  { id: 'function_hall', label: 'All Function Halls', emoji: '🏛️' },
                  { id: 'marriage_hall', label: 'Marriage Halls', emoji: '💒' },
                  { id: 'banquet_hall', label: 'Banquet Halls', emoji: '🥂' },
                  { id: 'convention_center', label: 'Convention Centers', emoji: '🏢' },
                  { id: 'mini_function_hall', label: 'Mini AC Halls', emoji: '✨' },
                  { id: 'party_hall', label: 'Party Lawns', emoji: '🎈' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFilterCategory(c.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      filterCategory === c.id
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-rose-50/80 text-rose-800 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <span>{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                ))
              : [
                  { id: 'all', label: t.allSpaces },
                  { id: 'function_hall', label: t.functionHalls },
                  { id: 'sports_turf', label: t.sportsTurfs },
                  { id: 'hotel_stay', label: t.hotelsSuites },
                  { id: 'pg_hostel', label: t.pgHostels },
                  { id: 'co_working', label: t.coworkingDesks },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFilterCategory(c.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      filterCategory === c.id
                        ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
          </div>
        </div>
      ) : (
        /* Pin Drop Controls Bar */
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
          {/* GPS Locate Button */}
          <button
            onClick={handleUseCurrentGPS}
            disabled={isLocatingGPS}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black border border-indigo-200 transition-all cursor-pointer shadow-2xs"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocatingGPS ? 'animate-spin' : ''}`} />
            <span>{isLocatingGPS ? 'Locating GPS...' : t.useMyLocation}</span>
          </button>

          {/* Radius Slider */}
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">
              {t.searchRadiusKm}: <span className="font-black text-indigo-600">{searchRadiusKm} km</span>
            </span>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={searchRadiusKm}
              onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
              className="w-24 sm:w-32 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Current Pin Label */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Pinned:</span>
            <span className="font-medium text-slate-600 truncate max-w-[180px] bg-slate-100 px-2 py-0.5 rounded-lg">
              {droppedPin.label}
            </span>
          </div>
        </div>
      )}

      {/* Main Map View Area */}
      <div className="relative flex-1 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-inner flex flex-col">
        {/* SVG Vector Map Canvas with Click Handling */}
        <svg
          onClick={handleMapClick}
          className={`w-full h-full object-cover select-none ${
            bookingMode === 'location_pin' ? 'cursor-crosshair' : 'cursor-default'
          }`}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Land tone */}
          <rect width="100" height="100" fill="#f8fafc" />

          {/* City Arterial Sector Grid */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="2" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="2" />
          <line x1="25" y1="0" x2="25" y2="100" stroke="#f1f5f9" strokeWidth="2" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#f1f5f9" strokeWidth="2" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="#f1f5f9" strokeWidth="2" />

          {/* River / Lake Waters */}
          <path
            d="M 0,45 Q 25,48 45,42 T 75,46 T 100,40 L 100,50 Q 75,54 45,50 T 0,53 Z"
            fill="#e0f2fe"
            opacity="0.85"
          />
          <ellipse cx="44" cy="46" rx="10" ry="7" fill="#bae6fd" opacity="0.9" />
          <text x="44" y="47" fontSize="2" fill="#0284c7" textAnchor="middle" fontWeight="bold">
            Lake Bay Basin
          </text>

          {/* Green Parks */}
          <path d="M 12,15 Q 22,12 26,22 T 18,32 T 10,24 Z" fill="#dcfce7" opacity="0.9" />
          <path d="M 72,65 Q 85,60 90,75 T 78,88 T 68,78 Z" fill="#dcfce7" opacity="0.9" />

          {/* Highways / Expressways */}
          <path
            d="M 5,20 Q 50,2 95,20 T 90,85 T 10,85 Z"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.2"
            strokeDasharray="2,1"
          />
          <line x1="0" y1="35" x2="100" y2="35" stroke="#ffffff" strokeWidth="1.8" />
          <line x1="0" y1="35" x2="100" y2="35" stroke="#e2e8f0" strokeWidth="0.8" />
          <line x1="0" y1="70" x2="100" y2="70" stroke="#ffffff" strokeWidth="1.8" />
          <line x1="0" y1="70" x2="100" y2="70" stroke="#e2e8f0" strokeWidth="0.8" />
          <line x1="30" y1="0" x2="30" y2="100" stroke="#ffffff" strokeWidth="1.8" />
          <line x1="30" y1="0" x2="30" y2="100" stroke="#e2e8f0" strokeWidth="0.8" />
          <line x1="65" y1="0" x2="65" y2="100" stroke="#ffffff" strokeWidth="1.8" />
          <line x1="65" y1="0" x2="65" y2="100" stroke="#e2e8f0" strokeWidth="0.8" />

          {/* Metro Rail Line */}
          <path
            d="M 5,75 Q 35,70 50,55 T 95,25"
            fill="none"
            stroke="#6366f1"
            strokeWidth="0.6"
            strokeDasharray="1.5,1.5"
          />

          {/* In Pin Mode: Draw Visual Search Radius Circle */}
          {bookingMode === 'location_pin' && (
            <g pointerEvents="none">
              {/* Outer Radius Fill */}
              <circle
                cx={droppedPin.x}
                cy={droppedPin.y}
                r={searchRadiusKm * 1.8}
                fill="#6366f1"
                fillOpacity="0.12"
                stroke="#6366f1"
                strokeWidth="0.5"
                strokeDasharray="2,1"
              />
              {/* Pulsing Center Anchor */}
              <circle cx={droppedPin.x} cy={droppedPin.y} r="1.5" fill="#ef4444" />
              <circle
                cx={droppedPin.x}
                cy={droppedPin.y}
                r="3.5"
                fill="none"
                stroke="#ef4444"
                strokeWidth="0.3"
                opacity="0.6"
              />
            </g>
          )}
        </svg>

        {/* Dropped Location Pin Marker on Map Canvas */}
        {bookingMode === 'location_pin' && (
          <div
            style={{ left: `${droppedPin.x}%`, top: `${droppedPin.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-full z-30 pointer-events-none transition-all duration-300 flex flex-col items-center"
          >
            <div className="px-2 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black shadow-lg flex items-center gap-1 whitespace-nowrap border border-white">
              <MapPin className="w-3 h-3 fill-white" />
              <span>{droppedPin.label}</span>
            </div>
            <div className="w-3 h-3 bg-red-600 rotate-45 -mt-1.5 shadow-md"></div>
          </div>
        )}

        {/* Venue Pins Overlay */}
        {(bookingMode === 'interactive_map' ? filteredMapVenues : venuesWithinRadius).map((venue) => {
          const isSelected = selectedPinVenue?.id === venue.id;

          return (
            <div
              key={venue.id}
              style={{ left: `${venue.mapX}%`, top: `${venue.mapY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-200"
              onClick={() => setSelectedPinVenue(venue)}
            >
              {/* Floating Price / Category Pill Marker */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black shadow-lg transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white scale-110 ring-4 ring-indigo-300'
                    : 'bg-white text-slate-900 border border-slate-200 hover:scale-105'
                }`}
              >
                <span>{venue.category.icon}</span>
                <span>₹{(venue.pricingBaseAmount / 1000).toFixed(0)}k</span>
                {bookingMode === 'location_pin' && (
                  <span className={`text-[10px] px-1 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {venue.distanceFromDroppedPin}km
                  </span>
                )}
              </div>
              <div
                className={`w-2 h-2 mx-auto rotate-45 -mt-1 ${
                  isSelected ? 'bg-indigo-600' : 'bg-white'
                }`}
              ></div>
            </div>
          );
        })}

        {/* Pin Mode Hint Pill */}
        {bookingMode === 'location_pin' && (
          <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[11px] font-bold text-slate-700">
              Click anywhere on map to move pin • Found <strong className="text-indigo-600">{venuesWithinRadius.length} spaces</strong> within {searchRadiusKm} km
            </span>
          </div>
        )}

        {/* Recenter Button */}
        <button
          onClick={() => {
            if (bookingMode === 'location_pin') {
              setDroppedPin({
                x: 45,
                y: 50,
                label: selectedLocation.area || selectedLocation.city,
                lat: 17.4319,
                lng: 78.4073,
              });
            } else {
              setSelectedPinVenue(venues[0]);
            }
          }}
          className="absolute top-4 right-4 p-2.5 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors z-30 cursor-pointer"
          title={t.recenterMap}
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Selected Venue Floating Preview Card at Bottom (Accessible in both modes) */}
        {selectedPinVenue && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-4 z-30 animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex gap-3">
              <img
                src={selectedPinVenue.images[0]?.url || selectedPinVenue.featuredImageUrl}
                alt={selectedPinVenue.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-600">
                    {selectedPinVenue.category.name}
                  </span>
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {selectedPinVenue.avgRating}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                  {selectedPinVenue.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {selectedPinVenue.addressLine1}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs font-black text-slate-900">
                    ₹{selectedPinVenue.pricingBaseAmount.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      {selectedPinVenue.category.slug === 'sports_turf' ? t.perHour : t.perSlot}
                    </span>
                  </div>
                  {bookingMode === 'location_pin' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      📍 {venuesWithCalculatedDistance.find((v) => v.id === selectedPinVenue.id)?.distanceFromDroppedPin || 1.5} km from pin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Booking & Details Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedVenueId(selectedPinVenue.id);
                  setActiveScreen('venue-detail');
                }}
                className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 text-center cursor-pointer transition-colors"
              >
                {t.viewDetails}
              </button>
              <button
                onClick={() => setBookingModalVenue(selectedPinVenue)}
                className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-500/20 text-center flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{bookingMode === 'location_pin' ? t.bookFromPin : t.bookOnMap}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* In Pin Mode: Bottom Ranked Spaces List Within Pin Radius */}
      {bookingMode === 'location_pin' && (
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{t.venuesFound} {t.withinRadius} ({venuesWithinRadius.length})</span>
            </span>
            <span className="text-[11px] font-bold text-indigo-600">
              Sorted by nearest proximity
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {venuesWithinRadius.map((venue) => (
              <div
                key={venue.id}
                onClick={() => setSelectedPinVenue(venue)}
                className={`shrink-0 w-64 p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  selectedPinVenue?.id === venue.id
                    ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-200 shadow-sm'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                }`}
              >
                <img
                  src={venue.images[0]?.url || venue.featuredImageUrl}
                  alt={venue.name}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-slate-900 truncate">{venue.name}</h5>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] font-bold text-indigo-600">
                      📍 {venue.distanceFromDroppedPin} {t.kmAway}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      ₹{(venue.pricingBaseAmount / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookingModalVenue(venue);
                    }}
                    className="w-full mt-1.5 py-1 px-2 rounded-lg bg-slate-950 hover:bg-indigo-600 text-white text-[10px] font-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                    <span>{t.bookFromPin}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
