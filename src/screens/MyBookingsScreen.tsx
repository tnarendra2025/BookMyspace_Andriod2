import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Receipt,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';

export const MyBookingsScreen: React.FC = () => {
  const {
    bookings,
    cancelBooking,
    setInvoiceModalBooking,
    setQrModalBooking,
    setActiveScreen,
    setBookingModalVenue,
    venues,
    setRegistrationCardBooking,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Change in schedule');

  const filtered = bookings.filter((b) => {
    if (activeTab === 'UPCOMING') return b.status === 'CONFIRMED' || b.status === 'HELD';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  const handleConfirmCancel = () => {
    if (!cancellingBooking) return;
    cancelBooking(cancellingBooking.id, cancelReason);
    setCancellingBooking(null);
  };

  const handleBookAgain = (booking: Booking) => {
    const venue = venues.find((v) => v.id === booking.venueId) || venues[0];
    setBookingModalVenue(venue);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-indigo-600" />
            My Reservations & Passes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your booked function halls, turfs, digital QR tickets, and GST invoices
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {[
            { key: 'UPCOMING', label: 'Upcoming' },
            { key: 'COMPLETED', label: 'Completed' },
            { key: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 justify-between"
            >
              {/* Venue Cover and Details */}
              <div className="flex gap-3.5">
                <img
                  src={b.venueCoverUrl}
                  alt={b.venueName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {b.bookingRef}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'COMPLETED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {b.status === 'CONFIRMED'
                        ? 'Confirmed & Locked'
                        : b.status === 'COMPLETED'
                        ? 'Completed / Checked In'
                        : 'Cancelled & Refunded'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                    {b.venueName}
                  </h3>

                  <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      {b.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {b.slotLabel}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 pt-1">
                    <span>Total Paid: </span>
                    <span className="font-extrabold text-slate-900">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </span>
                    {b.isAdvancePayment && b.remainingBalanceDue && b.remainingBalanceDue > 0 && (
                      <span className="text-[11px] text-amber-600 font-semibold ml-2">
                        (Balance Due: ₹{b.remainingBalanceDue.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col justify-end gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {b.status === 'CONFIRMED' && (
                  <>
                    <button
                      onClick={() => setQrModalBooking(b)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      Show QR Pass
                    </button>
                    <button
                      onClick={() => setRegistrationCardBooking(b)}
                      className="px-3 py-1.5 border border-indigo-200 bg-indigo-50/70 text-indigo-900 hover:bg-indigo-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      title="View Government KYC & Verification Card"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      Guest KYC Card
                    </button>
                    <button
                      onClick={() => setInvoiceModalBooking(b)}
                      className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                      Tax Invoice
                    </button>
                    <button
                      onClick={() => setCancellingBooking(b)}
                      className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Cancel Slot
                    </button>
                  </>
                )}

                {b.status === 'COMPLETED' && (
                  <>
                    <button
                      onClick={() => setInvoiceModalBooking(b)}
                      className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                      View Receipt
                    </button>
                    <button
                      onClick={() => handleBookAgain(b)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Book Again
                    </button>
                  </>
                )}

                {b.status === 'CANCELLED' && (
                  <div className="space-y-1 text-right sm:text-left">
                    <div className="text-[11px] text-emerald-600 font-bold">
                      ✓ Refunded: ₹{(b.refundAmount || Math.round(b.totalAmount * 0.9)).toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => handleBookAgain(b)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      Re-Book
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            No {activeTab.toLowerCase()} bookings found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore venues, courts, and PG accommodations to lock your next date.
          </p>
          <button
            onClick={() => setActiveScreen('home')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Explore Spaces
          </button>
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              Cancel Booking Confirmation
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to cancel your slot for{' '}
              <span className="font-bold text-slate-900">{cancellingBooking.venueName}</span> on{' '}
              <span className="font-bold text-slate-900">{cancellingBooking.date}</span>?
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Total Paid:</span>
                <span className="font-semibold">₹{cancellingBooking.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Estimated Refund (90%):</span>
                <span>₹{Math.round(cancellingBooking.totalAmount * 0.9).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                Amount will be credited back via Razorpay to your source payment method within 2-4 business hours.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
              >
                <option value="Change in schedule">Change in schedule / date</option>
                <option value="Booked another space">Booked alternative venue</option>
                <option value="Event postponed">Event postponed</option>
                <option value="Other">Other reason</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingBooking(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Confirm Cancellation & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
