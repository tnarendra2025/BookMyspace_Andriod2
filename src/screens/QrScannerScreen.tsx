import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  QrCode,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Search,
  ScanLine,
  ArrowRight,
} from 'lucide-react';

export const QrScannerScreen: React.FC = () => {
  const { checkInBooking, bookings } = useApp();

  const [inputToken, setInputToken] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    booking?: any;
  } | null>(null);

  const handleVerify = (tokenToVerify?: string) => {
    const code = (tokenToVerify || inputToken).trim();
    if (!code) return;

    const result = checkInBooking(code);
    setScanResult(result);
  };

  const sampleTokens = bookings.map((b) => ({
    token: b.qrCodeToken,
    guest: b.userName,
    venue: b.venueName,
    status: b.isCheckedIn ? 'Checked-In' : b.status,
  }));

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-2xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <QrCode className="w-6 h-6 text-indigo-600" />
          Attendee QR Pass Check-In Scanner
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Scan or enter attendee passes at venue entrance to validate admission and prevent duplicate entries
        </p>
      </div>

      {/* Simulated Scanner Viewport */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white text-center flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        <div className="relative w-60 h-60 border-2 border-indigo-400 rounded-3xl p-4 flex items-center justify-center bg-slate-950/40">
          {/* Laser Scanner Bar */}
          <div className="absolute left-2 right-2 h-1 bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-bounce"></div>
          <QrCode className="w-24 h-24 text-slate-700" />

          {/* Corner Guides */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-indigo-400"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-indigo-400"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-indigo-400"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-indigo-400"></div>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Center QR code inside frame, or type ticket reference below
        </p>
      </div>

      {/* Manual Input and Verify */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-700">
          Enter Pass Token or Booking Ref
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleVerify();
              }}
              placeholder="e.g. BMS-PASS-98124 or BMS-2026-98124"
              className="w-full text-xs font-mono font-bold uppercase p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
            />
          </div>
          <button
            onClick={() => handleVerify()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            Verify Pass
          </button>
        </div>
      </div>

      {/* Verification Result Message Card */}
      {scanResult && (
        <div
          className={`p-5 rounded-2xl border text-xs animate-in zoom-in-95 duration-150 space-y-3 ${
            scanResult.success
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/90 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {scanResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600" />
            )}
            <span>{scanResult.message}</span>
          </div>

          {scanResult.booking && (
            <div className="bg-white/90 p-4 rounded-xl border border-black/5 text-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Attendee Name:</span>
                <span className="font-bold">{scanResult.booking.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Venue:</span>
                <span className="font-bold">{scanResult.booking.venueName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Slot & Date:</span>
                <span className="font-medium">
                  {scanResult.booking.date} ({scanResult.booking.slotLabel})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Admit Count:</span>
                <span className="font-bold text-indigo-700">
                  {scanResult.booking.guestCount} Guest(s)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preset Token Fast-Test Helpers */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Fast-Test with Active Tickets in Database:
        </span>
        <div className="space-y-2">
          {sampleTokens.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputToken(item.token);
                handleVerify(item.token);
              }}
              className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-mono font-bold text-indigo-700">{item.token}</span>
                <span className="text-slate-500 ml-2">
                  {item.guest} ({item.venue})
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {item.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
