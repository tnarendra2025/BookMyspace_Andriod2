import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Key,
  ShieldAlert,
  Percent,
  ToggleLeft,
  ToggleRight,
  Save,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Activity,
  Sliders,
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  Database,
  Terminal,
  RefreshCw,
} from 'lucide-react';

export const AdminSettingsScreen: React.FC = () => {
  const { featureToggles, toggleFeature, setActiveScreen } = useApp();

  // Platform Details
  const [appName, setAppName] = useState('BookMySpace');
  const [supportEmail, setSupportEmail] = useState('support@bookmyspace.in');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [supportWhatsapp, setSupportWhatsapp] = useState('+91 98765 43210');
  const [currency, setCurrency] = useState('INR (₹)');
  const [commissionRate, setCommissionRate] = useState('5.0');
  const [taxRate, setTaxRate] = useState('18.0');

  // API Credentials
  const [razorpayKeyId, setRazorpayKeyId] = useState('rzp_test_5W98e4d3XyzaB1');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('sec_live_98124976a9bf31');
  const [geminiApiKey, setGeminiApiKey] = useState('AIzaSyD-mcp81928374615201948271');
  const [mapsApiKey, setMapsApiKey] = useState('AIzaSyA-maps98124987123984712938');
  const [showSecretKeys, setShowSecretKeys] = useState(false);

  // Maintenance Mode
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'Scheduled platform upgrade in progress. Normal bookings resume shortly.'
  );

  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 700);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
            Super Administrator Control Plane
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-600" />
            Admin Platform Settings & Dynamic Cloud Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure platform fees, production API secrets, maintenance gates, and core feature toggles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('admin-element-editor')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>CMS Element Editor</span>
          </button>
          <button
            onClick={() => setActiveScreen('admin-plug-play')}
            className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feature Hub</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Platform Parameters */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" />
            Platform Brand & Financial Economics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Application Title</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Host Commission Fee (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold text-purple-700"
                />
                <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Default GST Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                />
                <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Support Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Toll-Free Phone</label>
              <div className="relative">
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp Concierge</label>
              <div className="relative">
                <input
                  type="text"
                  value={supportWhatsapp}
                  onChange={(e) => setSupportWhatsapp(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
                <MessageSquare className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Production API Secrets */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-600" />
              Gateway Credentials & AI Intelligence Keys
            </h3>
            <button
              type="button"
              onClick={() => setShowSecretKeys(!showSecretKeys)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              {showSecretKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSecretKeys ? 'Mask Secrets' : 'Reveal Keys'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Razorpay Key ID</label>
              <input
                type={showSecretKeys ? 'text' : 'password'}
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Razorpay Key Secret</label>
              <input
                type={showSecretKeys ? 'text' : 'password'}
                value={razorpayKeySecret}
                onChange={(e) => setRazorpayKeySecret(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Gemini AI Model API Key</label>
              <input
                type={showSecretKeys ? 'text' : 'password'}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs text-indigo-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Google Maps Platform Key</label>
              <input
                type={showSecretKeys ? 'text' : 'password'}
                value={mapsApiKey}
                onChange={(e) => setMapsApiKey(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs text-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Maintenance Gate */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Emergency Maintenance Mode Gate
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                When active, non-admin visitors see an informational maintenance banner and checkout is safely disabled.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
              className={`p-1 rounded-full transition-colors ${
                isMaintenanceMode ? 'text-rose-600' : 'text-slate-300'
              }`}
            >
              {isMaintenanceMode ? (
                <ToggleRight className="w-10 h-10 fill-rose-600 text-white" />
              ) : (
                <ToggleLeft className="w-10 h-10 fill-slate-300 text-white" />
              )}
            </button>
          </div>

          {isMaintenanceMode && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-xs animate-in fade-in duration-200">
              <label className="font-bold text-rose-900 block">Maintenance Notice Message</label>
              <textarea
                rows={2}
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-300 bg-white text-rose-900 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Section 4: Live Feature Flags Matrix */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Core Runtime Feature Toggles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {featureToggles.map((flag) => (
              <div
                key={flag.key}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">{flag.title}</div>
                  <div className="text-[11px] text-slate-500">{flag.description}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFeature(flag.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    flag.isEnabled ? 'bg-purple-600' : 'bg-slate-300'
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

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Platform settings successfully saved and synced to cloud!</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Settings changes take effect instantaneously.</span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating Cloud...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
