import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Calendar,
  DollarSign,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  AlertTriangle,
  Layers,
  ArrowRight,
  FileText,
  ListFilter,
  GraduationCap,
  BarChart3,
  Film,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import { SAMPLE_CATEGORIES } from '../data/mockData';
import { Venue } from '../types';

export const OwnerDashboardScreen: React.FC = () => {
  const {
    venues,
    bookings,
    addVenue,
    createBooking,
    selectedLocation,
    setActiveScreen,
    setRegistrationCardBooking,
  } = useApp();

  const [activeOwnerTab, setActiveOwnerTab] = useState<'LISTINGS' | 'OFFLINE_WALKIN' | 'CALENDAR' | 'GUEST_REGISTRATIONS'>('LISTINGS');

  // New Venue Modal Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('function_hall');
  const [newPrice, setNewPrice] = useState(35000);
  const [newCapacity, setNewCapacity] = useState(250);
  const [newAddress, setNewAddress] = useState('');

  // Offline walk-in booking state
  const [offlineVenueId, setOfflineVenueId] = useState(venues[0]?.id || '');
  const [offlineDate, setOfflineDate] = useState(new Date().toISOString().split('T')[0]);
  const [offlineSlotId, setOfflineSlotId] = useState('ts_rp_1');
  const [offlineCustomerName, setOfflineCustomerName] = useState('');
  const [offlineCustomerPhone, setOfflineCustomerPhone] = useState('');
  const [offlineAdvancePaid, setOfflineAdvancePaid] = useState(5000);
  const [offlineSuccessMessage, setOfflineSuccessMessage] = useState('');

  // Calendar matrix view state
  const [calendarVenueId, setCalendarVenueId] = useState(venues[0]?.id || '');
  const [calendarDate, setCalendarDate] = useState(new Date().toISOString().split('T')[0]);

  const targetCalendarVenue = venues.find((v) => v.id === calendarVenueId) || venues[0];

  const handleCreateVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const matchedCat = SAMPLE_CATEGORIES.find((c) => c.slug === newCatSlug) || SAMPLE_CATEGORIES[1];
    addVenue({
      name: newName,
      category: matchedCat,
      pricingBaseAmount: newPrice,
      capacity: newCapacity,
      addressLine1: newAddress || selectedLocation.area,
      city: selectedLocation.city,
      state: selectedLocation.state,
    });

    setShowAddModal(false);
    setNewName('');
    setNewAddress('');
  };

  const handleRecordOfflineWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineCustomerName.trim()) return;

    const targetVenue = venues.find((v) => v.id === offlineVenueId) || venues[0];
    const targetSlot = targetVenue.timeSlots[0];

    createBooking({
      venueId: targetVenue.id,
      venueName: targetVenue.name,
      venueCoverUrl: targetVenue.images[0]?.url || targetVenue.featuredImageUrl,
      date: offlineDate,
      startTime: targetSlot?.startTime || '09:00 AM',
      endTime: targetSlot?.endTime || '02:00 PM',
      slotLabel: `${targetSlot?.label || 'Walk-in Slot'} (Offline Walk-In)`,
      baseAmount: targetVenue.pricingBaseAmount,
      taxAmount: Math.round(targetVenue.pricingBaseAmount * 0.18),
      platformFee: 0,
      totalAmount: targetVenue.pricingBaseAmount * 1.18,
      userName: offlineCustomerName,
      userPhone: offlineCustomerPhone || '+91 99887 76655',
      userEmail: 'walkin.customer@bookmyspace.local',
      paymentMethod: 'Offline Cash / Direct POS',
      isAdvancePayment: true,
      advanceAmountPaid: offlineAdvancePaid,
      remainingBalanceDue: Math.max(0, targetVenue.pricingBaseAmount * 1.18 - offlineAdvancePaid),
      customerNotes: 'Walk-in customer booked via Host Dashboard directly.',
    });

    setOfflineSuccessMessage(
      `Inventory slot successfully locked! Walk-in confirmed for ${offlineCustomerName}. No online double-booking can now occur.`
    );
    setOfflineCustomerName('');
    setOfflineCustomerPhone('');

    setTimeout(() => {
      setOfflineSuccessMessage('');
    }, 5000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-5xl mx-auto">
      {/* Top Header & Role Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              Host / Partner Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600" />
            Property Management & Inventory Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your spaces, record offline walk-ins, and inspect live slot concurrency
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          List New Space
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">My Properties</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{venues.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Bookings</span>
          <div className="text-2xl font-black text-slate-900 mt-1">48</div>
          <span className="text-[11px] text-indigo-600 font-semibold">+6 this week</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Current Month Payout</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹4.82 L</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Auto-settled weekly</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Slot Utilization</span>
          <div className="text-2xl font-black text-slate-900 mt-1">84%</div>
          <span className="text-[11px] text-slate-500 font-medium">Peak Muhurtham season</span>
        </div>
      </div>

      {/* Owner Power Tools Quick Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 overflow-x-auto">
        <div className="text-xs font-black text-slate-800 whitespace-nowrap">Owner Tools:</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('admin-venue-upload')}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <Film className="w-3.5 h-3.5 text-purple-600" />
            <span>Upload Photos & Short Videos</span>
          </button>

          <button
            onClick={() => setActiveScreen('create-venue')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>5-Step Venue Wizard</span>
          </button>

          <button
            onClick={() => setActiveScreen('tax-invoice-customizer')}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>GST Tax Invoices</span>
          </button>

          <button
            onClick={() => setActiveScreen('listing-fields-config')}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guest KYC & Registration Fields</span>
          </button>

          <button
            onClick={() => setActiveScreen('institute-owner')}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academy Batches</span>
          </button>

          <button
            onClick={() => setActiveScreen('reports')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Payout Reports</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveOwnerTab('LISTINGS')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeOwnerTab === 'LISTINGS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Listed Spaces ({venues.length})
        </button>

        <button
          onClick={() => setActiveOwnerTab('GUEST_REGISTRATIONS')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeOwnerTab === 'GUEST_REGISTRATIONS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Guest KYC & Inmate Records ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('OFFLINE_WALKIN')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeOwnerTab === 'OFFLINE_WALKIN'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Offline Walk-in Booker
        </button>

        <button
          onClick={() => setActiveOwnerTab('CALENDAR')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeOwnerTab === 'CALENDAR'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Availability Calendar
        </button>
      </div>

      {/* TAB 1: LISTINGS */}
      {activeOwnerTab === 'LISTINGS' && (
        <div className="space-y-4">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-xs"
            >
              <div className="flex gap-3.5">
                <img
                  src={venue.images[0]?.url || venue.featuredImageUrl}
                  alt={venue.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {venue.category.name}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        venue.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {venue.status === 'APPROVED' ? 'LIVE & APPROVED' : 'PENDING ADMIN AUDIT'}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">{venue.name}</h3>
                  <p className="text-xs text-slate-500">{venue.addressLine1}, {venue.city}</p>
                  <div className="text-xs font-extrabold text-slate-900 mt-1">
                    Base: ₹{venue.pricingBaseAmount.toLocaleString('en-IN')} • Cap: {venue.capacity} guests
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => {
                    setOfflineVenueId(venue.id);
                    setActiveOwnerTab('OFFLINE_WALKIN');
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors"
                >
                  + Add Walk-In
                </button>
                <button
                  onClick={() => {
                    setCalendarVenueId(venue.id);
                    setActiveOwnerTab('CALENDAR');
                  }}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  View Calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: OFFLINE WALKIN BOOKER */}
      {activeOwnerTab === 'OFFLINE_WALKIN' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-2xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Record Offline Walk-In Booking
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Per BookMySpace Business Rules, entering walk-ins locks the database slot and prevents online double booking.
            </p>
          </div>

          {offlineSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{offlineSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleRecordOfflineWalkin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Property</label>
              <select
                value={offlineVenueId}
                onChange={(e) => setOfflineVenueId(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reservation Date</label>
                <input
                  type="date"
                  value={offlineDate}
                  onChange={(e) => setOfflineDate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                <select
                  value={offlineSlotId}
                  onChange={(e) => setOfflineSlotId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="ts_rp_1">Morning Slot (09:00 AM - 02:00 PM)</option>
                  <option value="ts_rp_2">Evening Slot (05:00 PM - 11:00 PM)</option>
                  <option value="ts_rp_3">Full 24-Hour Day Slot</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={offlineCustomerName}
                  onChange={(e) => setOfflineCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Phone Number</label>
                <input
                  type="tel"
                  required
                  value={offlineCustomerPhone}
                  onChange={(e) => setOfflineCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Advance Token Collected at Counter (₹)
              </label>
              <input
                type="number"
                value={offlineAdvancePaid}
                onChange={(e) => setOfflineAdvancePaid(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              Lock Slot & Confirm Offline Walk-in
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: UNIFIED AVAILABILITY CALENDAR */}
      {activeOwnerTab === 'CALENDAR' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Single Unified Slot Availability Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Real-time synchronization between online app users and offline host bookings
              </p>
            </div>

            <select
              value={calendarVenueId}
              onChange={(e) => setCalendarVenueId(e.target.value)}
              className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Calendar slots grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {targetCalendarVenue?.timeSlots.map((slot, idx) => (
              <div
                key={slot.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{slot.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      idx === 1
                        ? 'bg-indigo-100 text-indigo-800'
                        : slot.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {idx === 1 ? 'BOOKED (Online)' : slot.isAvailable ? 'AVAILABLE' : 'BLOCKED'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {slot.startTime} to {slot.endTime}
                </div>
                <div className="text-xs font-extrabold text-slate-900">
                  ₹{slot.priceAmount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GUEST KYC & INMATE REGISTRATIONS */}
      {activeOwnerTab === 'GUEST_REGISTRATIONS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
            <div>
              <h3 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Customer KYC & Inmate Dossier Registry
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Compliant with local police verification guidelines for PG Hostels, Hotels, and Function Halls. Live photos & UIDAI proofs captured during payment checkout.
              </p>
            </div>

            <button
              onClick={() => setActiveScreen('listing-fields-config')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Configure Required KYC Fields</span>
            </button>
          </div>

          {/* Records Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No guest bookings registered yet.
              </div>
            ) : (
              bookings.map((booking) => {
                const reg = booking.customerRegistration;
                const venue = venues.find((v) => v.id === booking.venueId);

                return (
                  <div
                    key={booking.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {reg?.livePhotoUrl ? (
                          <img
                            src={reg.livePhotoUrl}
                            alt={booking.userName}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-black text-base flex items-center justify-center shrink-0">
                            {booking.userName.charAt(0)}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{booking.userName}</h4>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              VERIFIED
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-medium">{booking.userPhone}</div>
                          <div className="text-[11px] text-slate-400">{booking.userEmail}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-slate-600">{booking.bookingRef}</div>
                        <div className="text-xs font-extrabold text-emerald-700 mt-0.5">
                          ₹{booking.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Venue & Booking Scope */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">{venue?.name || booking.venueName}</span>
                        <div className="text-[10px] text-slate-400">
                          {booking.slotLabel} • {booking.date}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {venue?.category?.name || 'Space Stay'}
                      </span>
                    </div>

                    {/* Dynamic KYC Details Snippet */}
                    <div className="space-y-1 text-xs">
                      {reg?.idProofNumber && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">ID / Aadhaar Proof:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {reg.idProofType || 'Aadhaar'}: {reg.idProofNumber}
                          </span>
                        </div>
                      )}

                      {reg?.address && (
                        <div className="flex items-start justify-between text-[11px] gap-2">
                          <span className="text-slate-500 shrink-0">Permanent Address:</span>
                          <span className="text-slate-700 text-right truncate max-w-[240px]">
                            {reg.address}
                          </span>
                        </div>
                      )}

                      {reg?.guardianPhone && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Emergency / Guardian:</span>
                          <span className="font-semibold text-slate-700">
                            {reg.guardianName ? `${reg.guardianName} (` : ''}
                            {reg.guardianPhone}
                            {reg.guardianName ? ')' : ''}
                          </span>
                        </div>
                      )}

                      {reg?.stayDurationMonths && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Duration of Stay:</span>
                          <span className="font-semibold text-slate-700">{reg.stayDurationMonths}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Police Verification Consent Given</span>
                      </div>

                      <button
                        onClick={() => setRegistrationCardBooking(booking)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Guest KYC Card</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Add New Space Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">List New Space on BookMySpace</h3>
            <form onSubmit={handleCreateVenue} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Royal Crystal Banquet Hall"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {SAMPLE_CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(parseInt(e.target.value) || 100)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Address / Street</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="e.g. Jubilee Hills Road 36"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Submit for Admin Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
