import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserPlus,
  Building2,
  GraduationCap,
  Home,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { UserRole } from '../types';

export const UnifiedRegistrationScreen: React.FC = () => {
  const { switchRole, setActiveScreen, selectedLocation } = useApp();

  const [selectedRoleType, setSelectedRoleType] = useState<
    'GUEST' | 'BANQUET_HOST' | 'TURF_OWNER' | 'INSTITUTE_DIRECTOR' | 'PG_OPERATOR'
  >('BANQUET_HOST');

  const [fullName, setFullName] = useState('Anil Kumar Reddy');
  const [phone, setPhone] = useState('+91 98490 88219');
  const [email, setEmail] = useState('anil.reddy@example.com');
  const [businessName, setBusinessName] = useState('Emerald Convention & Banquets');
  const [gstin, setGstin] = useState('36AABCU9603R1ZM');

  // Dynamic Fields
  const [valetParking, setValetParking] = useState(true);
  const [generatorBackup, setGeneratorBackup] = useState(true);
  const [gateLockTime, setGateLockTime] = useState('10:30 PM');
  const [sportsCategory, setSportsCategory] = useState('Badminton (BWF Synthetic)');

  const [isSuccess, setIsSuccess] = useState(false);

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      if (selectedRoleType === 'GUEST') {
        switchRole('USER');
        setActiveScreen('home');
      } else if (selectedRoleType === 'INSTITUTE_DIRECTOR') {
        switchRole('VENUE_OWNER');
        setActiveScreen('institute-owner');
      } else {
        switchRole('VENUE_OWNER');
        setActiveScreen('owner');
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 text-center">
        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
          Unified Multi-Category Onboarding
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center justify-center gap-2">
          <UserPlus className="w-6 h-6 text-indigo-600" />
          Partner & Guest Registration Portal
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          One unified registration flow with category-specific compliance and dynamic attribute fields.
        </p>
      </div>

      {/* Role Selection */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-900 block">Select Registration Classification</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'BANQUET_HOST', title: 'Banquet & Convention', desc: 'Function halls & marriages', icon: '🏛️' },
            { id: 'TURF_OWNER', title: 'Sports Turf & Courts', desc: 'Badminton, Cricket, Football', icon: '🏸' },
            { id: 'INSTITUTE_DIRECTOR', title: 'Institute & Academy', desc: 'Coaching batches & faculty', icon: '🎓' },
            { id: 'PG_OPERATOR', title: 'PG & Co-Living Hostel', desc: 'Sharing rooms & meal plans', icon: '🏠' },
            { id: 'GUEST', title: 'Customer / Guest', desc: 'Search & book venues', icon: '👤' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedRoleType(item.id as any)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedRoleType === item.id
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-600/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <div>
                <span className="font-bold text-slate-900 text-xs block">{item.title}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{item.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleCompleteRegistration} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-indigo-600" />
          General Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mobile Phone (with WhatsApp) *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Category-Specific Dynamic Fields */}
        {selectedRoleType !== 'GUEST' && (
          <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
            <h4 className="font-black text-slate-900">Category-Specific Partner Attributes</h4>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Business / Property / Academy Legal Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">GSTIN (Optional for small proprietors)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-mono"
              />
            </div>

            {selectedRoleType === 'BANQUET_HOST' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Banquet Facilities:</span>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={valetParking}
                    onChange={(e) => setValetParking(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Provide Uniformed Valet Parking Service</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={generatorBackup}
                    onChange={(e) => setGeneratorBackup(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>100% Silent Diesel Generator Power Backup</span>
                </label>
              </div>
            )}

            {selectedRoleType === 'PG_OPERATOR' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Night Biometric Gate Curfew</label>
                <input
                  type="text"
                  value={gateLockTime}
                  onChange={(e) => setGateLockTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>
            )}
          </div>
        )}

        <div className="pt-3">
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Complete Registration & Activate Role</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Success Notification Modal */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Registration Complete!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Account activated. Redirecting you to your dedicated management portal...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
