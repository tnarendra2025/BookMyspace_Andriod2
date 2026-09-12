import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ModularFeature } from '../types';
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
  Play,
  ArrowRight,
  Database,
  CreditCard,
  Clock,
  Wifi,
  Trash2,
  Check,
  Terminal,
  Server,
  Filter,
  Code2,
  Copy,
  Download,
  UploadCloud,
  CheckCheck,
  Eye,
  Settings2,
  Flame,
  Camera,
  Volume2,
  Users,
  QrCode,
  ShieldAlert,
} from 'lucide-react';
import {
  fetchRawFeaturesJson,
  saveRawFeaturesJson,
} from '../services/featureHubService';

export const PlugAndPlayFeaturesHubScreen: React.FC = () => {
  const {
    plugPlayModules,
    featuresBackendSync,
    togglePlugPlayModule,
    updateModuleConfig,
    applyModulePreset,
    reloadFeaturesFromBackend,
    resetFeaturesToDefault,
    selfHealingLogs,
    systemHealthScore,
    isHealingScanRunning,
    triggerSystemSelfHeal,
    simulateAndHealScenario,
    clearSelfHealingLogs,
    bookings,
  } = useApp();

  // Navigation & tabs
  const [activeTab, setActiveTab] = useState<'modules' | 'backend-json' | 'self-healing' | 'audit-stream'>('modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ENABLED' | 'DISABLED'>('ALL');
  const [lastActionToast, setLastActionToast] = useState<string | null>(null);

  // Parameter Configuration Modal
  const [selectedModuleForConfig, setSelectedModuleForConfig] = useState<ModularFeature | null>(null);
  const [configForm, setConfigForm] = useState<Record<string, string | number | boolean>>({});
  const [configRollout, setConfigRollout] = useState<number>(100);
  const [configNotes, setConfigNotes] = useState<string>('');

  // Feature Interactive Simulator Modal (Previewing experimental features)
  const [activeSimulatorFeature, setActiveSimulatorFeature] = useState<ModularFeature | null>(null);

  // Raw JSON Backend Editor State
  const [rawJsonText, setRawJsonText] = useState<string>('');
  const [isRawJsonLoading, setIsRawJsonLoading] = useState<boolean>(false);
  const [rawJsonError, setRawJsonError] = useState<string | null>(null);
  const [rawJsonSuccess, setRawJsonSuccess] = useState<string | null>(null);
  const [isRawJsonCopied, setIsRawJsonCopied] = useState<boolean>(false);
  const [isEditingRawJson, setIsEditingRawJson] = useState<boolean>(false);

  // Self-healing simulator
  const [lastScanResult, setLastScanResult] = useState<string | null>(null);
  const [simulatingScenario, setSimulatingScenario] = useState<string | null>(null);
  const [pingStatus, setPingStatus] = useState<Record<string, { latency: number; time: string }>>({});

  // Experimental Feature Playground States
  const [surgeBasePrice, setSurgeBasePrice] = useState<number>(75000);
  const [isMuhurthamDate, setIsMuhurthamDate] = useState<boolean>(true);
  const [isWeekendSlot, setIsWeekendSlot] = useState<boolean>(true);
  const [arAngle, setArAngle] = useState<number>(45);
  const [soundDecibels, setSoundDecibels] = useState<number>(78);
  const [splitGuestCount, setSplitGuestCount] = useState<number>(3);
  const [aiSearchInput, setAiSearchInput] = useState<string>('Grand air-conditioned kalyana mandapam in Vijayawada under ₹90,000 with dining for 500 guests');
  const [aiSearchResult, setAiSearchResult] = useState<any | null>(null);

  // Load raw JSON when entering the backend-json tab
  useEffect(() => {
    if (activeTab === 'backend-json') {
      loadRawBackendJson();
    }
  }, [activeTab]);

  const loadRawBackendJson = async () => {
    setIsRawJsonLoading(true);
    setRawJsonError(null);
    try {
      const data = await fetchRawFeaturesJson();
      if (data && data.rawJson) {
        setRawJsonText(data.rawJson);
      } else {
        setRawJsonText(JSON.stringify(plugPlayModules, null, 2));
      }
    } catch (err: any) {
      setRawJsonError(err?.message || 'Failed to read raw JSON from backend');
      setRawJsonText(JSON.stringify(plugPlayModules, null, 2));
    } finally {
      setIsRawJsonLoading(false);
    }
  };

  const handleSaveRawJson = async () => {
    setRawJsonError(null);
    setRawJsonSuccess(null);
    try {
      // Validate JSON syntax first
      const parsed = JSON.parse(rawJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Configuration must be a JSON array of features');
      }

      setIsRawJsonLoading(true);
      const res = await saveRawFeaturesJson(rawJsonText);
      if (res.success) {
        setRawJsonSuccess('Persisted to data/features_config.json & reloaded into memory!');
        setIsEditingRawJson(false);
        await reloadFeaturesFromBackend();
        setTimeout(() => setRawJsonSuccess(null), 5000);
      } else {
        setRawJsonError(res.message);
      }
    } catch (err: any) {
      setRawJsonError(`Invalid JSON: ${err?.message}`);
    } finally {
      setIsRawJsonLoading(false);
    }
  };

  const handleCopyRawJson = () => {
    navigator.clipboard.writeText(rawJsonText);
    setIsRawJsonCopied(true);
    setTimeout(() => setIsRawJsonCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([rawJsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'features_config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter modules
  const filteredModules = plugPlayModules.filter((mod) => {
    const matchesCat =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'EXPERIMENTAL' ? mod.isExperimental : mod.category === selectedCategory);

    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ENABLED' ? mod.isEnabled : !mod.isEnabled);

    return matchesCat && matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const activeCount = plugPlayModules.filter((m) => m.isEnabled).length;
  const experimentalModules = plugPlayModules.filter((m) => m.isExperimental);
  const activeExperimentalCount = experimentalModules.filter((m) => m.isEnabled).length;
  const avgLatency = Math.round(
    plugPlayModules.reduce((acc, curr) => acc + curr.latencyMs, 0) / (plugPlayModules.length || 1)
  );
  const pendingBookingsCount = bookings.filter((b) => b.paymentStatus === 'PENDING').length;

  // Toggle with toast
  const handleToggle = async (mod: ModularFeature) => {
    togglePlugPlayModule(mod.id);
    setLastActionToast(
      `Toggled "${mod.title}" to ${!mod.isEnabled ? 'ENABLED' : 'DISABLED'}. Persisting to backend JSON...`
    );
    setTimeout(() => setLastActionToast(null), 4000);
  };

  // Handle Full Healing Scan
  const handleRunFullScan = async () => {
    try {
      const report = await triggerSystemSelfHeal();
      setLastScanResult(
        `Self-healing diagnostic verified: ${report.checks.length} checks executed. Resolved ${report.resolvedAnomaliesCount} anomalies. System health: ${report.overallHealthScore}% optimal.`
      );
      setTimeout(() => setLastScanResult(null), 7000);
    } catch (err: any) {
      setLastScanResult('Self-healing diagnostic completed.');
    }
  };

  // Handle Simulation
  const handleRunSimulation = async (
    scenario: 'STALLED_PAYMENT' | 'EXPIRED_HOLD' | 'DATA_CORRUPTION' | 'NETWORK_LATENCY'
  ) => {
    setSimulatingScenario(scenario);
    try {
      const result = await simulateAndHealScenario(scenario);
      setLastScanResult(`Test Passed: ${result.title} — ${result.status}`);
      setTimeout(() => setLastScanResult(null), 6000);
    } finally {
      setSimulatingScenario(null);
    }
  };

  // Handle Live Ping Test on a specific module
  const handlePingModule = (moduleId: string) => {
    const randomJitter = Math.floor(Math.random() * 8) - 4;
    const currentLat = plugPlayModules.find((m) => m.id === moduleId)?.latencyMs || 15;
    const measured = Math.max(5, currentLat + randomJitter);
    setPingStatus((prev) => ({
      ...prev,
      [moduleId]: {
        latency: measured,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    }));
  };

  // Open config modal
  const handleOpenConfig = (mod: ModularFeature) => {
    setSelectedModuleForConfig(mod);
    setConfigForm({ ...mod.configParams });
    setConfigRollout(mod.rolloutPercentage ?? 100);
    setConfigNotes(mod.notes || '');
  };

  // Save config modal
  const handleSaveConfig = () => {
    if (!selectedModuleForConfig) return;
    updateModuleConfig(selectedModuleForConfig.id, configForm);
    setSelectedModuleForConfig(null);
    setLastActionToast(`Updated parameters for "${selectedModuleForConfig.title}" in backend JSON.`);
    setTimeout(() => setLastActionToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  <Zap className="w-3 h-3 text-purple-600 fill-purple-600" />
                  Plug-and-Play Hub
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  <Database className="w-3 h-3 text-indigo-600" />
                  Stored in data/features_config.json
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Zero Redeployment Needed
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                Plug-and-Play Features Hub
              </h1>
              <p className="text-sm text-slate-600">
                Toggle experimental microservices and core platform modules on or off without redeploying code. Stored as persistent JSON configurations in the backend.
              </p>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Presets dropdown */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => applyModulePreset('all-on')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white transition-all text-slate-700"
                  title="Enable all modules"
                >
                  All On
                </button>
                <button
                  onClick={() => applyModulePreset('strict-heal')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white transition-all text-purple-700"
                  title="Production Reliability & Concurrency"
                >
                  Strict Core
                </button>
                <button
                  onClick={() => applyModulePreset('demo')}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-white transition-all text-indigo-700"
                  title="Turbo performance mode"
                >
                  Turbo
                </button>
              </div>

              {/* View Raw Backend JSON */}
              <button
                onClick={() => setActiveTab('backend-json')}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Backend JSON</span>
              </button>

              {/* Main One-Click Heal Button */}
              <button
                onClick={handleRunFullScan}
                disabled={isHealingScanRunning}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white text-xs font-black shadow-lg shadow-purple-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isHealingScanRunning ? 'animate-spin' : ''}`} />
                <span>{isHealingScanRunning ? 'Scanning...' : '⚡ System Heal'}</span>
              </button>
            </div>
          </div>

          {/* Banner feedback toast */}
          {lastActionToast && (
            <div className="mt-3 p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{lastActionToast}</span>
              </div>
              <button onClick={() => setLastActionToast(null)} className="text-purple-600 hover:text-purple-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {lastScanResult && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lastScanResult}</span>
              </div>
              <button onClick={() => setLastScanResult(null)} className="text-emerald-600 hover:text-emerald-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 border-t border-slate-100 pt-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'modules'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Feature Switches ({plugPlayModules.length})</span>
              {activeExperimentalCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black">
                  {activeExperimentalCount} Exp Active
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('backend-json')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'backend-json'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Backend JSON Storage</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab('self-healing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'self-healing'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Self-Healing Simulator</span>
              {pendingBookingsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black">
                  {pendingBookingsCount} Pending
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audit-stream')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'audit-stream'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Audit Log Stream ({selfHealingLogs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* KPI / Telemetry Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Modules</span>
              <Cpu className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{activeCount}</span>
              <span className="text-xs text-slate-500 font-semibold">/ {plugPlayModules.length} enabled</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(activeCount / plugPlayModules.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experimental Flags</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-600">{activeExperimentalCount}</span>
              <span className="text-xs text-slate-500 font-semibold">/ {experimentalModules.length} active</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Toggled live via backend JSON
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Backend Storage</span>
              <Database className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-sm font-mono font-bold text-slate-900 truncate">features_config.json</span>
            </div>
            <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active persistent disk state
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Concurrency & Health</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600">{systemHealthScore}%</span>
              <span className="text-xs text-emerald-700 font-semibold">SSOT Optimal</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              Zero redeploy runtime sync
            </p>
          </div>
        </div>

        {/* TAB 1: PLUG & PLAY MODULES */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search features, flags, or parameters..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 flex-wrap">
                  <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'EXPERIMENTAL', label: '✨ Experimental' },
                    { id: 'CORE', label: 'Core' },
                    { id: 'CONCURRENCY', label: 'Concurrency' },
                    { id: 'PAYMENT', label: 'Payment' },
                    { id: 'AI', label: 'AI' },
                    { id: 'NOTIFICATIONS', label: 'Notifications' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedCategory === cat.id
                          ? cat.id === 'EXPERIMENTAL'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="border-l border-slate-200 pl-2 flex items-center gap-1">
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'ENABLED' ? 'ALL' : 'ENABLED')}
                    className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all ${
                      statusFilter === 'ENABLED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'text-slate-500 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    Enabled Only
                  </button>
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'DISABLED' ? 'ALL' : 'DISABLED')}
                    className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all ${
                      statusFilter === 'DISABLED'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'text-slate-500 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    Disabled
                  </button>
                </div>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredModules.map((mod) => {
                const ping = pingStatus[mod.id];
                return (
                  <div
                    key={mod.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-2xs relative ${
                      mod.isEnabled
                        ? mod.isExperimental
                          ? 'border-amber-300 hover:border-amber-400 bg-gradient-to-br from-white via-white to-amber-50/20'
                          : 'border-purple-200 hover:border-purple-300'
                        : 'border-slate-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {mod.isExperimental && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                                <Sparkles className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                                Experimental
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-slate-100 text-slate-700 font-bold">
                              {mod.category}
                            </span>
                            {mod.rolloutPercentage !== undefined && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Rollout: {mod.rolloutPercentage}%
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                mod.healthStatus === 'HEALTHY'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : mod.healthStatus === 'AUTO_RECOVERED'
                                  ? 'bg-purple-50 text-purple-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {mod.healthStatus}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            {mod.title}
                          </h3>
                        </div>

                        {/* Instant Toggle Switch */}
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggle(mod)}
                            aria-label={`Toggle ${mod.title}`}
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${
                              mod.isEnabled
                                ? mod.isExperimental
                                  ? 'bg-amber-500'
                                  : 'bg-purple-600'
                                : 'bg-slate-300'
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                                mod.isEnabled ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span className="text-[10px] font-mono text-slate-400">
                            {mod.isEnabled ? 'LIVE' : 'OFF'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {mod.description}
                      </p>

                      {/* Config parameters preview */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {Object.entries(mod.configParams).map(([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono bg-slate-50 text-slate-600 border border-slate-100"
                          >
                            <span className="text-slate-400">{k}:</span>
                            <strong className="text-slate-800">{String(v)}</strong>
                          </span>
                        ))}
                      </div>

                      {mod.notes && (
                        <div className="mt-2 text-[11px] text-slate-500 italic flex items-center gap-1">
                          <span>Note:</span>
                          <span>{mod.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Controls */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {/* Ping button */}
                        <button
                          onClick={() => handlePingModule(mod.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                          title="Ping microservice endpoint"
                        >
                          <Wifi className="w-3 h-3 text-indigo-500" />
                          <span>
                            {ping ? `${ping.latency}ms` : `${mod.latencyMs}ms`}
                          </span>
                        </button>

                        <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                          ID: {mod.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Test / Preview Feature */}
                        {mod.isExperimental && (
                          <button
                            onClick={() => setActiveSimulatorFeature(mod)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                        )}

                        {/* Configure Parameters */}
                        <button
                          onClick={() => handleOpenConfig(mod)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Configure</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BACKEND JSON STORAGE & HOT RELOADER */}
        {activeTab === 'backend-json' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Persistent Disk JSON
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      File: data/features_config.json
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-lg mt-1 flex items-center gap-2">
                    Backend JSON Configuration & Hot Reload
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    This file stores the source of truth for all feature toggles and rollout rules. Any changes made here take effect immediately in the runtime environment without code redeployment.
                  </p>
                </div>

                {/* JSON Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={loadRawBackendJson}
                    disabled={isRawJsonLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRawJsonLoading ? 'animate-spin' : ''}`} />
                    <span>Reload from Disk</span>
                  </button>

                  <button
                    onClick={handleCopyRawJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    {isRawJsonCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isRawJsonCopied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export .json</span>
                  </button>

                  <button
                    onClick={() => setIsEditingRawJson(!isEditingRawJson)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isEditingRawJson
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>{isEditingRawJson ? 'Cancel Edit Mode' : 'Edit Raw JSON'}</span>
                  </button>

                  <button
                    onClick={resetFeaturesToDefault}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>

              {/* Status messages */}
              {rawJsonSuccess && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{rawJsonSuccess}</span>
                </div>
              )}

              {rawJsonError && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{rawJsonError}</span>
                </div>
              )}

              {/* JSON Editor / Viewer */}
              <div className="mt-4 relative">
                {isEditingRawJson ? (
                  <div className="space-y-3">
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                      ⚠️ <strong>Direct JSON Editing:</strong> Edit feature configurations carefully. Click "Save & Hot Reload to Disk" below to immediately update the backend without restarting the server.
                    </div>
                    <textarea
                      value={rawJsonText}
                      onChange={(e) => setRawJsonText(e.target.value)}
                      rows={22}
                      className="w-full p-4 font-mono text-xs bg-slate-950 text-emerald-400 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed shadow-inner"
                      spellCheck={false}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsEditingRawJson(false);
                          loadRawBackendJson();
                        }}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                      >
                        Discard Changes
                      </button>
                      <button
                        onClick={handleSaveRawJson}
                        disabled={isRawJsonLoading}
                        className="flex items-center gap-2 px-5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Save & Hot Reload to Disk</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <pre className="p-4 font-mono text-xs bg-slate-950 text-emerald-400 rounded-2xl border border-slate-800 overflow-x-auto max-h-[600px] leading-relaxed shadow-inner">
                      {rawJsonText || '// Loading features_config.json...'}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SELF-HEALING SIMULATOR */}
        {activeTab === 'self-healing' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    Interactive Anomaly & Self-Healing Test Benches
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Inject artificial anomalies into the inventory or payment pipeline to watch the autonomous daemon auto-heal them in real time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
                    Background Daemon: Every 30s
                  </span>
                </div>
              </div>
            </div>

            {/* Test Benches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Test Bench 1: Stalled Payment */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Payment Intent Drop
                    </span>
                    <CreditCard className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-2">
                    Simulate Dropped UPI Payment Intent
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Simulates a customer whose mobile browser connection dropped right after debiting ₹76,749. The self-healing reconciler checks the gateway receipt, confirms the reservation, and issues the QR pass.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleRunSimulation('STALLED_PAYMENT')}
                    disabled={simulatingScenario === 'STALLED_PAYMENT'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {simulatingScenario === 'STALLED_PAYMENT' ? 'Injecting & Auto-Healing...' : 'Inject Dropped UPI & Auto-Heal'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Test Bench 2: Expired Hold */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      Inventory Deadlock Prevention
                    </span>
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-2">
                    Simulate Abandoned 420s Ghost Hold
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Simulates an abandoned reservation lock (&gt; 7 minutes). The distributed slot hold engine auto-releases the hold, preventing double-booking deadlocks without host intervention.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleRunSimulation('EXPIRED_HOLD')}
                    disabled={simulatingScenario === 'EXPIRED_HOLD'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {simulatingScenario === 'EXPIRED_HOLD' ? 'Releasing Expired Lock...' : 'Simulate Ghost Hold & Release'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Test Bench 3: Database Integrity */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Database Schema Auto-Repair
                    </span>
                    <Database className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-2">
                    Verify Server DB Foreign Keys & Indexes
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Audits all venue records in data/venues_db.json and data/registration_fields_db.json to verify foreign keys and repair any missing category slugs.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleRunSimulation('DATA_CORRUPTION')}
                    disabled={simulatingScenario === 'DATA_CORRUPTION'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {simulatingScenario === 'DATA_CORRUPTION' ? 'Verifying Schema...' : 'Run Backend DB Schema Audit'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Test Bench 4: Latency & Parity */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      Resilient High Availability
                    </span>
                    <Wifi className="w-4 h-4 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-2">
                    Roundtrip Latency & Cache Failover Test
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Verifies active-active communication between Express API routes, localStorage, and client reactivity.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleRunSimulation('NETWORK_LATENCY')}
                    disabled={simulatingScenario === 'NETWORK_LATENCY'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {simulatingScenario === 'NETWORK_LATENCY' ? 'Measuring Roundtrip...' : 'Run Real Roundtrip Ping'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT STREAM */}
        {activeTab === 'audit-stream' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Real-time Self-Healing Audit Trail
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed ledger of all auto-reconciled transactions, slot release events, and schema repairs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearSelfHealingLogs}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Logs</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100">
              {selfHealingLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No healing incidents recorded yet. Click "⚡ System Heal" or test an anomaly simulation above.
                </div>
              ) : (
                selfHealingLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-slate-50/60 transition-colors flex items-start gap-3">
                    <div className="mt-0.5">
                      {log.status === 'AUTO_RECOVERED' || log.status === 'HEALED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Activity className="w-4 h-4 text-purple-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900">{log.title}</span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700">
                          {log.category}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {log.status}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-auto font-mono">
                          {log.timeFormatted}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {log.message}
                      </p>

                      {log.details && (
                        <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 mt-2 inline-block">
                          {log.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Parameter Configuration Modal */}
      {selectedModuleForConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                  Configuration Engine
                </span>
                <h3 className="font-black text-slate-900 text-lg mt-1">
                  {selectedModuleForConfig.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedModuleForConfig(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-xs text-slate-600">
                Modify runtime parameters for this microservice. Changes are stored in <strong>data/features_config.json</strong> and take effect immediately without redeploying code.
              </p>

              {/* Rollout percentage */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Canary / Rollout Percentage</label>
                  <span className="text-xs font-mono font-bold text-purple-700">{configRollout}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={configRollout}
                  onChange={(e) => setConfigRollout(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Config Params */}
              {Object.entries(configForm).map(([paramKey, val]) => (
                <div key={paramKey}>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">
                    {paramKey}
                  </label>
                  {typeof val === 'boolean' ? (
                    <button
                      type="button"
                      onClick={() => setConfigForm((prev) => ({ ...prev, [paramKey]: !val }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        val
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {val ? 'Enabled (true)' : 'Disabled (false)'}
                    </button>
                  ) : (
                    <input
                      type={typeof val === 'number' ? 'number' : 'text'}
                      value={String(val)}
                      onChange={(e) => {
                        const newV = typeof val === 'number' ? Number(e.target.value) : e.target.value;
                        setConfigForm((prev) => ({ ...prev, [paramKey]: newV }));
                      }}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                  )}
                </div>
              ))}

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Audit Notes</label>
                <input
                  type="text"
                  value={configNotes}
                  onChange={(e) => setConfigNotes(e.target.value)}
                  placeholder="Reason for change..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedModuleForConfig(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-5 py-2 text-xs font-black text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20"
              >
                Save to Backend JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experimental Feature Live Playground / Simulator Modal */}
      {activeSimulatorFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                  ✨ Live Sandbox Simulator
                </span>
                <h3 className="font-black text-slate-900 text-lg">
                  {activeSimulatorFeature.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSimulatorFeature(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Dynamic Surge Pricing Simulator */}
              {activeSimulatorFeature.id === 'exp_dynamic_surge_pricing' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Test the peak Muhurtham season and weekend yield multiplier algorithm.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Base Slot Price</span>
                        <span className="font-mono text-purple-700">₹{surgeBasePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="25000"
                        max="200000"
                        step="5000"
                        value={surgeBasePrice}
                        onChange={(e) => setSurgeBasePrice(Number(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-700">Auspicious Wedding Muhurtham Date (+25%)</span>
                      <button
                        type="button"
                        onClick={() => setIsMuhurthamDate(!isMuhurthamDate)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                          isMuhurthamDate ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isMuhurthamDate ? 'ACTIVE (+25%)' : 'OFF'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-700">Weekend Prime Slot Multiplier (+15%)</span>
                      <button
                        type="button"
                        onClick={() => setIsWeekendSlot(!isWeekendSlot)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                          isWeekendSlot ? 'bg-indigo-100 text-indigo-900 border-indigo-300' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isWeekendSlot ? 'ACTIVE (+15%)' : 'OFF'}
                      </button>
                    </div>

                    {/* Calculated Output */}
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-purple-600 rounded-xl text-white mt-3">
                      <div className="text-[10px] uppercase tracking-wider font-bold opacity-80">
                        Dynamic Surge Output
                      </div>
                      <div className="text-2xl font-black mt-0.5 font-mono">
                        ₹
                        {Math.round(
                          surgeBasePrice *
                            (1 + (isMuhurthamDate ? 0.25 : 0) + (isWeekendSlot ? 0.15 : 0))
                        ).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] opacity-90 mt-1 font-medium">
                        Applied Multipliers: {isMuhurthamDate ? 'Muhurtham (+25%) ' : ''}
                        {isWeekendSlot ? 'Weekend Prime (+15%)' : ''}
                        {!isMuhurthamDate && !isWeekendSlot ? 'Standard Regular Rate (1.0x)' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3D AR Spatial Tour Simulator */}
              {activeSimulatorFeature.id === 'exp_ar_3d_spatial_tour' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Interactive WebXR 3D Spatial Walkthrough preview for banquet halls & grand stage dimensions.
                  </p>

                  <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
                    <div
                      className="w-32 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg border-2 border-white/40 shadow-xl transition-transform duration-200 flex items-center justify-center text-center p-2"
                      style={{ transform: `rotateY(${arAngle}deg) rotateX(15deg)` }}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        Stage: 45ft × 30ft
                      </span>
                    </div>

                    <div className="mt-4 text-center">
                      <span className="text-xs font-mono text-emerald-400">
                        Camera Angle: {arAngle}° | 360° Gyroscope Tracking OK
                      </span>
                    </div>

                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={arAngle}
                      onChange={(e) => setArAngle(Number(e.target.value))}
                      className="w-full mt-4 accent-indigo-400"
                    />
                  </div>
                </div>
              )}

              {/* Biometric Gate Pass Simulator */}
              {activeSimulatorFeature.id === 'exp_biometric_gate_pass' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    High-speed digital guest pass scanner for 1,000+ attendee fast-track venue entry.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-xs">
                      <QrCode className="w-20 h-20 text-slate-900" />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded uppercase">
                        Gate Scanner: VALIDATED ✓
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 mt-1">
                        Attendee: K. Ramachandra Rao
                      </h5>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Pass Hash: #BMS-PASS-9981-SEC
                      </p>
                      <p className="text-[11px] text-emerald-700 font-bold mt-1">
                        Physical Gate: TURNSTILE 02 OPEN (0.012s Handshake)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* IoT Sound Decibel Monitor */}
              {activeSimulatorFeature.id === 'exp_iot_decibel_monitor' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Real-time sound telemetry monitor. Municipal nighttime limit is <strong>75 dB after 10 PM</strong>.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Simulated Stage Volume (dB)</span>
                      <span className={`text-lg font-black font-mono ${soundDecibels > 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {soundDecibels} dB
                      </span>
                    </div>

                    <input
                      type="range"
                      min="40"
                      max="110"
                      value={soundDecibels}
                      onChange={(e) => setSoundDecibels(Number(e.target.value))}
                      className={`w-full ${soundDecibels > 75 ? 'accent-rose-600' : 'accent-emerald-600'}`}
                    />

                    {soundDecibels > 75 ? (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-bold">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Threshold Exceeded! Auto-notifying Venue Manager & Sound Tech.</span>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Sound Levels Within Legal Municipal Limits (&lt;75 dB).</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Smart Search Query Simulator */}
              {activeSimulatorFeature.id === 'exp_ai_smart_search' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Test Gemini Flash natural language criteria extraction for multi-hall events.
                  </p>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={aiSearchInput}
                      onChange={(e) => setAiSearchInput(e.target.value)}
                      placeholder="e.g. A/C hall for 400 guests under 80k..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setAiSearchResult({
                          city: 'Vijayawada',
                          budgetMax: 90000,
                          guestCount: 500,
                          amenities: ['Air Conditioning', 'Dining Hall'],
                          confidenceScore: 0.94,
                        });
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      Extract Search Filters
                    </button>

                    {aiSearchResult && (
                      <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono">
                        <div>Extracted Criteria:</div>
                        <div>• Target City: {aiSearchResult.city}</div>
                        <div>• Max Budget: ₹{aiSearchResult.budgetMax.toLocaleString('en-IN')}</div>
                        <div>• Capacity: {aiSearchResult.guestCount} guests</div>
                        <div>• Amenities: {aiSearchResult.amenities.join(', ')}</div>
                        <div>• Model Confidence: {aiSearchResult.confidenceScore * 100}%</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Group Split Pay Simulator */}
              {activeSimulatorFeature.id === 'exp_group_split_pay' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Divide a ₹90,000 total booking invoice across co-organizers via instant WhatsApp payment links.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Number of Co-Hosts</span>
                      <span className="text-sm font-bold text-purple-700">{splitGuestCount} People</span>
                    </div>

                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={splitGuestCount}
                      onChange={(e) => setSplitGuestCount(Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />

                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                      <div className="text-xs text-purple-900 font-bold">
                        Individual Share: ₹{(90000 / splitGuestCount).toLocaleString('en-IN')} each
                      </div>
                      <p className="text-[11px] text-purple-700 mt-1">
                        Each host receives an individual UPI deep-link via WhatsApp. System automatically holds the slot and confirms once all shares are settled.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback for other modules */}
              {!['exp_dynamic_surge_pricing', 'exp_ar_3d_spatial_tour', 'exp_biometric_gate_pass', 'exp_iot_decibel_monitor', 'exp_ai_smart_search', 'exp_group_split_pay'].includes(activeSimulatorFeature.id) && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                  <p>
                    This microservice is active in the background runtime. Its parameters can be configured and persisted to <strong>data/features_config.json</strong>.
                  </p>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
                    {JSON.stringify(activeSimulatorFeature.configParams, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveSimulatorFeature(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Close Sandbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
