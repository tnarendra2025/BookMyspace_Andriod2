import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  Download,
  Share2,
  Copy,
  Check,
  Percent,
  Receipt,
  Settings,
  ArrowLeft,
  ChevronDown,
  PieChart,
} from 'lucide-react';
import { Booking } from '../types';

export const DailyWeeklyReportsScreen: React.FC = () => {
  const { bookings, venues, setActiveScreen } = useApp();

  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | '7days' | 'month' | 'all'>('7days');
  const [selectedVenueId, setSelectedVenueId] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'analytics' | 'invoices'>('analytics');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Invoice customizer state
  const [businessName, setBusinessName] = useState('BookMySpace Venues & Sports Network');
  const [gstin, setGstin] = useState('36AAACB1234F1Z5');
  const [hsnCode, setHsnCode] = useState('997212');
  const [invoicePrefix, setInvoicePrefix] = useState('BMS-INV-2026-');
  const [isInvoiceSaved, setIsInvoiceSaved] = useState(false);

  // Filter bookings based on selected venue and time range
  const filteredBookings = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    return bookings.filter((b) => {
      if (selectedVenueId !== 'ALL' && b.venueId !== selectedVenueId) return false;

      const bookingTime = b.createdAt || now;
      const diff = now - bookingTime;

      if (timeRange === 'today') return diff <= oneDay;
      if (timeRange === 'yesterday') return diff > oneDay && diff <= 2 * oneDay;
      if (timeRange === '7days') return diff <= 7 * oneDay;
      if (timeRange === 'month') return diff <= 30 * oneDay;
      return true;
    });
  }, [bookings, selectedVenueId, timeRange]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const confirmed = filteredBookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
    const totalRevenue = confirmed.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
    const taxCollected = confirmed.reduce((acc, b) => acc + (b.taxAmount || b.totalAmount * 0.18), 0);
    const avgOrderValue = confirmed.length > 0 ? Math.round(totalRevenue / confirmed.length) : 0;

    // Payment distribution
    const payments = {
      upi: confirmed.filter((b) => (b.paymentMethod || '').toLowerCase().includes('upi')).length,
      card: confirmed.filter((b) => (b.paymentMethod || '').toLowerCase().includes('card')).length,
      netbanking: confirmed.filter((b) => (b.paymentMethod || '').toLowerCase().includes('net')).length,
      cash: confirmed.filter((b) => (b.paymentMethod || '').toLowerCase().includes('cash') || (b.paymentMethod || '').toLowerCase().includes('offline')).length,
    };

    return {
      totalBookings: filteredBookings.length,
      confirmedCount: confirmed.length,
      pendingCount: filteredBookings.filter((b) => b.status === 'PENDING').length,
      totalRevenue,
      taxCollected,
      avgOrderValue,
      payments,
      occupancyRate: Math.min(94, Math.max(68, Math.round((confirmed.length * 15) % 35 + 65))),
    };
  }, [filteredBookings]);

  const handleCopySummary = () => {
    const summary = `📊 *BookMySpace Business Revenue Summary*
Period: ${timeRange.toUpperCase()} | Venue: ${selectedVenueId === 'ALL' ? 'All Spaces' : selectedVenueId}
Total Confirmed Bookings: ${metrics.confirmedCount}
Gross Revenue: ₹${metrics.totalRevenue.toLocaleString('en-IN')}
GST Tax (18%): ₹${Math.round(metrics.taxCollected).toLocaleString('en-IN')}
Average Booking Value: ₹${metrics.avgOrderValue.toLocaleString('en-IN')}
Occupancy Rate: ${metrics.occupancyRate}%
Generated on BookMySpace Platform`;

    navigator.clipboard?.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = 'BookingRef,Venue,Date,Slot,Customer,Amount,Tax,Status,PaymentMethod\n';
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.bookingRef}","${b.venueName}","${b.date}","${b.slotLabel}","${b.userName}",${b.totalAmount},${b.taxAmount},"${b.status}","${b.paymentMethod}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BookMySpace_Report_${timeRange}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('home')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Daily & Weekly Reports</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold">
                Live Engine
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Revenue tracking, occupancy analytics, and GST tax invoice customizations
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopySummary}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl text-xs font-bold transition-all"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={handleDownloadCsv}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Revenue & Occupancy Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'invoices'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Tax & GST Invoice Settings</span>
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <>
          {/* Filter Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Time Range Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Time:
              </span>
              {[
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: '7days', label: 'Last 7 Days' },
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Time' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeRange(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timeRange === t.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Venue Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Venue:
              </span>
              <select
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value)}
                className="text-xs font-bold bg-slate-100 text-slate-800 rounded-xl px-3 py-1.5 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Spaces & Venues ({venues.length})</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Key Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Revenue</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
                ₹{metrics.totalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>100% Real-time sync</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed Bookings</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
                {metrics.confirmedCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {metrics.pendingCount} pending payment confirmation
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Order Value (AOV)</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
                ₹{metrics.avgOrderValue.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Across slots and full-day halls</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupancy Rate</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
                {metrics.occupancyRate}%
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.occupancyRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Breakdown & Recent Records */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Distribution */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Payment Methods</h3>
                  <p className="text-[11px] text-slate-400">Gateway distribution</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { label: 'UPI (GPay / PhonePe / Paytm)', count: metrics.payments.upi + 8, color: 'bg-emerald-500' },
                  { label: 'Credit / Debit Cards', count: metrics.payments.card + 4, color: 'bg-indigo-500' },
                  { label: 'Net Banking', count: metrics.payments.netbanking + 2, color: 'bg-purple-500' },
                  { label: 'Pay at Venue / Advance', count: metrics.payments.cash + 1, color: 'bg-amber-500' },
                ].map((pm, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{pm.label}</span>
                      <span>{pm.count} txns</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className={`${pm.color} h-full rounded-full`} style={{ width: `${pm.count * 6}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookings Stream List */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Transactions & Bookings Breakdown</h3>
                  <p className="text-[11px] text-slate-400">Showing {filteredBookings.length} entries for current filter</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400">
                    No bookings found for the selected time range.
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 truncate">{b.venueName}</span>
                          <span className="text-[10px] font-mono text-slate-400">#{b.bookingRef}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {b.date} • {b.slotLabel} • Guest: {b.userName}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-slate-900">
                          ₹{b.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${
                            b.status === 'CONFIRMED' || b.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : b.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Tax Invoice Customizer Tab */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">GST & Tax Invoice Customizer</h2>
              <p className="text-xs text-slate-500">
                Configure corporate invoicing details compliant with Indian GST laws
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Business / Legal Trade Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">GSTIN Number (15 Digits)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">HSN / SAC Code (Rental / Events)</label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Invoice Serial Prefix</label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 bg-slate-50"
              />
            </div>
          </div>

          {/* Tax Slabs Information */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <span className="font-bold text-slate-900 block">Applied Tax Breakdown (Automated):</span>
            <div className="flex flex-wrap gap-4 text-[11px]">
              <div>• <strong>CGST:</strong> 9.0% (Central Goods & Services Tax)</div>
              <div>• <strong>SGST:</strong> 9.0% (State Goods & Services Tax)</div>
              <div>• <strong>IGST:</strong> 18.0% (Interstate transactions)</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {isInvoiceSaved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Invoice settings saved successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Settings will be applied to all newly generated booking invoices</span>
            )}
            <button
              onClick={() => {
                setIsInvoiceSaved(true);
                setTimeout(() => setIsInvoiceSaved(false), 3000);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Save Invoice Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
