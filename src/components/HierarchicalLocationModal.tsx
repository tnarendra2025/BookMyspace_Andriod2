import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Search,
  Check,
  ChevronRight,
  Globe,
  Navigation,
  Building2,
  X,
  Compass,
  Zap,
  Loader2,
  Sparkles,
  PlusCircle,
} from 'lucide-react';
import { LocationHierarchy } from '../types';
import {
  ALL_INDIA_STATES,
  INDIA_ADMINISTRATIVE_DATA,
  getAllDistrictsForState,
  getMandalsForDistrict,
  getTownsForDistrict,
  getAuthoritativeIndianPresets,
  inferIndianLocationFromPincode,
  IndiaLocationItem,
} from '../data/indiaLocations';

interface HierarchicalLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RealtimePostOffice {
  name: string;
  branchType?: string;
  deliveryStatus?: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export const HierarchicalLocationModal: React.FC<HierarchicalLocationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedLocation, setSelectedLocation } = useApp();

  const [activeTab, setActiveTab] = useState<'drill' | 'realtime'>('drill');
  const [zoneFilter, setZoneFilter] = useState<'All' | 'South' | 'North' | 'West' | 'East' | 'Central' | 'NorthEast'>('All');

  // Hierarchy selections
  const [selectedCountry] = useState('India');
  const [selectedState, setSelectedState] = useState<string>(selectedLocation?.state || 'Telangana');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(selectedLocation?.district || 'Hyderabad');
  const [selectedMandal, setSelectedMandal] = useState<string>(selectedLocation?.mandal || 'Serilingampally');
  const [selectedTown, setSelectedTown] = useState<string>('Madhapur (Hitec City)');
  const [customTownInput, setCustomTownInput] = useState<string>('');
  const [isCustomTownActive, setIsCustomTownActive] = useState<boolean>(false);
  const [selectedRadius, setSelectedRadius] = useState<number>(10);

  // Filter terms for faster discovery
  const [districtFilter, setDistrictFilter] = useState('');
  const [townFilter, setTownFilter] = useState('');

  // Live district offices fetched from India Post
  const [liveDistrictOffices, setLiveDistrictOffices] = useState<any[]>([]);
  const [isLoadingDistrictOffices, setIsLoadingDistrictOffices] = useState(false);

  // Real-time live search states
  const [realtimeQuery, setRealtimeQuery] = useState('');
  const [isSearchingRealtime, setIsSearchingRealtime] = useState(false);
  const [realtimeResults, setRealtimeResults] = useState<RealtimePostOffice[]>([]);
  const [realtimeSource, setRealtimeSource] = useState<'india-post' | 'deterministic' | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const presets = useMemo(() => getAuthoritativeIndianPresets(), []);

  // Filtered States based on Zone
  const filteredStates = useMemo(() => {
    if (zoneFilter === 'All') return ALL_INDIA_STATES;
    return ALL_INDIA_STATES.filter((stateName) => {
      const data = INDIA_ADMINISTRATIVE_DATA[stateName];
      return data?.zone === zoneFilter;
    });
  }, [zoneFilter]);

  // Current State Data
  const currentStateData = useMemo(() => {
    return INDIA_ADMINISTRATIVE_DATA[selectedState];
  }, [selectedState]);

  // All authoritative districts for current State (covers 780+ across India)
  const availableDistricts = useMemo(() => {
    return getAllDistrictsForState(selectedState);
  }, [selectedState]);

  // Filtered districts matching search
  const filteredDistricts = useMemo(() => {
    if (!districtFilter.trim()) return availableDistricts;
    const lower = districtFilter.toLowerCase().trim();
    return availableDistricts.filter((d) => d.toLowerCase().includes(lower));
  }, [availableDistricts, districtFilter]);

  // Mandals for current District (combines static authoritative tehsils and live India Post blocks)
  const availableMandals = useMemo(() => {
    const baseMandals = getMandalsForDistrict(selectedState, selectedDistrict);
    const liveMandals = liveDistrictOffices
      .map((o) => o.mandal)
      .filter((m): m is string => Boolean(m && m.length > 1 && m !== 'NA'));
    const combined = Array.from(new Set([...baseMandals, ...liveMandals])).sort();
    return combined.length > 0 ? combined : ['Headquarters Mandal', 'Urban Taluk'];
  }, [selectedState, selectedDistrict, liveDistrictOffices]);

  // Towns / Villages / Pincodes for current District (combines static list + ALL live post offices in district)
  const availableTowns = useMemo(() => {
    const baseTowns = getTownsForDistrict(selectedState, selectedDistrict);
    const liveTowns = liveDistrictOffices.map((o) => ({
      town: o.town || o.name,
      pin: o.pin || o.pincode,
      lat: o.lat || o.latitude || 20.5937,
      lng: o.lng || o.longitude || 78.9629,
      branchType: o.branchType,
      deliveryStatus: o.deliveryStatus,
      mandal: o.mandal,
    }));

    const map = new Map<string, any>();
    // Add live towns first (authentic postal directory)
    for (const t of liveTowns) {
      map.set(`${t.town}-${t.pin}`, t);
    }
    // Add base towns if not already present
    for (const t of baseTowns) {
      const key = `${t.town}-${t.pin}`;
      if (!map.has(key)) {
        map.set(key, t);
      }
    }
    return Array.from(map.values());
  }, [selectedState, selectedDistrict, liveDistrictOffices]);

  // Filtered towns matching user input
  const filteredTowns = useMemo(() => {
    if (!townFilter.trim()) return availableTowns;
    const lower = townFilter.toLowerCase().trim();
    return availableTowns.filter(
      (t) =>
        t.town.toLowerCase().includes(lower) ||
        t.pin.includes(lower) ||
        (t.mandal && t.mandal.toLowerCase().includes(lower))
    );
  }, [availableTowns, townFilter]);

  // Fetch all live post offices and villages in this district via India Post
  useEffect(() => {
    if (!selectedDistrict) return;
    let cancelled = false;
    const cleanDist = selectedDistrict.replace(/\s*\(.*?\)\s*/g, '').trim();
    setIsLoadingDistrictOffices(true);

    fetch(`/api/location/district/${encodeURIComponent(cleanDist)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setIsLoadingDistrictOffices(false);
        if (data.success && Array.isArray(data.towns)) {
          setLiveDistrictOffices(data.towns);
        } else {
          setLiveDistrictOffices([]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoadingDistrictOffices(false);
          setLiveDistrictOffices([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDistrict]);

  // Synchronize when state changes
  const handleStateChange = (st: string) => {
    setSelectedState(st);
    setDistrictFilter('');
    setTownFilter('');
    const distList = getAllDistrictsForState(st);
    const firstDist = distList[0] || `${st} Central`;
    setSelectedDistrict(firstDist);

    const mList = getMandalsForDistrict(st, firstDist);
    const firstMandal = mList[0] || `${firstDist} Urban`;
    setSelectedMandal(firstMandal);

    const tList = getTownsForDistrict(st, firstDist);
    if (tList.length > 0) {
      setSelectedTown(tList[0].town);
    } else {
      setSelectedTown(`${firstDist} Main`);
    }
    setIsCustomTownActive(false);
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    setTownFilter('');
    const mList = getMandalsForDistrict(selectedState, dist);
    setSelectedMandal(mList[0] || `${dist} Urban`);
    const tList = getTownsForDistrict(selectedState, dist);
    if (tList.length > 0) {
      setSelectedTown(tList[0].town);
    } else {
      setSelectedTown(`${dist} Main`);
    }
    setIsCustomTownActive(false);
  };

  // Real-time lookup debouncer
  const searchTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const q = realtimeQuery.trim();
    if (!q) {
      setRealtimeResults([]);
      setIsSearchingRealtime(false);
      setRealtimeSource(null);
      setSearchFeedback(null);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If exactly 6 digits (PIN code), run immediate lookup
    if (/^\d{6}$/.test(q)) {
      setIsSearchingRealtime(true);
      setSearchFeedback('Querying India Post Live Directory...');

      fetch(`/api/location/pincode/${q}`)
        .then((res) => res.json())
        .then((data) => {
          setIsSearchingRealtime(false);
          if (data.success && Array.isArray(data.offices) && data.offices.length > 0) {
            setRealtimeResults(
              data.offices.map((o: any) => ({
                name: o.name,
                branchType: o.branchType,
                deliveryStatus: o.deliveryStatus,
                mandal: o.mandal,
                district: o.district,
                state: o.state,
                pincode: o.pincode,
                latitude: data.latitude,
                longitude: data.longitude,
              }))
            );
            setRealtimeSource('india-post');
            setSearchFeedback(`Found ${data.offices.length} live post offices in ${data.district}, ${data.state}`);
          } else {
            // Fallback to deterministic circle resolver
            const inferred = inferIndianLocationFromPincode(q);
            setRealtimeResults([
              {
                name: inferred.townOrVillage,
                mandal: inferred.mandal,
                district: inferred.district,
                state: inferred.state,
                pincode: inferred.pincode,
                latitude: inferred.lat,
                longitude: inferred.lng,
              },
            ]);
            setRealtimeSource('deterministic');
            setSearchFeedback(`Resolved region: ${inferred.state} (${inferred.district})`);
          }
        })
        .catch(() => {
          setIsSearchingRealtime(false);
          const inferred = inferIndianLocationFromPincode(q);
          setRealtimeResults([
            {
              name: inferred.townOrVillage,
              mandal: inferred.mandal,
              district: inferred.district,
              state: inferred.state,
              pincode: inferred.pincode,
              latitude: inferred.lat,
              longitude: inferred.lng,
            },
          ]);
          setRealtimeSource('deterministic');
          setSearchFeedback(`Resolved region: ${inferred.state}`);
        });
      return;
    }

    // Text query search (Town, Village, Mandal)
    if (q.length >= 3) {
      setIsSearchingRealtime(true);
      setSearchFeedback('Searching all-India towns, villages & mandals...');
      searchTimeoutRef.current = setTimeout(() => {
        fetch(`/api/location/search?q=${encodeURIComponent(q)}`)
          .then((res) => res.json())
          .then((data) => {
            setIsSearchingRealtime(false);
            if (data.success && Array.isArray(data.results) && data.results.length > 0) {
              setRealtimeResults(
                data.results.map((r: any) => ({
                  name: r.townOrVillage,
                  mandal: r.mandal,
                  district: r.district,
                  state: r.state,
                  pincode: r.pincode,
                  latitude: r.latitude,
                  longitude: r.longitude,
                }))
              );
              setRealtimeSource('india-post');
              setSearchFeedback(`Found ${data.results.length} matching locations in India`);
            } else {
              // Local preset fuzzy filter
              const localMatches = presets
                .filter(
                  (p) =>
                    p.townOrVillage.toLowerCase().includes(q.toLowerCase()) ||
                    p.mandal.toLowerCase().includes(q.toLowerCase()) ||
                    p.district.toLowerCase().includes(q.toLowerCase()) ||
                    p.state.toLowerCase().includes(q.toLowerCase())
                )
                .slice(0, 10);

              if (localMatches.length > 0) {
                setRealtimeResults(
                  localMatches.map((p) => ({
                    name: p.townOrVillage,
                    mandal: p.mandal,
                    district: p.district,
                    state: p.state,
                    pincode: p.pincode,
                    latitude: p.lat,
                    longitude: p.lng,
                  }))
                );
                setRealtimeSource('deterministic');
                setSearchFeedback(`Found ${localMatches.length} matching administrative hubs`);
              } else {
                setRealtimeResults([]);
                setSearchFeedback('No direct matches found. Try entering a 6-digit PIN code or standard town name.');
              }
            }
          })
          .catch(() => {
            setIsSearchingRealtime(false);
            setSearchFeedback('Search service currently operating in offline mode.');
          });
      }, 400);
    }
  }, [realtimeQuery, presets]);

  // Apply location selected from real-time results
  const handleApplyRealtimeLocation = (item: RealtimePostOffice) => {
    const newLoc: LocationHierarchy = {
      state: item.state,
      district: item.district,
      mandal: item.mandal,
      city: item.district,
      area: `${item.name} (${item.mandal})`,
      pincode: item.pincode,
      fullAddressText: `${item.name}, ${item.mandal}, ${item.district}, ${item.state} - ${item.pincode}, India`,
    };
    setSelectedLocation(newLoc);
    onClose();
  };

  // Apply location selected from hierarchy tree
  const handleApplyHierarchy = () => {
    const resolvedTown = isCustomTownActive && customTownInput.trim()
      ? customTownInput.trim()
      : selectedTown;

    const matchedPinItem = availableTowns.find((t) => t.town === selectedTown);
    const pin = matchedPinItem ? matchedPinItem.pin : '500001';

    const newLoc: LocationHierarchy = {
      state: selectedState,
      district: selectedDistrict,
      mandal: selectedMandal,
      city: selectedDistrict,
      area: `${resolvedTown} (${selectedMandal})`,
      pincode: pin,
      fullAddressText: `${resolvedTown}, ${selectedMandal}, ${selectedDistrict}, ${selectedState} - ${pin}, India`,
    };

    setSelectedLocation(newLoc);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xs">
              <MapPin className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">All-India Location Hub</h2>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-emerald-400" /> Real-time Live
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                All 36 States & UTs • All Districts • All Mandals/Taluks • All Towns/Villages • All PIN Codes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/90 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('drill')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'drill'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Hierarchy Explorer (State → Dist → Mandal → Village)
          </button>
          <button
            onClick={() => setActiveTab('realtime')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'realtime'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Real-time PIN / Village Search (Live India Post)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'drill' ? (
            <div className="space-y-5">
              {/* Active Selection Breadcrumb */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-2 text-xs font-semibold text-indigo-950 flex-wrap">
                <span className="text-slate-400">Path:</span>
                <span className="text-indigo-700 font-bold">🇮🇳 India</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-indigo-700 font-bold">{selectedState}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-indigo-700 font-bold">{selectedDistrict}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-indigo-700 font-bold">{selectedMandal}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg shadow-xs border border-indigo-200/60">
                  {isCustomTownActive && customTownInput.trim() ? customTownInput.trim() : selectedTown}
                </span>
              </div>

              {/* Geographic Zone Pills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    1. Filter States by Geographic Zone
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">36 States & UTs Available</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'South', 'North', 'West', 'East', 'Central', 'NorthEast'] as const).map((z) => (
                    <button
                      key={z}
                      onClick={() => setZoneFilter(z)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        zoneFilter === z
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {z === 'All' ? 'All India (36)' : z}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Select State or Union Territory
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50/50">
                  {filteredStates.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStateChange(st)}
                      className={`px-3 py-2 rounded-xl text-xs text-left font-medium transition-all flex items-center justify-between border ${
                        selectedState === st
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                      }`}
                    >
                      <span className="truncate">{st}</span>
                      {selectedState === st && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* District & Mandal Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* District Dropdown with Search */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      3. Select District ({filteredDistricts.length} / {availableDistricts.length})
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search district (e.g. Guntur, Pune)..."
                        value={districtFilter}
                        onChange={(e) => setDistrictFilter(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    >
                      {filteredDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mandal / Taluk Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      4. Select Mandal / Taluk / Tehsil ({availableMandals.length})
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[11px] text-slate-400 py-1.5">
                      Sub-district administrative divisions in {selectedDistrict}
                    </div>
                    <select
                      value={selectedMandal}
                      onChange={(e) => {
                        setSelectedMandal(e.target.value);
                        setIsCustomTownActive(false);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    >
                      {availableMandals.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Town / Village / Pincode Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      5. Select Town / Village / Pincode ({filteredTowns.length})
                    </label>
                    {isLoadingDistrictOffices && (
                      <span className="flex items-center gap-1 text-[10px] text-indigo-600 font-medium animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> Fetching India Post...
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsCustomTownActive(!isCustomTownActive)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    {isCustomTownActive ? 'Choose from known postal villages' : 'Type custom village/area'}
                  </button>
                </div>

                {liveDistrictOffices.length > 0 && !isCustomTownActive && (
                  <div className="mb-2 p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      {liveDistrictOffices.length} official post offices & villages live in {selectedDistrict}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      India Post Verified
                    </span>
                  </div>
                )}

                {isCustomTownActive ? (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                    <p className="text-xs text-amber-800">
                      Enter any specific village, ward, street, or colony under <strong>{selectedMandal} Mandal</strong>:
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. Rampur Village, Main Bazaar, Colony No. 4..."
                      value={customTownInput}
                      onChange={(e) => setCustomTownInput(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search village, town, or PIN code in this district..."
                        value={townFilter}
                        onChange={(e) => setTownFilter(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50/50">
                      {filteredTowns.map((t) => {
                        const isSelected = selectedTown === t.town;
                        return (
                          <button
                            key={`${t.town}-${t.pin}`}
                            onClick={() => {
                              setSelectedTown(t.town);
                              if (t.mandal && t.mandal !== 'NA') {
                                setSelectedMandal(t.mandal);
                              }
                            }}
                            className={`px-3 py-2 rounded-xl text-xs text-left font-medium transition-all flex items-center justify-between border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <span className="font-semibold block truncate">{t.town}</span>
                              {t.mandal && (
                                <span className={`text-[10px] block truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                                  {t.mandal} {t.branchType ? `• ${t.branchType}` : ''}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 ${
                                isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {t.pin}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Discovery Radius Slider */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    Discovery Search Radius
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Display venues within {selectedRadius} km from selected center
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[5, 10, 20, 50].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRadius(r)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedRadius === r
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {r} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleApplyHierarchy}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Apply Location ({selectedState} • {selectedDistrict})
              </button>
            </div>
          ) : (
            /* REAL-TIME LIVE INDIA POST PINCODE & VILLAGE SEARCH TAB */
            <div className="space-y-4">
              <div className="p-3.5 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">
                    Live Real-Time Postal Index Search (All 155,000+ Post Offices in India)
                  </h4>
                  <p className="text-[11px] text-indigo-800/80 leading-relaxed mt-0.5">
                    Type <strong>any 6-digit PIN code</strong> (e.g. <code>110001</code>, <code>500081</code>, <code>400001</code>, <code>600001</code>, <code>533001</code>) or <strong>town / village name</strong> (e.g. <em>Varanasi, Kakinada, Manali, Alibaug</em>). It queries official postal records in real time!
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN (e.g. 500081) or Town / Village / Post Office name..."
                  value={realtimeQuery}
                  onChange={(e) => setRealtimeQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-hidden shadow-xs"
                />
                {isSearchingRealtime && (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
                {!isSearchingRealtime && realtimeQuery && (
                  <button
                    onClick={() => setRealtimeQuery('')}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status and Feedback */}
              {searchFeedback && (
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-600 font-medium">{searchFeedback}</span>
                  {realtimeSource === 'india-post' && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Live Postal Service
                    </span>
                  )}
                  {realtimeSource === 'deterministic' && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      Regional Resolver
                    </span>
                  )}
                </div>
              )}

              {/* Results List */}
              {realtimeResults.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {realtimeResults.map((item, idx) => (
                    <div
                      key={`${item.pincode}-${item.name}-${idx}`}
                      onClick={() => handleApplyRealtimeLocation(item)}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer shadow-xs hover:shadow-sm flex items-center justify-between group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                              {item.name}
                            </span>
                            {item.branchType && (
                              <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md">
                                {item.branchType}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Mandal: <strong>{item.mandal}</strong> • District: <strong>{item.district}</strong> • {item.state}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-mono font-bold">
                          {item.pincode}
                        </span>
                        <div className="text-[10px] text-indigo-600 font-bold mt-1 group-hover:underline">
                          Select →
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Popular Major Indian Hubs Quick Select */
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Popular Metros & Tech Hubs (One-Tap Quick Select)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {presets.slice(0, 8).map((preset) => (
                      <button
                        key={preset.pincode + preset.townOrVillage}
                        onClick={() =>
                          handleApplyRealtimeLocation({
                            name: preset.townOrVillage,
                            mandal: preset.mandal,
                            district: preset.district,
                            state: preset.state,
                            pincode: preset.pincode,
                            latitude: preset.lat,
                            longitude: preset.lng,
                          })
                        }
                        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            {preset.townOrVillage}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {preset.district}, {preset.state}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                          {preset.pincode}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Currently Active: <strong>{selectedLocation?.fullAddressText || 'Madhapur, Hyderabad'}</strong></span>
          </div>
          <span className="text-slate-400 hidden sm:inline">Republic of India • Postal System Coverage</span>
        </div>
      </div>
    </div>
  );
};
