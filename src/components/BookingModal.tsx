import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Tag,
  AlertCircle,
  Sparkles,
  Receipt,
  QrCode,
  ArrowRight,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TimeSlot, VenuePackage, VenueAddon } from '../types';

export const BookingModal: React.FC = () => {
  const {
    bookingModalVenue,
    setBookingModalVenue,
    createBooking,
    setInvoiceModalBooking,
    setQrModalBooking,
    setActiveScreen,
  } = useApp();

  const venue = bookingModalVenue;

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedPackage, setSelectedPackage] = useState<VenuePackage | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Razorpay UPI');
  const [isAdvanceSplit, setIsAdvanceSplit] = useState<boolean>(false);
  const [customerNotes, setCustomerNotes] = useState<string>('');

  // Step state (1: Select Details, 2: Review & Price Quote, 3: Processing, 4: Success)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [confirmedBookingResult, setConfirmedBookingResult] = useState<any>(null);

  // Hold Timer (10-minute hold countdown simulation)
  const [holdSecondsLeft, setHoldSecondsLeft] = useState<number>(600); // 10 minutes

  // Default values initialization
  useEffect(() => {
    if (venue) {
      // Default to tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);

      // Default slot
      const firstAvail = venue.timeSlots.find((s) => s.isAvailable) || venue.timeSlots[0] || null;
      setSelectedSlot(firstAvail);

      // Default package
      if (venue.packages.length > 0) {
        setSelectedPackage(venue.packages[0]);
      } else {
        setSelectedPackage(null);
      }

      setGuestCount(venue.minGuests || 1);
      setSelectedAddonIds([]);
      setCouponCode('');
      setCouponDiscount(0);
      setCouponMessage('');
      setStep(1);
      setHoldSecondsLeft(600);
      setConfirmedBookingResult(null);
    }
  }, [venue]);

  // Countdown timer for step 2 (Hold active)
  useEffect(() => {
    let interval: any;
    if (step === 2 && holdSecondsLeft > 0) {
      interval = setInterval(() => {
        setHoldSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, holdSecondsLeft]);

  if (!venue) return null;

  // Price Calculation Engine (Strictly Authoritative)
  const slotBase = selectedSlot?.priceAmount || venue.pricingBaseAmount;
  const packagePrice = selectedPackage?.priceAmount || 0;
  const addonsTotal = selectedAddonIds.reduce((sum, id) => {
    const add = venue.addons.find((a) => a.id === id);
    return sum + (add?.priceAmount || 0);
  }, 0);

  const subtotal = Math.max(slotBase, packagePrice) + addonsTotal;
  const taxAmount = Math.round(subtotal * (venue.taxRate / 100));
  const platformFee = subtotal > 50000 ? 999 : subtotal > 5000 ? 199 : 49;
  const grossTotal = subtotal + taxAmount + platformFee;
  const netTotal = Math.max(0, grossTotal - couponDiscount);

  // Advance calculation (25% token)
  const advanceAmount = Math.round(netTotal * 0.25);
  const remainingDue = netTotal - advanceAmount;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'BMS2026' || code === 'WELCOME') {
      const discount = subtotal > 10000 ? 2500 : Math.round(subtotal * 0.15);
      setCouponDiscount(discount);
      setCouponMessage(`Promo code ${code} applied! You saved ₹${discount.toLocaleString('en-IN')}`);
    } else if (code === 'BMSWEDDING20' && venue.pricingBaseAmount > 50000) {
      const discount = 15000;
      setCouponDiscount(discount);
      setCouponMessage(`Wedding Special applied! ₹15,000 off.`);
    } else {
      setCouponDiscount(0);
      setCouponMessage('Invalid or expired promo code. Try "BMS2026".');
    }
  };

  const handleProceedToHold = () => {
    if (!selectedSlot) return;
    setStep(2);
    setHoldSecondsLeft(600);
  };

  const handleExecutePayment = () => {
    setStep(3); // Processing payment simulation

    setTimeout(() => {
      const newBooking = createBooking({
        venueId: venue.id,
        venueName: venue.name,
        venueCoverUrl: venue.images[0]?.url || venue.featuredImageUrl || '',
        venueCity: venue.city,
        date: selectedDate,
        startTime: selectedSlot?.startTime || '07:00 AM',
        endTime: selectedSlot?.endTime || '08:00 AM',
        slotLabel: selectedSlot?.label || 'Standard Slot',
        baseAmount: subtotal,
        taxAmount,
        platformFee,
        discountAmount: couponDiscount,
        totalAmount: isAdvanceSplit ? advanceAmount : netTotal,
        guestCount,
        packageName: selectedPackage?.name,
        paymentMethod: `${paymentMethod} (Razorpay Test Mode)`,
        isAdvancePayment: isAdvanceSplit,
        advanceAmountPaid: isAdvanceSplit ? advanceAmount : netTotal,
        remainingBalanceDue: isAdvanceSplit ? remainingDue : 0,
        customerNotes,
      });

      setConfirmedBookingResult(newBooking);
      setStep(4);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 1400);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                {venue.category.name}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{venue.city}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-md mt-0.5">
              {venue.name}
            </h2>
          </div>
          <button
            onClick={() => setBookingModalVenue(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Date, Slot, Package, Addons */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Date & Guest Count Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    Number of Guests / Players
                  </label>
                  <input
                    type="number"
                    min={venue.minGuests || 1}
                    max={venue.maxGuests || 2000}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Select Time Slot
                  </span>
                  <span className="text-[11px] font-normal text-emerald-600">● Live Inventory Check</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {venue.timeSlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                          !slot.isAvailable
                            ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 font-medium ring-1 ring-indigo-500'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{slot.label}</span>
                          {!slot.isAvailable && (
                            <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
                              Booked
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                          <span>{slot.startTime} - {slot.endTime}</span>
                          <span className="font-bold text-indigo-600">₹{slot.priceAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Packages (if any) */}
              {venue.packages.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Select Curated Package (Optional)
                  </label>
                  <div className="space-y-2">
                    {venue.packages.map((pkg) => {
                      const isSelected = selectedPackage?.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(isSelected ? null : pkg)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-50/70 border-amber-500 text-amber-950 ring-1 ring-amber-400'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span>{pkg.name}</span>
                            <span className="text-amber-700">₹{pkg.priceAmount.toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">{pkg.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Optional Addons */}
              {venue.addons.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Add-on Services & Equipment
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {venue.addons.map((add) => {
                      const isChecked = selectedAddonIds.includes(add.id);
                      return (
                        <label
                          key={add.id}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isChecked ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-medium' : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAddonIds([...selectedAddonIds, add.id]);
                              } else {
                                setSelectedAddonIds(selectedAddonIds.filter((id) => id !== add.id));
                              }
                            }}
                            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <div className="font-semibold">{add.name}</div>
                            <div className="text-[10px] text-slate-500">₹{add.priceAmount.toLocaleString('en-IN')}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customer Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Requests or Instructions
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Dietary catering requirements, extra chairs, VIP valet instructions..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Review Quote, Temporary Hold & Payment Selection */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Concurrency Hold Banner */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                  <div>
                    <span className="font-bold">Temporary Slot Hold Active:</span> Slot locked for you.
                  </div>
                </div>
                <div className="font-mono font-bold text-sm bg-amber-200/70 px-2.5 py-1 rounded-lg text-amber-900">
                  {formatTimer(holdSecondsLeft)}
                </div>
              </div>

              {/* Itemized Price Quote Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>Authoritative Price Breakdown</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">Verified by Server</span>
                </div>

                <div className="flex justify-between">
                  <span>Slot / Base Rental ({selectedSlot?.label}):</span>
                  <span className="font-medium text-slate-900">₹{slotBase.toLocaleString('en-IN')}</span>
                </div>

                {selectedPackage && (
                  <div className="flex justify-between">
                    <span>Package ({selectedPackage.name}):</span>
                    <span className="font-medium text-slate-900">₹{selectedPackage.priceAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {addonsTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Selected Add-ons ({selectedAddonIds.length}):</span>
                    <span className="font-medium text-slate-900">₹{addonsTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Applicable GST (CGST 9% + SGST 9%):</span>
                  <span className="font-medium text-slate-900">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Convenience & Safety Fee:</span>
                  <span className="font-medium text-slate-900">₹{platformFee}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Promo Discount:</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-2.5 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Amount Due:</span>
                  <span className="text-indigo-600 text-base">₹{netTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Promo Coupon Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon (e.g. BMS2026)"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 uppercase font-semibold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <div className={`text-[11px] font-medium ${couponDiscount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {couponMessage}
                </div>
              )}

              {/* Split Advance Option for Large Bookings */}
              {netTotal >= 20000 && (
                <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl">
                  <label className="flex items-start gap-2 text-xs text-indigo-950 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAdvanceSplit}
                      onChange={(e) => setIsAdvanceSplit(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold">Pay 25% Token Advance Now (₹{advanceAmount.toLocaleString('en-IN')})</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Pay ₹{advanceAmount.toLocaleString('en-IN')} today to confirm hold; balance ₹{remainingDue.toLocaleString('en-IN')} payable directly at the venue on arrival.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Payment Gateway
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Razorpay UPI', label: 'UPI / QR (GooglePay, PhonePe)' },
                    { id: 'Razorpay Cards', label: 'Credit / Debit Card' },
                    { id: 'Razorpay NetBanking', label: 'Net Banking' },
                    { id: 'Pay at Venue', label: 'Pay at Check-In (Offline)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all ${
                        paymentMethod === m.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Razorpay Sandbox 256-bit encrypted checkout with test authorization.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {step === 3 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Securing Your Reservation...</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verifying atomic inventory lock & generating digital check-in token
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success Confirmed */}
          {step === 4 && confirmedBookingResult && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full">
                  Booking Confirmed
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  You're all set for {confirmedBookingResult.venueName}!
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Ref ID: <span className="font-bold text-indigo-700">{confirmedBookingResult.bookingRef}</span>
                </p>
              </div>

              <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-bold text-slate-900">
                    {confirmedBookingResult.date} ({confirmedBookingResult.slotLabel})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Paid:</span>
                  <span className="font-bold text-emerald-700">
                    ₹{confirmedBookingResult.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check-in QR Token:</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {confirmedBookingResult.qrCodeToken}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setInvoiceModalBooking(confirmedBookingResult);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4 text-indigo-600" />
                  View Tax Invoice
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQrModalBooking(confirmedBookingResult);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
                >
                  <QrCode className="w-4 h-4" />
                  Show QR Pass
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          {step === 1 && (
            <>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">ESTIMATED TOTAL</span>
                <span className="text-base font-extrabold text-slate-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                disabled={!selectedSlot}
                onClick={handleProceedToHold}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
              >
                Continue to Hold & Pay
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleExecutePayment}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Pay ₹{(isAdvanceSplit ? advanceAmount : netTotal).toLocaleString('en-IN')} & Confirm
              </button>
            </>
          )}

          {step === 4 && (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setBookingModalVenue(null);
                  setActiveScreen('bookings');
                }}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Go to My Bookings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
