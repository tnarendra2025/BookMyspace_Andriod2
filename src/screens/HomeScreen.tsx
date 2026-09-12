import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Star,
  Users,
  ShieldCheck,
  Heart,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calendar,
  Building2,
  Trophy,
  GraduationCap,
  Ticket,
  AlertTriangle,
  CloudOff,
  X,
  Copy,
  Check,
  Plus,
  Hotel,
  Home,
  Landmark,
  Search,
  Mic,
  Zap,
  SlidersHorizontal,
  Layers,
  Filter,
} from 'lucide-react';
import { CategoryIcon, getCategoryMeta } from '../components/CategoryIcon';
import { Venue } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { AmbientColorSwitcherPill, useAmbientTheme, AmbientThemeMode } from '../components/AmbientBackground';
import { IntegrateSubSectionModal, CustomSubSection } from '../components/IntegrateSubSectionModal';
import { Category3DGlassStage } from '../components/Category3DGlassStage';
import { HierarchicalLocationModal } from '../components/HierarchicalLocationModal';
import { useLanguage } from '../context/LanguageContext';
import { isFunctionHallCategory, FUNCTION_HALL_CATEGORIES } from '../data/mockData';

export const HomeScreen: React.FC = () => {
  const {
    venues,
    events,
    institutes,
    selectedLocation,
    selectedCategoryId,
    setSelectedCategoryId,
    setActiveScreen,
    setSelectedVenueId,
    setBookingModalVenue,
    toggleFavoriteVenue,
    searchQuery,
    setSearchQuery,
    setIsVoiceSearchOpen,
    setIsAIBookingOpen,
    addVenue,
  } = useApp();

  const { t } = useLanguage();

  const { setTheme, currentTheme } = useAmbientTheme();

  const [isSyncDismissed, setIsSyncDismissed] = useState(false);
  const [activeDealIndex, setActiveDealIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [customCategoryModalOpen, setCustomCategoryModalOpen] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [submittedCategory, setSubmittedCategory] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState<'all' | 'instant' | 'budget' | 'topRated'>('all');
  
  // Section & Subsection hierarchical navigation state
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedSubsectionId, setSelectedSubsectionId] = useState<string>('all');
  const venueFeedRef = useRef<HTMLDivElement>(null);

  // Dynamic integrated custom subsections with local persistence
  const [customSubsections, setCustomSubsections] = useState<CustomSubSection[]>(() => {
    try {
      const saved = localStorage.getItem('bms_custom_subsections');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isIntegrateModalOpen, setIsIntegrateModalOpen] = useState(false);
  const [integrateTargetCat, setIntegrateTargetCat] = useState<string>('function_halls');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const hotDeals = [
    {
      id: 'pg',
      tag: 'MONTHLY SAVE',
      timeTag: 'Limited Beds',
      title: 'Gents & Ladies PG Hostels',
      subtitle: 'Zero Security Deposit + Free High-Speed WiFi Month',
      code: 'ZEROPG',
      gradient: 'from-amber-500 via-orange-500 to-rose-500',
      sectionId: 'pg_hostels',
      subId: 'all',
    },
    {
      id: 'wedding',
      tag: 'FLASH DEAL',
      timeTag: 'Ends Today',
      title: 'Grand Marriage & Banquet Halls',
      subtitle: 'Up to 35% OFF on Advance Bookings + Free AC Suite',
      code: 'ROYALWED35',
      gradient: 'from-rose-600 via-purple-600 to-indigo-600',
      sectionId: 'function_halls',
      subId: 'marriage_hall',
    },
    {
      id: 'rooms',
      tag: 'INSTANT STAY',
      timeTag: 'Today Only',
      title: 'Hotels, Lodges & Day Rooms',
      subtitle: 'Flat ₹600 OFF on 24-Hour & Hourly Check-ins',
      code: 'FASTSTAY600',
      gradient: 'from-sky-600 via-indigo-600 to-emerald-600',
      sectionId: 'lodge_rooms',
      subId: 'all',
    },
    {
      id: 'skills',
      tag: 'EARLY BIRD',
      timeTag: '5 Seats Left',
      title: 'Dance, Music & IT Academies',
      subtitle: '25% Cashback on First Batch Enrolment + Free Demo',
      code: 'SKILL25',
      gradient: 'from-purple-600 via-blue-600 to-cyan-600',
      sectionId: 'institutes_classes',
      subId: 'all',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDealIndex((prev) => (prev + 1) % hotDeals.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [hotDeals.length]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // EXACTLY 5 Main Sections with all remaining space categories organized as sub-sections underneath
  const mainSections = useMemo(() => {
    return [
      {
        id: 'function_halls',
        title: 'Function Halls & Celebrations',
        shortTitle: 'Function Halls',
        subtitle: 'Grand Marriage Halls, Convention Centers, Banquets & Party Lawns',
        tagline: 'Marriage Halls • Grand Banquets • Lawns',
        startingPrice: '₹25,000/day',
        highlightStat: '⚡ 10-Min Royal Hold',
        badge: 'POPULAR',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        gradient: 'from-rose-600 via-pink-600 to-rose-700',
        iconBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        borderAccent: 'border-rose-500/30 hover:border-rose-400',
        glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(244,63,94,0.4)]',
        bgDarkGradient: 'from-rose-950/85 via-slate-950/95 to-slate-950',
        chipBg: 'bg-rose-500/15 hover:bg-rose-500/30 border-rose-400/25 text-rose-100 hover:text-white',
        imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&auto=format&fit=crop&q=85',
        icon: Building2,
        subsections: [
          { id: 'all', name: 'All Function Halls', emoji: '🏛️', slugs: ['function_hall', 'marriage_hall', 'banquet_hall', 'convention_center', 'mini_function_hall', 'party_hall', 'dining_hall', 'events'] },
          { id: 'marriage_hall', name: 'Marriage Halls & Mandapams', emoji: '💒', slugs: ['marriage_hall', 'function_hall'] },
          { id: 'banquet_hall', name: 'Banquet & Reception Halls', emoji: '🥂', slugs: ['banquet_hall'] },
          { id: 'convention_center', name: 'Convention Centers & Plazas', emoji: '🏢', slugs: ['convention_center', 'function_hall'] },
          { id: 'mini_function_hall', name: 'Mini AC Function Halls', emoji: '✨', slugs: ['mini_function_hall'] },
          { id: 'party_hall', name: 'Party Halls & Open Lawns', emoji: '🎈', slugs: ['party_hall', 'events', 'banquet_hall'] },
          { id: 'dining_hall', name: 'Dining & Buffet Halls', emoji: '🍽️', slugs: ['dining_hall'] },
          ...customSubsections
            .filter((c) => c.parentSectionId === 'function_halls')
            .map((c) => ({ id: c.id, name: c.name, emoji: c.emoji, slugs: c.slugs, isCustom: true })),
          { id: 'other', name: 'Other Halls & Spaces', emoji: '🌟', slugs: ['events', 'function_hall', 'banquet_hall', 'marriage_hall', 'other'] },
        ],
      },
      {
        id: 'lodge_rooms',
        title: 'Hotels, Lodges & Rooms',
        shortTitle: 'Hotels & Rooms',
        subtitle: '24-Hour Check-in Hotels, Hourly Micro-Stays & Executive Suites',
        tagline: '24h Check-in • Hourly Day Rooms • Suites',
        startingPrice: '₹499/hr',
        highlightStat: '⏱️ Flexible Hourly Slots',
        badge: 'INSTANT STAY',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        gradient: 'from-sky-600 via-blue-600 to-indigo-700',
        iconBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        borderAccent: 'border-sky-500/30 hover:border-sky-400',
        glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(14,165,233,0.4)]',
        bgDarkGradient: 'from-sky-950/85 via-slate-950/95 to-slate-950',
        chipBg: 'bg-sky-500/15 hover:bg-sky-500/30 border-sky-400/25 text-sky-100 hover:text-white',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=85',
        icon: Hotel,
        subsections: [
          { id: 'all', name: 'All Rooms', emoji: '🏨', slugs: ['hourly_rooms', 'hotel_stay'] },
          { id: 'hotel_stay', name: 'Hotels & Suites', emoji: '🛎️', slugs: ['hotel_stay'] },
          { id: 'hourly_rooms', name: 'Hourly Day Rooms', emoji: '⏱️', slugs: ['hourly_rooms'] },
          { id: 'budget_lodge', name: 'Budget Lodges', emoji: '🛏️', slugs: ['hotel_stay', 'hourly_rooms'] },
          { id: 'resort_stay', name: 'Resorts & Homestay', emoji: '🌴', slugs: ['hotel_stay'] },
          ...customSubsections
            .filter((c) => c.parentSectionId === 'lodge_rooms')
            .map((c) => ({ id: c.id, name: c.name, emoji: c.emoji, slugs: c.slugs, isCustom: true })),
          { id: 'other', name: 'Other Stays & Homestays', emoji: '✨', slugs: ['hotel_stay', 'hourly_rooms', 'other'] },
        ],
      },
      {
        id: 'pg_hostels',
        title: 'PG Hostels & Co-Living',
        shortTitle: 'PG & Hostels',
        subtitle: 'Verified Gents & Ladies PGs, Co-Living Suites & Student Hostels',
        tagline: 'Gents & Ladies PGs • Co-Living • WiFi',
        startingPrice: '₹4,500/mo',
        highlightStat: '🛡️ Verified Biometric Security',
        badge: 'ZERO BROKERAGE',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        gradient: 'from-amber-600 via-orange-600 to-amber-700',
        iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        borderAccent: 'border-amber-500/30 hover:border-amber-400',
        glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(245,158,11,0.4)]',
        bgDarkGradient: 'from-amber-950/85 via-slate-950/95 to-slate-950',
        chipBg: 'bg-amber-500/15 hover:bg-amber-500/30 border-amber-400/25 text-amber-100 hover:text-white',
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&auto=format&fit=crop&q=85',
        icon: Home,
        subsections: [
          { id: 'all', name: 'All Hostels', emoji: '🏠', slugs: ['pg_hostel'] },
          { id: 'gents_pg', name: 'Gents PG', emoji: '👨', slugs: ['pg_hostel'] },
          { id: 'ladies_pg', name: 'Ladies PG', emoji: '👩', slugs: ['pg_hostel'] },
          { id: 'student_hostel', name: 'Student Hostels', emoji: '🎒', slugs: ['pg_hostel'] },
          { id: 'coliving', name: 'Co-Living Spaces', emoji: '🛋️', slugs: ['pg_hostel'] },
          ...customSubsections
            .filter((c) => c.parentSectionId === 'pg_hostels')
            .map((c) => ({ id: c.id, name: c.name, emoji: c.emoji, slugs: c.slugs, isCustom: true })),
          { id: 'other', name: 'Other Hostels & Pods', emoji: '✨', slugs: ['pg_hostel', 'other'] },
        ],
      },
      {
        id: 'institutes_classes',
        title: 'Institutes & Academy Classes',
        shortTitle: 'Classes & Labs',
        subtitle: 'Coaching Labs, IT Academies, Tuition, Dance & Music Studios',
        tagline: 'Coaching • IT Training • Dance & Music',
        startingPrice: '₹1,200/mo',
        highlightStat: '🎓 Certified Master Instructors',
        badge: 'FREE DEMO',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        gradient: 'from-purple-600 via-indigo-600 to-purple-700',
        iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        borderAccent: 'border-purple-500/30 hover:border-purple-400',
        glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(168,85,247,0.4)]',
        bgDarkGradient: 'from-purple-950/85 via-slate-950/95 to-slate-950',
        chipBg: 'bg-purple-500/15 hover:bg-purple-500/30 border-purple-400/25 text-purple-100 hover:text-white',
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=85',
        icon: GraduationCap,
        subsections: [
          { id: 'all', name: 'All Classes', emoji: '🎓', slugs: ['coaching', 'dance_studio'] },
          { id: 'coaching', name: 'Coaching Centers', emoji: '📚', slugs: ['coaching'] },
          { id: 'tuition', name: 'Tuition & Test Prep', emoji: '✏️', slugs: ['coaching'] },
          { id: 'it_academy', name: 'IT & Computer Training', emoji: '💻', slugs: ['coaching'] },
          { id: 'dance_music', name: 'Dance & Music Studios', emoji: '🎵', slugs: ['dance_studio'] },
          ...customSubsections
            .filter((c) => c.parentSectionId === 'institutes_classes')
            .map((c) => ({ id: c.id, name: c.name, emoji: c.emoji, slugs: c.slugs, isCustom: true })),
          { id: 'other', name: 'Other Classes & Studios', emoji: '✨', slugs: ['coaching', 'dance_studio', 'other'] },
        ],
      },
      {
        id: 'sports_workspaces',
        title: 'Sports Turfs & Workspaces',
        shortTitle: 'Sports & Desks',
        subtitle: 'Floodlit Box Cricket, Football Turfs, Gyms, Co-Working & Studios',
        tagline: 'Box Cricket • Floodlit Turfs • Desks',
        startingPrice: '₹600/hr',
        highlightStat: '⚡ Instant Slot Booking',
        badge: 'FLOODLIT & 24/7',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        gradient: 'from-emerald-600 via-teal-600 to-emerald-700',
        iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        borderAccent: 'border-emerald-500/30 hover:border-emerald-400',
        glowShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.4)]',
        bgDarkGradient: 'from-emerald-950/85 via-slate-950/95 to-slate-950',
        chipBg: 'bg-emerald-500/15 hover:bg-emerald-500/30 border-emerald-400/25 text-emerald-100 hover:text-white',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=85',
        icon: Trophy,
        subsections: [
          { id: 'all', name: 'All Spaces', emoji: '⚡', slugs: ['sports_turf', 'co_working'] },
          { id: 'sports_turf', name: 'Box Cricket & Turf', emoji: '⚽', slugs: ['sports_turf'] },
          { id: 'gym_fitness', name: 'Gym & Fitness', emoji: '🏋️', slugs: ['sports_turf'] },
          { id: 'co_working', name: 'Co-Working Desks', emoji: '💼', slugs: ['co_working'] },
          { id: 'photo_studios', name: 'Photo & Film Studios', emoji: '📸', slugs: ['dance_studio', 'co_working'] },
          ...customSubsections
            .filter((c) => c.parentSectionId === 'sports_workspaces')
            .map((c) => ({ id: c.id, name: c.name, emoji: c.emoji, slugs: c.slugs, isCustom: true })),
          { id: 'other', name: 'Other Turfs & Desks', emoji: '✨', slugs: ['sports_turf', 'co_working', 'dance_studio', 'other'] },
        ],
      },
    ];
  }, [customSubsections]);

  // Active section metadata
  const activeSection = useMemo(() => {
    if (!selectedSectionId) return null;
    return mainSections.find((s) => s.id === selectedSectionId) || null;
  }, [mainSections, selectedSectionId]);

  // Active subsection metadata
  const activeSubsection = useMemo(() => {
    if (!activeSection) return null;
    return activeSection.subsections.find((sub) => sub.id === selectedSubsectionId) || activeSection.subsections[0];
  }, [activeSection, selectedSubsectionId]);

  // Open a main section with synchronized ambient color aura
  const handleOpenSection = (sectionId: string, subsectionId: string = 'all') => {
    setSelectedSectionId(sectionId);
    setSelectedSubsectionId(subsectionId);

    // Sync ambient background color theme smoothly
    const sectionThemeMap: Record<string, AmbientThemeMode> = {
      function_halls: 'sunset',
      lodge_rooms: 'ocean',
      pg_hostels: 'sunrise',
      institutes_classes: 'midnight',
      sports_workspaces: 'aurora',
    };
    if (sectionThemeMap[sectionId]) {
      setTheme(sectionThemeMap[sectionId]);
    }

    setTimeout(() => {
      venueFeedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  // Back to All Sections on Home Page
  const handleBackToAllSections = () => {
    setSelectedSectionId(null);
    setSelectedSubsectionId('all');
    setTheme('auto');
  };

  // Easily integrate a new subsection
  const handleIntegrateSubSection = (newSub: CustomSubSection, starterVenue?: Partial<Venue>) => {
    const updated = [...customSubsections, newSub];
    setCustomSubsections(updated);
    try {
      localStorage.setItem('bms_custom_subsections', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (starterVenue) {
      addVenue(starterVenue);
    }

    // Immediately open the section and select the newly integrated sub-section
    handleOpenSection(newSub.parentSectionId, newSub.id);
    showToast(`✨ Sub-section "${newSub.name}" integrated successfully!`);
  };

  // Remove a custom sub-section
  const handleRemoveCustomSubSection = (subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customSubsections.filter((s) => s.id !== subId);
    setCustomSubsections(updated);
    try {
      localStorage.setItem('bms_custom_subsections', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (selectedSubsectionId === subId) {
      setSelectedSubsectionId('all');
    }
    showToast('Sub-section removed.');
  };

  // Count venues in a section
  const getSectionSpacesCount = (sectionId: string) => {
    const section = mainSections.find((s) => s.id === sectionId);
    if (!section) return 0;
    const allSlugs = Array.from(new Set(section.subsections.flatMap((sub) => sub.slugs)));
    return venues.filter((v) => {
      if (v.status && v.status !== 'APPROVED') return false;
      return allSlugs.includes(v.category.slug) || v.category.parentSection === sectionId;
    }).length;
  };

  // Count venues in a subsection
  const getSubsectionSpacesCount = (sectionId: string, subId: string) => {
    const section = mainSections.find((s) => s.id === sectionId);
    if (!section) return 0;
    const sub = section.subsections.find((s) => s.id === subId);
    if (!sub) return 0;
    if (sub.id === 'all') {
      return getSectionSpacesCount(sectionId);
    }
    return venues.filter((v) => {
      if (v.status && v.status !== 'APPROVED') return false;
      if (sub.id === 'other') {
        const specificSubSlugs = section.subsections
          .filter((s) => s.id !== 'all' && s.id !== 'other' && !(s as any).isCustom)
          .flatMap((s) => s.slugs);
        const matchesSlugs = sub.slugs.includes(v.category.slug);
        const isParentMatch = v.category.parentSection === sectionId && !specificSubSlugs.includes(v.category.slug);
        return matchesSlugs || isParentMatch;
      }
      return sub.slugs.includes(v.category.slug) || v.category.name.toLowerCase() === sub.name.toLowerCase();
    }).length;
  };

  // Filtered venues strictly matching the active section and active subsection
  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      if (v.status && v.status !== 'APPROVED') return false;

      // When inside a section, filter by active subsection's slugs
      if (activeSection && activeSubsection) {
        if (activeSubsection.id === 'all') {
          const allSlugs = Array.from(new Set(activeSection.subsections.flatMap((sub) => sub.slugs)));
          const matchesSlugs = allSlugs.includes(v.category.slug);
          const matchesParent = v.category.parentSection === activeSection.id;
          if (!matchesSlugs && !matchesParent) {
            return false;
          }
        } else if (activeSubsection.id === 'other') {
          const specificSubSlugs = activeSection.subsections
            .filter((s) => s.id !== 'all' && s.id !== 'other' && !(s as any).isCustom)
            .flatMap((s) => s.slugs);
          const isCategorySlugMatch = activeSubsection.slugs.includes(v.category.slug);
          const isUnlistedParentMatch =
            v.category.parentSection === activeSection.id && !specificSubSlugs.includes(v.category.slug);
          if (!isCategorySlugMatch && !isUnlistedParentMatch) {
            return false;
          }
        } else if ((activeSubsection as any).isCustom) {
          const matchesCustomSlug = activeSubsection.slugs.includes(v.category.slug);
          const matchesName = v.category.name.toLowerCase() === activeSubsection.name.toLowerCase();
          const matchesParent = v.category.parentSection === activeSection.id;
          if (!matchesCustomSlug && !matchesName && !matchesParent) {
            return false;
          }
        } else {
          if (!activeSubsection.slugs.includes(v.category.slug)) {
            return false;
          }
        }
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchCity = v.city.toLowerCase().includes(q);
        const matchCat = v.category.name.toLowerCase().includes(q);
        const matchFacility = v.facilities?.some((f) => f.facility.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchCat && !matchFacility) return false;
      }

      // Quick Filters
      if (quickFilter === 'instant' && !v.isVerified && (!v.timeSlots || v.timeSlots.length === 0)) return false;
      if (quickFilter === 'budget' && v.pricingBaseAmount > 5000) return false;
      if (quickFilter === 'topRated' && v.avgRating < 4.5) return false;

      return true;
    });
  }, [venues, activeSection, activeSubsection, searchQuery, quickFilter]);

  const sportsVenues = useMemo(() => {
    return venues.filter((v) => v.category.slug === 'sports_turf');
  }, [venues]);

  const activeDeal = hotDeals[activeDealIndex];

  return (
    <div className="space-y-5 pb-20 md:pb-12">
      {/* 1. Simple, Elegant Brand Hero with Unified Search */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-9 shadow-xl border border-teal-900/30">
        {/* Subtle Ambient Background Light */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3.5">
          {/* Location Selector Pill */}
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md text-xs font-semibold text-teal-200 border border-white/10 transition-colors cursor-pointer group"
            title="Click to choose Country > State > District > Mandal > Town/Village or PIN"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Discovering in {selectedLocation.city}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-bold ml-0.5">
              Change Area / PIN
            </span>
          </button>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Book verified spaces with confidence
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Find. Compare. Book. Authoritative 10-minute hold locking with instant QR passes.
          </p>

          {/* Unified Search Input */}
          <div className="pt-1">
            <div className="relative flex items-center w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-slate-100 p-1.5 focus-within:ring-2 focus-within:ring-teal-500">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search spaces, banquets, turfs, or PGs in ${selectedLocation.city}...`}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg shrink-0"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsVoiceSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors shrink-0 mr-1"
                title="Search with Voice"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <button
                onClick={() => setIsAIBookingOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-900/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Concierge</span>
              </button>

              <button
                onClick={() => setActiveScreen('map')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Map & PIN Radius</span>
              </button>

              {/* Quick Jump Shortcuts */}
              <div className="hidden sm:flex items-center gap-1.5 pl-2 text-xs text-slate-300 border-l border-white/10">
                <span className="text-[11px] text-slate-400 font-medium">Quick:</span>
                <button
                  onClick={() => handleOpenSection('function_halls', 'all')}
                  className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors cursor-pointer"
                >
                  🏛️ Function Halls
                </button>
                <button
                  onClick={() => handleOpenSection('lodge_rooms', 'all')}
                  className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors cursor-pointer"
                >
                  🏨 Rooms
                </button>
                <button
                  onClick={() => handleOpenSection('pg_hostels', 'all')}
                  className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors cursor-pointer"
                >
                  🏠 PGs
                </button>
                <button
                  onClick={() => handleOpenSection('sports_workspaces', 'sports_turf')}
                  className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors cursor-pointer"
                >
                  ⚽ Turfs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Simple, Non-Intrusive Offer Card */}
      <section className="rounded-2xl bg-white border border-slate-200/80 p-3.5 sm:p-4 text-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                  {activeDeal.tag}
                </span>
                <span className="text-xs font-bold text-slate-900">{activeDeal.title}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{activeDeal.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleCopyCode(activeDeal.code)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCode === activeDeal.code ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <span>Code: {activeDeal.code}</span>
                  <Copy className="w-3 h-3 text-slate-400" />
                </>
              )}
            </button>
            <button
              onClick={() => handleOpenSection(activeDeal.sectionId, activeDeal.subId)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>View Spaces</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 3.5. Category Navigation Bar (Switches to Function Hall Related Categories Only when Function Hall is selected) */}
      <section className="space-y-2">
        {selectedSectionId === 'function_halls' ? (
          /* Function Halls Mode: ONLY FUNCTION HALL RELATED CATEGORIES DISPLAY */
          <div className="bg-gradient-to-r from-rose-50/95 via-pink-50/95 to-rose-50/95 border border-rose-200 rounded-2xl p-3.5 shadow-xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 text-white flex items-center justify-center text-base shadow-xs font-black shrink-0">
                  🏛️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-950">
                      Function Halls Mode Active
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-800">
                      Related Categories Only
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Displaying only Marriage Halls, Banquets, Convention Centers, Mini Halls & Lawns
                  </p>
                </div>
              </div>
              <button
                onClick={handleBackToAllSections}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Show All Categories</span>
              </button>
            </div>

            {/* ONLY FUNCTION HALL RELATED CATEGORIES */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-rose-200/70">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3 text-rose-600" />
                Hall Categories:
              </span>
              {mainSections[0].subsections.map((sub) => {
                const isCurrent = selectedSubsectionId === sub.id;
                const count = getSubsectionSpacesCount('function_halls', sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubsectionId(sub.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-600 shadow-xs scale-[1.02]'
                        : 'bg-white text-slate-700 border-rose-200 hover:bg-rose-50'
                    }`}
                  >
                    <span>{sub.emoji}</span>
                    <span>{sub.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isCurrent ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Default: Main Categories Bar */
          <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-2xs flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1.5">
              Browse:
            </span>
            <button
              onClick={() => handleBackToAllSections()}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedSectionId === null
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              ✨ All Spaces
            </button>
            {mainSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => handleOpenSection(sec.id, 'all')}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedSectionId === sec.id
                    ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                    : sec.id === 'function_halls'
                    ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>
                  {sec.id === 'function_halls'
                    ? '🏛️'
                    : sec.id === 'lodge_rooms'
                    ? '🏨'
                    : sec.id === 'pg_hostels'
                    ? '🏠'
                    : sec.id === 'institutes_classes'
                    ? '🎓'
                    : '🏸'}
                </span>
                <span>{sec.shortTitle}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 4. 5 Main Sections & Sub-Sections Hierarchical System */}
      <section className="space-y-4">
        {selectedSectionId === null ? (
          // ==========================================
          // HOME PAGE: EXACTLY 5 MAIN SECTIONS WITH NESTED SUBSECTIONS
          // ==========================================
          <Category3DGlassStage
            mainSections={mainSections}
            selectedLocation={selectedLocation}
            getSectionSpacesCount={getSectionSpacesCount}
            getSubsectionSpacesCount={getSubsectionSpacesCount}
            handleOpenSection={handleOpenSection}
            onOpenIntegrateModal={(sectionId) => {
              setIntegrateTargetCat(sectionId);
              setIsIntegrateModalOpen(true);
            }}
            onOpenCustomCategoryModal={() => setCustomCategoryModalOpen(true)}
          />
        ) : (
          // ==========================================
          // SECTION VIEW: ACTIVE MAIN SECTION WITH ANIMATED 3D GLASS SUB-SECTION STRIP
          // ==========================================
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-3"
          >
            {/* Active Section Banner with 3D White Crystal Glass Morphism */}
            <div className="p-5 sm:p-7 rounded-[2rem] border border-white/90 bg-white/85 backdrop-blur-3xl text-slate-900 relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.07),inset_0_1.5px_2px_rgba(255,255,255,1)]">
              {/* Prismatic Top Edge Shimmer Glint */}
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-sky-400/80 via-pink-400/80 to-amber-300/80 opacity-80" />

              {/* Ambient 3D Glass Refractive Floating Orb */}
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-45 bg-gradient-to-br from-sky-300/40 via-pink-300/30 to-amber-200/40" />

              {/* Ambient Background Image Tint with White Frosted Glass Sheen */}
              {activeSection && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                  <img
                    src={activeSection.imageUrl}
                    alt={activeSection.title}
                    className="w-full h-full object-cover brightness-[0.9] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/40" />
                </div>
              )}

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* 3D Glass Dome Icon Enclosure */}
                  <div className="relative group/icon">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/90 backdrop-blur-2xl border border-white text-indigo-600 shrink-0 shadow-[0_10px_25px_rgba(0,0,0,0.08),inset_0_1.5px_2px_rgba(255,255,255,1)]">
                      {activeSection && <activeSection.icon className="w-8 h-8 text-indigo-600 drop-shadow-xs" />}
                      <div className="absolute top-1 left-2 right-2 h-3 rounded-t-xl bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
                        Active Master Category
                      </span>
                      {activeSection?.badge && (
                        <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
                          {activeSection.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-700 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-200/80">
                        💎 3D White Glass
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-1">
                      {activeSection?.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      {activeSection?.subtitle} • <span className="text-indigo-600 font-bold">{filteredVenues.length} available</span> in {selectedLocation.city}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleBackToAllSections}
                  className="px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-indigo-600 text-white text-xs font-black transition-all flex items-center gap-2 border border-slate-900 self-start sm:self-center shadow-md backdrop-blur-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>All 5 Master Categories</span>
                </motion.button>
              </div>

              {/* Animated Sub-sections Pills Carousel with Gliding Layout Indicator */}
              <div className="relative z-10 mt-5 pt-4 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
                  <Filter className="w-3.5 h-3.5 text-indigo-600" />
                  Sub-Sections:
                </span>
                {activeSection?.subsections.map((sub) => {
                  const isCurrent = selectedSubsectionId === sub.id;
                  const count = getSubsectionSpacesCount(activeSection.id, sub.id);
                  const isCustom = Boolean((sub as any).isCustom);
                  const isOther = sub.id === 'other';

                  return (
                    <motion.button
                      key={sub.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSubsectionId(sub.id)}
                      className={`relative shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all border backdrop-blur-xl ${
                        isCurrent
                          ? 'text-white border-slate-900 shadow-sm'
                          : isOther
                          ? 'text-amber-900 bg-amber-100 hover:bg-amber-200 border-amber-300'
                          : 'text-slate-700 bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isCurrent && (
                        <motion.div
                          layoutId="activeSubSectionTabPill"
                          className="absolute inset-0 bg-slate-950 rounded-xl shadow-md z-0"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10 text-sm">{sub.emoji}</span>
                      <span className="relative z-10">{sub.name}</span>
                      <span
                        className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                          isCurrent
                            ? 'bg-white/20 text-white'
                            : isOther
                            ? 'bg-amber-200/60 text-amber-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>

                      {/* Remove custom sub-section */}
                      {isCustom && (
                        <span
                          onClick={(e) => handleRemoveCustomSubSection(sub.id, e)}
                          title="Remove custom sub-section"
                          className="relative z-10 ml-0.5 text-slate-400 hover:text-red-500 font-black p-0.5 rounded transition-colors"
                        >
                          ×
                        </span>
                      )}
                    </motion.button>
                  );
                })}

                {/* + Integrate Sub-Section button in carousel */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (activeSection) {
                      setIntegrateTargetCat(activeSection.id);
                      setIsIntegrateModalOpen(true);
                    }
                  }}
                  className="relative shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all border border-dashed border-slate-300 bg-white/60 text-slate-700 hover:text-indigo-600 hover:bg-white hover:border-indigo-400 shadow-xs backdrop-blur-xl"
                  title="Integrate new custom sub-section into this category"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" />
                  <span>+ Integrate Sub-Section</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* 5. Quick Attribute Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Filter by:</span>
        {[
          { id: 'all', label: 'All Verified' },
          { id: 'instant', label: '⚡ Instant Hold Only' },
          { id: 'budget', label: '💰 Budget Under ₹5,000' },
          { id: 'topRated', label: '★ Top Rated 4.5+' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setQuickFilter(f.id as any)}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              quickFilter === f.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 6. Primary Venue Feed */}
      <section ref={venueFeedRef} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {activeSection
                ? `${activeSection.title} ${activeSubsection && activeSubsection.id !== 'all' ? `— ${activeSubsection.name}` : ''} in ${selectedLocation.city}`
                : `Verified Spaces in ${selectedLocation.city}`}
            </h2>
            <p className="text-xs text-slate-500">
              {activeSection
                ? `Showing verified spaces with instant 10-minute hold protection`
                : 'Authoritative 10-minute hold lock guarantee across all spaces'}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {filteredVenues.length} available
          </span>
        </div>

        {/* Special Banner when viewing "Other" Subsection */}
        {activeSection && selectedSubsectionId === 'other' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/15 border border-amber-400/30 text-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/25 border border-amber-400/40 flex items-center justify-center text-xl shrink-0 shadow-inner">
                ✨
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>Other & Alternative Spaces in {activeSection.shortTitle}</span>
                  <span className="text-[10px] bg-amber-400/30 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
                    Sub-Section
                  </span>
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Showing alternative categories and specialized spaces. Want to easily integrate a new space sub-type?
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIntegrateTargetCat(activeSection.id);
                setIsIntegrateModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Integrate Sub-Section</span>
            </button>
          </motion.div>
        )}

        {filteredVenues.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {activeSection
                ? `No spaces yet in "${activeSubsection?.name || 'this sub-section'}"`
                : 'No spaces matched your filters'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeSection
                ? `You can easily integrate a starter space or list your venue in this sub-section.`
                : `Try resetting quick filters or browse all verified spaces in ${selectedLocation.city}.`}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {activeSection && (
                <button
                  onClick={() => {
                    setIntegrateTargetCat(activeSection.id);
                    setIsIntegrateModalOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Integrate Space in this Sub-Section</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setQuickFilter('all');
                  if (activeSection) setSelectedSubsectionId('all');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Show All in {activeSection ? activeSection.shortTitle : selectedLocation.city}
              </button>
              {activeSection && (
                <button
                  onClick={handleBackToAllSections}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  View All 5 Master Categories
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVenues.map((venue) => (
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
        )}
      </section>

      {/* 7. Curated Sports Turfs Strip (When on Home Screen) */}
      {selectedSectionId === null && !searchQuery.trim() && sportsVenues.length > 0 && (
        <section className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold">Badminton & Box Cricket Turfs</h3>
                <p className="text-xs text-slate-400">Instant hourly booking with digital QR entry</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenSection('sports_workspaces', 'sports_turf')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              View All Turfs →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sportsVenues.slice(0, 2).map((venue) => (
              <div
                key={venue.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 hover:border-amber-500/50 transition-colors"
              >
                <img
                  src={venue.images[0]?.url || venue.featuredImageUrl}
                  alt={venue.name}
                  className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0"
                />
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {venue.category.name}
                      </span>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        ★ {venue.avgRating}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{venue.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{venue.addressLine1}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700">
                    <span className="text-sm font-extrabold text-white">
                      ₹{venue.pricingBaseAmount.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">/ hr</span>
                    </span>
                    <button
                      onClick={() => setBookingModalVenue(venue)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Curated Events & Masterclasses */}
      {selectedCategoryId === 'all' && !searchQuery.trim() && events.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-600" />
                Featured Events & Workshops
              </h2>
              <p className="text-xs text-slate-500">
                Tournaments, bridal expos, and tech workshops hosted at partner spaces
              </p>
            </div>
            <button
              onClick={() => setActiveScreen('events')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              View All Events →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36">
                    <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800">
                      {evt.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {evt.date} • {evt.time}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">{evt.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{evt.description}</p>
                    <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {evt.venueName}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">PASS PRICE</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{evt.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveScreen('events')}
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    View Passes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Custom Category Request Modal */}
      {customCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Request Custom Category</h3>
                  <p className="text-xs text-slate-500">Add any unlisted venue or room type</p>
                </div>
              </div>
              <button
                onClick={() => setCustomCategoryModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedCategory ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <p className="font-bold">Request received for "{submittedCategory}"!</p>
                <p>Our operations team will add spaces in this category shortly.</p>
                <button
                  onClick={() => {
                    setSubmittedCategory(null);
                    setCustomCategoryModalOpen(false);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customCategoryInput.trim()) {
                    setSubmittedCategory(customCategoryInput.trim());
                    setCustomCategoryInput('');
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  placeholder="e.g. Yoga Studio, Turf Ground, Ashrams, Pet Boarding"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!customCategoryInput.trim()}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
                >
                  Submit Category Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Sub-Section Integration Modal */}
      <IntegrateSubSectionModal
        isOpen={isIntegrateModalOpen}
        onClose={() => setIsIntegrateModalOpen(false)}
        onIntegrate={handleIntegrateSubSection}
        defaultSectionId={integrateTargetCat}
        currentCity={selectedLocation.city}
      />

      {/* Floating Action Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white text-xs font-black shadow-2xl border border-white/20 flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hierarchical Location Selector Modal */}
      <HierarchicalLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};

// Extracted Subcomponent for Venue Card
export const VenueCard: React.FC<{
  venue: Venue;
  onSelect: () => void;
  onBookNow: () => void;
  onToggleFavorite: () => void;
}> = ({ venue, onSelect, onBookNow, onToggleFavorite }) => {
  const coverImage = venue.images.find((i) => i.isCover)?.url || venue.images[0]?.url || venue.featuredImageUrl;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Image & Badges */}
        <div className="relative h-48 sm:h-52 overflow-hidden cursor-pointer" onClick={onSelect}>
          <img
            src={coverImage}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/30"></div>

          {/* Top category chip & distance badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-extrabold text-slate-900 shadow-xs">
              {venue.category.name}
            </span>
            {venue.distanceKm !== undefined && (
              <span className="px-2 py-1 bg-slate-950/80 backdrop-blur-md text-white rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-rose-400" />
                {venue.distanceKm} km
              </span>
            )}
            {venue.isVerified && (
              <span className="p-1 bg-emerald-500 text-white rounded-full shadow-xs" title="Verified Property">
                <ShieldCheck className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Favorite heart button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors"
          >
            <Heart className={`w-4 h-4 ${venue.isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>

          {/* Bottom stats inside image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1 font-bold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {venue.avgRating} ({venue.ratingCount})
            </span>
            {venue.capacity && (
              <span className="flex items-center gap-1 text-[11px] font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                <Users className="w-3 h-3 text-slate-200" />
                Up to {venue.capacity} guests
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 cursor-pointer" onClick={onSelect}>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {venue.name}
          </h3>
          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{venue.addressLine1}, {venue.city}</span>
              {venue.distanceKm !== undefined && (
                <span className="text-indigo-600 font-semibold shrink-0">
                  • {venue.distanceKm} km away
                </span>
              )}
            </p>
            {venue.intelligentScore !== undefined && (
              <span
                className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 shadow-2xs"
                title={`Multi-Factor Score: ${venue.intelligentScore}% (Dist: ${venue.scoreBreakdown?.distanceScore}%, Pop: ${venue.scoreBreakdown?.popularityScore}%, Avail: ${venue.scoreBreakdown?.availabilityScore}%)`}
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                {venue.intelligentScore}% Match
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {venue.facilities.slice(0, 3).map((f, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
              >
                {f.facility}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Booking CTA */}
      <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">FROM</span>
          <span className="text-base font-extrabold text-slate-900">
            ₹{venue.pricingBaseAmount.toLocaleString('en-IN')}{' '}
            <span className="text-[10px] font-normal text-slate-500">
              {venue.category.slug === 'sports_turf'
                ? '/ hr'
                : venue.category.slug === 'pg_hostel'
                ? '/ mo'
                : '/ slot'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onSelect}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Details
          </button>
          <button
            type="button"
            onClick={onBookNow}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
