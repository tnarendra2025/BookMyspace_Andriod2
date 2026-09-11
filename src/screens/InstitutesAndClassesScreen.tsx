import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  GraduationCap,
  Search,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Star,
  Award,
  ArrowRight,
  X,
  Phone,
  BookOpen,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Building2,
  AlertCircle,
  Bell,
  Check,
} from 'lucide-react';
import { InstituteClass, ConfirmedClassBooking } from '../types';
import { SAMPLE_INSTITUTE_CLASSES } from '../data/mockData';

export const InstitutesAndClassesScreen: React.FC = () => {
  const { setActiveScreen, selectedLocation } = useApp();
  const { t } = useLanguage();

  const [classesList, setClassesList] = useState<InstituteClass[]>(SAMPLE_INSTITUTE_CLASSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [showOngoingToday, setShowOngoingToday] = useState(false);
  const [showWaitlistOnly, setShowWaitlistOnly] = useState(false);

  // Modals
  const [bookingClassTarget, setBookingClassTarget] = useState<InstituteClass | null>(null);
  const [facultyModalTarget, setFacultyModalTarget] = useState<InstituteClass | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedClassBooking | null>(null);

  // Booking Form State
  const [studentName, setStudentName] = useState('T. Narendra Reddy');
  const [studentPhone, setStudentPhone] = useState('+91 98490 12345');
  const [isDemoTrial, setIsDemoTrial] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = ['All', 'Sports & Fitness', 'Academics', 'Tech & Coding', 'Dance', 'Music & Arts'];
  const deliveryModes = ['All', 'OFFLINE', 'ONLINE', 'HYBRID'];

  const filteredClasses = useMemo(() => {
    return classesList.filter((cls) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.instituteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.facultyName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || cls.category === selectedCategory;
      const matchesMode = selectedMode === 'All' || cls.deliveryMode === selectedMode;
      const matchesOngoing = !showOngoingToday || cls.isTodayOngoing;
      const matchesWaitlist = !showWaitlistOnly || cls.availableSeats <= 4;

      return matchesSearch && matchesCat && matchesMode && matchesOngoing && matchesWaitlist;
    });
  }, [classesList, searchQuery, selectedCategory, selectedMode, showOngoingToday, showWaitlistOnly]);

  const handleConfirmEnrollment = () => {
    if (!bookingClassTarget) return;
    setIsProcessing(true);

    setTimeout(() => {
      const newBooking: ConfirmedClassBooking = {
        id: `BMS-CLS-${Math.floor(100000 + Math.random() * 900000)}`,
        studentName,
        studentPhone,
        className: bookingClassTarget.title,
        instituteName: bookingClassTarget.instituteName,
        timing: bookingClassTarget.batchTiming,
        amount: isDemoTrial ? 0 : bookingClassTarget.monthlyFee,
        status: isDemoTrial ? 'TRIAL_BOOKED' : 'CONFIRMED',
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      };

      // Decrement available seats
      setClassesList((prev) =>
        prev.map((c) => (c.id === bookingClassTarget.id ? { ...c, availableSeats: Math.max(0, c.availableSeats - 1) } : c))
      );

      setIsProcessing(false);
      setBookingClassTarget(null);
      setConfirmedBooking(newBooking);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-7xl mx-auto">
      {/* Top Banner with Quick Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-sky-400/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-sky-200">
            <GraduationCap className="w-4 h-4 text-sky-300" />
            <span>Coaching Centers • Sports Academies • Tuition Hubs</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Discover Verified Academies & Batch Admissions
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            Reserve certified batches, book 1-on-1 trial classes, and verify faculty credentials directly with institute owners in {selectedLocation.city}.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveScreen('institute-owner')}
              className="px-4 py-2 bg-white text-indigo-900 font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-sky-50 transition-all shadow-md active:scale-95"
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Institute Owner Portal</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] text-sky-200 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Certified Faculty & Real-Time Seat Availability</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batches (e.g., Badminton, UPSC, AI Coding, Dance)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {deliveryModes.map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                  selectedMode === mode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {mode === 'All' ? 'All Modes' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Filter Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOngoingToday}
                onChange={(e) => setShowOngoingToday(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-slate-700">Today Ongoing Classes</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showWaitlistOnly}
                onChange={(e) => setShowWaitlistOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="font-semibold text-slate-700">Almost Full (Waitlist alert)</span>
            </label>
          </div>

          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredClasses.length}</strong> verified batches
          </span>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Image & Badges */}
            <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white">
                  {item.category}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white backdrop-blur-md ${
                  item.deliveryMode === 'ONLINE' ? 'bg-sky-600/80' : item.deliveryMode === 'HYBRID' ? 'bg-purple-600/80' : 'bg-emerald-600/80'
                }`}>
                  {item.deliveryMode}
                </span>
              </div>

              {item.isTodayOngoing && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>ONGOING TODAY</span>
                </div>
              )}

              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.rating}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-indigo-600 tracking-wide uppercase block truncate">
                  {item.instituteName}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{item.subject}</p>

                {/* Batch timing and location */}
                <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.batchTiming}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                {/* Faculty Pill */}
                <div
                  onClick={() => setFacultyModalTarget(item)}
                  className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50/60 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {item.facultyName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-none">{item.facultyName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.facultyExperience}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-0.5">
                    Credentials <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Pricing & Booking Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Monthly Fee</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-900">₹{item.monthlyFee.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-500">/mo</span>
                  </div>
                  <div className="text-[10px] font-bold mt-0.5">
                    {item.availableSeats <= 4 ? (
                      <span className="text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Only {item.availableSeats} seats left!
                      </span>
                    ) : (
                      <span className="text-emerald-600">{item.availableSeats} of {item.totalSeats} seats open</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setBookingClassTarget(item)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <span>Enroll Batch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Faculty Credentials Modal */}
      {facultyModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                  {facultyModalTarget.facultyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{facultyModalTarget.facultyName}</h3>
                  <span className="text-xs text-indigo-600 font-bold">{facultyModalTarget.facultyExperience}</span>
                </div>
              </div>
              <button
                onClick={() => setFacultyModalTarget(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Bio & Achievements</span>
                <p className="mt-1 text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {facultyModalTarget.facultyBio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-bold text-indigo-600 block">Institute Affiliation</span>
                  <span className="font-bold text-slate-900 text-xs block truncate mt-0.5">{facultyModalTarget.instituteName}</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-700 block">Batch Timing</span>
                  <span className="font-bold text-slate-900 text-xs block truncate mt-0.5">{facultyModalTarget.batchTiming}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setFacultyModalTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = facultyModalTarget;
                  setFacultyModalTarget(null);
                  setBookingClassTarget(target);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                Enroll with this Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment & One-Tap Demo Booking Modal */}
      {bookingClassTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Instant Admission Window</span>
                <h3 className="text-base font-black text-slate-900 truncate max-w-sm">{bookingClassTarget.title}</h3>
              </div>
              <button
                onClick={() => setBookingClassTarget(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Option Selector: Full Enrollment vs Free Trial */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsDemoTrial(false)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    !isDemoTrial
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-black text-slate-900 block">Monthly Admission</span>
                  <span className="text-base font-black text-indigo-700 block mt-1">₹{bookingClassTarget.monthlyFee}</span>
                  <span className="text-[10px] text-slate-500">Lock permanent seat in batch</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDemoTrial(true)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isDemoTrial
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-emerald-700 font-black text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Free Trial Pass</span>
                  </div>
                  <span className="text-base font-black text-emerald-700 block mt-1">₹0 FREE</span>
                  <span className="text-[10px] text-slate-500">1-Class trial demo session</span>
                </button>
              </div>

              {/* Student Details Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student / Candidate Full Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parent / Contact Phone Number</label>
                  <input
                    type="tel"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Batch Slot:</span>
                    <strong className="text-slate-800">{bookingClassTarget.batchTiming}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Institute Center:</span>
                    <strong className="text-slate-800">{bookingClassTarget.instituteName}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setBookingClassTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={handleConfirmEnrollment}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              >
                {isProcessing ? 'Locking Batch Seat...' : isDemoTrial ? 'Confirm Free Trial' : `Pay ₹${bookingClassTarget.monthlyFee} & Enroll`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation Receipt */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Admission Reserved</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">{confirmedBooking.className}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{confirmedBooking.instituteName}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Ref:</span>
                <span className="font-mono font-bold text-slate-900">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Timing:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.timing}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pass Type:</span>
                <span className="font-bold text-emerald-600">{confirmedBooking.status}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-black text-slate-900">₹{confirmedBooking.amount}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
            >
              Done & View Batches
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
