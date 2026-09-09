import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, ShieldCheck, QrCode, Calendar, MapPin, Users, Ticket } from 'lucide-react';

export const QrPassModal: React.FC = () => {
  const { qrModalBooking, setQrModalBooking } = useApp();
  const b = qrModalBooking;

  if (!b) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-5 text-white relative">
          <button
            onClick={() => setQrModalBooking(null)}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-indigo-200" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">
              Digital Entry Pass
            </span>
          </div>
          <h3 className="text-lg font-extrabold mt-1 truncate pr-8">{b.venueName}</h3>
          <p className="text-xs text-indigo-100 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-300" />
            {b.venueCity || 'Hyderabad'}
          </p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          {/* Status Badge */}
          {b.isCheckedIn ? (
            <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-extrabold rounded-full flex items-center gap-1.5 border border-sky-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              ALREADY CHECKED IN
            </span>
          ) : b.status === 'CANCELLED' ? (
            <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-extrabold rounded-full border border-rose-300">
              CANCELLED - INVALID
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full flex items-center gap-1.5 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              VALID FOR ENTRY
            </span>
          )}

          {/* SVG QR Code */}
          <div className="p-4 bg-white rounded-2xl border-2 border-slate-900/90 shadow-inner flex flex-col items-center justify-center">
            <svg
              className="w-44 h-44"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer boundary */}
              <rect width="100" height="100" fill="white" />
              {/* Top-Left Finder */}
              <rect x="10" y="10" width="26" height="26" fill="#0f172a" rx="4" />
              <rect x="14" y="14" width="18" height="18" fill="white" rx="2" />
              <rect x="18" y="18" width="10" height="10" fill="#4f46e5" rx="1.5" />
              {/* Top-Right Finder */}
              <rect x="64" y="10" width="26" height="26" fill="#0f172a" rx="4" />
              <rect x="68" y="14" width="18" height="18" fill="white" rx="2" />
              <rect x="72" y="18" width="10" height="10" fill="#4f46e5" rx="1.5" />
              {/* Bottom-Left Finder */}
              <rect x="10" y="64" width="26" height="26" fill="#0f172a" rx="4" />
              <rect x="14" y="68" width="18" height="18" fill="white" rx="2" />
              <rect x="18" y="72" width="10" height="10" fill="#4f46e5" rx="1.5" />
              {/* Data Blocks Matrix Pattern */}
              <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
              <rect x="52" y="12" width="6" height="6" fill="#0f172a" />
              <rect x="42" y="22" width="6" height="6" fill="#4f46e5" />
              <rect x="52" y="28" width="6" height="6" fill="#0f172a" />
              <rect x="12" y="42" width="6" height="6" fill="#0f172a" />
              <rect x="22" y="42" width="6" height="6" fill="#4f46e5" />
              <rect x="32" y="42" width="6" height="6" fill="#0f172a" />
              <rect x="42" y="42" width="16" height="16" fill="#0f172a" rx="3" />
              <rect x="46" y="46" width="8" height="8" fill="#4f46e5" />
              <rect x="64" y="42" width="6" height="6" fill="#0f172a" />
              <rect x="74" y="42" width="6" height="6" fill="#4f46e5" />
              <rect x="84" y="42" width="6" height="6" fill="#0f172a" />
              <rect x="42" y="64" width="6" height="6" fill="#0f172a" />
              <rect x="52" y="74" width="6" height="6" fill="#4f46e5" />
              <rect x="64" y="64" width="6" height="6" fill="#0f172a" />
              <rect x="74" y="74" width="6" height="6" fill="#0f172a" />
              <rect x="84" y="64" width="6" height="6" fill="#4f46e5" />
              <rect x="64" y="84" width="6" height="6" fill="#0f172a" />
              <rect x="84" y="84" width="6" height="6" fill="#0f172a" />
            </svg>
            <div className="font-mono text-xs font-bold text-indigo-700 tracking-wider mt-2">
              {b.qrCodeToken}
            </div>
          </div>

          {/* Details */}
          <div className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Attendee:</span>
              <span className="font-bold text-slate-900">{b.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date:</span>
              <span className="font-bold text-slate-900">{b.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Slot:</span>
              <span className="font-semibold text-slate-800">{b.slotLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Guests:</span>
              <span className="font-bold text-slate-900">{b.guestCount} Person(s)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Present this QR screen at venue entry or front desk for instant scan.
          </div>
        </div>
      </div>
    </div>
  );
};
