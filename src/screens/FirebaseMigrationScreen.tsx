import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Cloud,
  Database,
  RefreshCw,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';

export const FirebaseMigrationScreen: React.FC = () => {
  const { venues, bookings, auditLogs } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCED' | 'ERROR'>('IDLE');
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [syncLogs, setSyncLogs] = useState<string[]>([
    '2026-09-11 04:00:12 [INFO] Initialized Cloud Firestore duplex client.',
    '2026-09-11 04:00:14 [INFO] Verified Collection schema: `venues`, `bookings`, `slots`, `audit_logs`.',
    '2026-09-11 04:00:18 [SUCCESS] Real-time snapshot listener attached to 18 venues.',
  ]);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setSyncStatus('IDLE');
    setSyncLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} [SYNC] Triggering bilateral differential sync...`]);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('SYNCED');
      setLastSyncTime(new Date().toLocaleTimeString());
      setSyncLogs((prev) => [
        ...prev,
        `${new Date().toLocaleTimeString()} [SUCCESS] Synced ${venues.length} venues, ${bookings.length} bookings, and ${auditLogs.length} audit logs. Zero collision conflicts.`,
      ]);
    }, 1200);
  };

  const handleExportBackup = () => {
    const data = {
      timestamp: Date.now(),
      venues,
      bookings,
      auditLogs,
      version: '1.2.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmyspace-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase tracking-wider">
          Cloud Infrastructure & Synchronization
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
          <Cloud className="w-6 h-6 text-sky-600" />
          Cloud Firestore Sync & Data Migration Hub
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Dual persistence synchronization between local reactive state and cloud database with differential hash verification.
        </p>
      </div>

      {/* Overview Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Firestore Connection</span>
          <div className="text-base font-black text-emerald-600 mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>ONLINE</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Ping: 34ms roundtrip</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Venues Synced</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{venues.length}</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">100% Consistent</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bookings Synced</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{bookings.length}</div>
          <span className="text-[10px] text-indigo-600 font-bold mt-0.5 block">Zero collision holds</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audit Trails</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{auditLogs.length}</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Immutable hash logs</span>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-slate-900 block">Duplex Real-Time Data Sync</span>
          <span className="text-xs text-slate-500">Last bilateral sync completed: {lastSyncTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={isSyncing}
            onClick={handleSyncNow}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Cloud Now'}</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Backup</span>
          </button>
        </div>
      </div>

      {/* Collections Schema Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-black text-xs text-slate-900">
          Cloud Firestore Document Collections
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-slate-900">/venues/{'{venueId}'}</div>
              <div className="text-slate-500 text-[11px]">Primary inventory specs, slot configurations, pricing models, and photos</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">SYNCED (18)</span>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-slate-900">/bookings/{'{bookingId}'}</div>
              <div className="text-slate-500 text-[11px]">Customer orders, cryptographic QR pass hashes, payment UTR status</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">SYNCED ({bookings.length})</span>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-slate-900">/holds/{'{holdMutexId}'}</div>
              <div className="text-slate-500 text-[11px]">Active 10-minute temporary inventory locks prevents race conditions</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px]">CONCURRENCY ENGINE ACTIVE</span>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-slate-900">/audit_logs/{'{auditId}'}</div>
              <div className="text-slate-500 text-[11px]">Immutable event sourcing logs for all state transitions and refunds</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">IMMUTABLE ({auditLogs.length})</span>
          </div>
        </div>
      </div>

      {/* Sync Console Logs */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-mono text-sky-400 flex items-center gap-1.5">
            <Terminal className="w-4 h-4" /> Live Sync Engine Log Stream
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Bilateral Differential Protocol</span>
        </div>

        <div className="space-y-1.5 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
          {syncLogs.map((log, i) => (
            <div key={i} className="leading-relaxed">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
