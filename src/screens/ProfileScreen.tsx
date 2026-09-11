import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
  Gift,
  Copy,
  Check,
  Share2,
  Ticket,
  Heart,
  FileText,
  HelpCircle,
  Settings,
  Flame,
  Globe,
  RefreshCw,
  Sliders,
  ExternalLink,
  ChevronRight,
  LogOut,
  CreditCard,
  Bell,
  Smartphone,
  Palette,
  Cloud,
  Bot,
  UserPlus,
  PlusCircle,
  ListFilter,
} from 'lucide-react';
import { UserRole } from '../types';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    switchRole,
    setActiveScreen,
    bookings,
    venues,
    featureToggles,
    toggleFeature,
  } = useApp();

  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  const [copiedReferral, setCopiedReferral] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showTestModeBanner, setShowTestModeBanner] = useState(true);
  const [testModeEnabled, setTestModeEnabled] = useState(true);

  const referralCode = 'BMS-NAREN-2026';
  const walletBalance = 2500;
  const activeBookingsCount = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const savedCount = venues.filter((v) => v.isSaved).length;

  const testAccounts = [
    {
      name: 'Narendra T (Customer)',
      email: 'tnarendra2025@gmail.com',
      phone: '+91 98765 43210',
      role: 'USER' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      description: 'Customer browsing & booking function halls, turfs, and rooms.',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      name: 'Rajesh Sharma (Venue Owner)',
      email: 'rajesh.venues@bookmyspace.in',
      phone: '+91 98480 12345',
      role: 'VENUE_OWNER' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      description: 'Host of Grand Royal Palace & Sri Srinivasa Convention Center.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      name: 'Super Administrator',
      email: 'admin@bookmyspace.in',
      phone: '+91 94400 99999',
      role: 'ADMIN' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      description: 'Platform auditor managing categories, live approvals & feature flags.',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Use my BookMySpace referral code ${referralCode} to get ₹500 instant wallet credits on marriage halls, sports turfs, and PG rooms booking! https://bookmyspace.in`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Banner for Test Mode */}
      {showTestModeBanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">BookMySpace Full Diagnostic & Multi-Role Mode Active</span>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Switch seamlessly between Customer, Venue Host, and Super Admin test accounts with full access to live databases, inventory holds, and instant audit trails.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTestModeBanner(false)}
            className="text-amber-700 hover:text-amber-900 font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  currentUser.avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'
                }
                alt={currentUser.fullName}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md"
              />
              <span className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-emerald-500 text-white rounded-xl shadow-xs">
                <Check className="w-3 h-3" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentUser.fullName}
                </h1>
                <span
                  className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : currentUser.role === 'VENUE_OWNER'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}
                >
                  {currentUser.role === 'ADMIN'
                    ? 'Super Admin'
                    : currentUser.role === 'VENUE_OWNER'
                    ? 'Venue Host / Owner'
                    : 'Customer / Guest'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{currentUser.email} • {currentUser.phone || '+91 98765 43210'}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                  <Ticket className="w-3.5 h-3.5 text-indigo-600" />
                  {activeBookingsCount} Active Bookings
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  {savedCount} Saved Spaces
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveScreen('bookings')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>View My Bookings</span>
            </button>
            <button
              onClick={() => setActiveScreen('saved')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold rounded-xl transition-all"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Saved Spaces</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wallet & Referral Card (From ReferralScreen.kt) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 rounded-xl">
                <CreditCard className="w-5 h-5 text-indigo-300" />
              </div>
              <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">BookMySpace Wallet</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Active & Usable
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black tracking-tight">₹{walletBalance.toLocaleString('en-IN')}</div>
            <p className="text-xs text-indigo-200/80 mt-1">
              Usable on instant slot holds, venue discounts & sports turf bookings.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-indigo-200">100% Instant Redemption at Checkout</span>
            <button
              onClick={() => setActiveScreen('home')}
              className="text-amber-300 hover:underline font-bold flex items-center gap-1"
            >
              Book Spaces Now →
            </button>
          </div>
        </div>

        {/* Refer & Earn Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200 rounded-3xl p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">Refer & Earn ₹500</span>
            </div>
            <span className="text-[10px] font-extrabold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
              Unlimited
            </span>
          </div>
          <p className="text-xs text-slate-700 mt-3">
            Share your unique code. Both you and your friend get <strong>₹500 in wallet credits</strong> on their first completed celebration, turf or room booking!
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-900 tracking-wider flex items-center justify-between">
              <span>{referralCode}</span>
              <button
                onClick={handleCopyReferral}
                className="text-slate-500 hover:text-indigo-600 transition-colors p-1"
                title="Copy Code"
              >
                {copiedReferral ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Switch Test Accounts (From DebugMenuScreen.dart & ProfileSettingsAuthLegalScreens.kt) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Switch Test Profile & Role</h2>
              <p className="text-[11px] text-slate-500">Test the application from multiple stakeholder viewpoints</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {testAccounts.map((acc) => {
            const isSelected = currentUser.role === acc.role;
            return (
              <div
                key={acc.role}
                onClick={() => switchRole(acc.role)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={acc.avatar} alt={acc.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{acc.name}</div>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border inline-block mt-0.5 ${acc.badgeColor}`}>
                      {acc.role}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 mt-2.5 line-clamp-2">{acc.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Developer & Diagnostics Suite (From DebugMenuScreen.dart) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Developer & Feature Flags</h2>
              <p className="text-[11px] text-slate-500">Enable or toggle core platform capabilities in real time</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {featureToggles.map((flag) => (
            <div
              key={flag.key}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white transition-all"
            >
              <div className="pr-3">
                <div className="text-xs font-bold text-slate-900">{flag.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{flag.description}</div>
              </div>
              <button
                onClick={() => toggleFeature(flag.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  flag.isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    flag.isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Quick Shortcuts & Stakeholder Links */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 mb-2">Management & Stakeholder Hubs</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Venue Host Portal */}
          <button
            onClick={() => setActiveScreen('owner')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Venue Host Portal</span>
                  {currentUser.role !== 'VENUE_OWNER' && currentUser.role !== 'ADMIN' && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Owner Role Req.</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-600">Offline walk-in entries, slot calendar & earnings</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-700" />
          </button>

          {/* Daily & Weekly Reports */}
          <button
            onClick={() => setActiveScreen('reports')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-xl">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Daily & Weekly Reports</span>
                  {currentUser.role !== 'VENUE_OWNER' && currentUser.role !== 'ADMIN' && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Owner Role Req.</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-600">Revenue analytics, occupancy & GST invoices</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-700" />
          </button>

          {/* Admin Audit Trail */}
          <button
            onClick={() => setActiveScreen('admin-audit')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 text-white rounded-xl">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Admin Audit Trail</span>
                  {currentUser.role !== 'ADMIN' && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-200 text-purple-900">Admin Only</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-600">Review approvals, slot cancellations & logs</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-700" />
          </button>

          <button
            onClick={() => setActiveScreen('support')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/50 hover:bg-sky-50 border border-sky-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-600 text-white rounded-xl">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Help & 24/7 Support</div>
                <div className="text-[10px] text-slate-600">AI Concierge, WhatsApp helpline & refund FAQs</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-sky-700" />
          </button>

          {/* New Modules ported from Android source */}
          <button
            onClick={() => setActiveScreen('institutes')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-600 text-white rounded-xl">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Institutes & Coaching Classes</div>
                <div className="text-[10px] text-slate-600">Browse batches, instructors & enrollments</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-700" />
          </button>

          <button
            onClick={() => setActiveScreen('create-venue')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <PlusCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">List Your Venue / Hall</div>
                <div className="text-[10px] text-slate-600">5-step venue creation wizard & slot setup</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-700" />
          </button>

          <button
            onClick={() => setActiveScreen('referrals')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 hover:bg-rose-50 border border-rose-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-600 text-white rounded-xl">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Refer & Earn Rewards</div>
                <div className="text-[10px] text-slate-600">Invite friends, earn ₹500 wallet coins</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-700" />
          </button>

          <button
            onClick={() => setActiveScreen('theme-customizer')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 text-white rounded-xl">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Brand Theme & Color Engine</div>
                <div className="text-[10px] text-slate-600">Brand accents, corner radiuses & WCAG mode</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-700" />
          </button>

          <button
            onClick={() => setActiveScreen('mcp-integrations')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 text-white rounded-xl">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">MCP & External Integrations</div>
                <div className="text-[10px] text-slate-600">Claude/Cursor MCP tools, widgets & APIs</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>

          <button
            onClick={() => setActiveScreen('payment-health')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/50 hover:bg-teal-50 border border-teal-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600 text-white rounded-xl">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Payment Health & Concurrency</div>
                <div className="text-[10px] text-slate-600">Gateway uptime, self-healing & refund ledger</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-teal-700" />
          </button>

          <button
            onClick={() => setActiveScreen('cloud-sync')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/50 hover:bg-sky-50 border border-sky-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-600 text-white rounded-xl">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Cloud Firestore Dual Sync</div>
                <div className="text-[10px] text-slate-600">Database synchronization & JSON backups</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-sky-700" />
          </button>

          <button
            onClick={() => setActiveScreen('unified-registration')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-xl">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Unified Partner Registration</div>
                <div className="text-[10px] text-slate-600">Multi-category onboarding & compliance fields</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-700" />
          </button>

          {/* Admin Platform Settings */}
          <button
            onClick={() => setActiveScreen('admin-settings')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 text-white rounded-xl">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Admin Platform Settings</div>
                <div className="text-[10px] text-slate-600">Platform economics, API secrets & maintenance</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-700" />
          </button>

          {/* Admin Live Element CMS Editor */}
          <button
            onClick={() => setActiveScreen('admin-element-editor')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-violet-50/50 hover:bg-violet-50 border border-violet-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-600 text-white rounded-xl">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Live Element & CMS Master Editor</div>
                <div className="text-[10px] text-slate-600">Instant on-device text, labels & CTA overrides</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-violet-700" />
          </button>

          {/* Plug & Play Features Matrix */}
          <button
            onClick={() => setActiveScreen('admin-plug-play')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-fuchsia-50/50 hover:bg-fuchsia-50 border border-fuchsia-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fuchsia-600 text-white rounded-xl">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Plug & Play Feature Hub</div>
                <div className="text-[10px] text-slate-600">Self-healing microservices & concurrency toggles</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-fuchsia-700" />
          </button>

          {/* GST Tax Invoice Customizer */}
          <button
            onClick={() => setActiveScreen('tax-invoice-customizer')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">GST Tax Invoice Customizer</div>
                <div className="text-[10px] text-slate-600">HSN/SAC codes, GSTIN split & PDF print preview</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-700" />
          </button>

          {/* Category Listing Fields Config */}
          <button
            onClick={() => setActiveScreen('listing-fields-config')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/50 hover:bg-sky-50 border border-sky-200 text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-600 text-white rounded-xl">
                <ListFilter className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Category Listing Fields</div>
                <div className="text-[10px] text-slate-600">NOC fields, mat specs & custom dynamic forms</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-sky-700" />
          </button>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{t.selectLanguage}</div>
            <div className="text-[10px] text-slate-500">Currently browsing in {languages.find((l) => l.code === currentLanguage)?.name}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-colors ${
                currentLanguage === l.code
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {l.flag} {l.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* Legal & Version Footnote */}
      <div className="text-center text-xs text-slate-400 space-y-1 pt-2">
        <div>BookMySpace v2.4.0 • Enterprise Cloud Architecture</div>
        <div className="flex items-center justify-center gap-3 text-[11px] text-indigo-600">
          <button onClick={() => setShowTermsModal(true)} className="hover:underline">
            Cancellation & Refund Terms
          </button>
          <span>•</span>
          <button onClick={() => setShowTermsModal(true)} className="hover:underline">
            Host Listing Guidelines
          </button>
          <span>•</span>
          <button onClick={() => setShowTermsModal(true)} className="hover:underline">
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">BookMySpace Booking Terms & Refund Policy</h3>
            <div className="text-xs text-slate-600 space-y-2 max-h-80 overflow-y-auto pr-2">
              <p>
                <strong>1. Atomic 10-Minute Hold:</strong> Once you tap 'Book Slot', the venue or turf slot is temporarily locked for 10 minutes to prevent double-booking while you complete checkout.
              </p>
              <p>
                <strong>2. Cancellation & Refunds:</strong> Confirmed reservations can be cancelled up to 2 hours prior to the slot start time directly from 'My Bookings'. Eligible refunds (90%) are credited back via original UPI or card within 2-3 business days.
              </p>
              <p>
                <strong>3. GST Invoices:</strong> Business and corporate invoices are generated automatically with valid GSTIN and HSN codes, downloadable from the booking detail screen.
              </p>
              <p>
                <strong>4. On-Site Check-in:</strong> Present the digital QR Pass generated upon confirmation at the venue front desk for instant contactless check-in.
              </p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
