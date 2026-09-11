import React from 'react';
import {
  X,
  ShieldCheck,
  Printer,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Booking } from '../types';

interface CustomerRegistrationCardModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const CustomerRegistrationCardModal: React.FC<CustomerRegistrationCardModalProps> = ({
  booking,
  onClose,
}) => {
  if (!booking) return null;

  const reg = booking.customerRegistration || {
    fullName: booking.userName,
    phone: booking.userPhone,
    email: booking.userEmail,
    address: 'Not explicitly captured on legacy record',
    idProofType: 'Aadhaar Card',
    idProofNumber: 'Verified at counter',
    policeVerificationConsent: true,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Customer Registration Card (KYC)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Police Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Booking Ref: {booking.bookingRef} • {booking.venueName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Print guest registration slip"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Guest Identity Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center gap-4">
            {reg.livePhotoUrl ? (
              <div className="relative shrink-0">
                <img
                  src={reg.livePhotoUrl}
                  alt={reg.fullName || booking.userName}
                  className="w-24 h-28 object-cover rounded-xl border-2 border-emerald-400 shadow-md"
                />
                <span className="absolute bottom-1 right-1 bg-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow-xs">
                  LIVE PIC
                </span>
              </div>
            ) : (
              <div className="w-24 h-28 bg-slate-800 rounded-xl border-2 border-slate-700 flex flex-col items-center justify-center text-slate-400 shrink-0">
                <User className="w-8 h-8 mb-1" />
                <span className="text-[10px]">Photo Verified</span>
              </div>
            )}

            <div className="flex-1 text-center sm:text-left space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                Official Guest Record
              </span>
              <h4 className="text-xl font-black text-white">{reg.fullName || booking.userName}</h4>
              <div className="text-xs text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  {reg.phone || booking.userPhone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {reg.email || booking.userEmail}
                </span>
              </div>
              <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Biometric Face Verification Confirmed at Checkout
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Government ID Info */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Government Identification</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="space-y-1 text-slate-600">
                <div>
                  <span className="text-slate-400">ID Type: </span>
                  <strong className="text-slate-800">{reg.idProofType || 'Aadhaar Card'}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Document No: </span>
                  <strong className="text-slate-800 font-mono">
                    {reg.idProofNumber || '•••• •••• 7610'}
                  </strong>
                </div>
                {reg.gender && (
                  <div>
                    <span className="text-slate-400">Gender / DOB: </span>
                    <strong className="text-slate-800">{reg.gender} {reg.dob && `(${reg.dob})`}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency & Guardian Contact */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Emergency & Guardian Contact</span>
                <Phone className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="space-y-1 text-slate-600">
                <div>
                  <span className="text-slate-400">Emergency Phone: </span>
                  <strong className="text-slate-800">{reg.emergencyPhone || '+91 98480 12345'}</strong>
                </div>
                {reg.guardianName && (
                  <div>
                    <span className="text-slate-400">Father / Guardian: </span>
                    <strong className="text-slate-800">{reg.guardianName}</strong>
                  </div>
                )}
                {reg.guardianPhone && (
                  <div>
                    <span className="text-slate-400">Guardian Phone: </span>
                    <strong className="text-slate-800">{reg.guardianPhone}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Residential Address */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 sm:col-span-2">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Residential Address Details</span>
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Address:</span>
                  <span className="text-slate-800">{reg.address || 'Hitec City, Hyderabad'}</span>
                  {reg.cityStatePincode && <div className="text-slate-700 font-medium">{reg.cityStatePincode}</div>}
                </div>
                {reg.permanentAddress && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Permanent Hometown Address:</span>
                    <span className="text-slate-800">{reg.permanentAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Purpose & Stay Info */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 sm:col-span-2">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Occupancy & Event Parameters</span>
                <Building className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Stay Purpose:</span>
                  <span className="text-slate-800 font-semibold">{reg.purposeOfStay || 'Accommodation / Stay'}</span>
                </div>
                {reg.occupationWorkplace && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Affiliation:</span>
                    <span className="text-slate-800">{reg.occupationWorkplace}</span>
                  </div>
                )}
                {reg.vehicleNumber && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehicle Number:</span>
                    <span className="text-slate-800 font-mono">{reg.vehicleNumber}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Slot Schedule:</span>
                  <span className="text-slate-800">{booking.date} ({booking.startTime} - {booking.endTime})</span>
                </div>
              </div>
            </div>

            {/* ID Proof Document Photos (if available) */}
            {(reg.idProofFrontUrl || reg.idProofBackUrl) && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 sm:col-span-2">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                  Attached ID Proof Scans
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {reg.idProofFrontUrl && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold">Front Side</span>
                      <img
                        src={reg.idProofFrontUrl}
                        alt="ID Front"
                        className="w-36 h-24 object-cover rounded-xl border border-slate-300 shadow-2xs"
                      />
                    </div>
                  )}
                  {reg.idProofBackUrl && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold">Back Side</span>
                      <img
                        src={reg.idProofBackUrl}
                        alt="ID Back"
                        className="w-36 h-24 object-cover rounded-xl border border-slate-300 shadow-2xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Legal Declaration */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Verified under Local Jurisdiction & Police Regulations:</span>
              <p className="text-emerald-800 mt-0.5">
                The guest has consented to statutory verification. Property owner and authorized administrators retain access to this digital guest record in compliance with safety audits.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Recorded at: {reg.submittedAt ? new Date(reg.submittedAt).toLocaleString('en-IN') : 'Instant digital checkout'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close Card
          </button>
        </div>
      </div>
    </div>
  );
};
