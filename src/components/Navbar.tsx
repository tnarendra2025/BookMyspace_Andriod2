import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  MapPin,
  Bell,
  User,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  ChevronDown,
  Layers,
  Compass,
  CheckCircle2,
  Mic,
  Globe,
  Zap,
  GraduationCap,
  PlusCircle,
  Bot,
  Settings,
  Sliders,
  Film,
} from 'lucide-react';
import { UserRole } from '../types';
import { AmbientColorSwitcherPill } from './AmbientBackground';
import { HierarchicalLocationModal } from './HierarchicalLocationModal';

export const Navbar: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    currentUser,
    switchRole,
    selectedLocation,
    setSelectedLocation,
    allLocations,
    notifications,
    markNotificationRead,
    searchQuery,
    setSearchQuery,
    setIsVoiceSearchOpen,
    setIsAIBookingOpen,
    venues,
  } = useApp();

  const { t, currentLanguage, setLanguage, languages } = useLanguage();

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isHierarchicalModalOpen, setIsHierarchicalModalOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const savedCount = venues.filter((v) => v.isSaved).length;
  const activeLangOption = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveScreen('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
                  Book<span className="text-indigo-600">My</span>Space
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-indigo-700">
                  Venues • Courts • Hostels
                </span>
              </div>
            </button>

            {/* Location Selector Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
                title="Select City or Location"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span className="max-w-[140px] truncate">{selectedLocation.city}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showLocationDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Popular Hubs in India
                    </span>
                    <button
                      onClick={() => {
                        setShowLocationDropdown(false);
                        setIsHierarchicalModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 underline"
                    >
                      Hierarchy Filter
                    </button>
                  </div>
                  {allLocations.map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                        selectedLocation.city === loc.city && selectedLocation.area === loc.area
                          ? 'bg-indigo-50/70 text-indigo-700 font-semibold'
                          : 'text-slate-700'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-slate-900">{loc.city} ({loc.state})</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{loc.area}</div>
                      </div>
                    </button>
                  ))}

                  <div className="p-2 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setShowLocationDropdown(false);
                        setIsHierarchicalModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Choose Country → State → Dist → Town or PIN</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Search Input (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setActiveScreen('search');
                }}
                placeholder="Search wedding halls, badminton turf, PG hostels..."
                className="w-full pl-9 pr-10 py-2 text-xs bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-slate-800 rounded-full border border-transparent focus:border-indigo-400 focus:outline-hidden transition-all shadow-inner"
              />
              <button
                onClick={() => setIsVoiceSearchOpen(true)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Search with Voice"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveScreen('home')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeScreen === 'home' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              {t.explore}
            </button>
            <button
              onClick={() => setActiveScreen('map')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeScreen === 'map' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{t.mapBooking}</span>
            </button>
            <button
              onClick={() => setIsAIBookingOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-black shadow-md shadow-indigo-500/20 hover:scale-105 transition-transform cursor-pointer"
              title={t.aiBooking}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{t.aiBooking}</span>
            </button>
            <button
              onClick={() => setActiveScreen('admin-plug-play')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeScreen === 'admin-plug-play'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100/90 border border-purple-200/70'
              }`}
              title="Plug-and-Play Features Hub - Toggle Experimental Microservices via Backend JSON"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="hidden sm:inline">Features Hub</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200/90 text-amber-900 font-black">
                ✨ JSON
              </span>
            </button>
            <button
              onClick={() => setActiveScreen('bookings')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeScreen === 'bookings' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              {t.myBookings}
            </button>
            <button
              onClick={() => setActiveScreen('events')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeScreen === 'events' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveScreen('institutes')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                activeScreen === 'institutes' ? 'bg-amber-50 text-amber-700 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Institutes & Batches
            </button>

            {/* Role specific links */}
            {currentUser.role === 'VENUE_OWNER' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveScreen('owner')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScreen === 'owner' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-emerald-700 hover:bg-emerald-50/60'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Owner Portal
                </button>
                <button
                  onClick={() => setActiveScreen('create-venue')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScreen === 'create-venue' ? 'bg-emerald-600 text-white font-bold' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  List Space
                </button>
                <button
                  onClick={() => setActiveScreen('institute-owner')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScreen === 'institute-owner' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-amber-700 hover:bg-amber-50/60'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Academy Portal
                </button>
              </div>
            )}

            {currentUser.role === 'ADMIN' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveScreen('admin-venue-upload')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScreen === 'admin-venue-upload' ? 'bg-purple-600 text-white font-bold shadow-xs' : 'bg-purple-50 text-purple-800 hover:bg-purple-100 font-bold'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Upload Venue</span>
                </button>
                <button
                  onClick={() => setActiveScreen('admin-audit')}
                  className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScreen === 'admin-audit' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-purple-700 hover:bg-purple-50/60'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Audit
                </button>
                <button
                  onClick={() => setActiveScreen('admin-sections')}
                  className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScreen === 'admin-sections' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-purple-700 hover:bg-purple-50/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Sections
                </button>
                <button
                  onClick={() => setActiveScreen('admin-settings')}
                  className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScreen === 'admin-settings' ? 'bg-purple-600 text-white font-bold' : 'text-purple-700 hover:bg-purple-50/60'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>
                <button
                  onClick={() => setActiveScreen('admin-element-editor')}
                  className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScreen === 'admin-element-editor' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-purple-700 hover:bg-purple-50/60'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  CMS
                </button>
                <button
                  onClick={() => setActiveScreen('mcp-integrations')}
                  className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScreen === 'mcp-integrations' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-indigo-700 hover:bg-indigo-50/60'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  MCP Hub
                </button>
                <button
                  onClick={() => setActiveScreen('admin-plug-play')}
                  className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScreen === 'admin-plug-play' ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300' : 'text-amber-700 hover:bg-amber-50/60'
                  }`}
                  title="Plug-and-Play Features Hub"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Flags Hub</span>
                </button>
              </div>
            )}
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2">
            {/* Mobile AI Booking Quick Action */}
            <button
              onClick={() => setIsAIBookingOpen(true)}
              className="md:hidden p-2 text-indigo-600 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100"
              title={t.aiBooking}
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
                title={t.selectLanguage}
              >
                <span className="text-sm">{activeLangOption.flag}</span>
                <span className="hidden sm:inline font-semibold">{activeLangOption.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.selectLanguage}</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          currentLanguage === lang.code
                            ? 'bg-indigo-50/70 text-indigo-700 font-bold'
                            : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <div>
                            <div className="font-semibold text-slate-900">{lang.nativeName}</div>
                            <div className="text-[10px] text-slate-400">{lang.name}</div>
                          </div>
                        </div>
                        {currentLanguage === lang.code && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ambient Background Color Changer Pill */}
            <AmbientColorSwitcherPill inline />

            {/* QR Scanner shortcut */}
            <button
              onClick={() => setActiveScreen('qr-scanner')}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Scan QR Ticket"
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Notifications ({unreadCount} new)</span>
                    <button
                      onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
                      className="text-[10px] text-indigo-600 hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-400">No new notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.linkRoute) setActiveScreen(n.linkRoute as any);
                            setShowNotifDropdown(false);
                          }}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="font-semibold text-slate-800">{n.title}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</div>
                          <div className="text-[10px] text-slate-400 mt-1">Just now</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Badge (Seamlessly toggle between Customer, Owner, Admin) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                    : currentUser.role === 'VENUE_OWNER'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-800 border-slate-300'
                }`}
                title="Switch User Role (Customer / Owner / Admin)"
              >
                {currentUser.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
                {currentUser.role === 'VENUE_OWNER' && <Building2 className="w-3.5 h-3.5" />}
                {currentUser.role === 'USER' && <User className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">
                  {currentUser.role === 'ADMIN' ? 'Admin' : currentUser.role === 'VENUE_OWNER' ? 'Owner' : 'Customer'}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Role
                  </div>
                  <button
                    onClick={() => {
                      switchRole('USER');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currentUser.role === 'USER' ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="font-semibold">Customer / Guest</div>
                        <div className="text-[10px] text-slate-400">Search, book slots, pay & QR passes</div>
                      </div>
                    </div>
                    {currentUser.role === 'USER' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('VENUE_OWNER');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currentUser.role === 'VENUE_OWNER' ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-semibold">Venue Host / Owner</div>
                        <div className="text-[10px] text-slate-400">Offline bookings & inventory calendar</div>
                      </div>
                    </div>
                    {currentUser.role === 'VENUE_OWNER' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('ADMIN');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currentUser.role === 'ADMIN' ? 'bg-purple-50 font-semibold text-purple-700' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-semibold">Platform Admin</div>
                        <div className="text-[10px] text-slate-400">Approvals, audit trails & feature flags</div>
                      </div>
                    </div>
                    {currentUser.role === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <button
              onClick={() => setActiveScreen('profile')}
              className="w-8 h-8 rounded-full ring-2 ring-slate-200 overflow-hidden shrink-0 hover:ring-indigo-400 transition-all"
              title="User Profile & Settings"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Hierarchical Location Discovery Modal */}
      <HierarchicalLocationModal
        isOpen={isHierarchicalModalOpen}
        onClose={() => setIsHierarchicalModalOpen(false)}
      />
    </header>
  );
};
