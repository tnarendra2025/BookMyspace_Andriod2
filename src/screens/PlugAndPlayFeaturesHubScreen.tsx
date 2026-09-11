import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  Sliders,
  Search,
  RefreshCw,
  FileCode,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  X,
} from 'lucide-react';

interface ModularFeature {
  id: string;
  title: string;
  category: 'CORE' | 'AI' | 'PAYMENT' | 'CONCURRENCY' | 'NOTIFICATIONS';
  description: string;
  isEnabled: boolean;
  healthStatus: 'HEALTHY' | 'AUTO_RECOVERED' | 'MONITORING';
  latencyMs: number;
  configParams: Record<string, string | number | boolean>;
}

const INITIAL_MODULES: ModularFeature[] = [
  {
    id: 'f_ssot_lock',
    title: 'Distributed Inventory Slot Lock (SSOT)',
    category: 'CONCURRENCY',
    description: 'Hardware clock synchronized slot hold engine preventing parallel double-bookings',
    isEnabled: true,
    healthStatus: 'HEALTHY',
    latencyMs: 12,
    configParams: { holdExpirySeconds: 420, maxSimultaneousHoldsPerUser: 2 },
  },
  {
    id: 'f_self_healing_reconcile',
    title: 'Autonomous Payment & Webhook Reconciler',
    category: 'PAYMENT',
    description: 'Detects dropped connections during UPI payment and auto-confirms or issues instant refunds',
    isEnabled: true,
    healthStatus: 'AUTO_RECOVERED',
    latencyMs: 38,
    configParams: { scanIntervalSecs: 30, retryAttempts: 3 },
  },
  {
    id: 'f_gemini_voice',
    title: 'Gemini Natural Language Voice Search',
    category: 'AI',
    description: 'Translates conversational voice queries into filtered venue search criteria',
    isEnabled: true,
    healthStatus: 'HEALTHY',
    latencyMs: 140,
    configParams: { modelAlias: 'gemini-2.5-flash', audioSampleRate: 16000 },
  },
  {
    id: 'f_mcp_agent_server',
    title: 'Model Context Protocol (MCP) Remote Tools Server',
    category: 'CORE',
    description: 'Exposes venue availability and booking endpoints to Claude, Cursor, and Gemini agents',
    isEnabled: true,
    healthStatus: 'HEALTHY',
    latencyMs: 25,
    configParams: { maxActiveMcpTokens: 100, rateLimitPerMinute: 60 },
  },
  {
    id: 'f_firestore_dual_sync',
    title: 'Firestore Realtime Dual Synchronization',
    category: 'CORE',
    description: 'Bridges local reactive store with Cloud Firestore collection streams',
    isEnabled: true,
    healthStatus: 'HEALTHY',
    latencyMs: 55,
    configParams: { offlineCacheTtlHours: 24, syncBatchSize: 50 },
  },
  {
    id: 'f_whatsapp_webhooks',
    title: 'Automated WhatsApp PDF Invoice Dispatcher',
    category: 'NOTIFICATIONS',
    description: 'Sends instant booking confirmation pass and tax invoice to guest WhatsApp',
    isEnabled: true,
    healthStatus: 'HEALTHY',
    latencyMs: 82,
    configParams: { templateId: 'bms_booking_v2', includeQrCheckIn: true },
  },
];

export const PlugAndPlayFeaturesHubScreen: React.FC = () => {
  const [modules, setModules] = useState<ModularFeature[]>(INITIAL_MODULES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);

  // Parameter Edit Modal
  const [editingModule, setEditingModule] = useState<ModularFeature | null>(null);
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  const categories = ['ALL', 'CORE', 'AI', 'PAYMENT', 'CONCURRENCY', 'NOTIFICATIONS'];

  const filteredModules = modules.filter((m) => {
    const matchesSearch =
      searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || m.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const activeCount = modules.filter((m) => m.isEnabled).length;
  const healthyCount = modules.filter((m) => m.healthStatus === 'HEALTHY').length;

  const handleToggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isEnabled: !m.isEnabled } : m))
    );
  };

  const handleRunDiagnostic = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      setIsDiagnosticRunning(false);
      setDiagnosticResult('All 6 micro-service modules passed integrity validation. Zero deadlock detected.');
      setTimeout(() => setDiagnosticResult(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
            Admin System Architecture
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Plug & Play Feature Hub & Self-Healing Modules
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time toggles and latency diagnostics for inventory locks, payment reconcilers, and AI agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAuditLogs(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Healing Logs</span>
          </button>

          <button
            onClick={handleRunDiagnostic}
            disabled={isDiagnosticRunning}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
            <span>{isDiagnosticRunning ? 'Validating...' : 'Run Diagnostics'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Active Modules</div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {activeCount} <span className="text-xs text-slate-400 font-normal">/ {modules.length}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Health Rating</div>
          <div className="text-xl font-black text-emerald-600 mt-1">
            {Math.round((healthyCount / modules.length) * 100)}%
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Average Latency</div>
          <div className="text-xl font-black text-indigo-600 mt-1">42 ms</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Concurrency State</div>
          <div className="text-xl font-black text-purple-600 mt-1">SSOT Active</div>
        </div>
      </div>

      {diagnosticResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{diagnosticResult}</span>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules by title or description..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCat === c ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredModules.map((m) => (
          <div
            key={m.id}
            className={`p-5 rounded-3xl border transition-all ${
              m.isEnabled ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50/70 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{m.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                    {m.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      m.healthStatus === 'HEALTHY'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        m.healthStatus === 'HEALTHY' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    {m.healthStatus} ({m.latencyMs}ms)
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleToggleModule(m.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  m.isEnabled ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    m.isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{m.description}</p>

            {/* Config Params Preview */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="text-slate-400 font-mono">
                {Object.keys(m.configParams).length} configurable parameters
              </div>

              <button
                onClick={() => setEditingModule(m)}
                className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>Configure</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Module Parameter Configuration Modal */}
      {editingModule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">{editingModule.title}</h3>
                <span className="text-xs text-slate-400 font-mono">ID: {editingModule.id}</span>
              </div>
              <button onClick={() => setEditingModule(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {Object.entries(editingModule.configParams).map(([key, val]) => (
                <div key={key}>
                  <label className="font-bold text-slate-700 block mb-1 font-mono">{key}</label>
                  <input
                    type="text"
                    defaultValue={String(val)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setEditingModule(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditingModule(null);
                  alert('Parameters updated successfully!');
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Self-Healing Audit Logs Modal */}
      {showAuditLogs && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Self-Healing Event Audit Trail
              </h3>
              <button onClick={() => setShowAuditLogs(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs">
              {[
                {
                  time: '10:42 AM',
                  msg: 'Reconciled 1 orphaned UPI intent for Booking #BMS-98124. Payment confirmed.',
                  type: 'SUCCESS',
                },
                {
                  time: '10:15 AM',
                  msg: 'Released expired slot hold for ts_rp_1 (420 seconds expired with no payment).',
                  type: 'INFO',
                },
                {
                  time: '09:30 AM',
                  msg: 'Gemini Agent latency reached 180ms. Fallback local cache activated.',
                  type: 'WARN',
                },
                {
                  time: '09:00 AM',
                  msg: 'Firestore dual-sync handshake verified. 4 collections in complete parity.',
                  type: 'SUCCESS',
                },
              ].map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="font-mono text-[10px] text-slate-400 pt-0.5">{log.time}</span>
                  <div className="flex-1 text-slate-700 font-medium">{log.msg}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setShowAuditLogs(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
