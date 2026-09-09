import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { invoiceModalBooking, setInvoiceModalBooking } = useApp();
  const b = invoiceModalBooking;

  if (!b) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(b.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Official GST Tax Invoice & Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={() => setInvoiceModalBooking(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-base">
                  B
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Book<span className="text-indigo-600">My</span>Space
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">BookMySpace Technologies Pvt Ltd</p>
              <p className="text-[10px] text-slate-400">GSTIN: 36AABCB1234F1Z9 • HSN: 997212</p>
              <p className="text-[10px] text-slate-400">Financial District, Gachibowli, Hyderabad 500081</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                TAX INVOICE - PAID
              </span>
              <div className="text-xs font-mono font-bold text-slate-900 mt-2">
                Invoice No: INV-{b.bookingRef}
              </div>
              <div className="text-[11px] text-slate-500">Date: {formattedDate}</div>
              <div className="text-[11px] text-slate-500">Payment ID: {b.paymentId || 'pay_live_test'}</div>
            </div>
          </div>

          {/* Billed To & Venue Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Billed To (Customer)</div>
              <div className="font-bold text-slate-900 mt-1">{b.userName}</div>
              <div className="text-[11px] text-slate-600">{b.userEmail}</div>
              <div className="text-[11px] text-slate-600">{b.userPhone}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Reserved Venue</div>
              <div className="font-bold text-slate-900 mt-1">{b.venueName}</div>
              <div className="text-[11px] text-slate-600">
                Date: <span className="font-semibold text-slate-900">{b.date}</span>
              </div>
              <div className="text-[11px] text-slate-600">Slot: {b.slotLabel}</div>
              <div className="text-[11px] text-slate-600">Guests: {b.guestCount}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Taxable Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              <tr>
                <td className="py-3">
                  <div className="font-semibold text-slate-900">Space & Facility Reservation</div>
                  <div className="text-[10px] text-slate-400">{b.venueName} • {b.slotLabel}</div>
                </td>
                <td className="py-3 text-right">1</td>
                <td className="py-3 text-right font-medium">₹{b.baseAmount.toLocaleString('en-IN')}</td>
              </tr>

              {b.packageName && (
                <tr>
                  <td className="py-3">
                    <div className="font-semibold text-slate-900">Package: {b.packageName}</div>
                  </td>
                  <td className="py-3 text-right">1</td>
                  <td className="py-3 text-right font-medium">Included</td>
                </tr>
              )}

              <tr>
                <td className="py-3">
                  <div className="font-semibold text-slate-900">BookMySpace Platform Convenience Fee</div>
                </td>
                <td className="py-3 text-right">1</td>
                <td className="py-3 text-right font-medium">₹{b.platformFee}</td>
              </tr>
            </tbody>
          </table>

          {/* Tax Breakdown & Totals */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between gap-4">
            <div className="text-[11px] text-slate-500 space-y-1">
              <div>• Payment Mode: {b.paymentMethod}</div>
              <div>• Cancellation Refund Window: Active per platform policy.</div>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                This is a computer-generated tax invoice and requires no physical signature.
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">₹{(b.baseAmount + b.platformFee).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%):</span>
                <span className="font-semibold text-slate-900">₹{(b.taxAmount / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%):</span>
                <span className="font-semibold text-slate-900">₹{(b.taxAmount / 2).toFixed(2)}</span>
              </div>
              {b.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount:</span>
                  <span>-₹{b.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Total Paid:</span>
                <span className="text-indigo-600">₹{b.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              {b.isAdvancePayment && b.remainingBalanceDue && b.remainingBalanceDue > 0 && (
                <div className="flex justify-between text-[11px] text-amber-700 font-bold pt-1">
                  <span>Balance Due at Venue:</span>
                  <span>₹{b.remainingBalanceDue.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
