import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Activity,
  ShieldCheck,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Zap,
  RefreshCw,
  X,
  FileText,
  Sliders,
} from 'lucide-react';
import { PaymentTransactionRecord } from '../types';
import { SAMPLE_PAYMENT_TRANSACTIONS } from '../data/mockData';

export const PaymentHealthAndConfigScreen: React.FC = () => {
  const { auditLogs } = useApp();

  const [transactions, setTransactions] = useState<PaymentTransactionRecord[]>(SAMPLE_PAYMENT_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<'health' | 'transactions' | 'reconciliation'>('health');
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Chaos / Resilience Simulation state
  const [isHealing, setIsHealing] = useState(false);
  const [healResult, setHealResult] = useState<string | null>(null);

  // Refund Modal state
  const [refundTarget, setRefundTarget] = useState<PaymentTransactionRecord | null>(null);
  const [refundReason, setRefundReason] = useState('Customer cancellation within permitted policy window');
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      searchQuery === '' ||
      t.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.utrOrRrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.venueName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRunAutoHeal = () => {
    setIsHealing(true);
    setHealResult(null);
    setTimeout(() => {
      setIsHealing(false);
      setHealResult(
        '✓ Auto-Healing Completed: Scanned 120 slot holds. 2 expired locks safely recycled back to public inventory. 1 pending webhook ACK resolved with Razorpay signature verification.'
      );
    }, 1000);
  };

  const handleConfirmRefund = () => {
    if (!refundTarget) return;
    setIsProcessingRefund(true);
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === refundTarget.id ? { ...t, status: 'REFUNDED' } : t))
      );
      setIsProcessingRefund(false);
      setRefundTarget(null);
    }, 700);
  };

  const orphanedQueue = [
    {
      id: 'orph_1',
      utr: 'UPI-RR-881940128',
      amount: 716,
      venue: 'Smash Arena BWF Courts',
      guest: 'Prakash Rao',
      issue: 'Payment captured on UPI gateway but browser closed before callback confirmation.',
      time: '14 minutes ago',
    },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
            Finance & Concurrency Reliability
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            Payment Health, Gateway Concurrency & Audit Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time gateway latency, run self-healing inventory diagnostics, and manage refund reconciliation.
          </p>
        </div>

        {/* Sandbox vs Live Switcher */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-600">Gateway Mode:</span>
          <button
            onClick={() => setIsSandboxMode(!isSandboxMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              isSandboxMode
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-600 text-white shadow-xs'
            }`}
          >
            {isSandboxMode ? 'SANDBOX / TEST' : 'LIVE PRODUCTION'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('health')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'health' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Gateway Health & Resilience</span>
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'transactions' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Transactions Ledger ({transactions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'reconciliation' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Orphaned Reconciliation ({orphanedQueue.length})</span>
        </button>
      </div>

      {/* Tab 1: Gateway Health & Self-Healing */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* Uptime & Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gateway Uptime</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">99.98%</div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Last 30 days rolling</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">UPI Intent P95</span>
              <div className="text-2xl font-black text-slate-900 mt-1">112ms</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">Optimal performance</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Webhook Delivery Rate</span>
              <div className="text-2xl font-black text-slate-900 mt-1">100%</div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Zero drops recorded</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inventory Mutex Status</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">HEALTHY</div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">10-Min auto timeout engine active</span>
            </div>
          </div>

          {/* Connected Gateway Pipes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">Live Gateway Pipes Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Razorpay Standard PG</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xs text-slate-500">Latency: <strong>142ms</strong> • Success Rate: <strong>99.4%</strong></div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold inline-block">
                  LIVE PIPELINE
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Direct UPI Dynamic QR / Intent</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xs text-slate-500">Latency: <strong>85ms</strong> • Success Rate: <strong>99.8%</strong></div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold inline-block">
                  INSTANT SETTLEMENT
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Host Walk-in Cash / POS</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                </div>
                <div className="text-xs text-slate-500">Counter verification • Synchronized mutex</div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold inline-block">
                  OFFLINE CONVERGENCE
                </span>
              </div>
            </div>
          </div>

          {/* Self-Healing & Resilience Testbed */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Self-Healing Engine & Concurrency Diagnostic
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detects orphaned temporary holds, reconciles interrupted payment webhooks, and verifies slot mutex integrity.
                </p>
              </div>

              <button
                disabled={isHealing}
                onClick={handleRunAutoHeal}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-md active:scale-95 transition-all shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isHealing ? 'animate-spin' : ''}`} />
                <span>{isHealing ? 'Diagnosing & Healing...' : 'Run Auto-Heal Diagnostic'}</span>
              </button>
            </div>

            {healResult && (
              <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-mono">
                {healResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Transactions Ledger */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search UTR, Booking Ref, Guest Name..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              {['ALL', 'CAPTURED', 'REFUNDED', 'RECONCILED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((txn) => (
              <div key={txn.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{txn.bookingRef}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                      {txn.paymentMethod}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        txn.status === 'CAPTURED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : txn.status === 'REFUNDED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {txn.guestName} • {txn.venueName} • <span className="font-mono text-[11px] text-slate-400">UTR: {txn.utrOrRrn}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-black text-slate-900 text-sm">₹{txn.amount.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400">{new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>

                  {txn.status === 'CAPTURED' && (
                    <button
                      onClick={() => setRefundTarget(txn)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Refund
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Orphaned Reconciliation Queue */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Orphaned Payment Reconciliation Queue (Rule #41 Compliance)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              When a guest's bank account is debited but the browser crashes before booking status transitions to CONFIRMED, our engine intercepts the payment and flags it here for auto-reconciliation.
            </p>
          </div>

          <div className="space-y-3">
            {orphanedQueue.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{item.utr}</span>
                    <span className="font-black text-xs text-slate-900">₹{item.amount}</span>
                    <span className="text-[10px] text-slate-500">{item.time}</span>
                  </div>
                  <div className="text-xs text-slate-700">Guest: <strong>{item.guest}</strong> • Venue: <strong>{item.venue}</strong></div>
                  <p className="text-[11px] text-amber-800">{item.issue}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Reconciled and confirmed booking for ${item.guest}. Ticket QR issued.`)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => alert(`Initiated instant 100% refund of ₹${item.amount} back to ${item.guest} UPI handle.`)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Refund Guest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Initiate Instant Refund</h3>
              <button onClick={() => setRefundTarget(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Ref:</span>
                  <span className="font-mono font-bold text-slate-800">{refundTarget.bookingRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Guest Name:</span>
                  <span className="font-bold text-slate-800">{refundTarget.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Refund Amount:</span>
                  <span className="font-black text-rose-600">₹{refundTarget.amount}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Refund</label>
                <textarea
                  rows={2}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setRefundTarget(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                disabled={isProcessingRefund}
                onClick={handleConfirmRefund}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                {isProcessingRefund ? 'Processing...' : 'Confirm Full Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
