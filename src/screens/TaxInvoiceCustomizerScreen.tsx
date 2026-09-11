import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Building2,
  CheckCircle2,
  Printer,
  Download,
  Save,
  Palette,
  ShieldCheck,
  CreditCard,
  Layers,
  ChevronRight,
} from 'lucide-react';

const ACCENT_COLORS = [
  { hex: '#4f46e5', name: 'Indigo' },
  { hex: '#2563eb', name: 'Royal Blue' },
  { hex: '#059669', name: 'Emerald' },
  { hex: '#7c3aed', name: 'Purple' },
  { hex: '#dc2626', name: 'Crimson' },
  { hex: '#0f172a', name: 'Slate Dark' },
];

export const TaxInvoiceCustomizerScreen: React.FC = () => {
  const { venues, currentUser } = useApp();

  const [selectedVenueId, setSelectedVenueId] = useState<string>(venues[0]?.id || 'global');

  // Business & GST Details
  const [businessName, setBusinessName] = useState('Royal Palace Convention & Hospitality Pvt Ltd');
  const [gstin, setGstin] = useState('36AABCR1234F1Z9');
  const [pan, setPan] = useState('AABCR1234F');
  const [stateName, setStateName] = useState('Telangana');
  const [stateCode, setStateCode] = useState('36');
  const [registeredAddress, setRegisteredAddress] = useState(
    'Plot 42, Hitech City Main Road, Madhapur, Hyderabad - 500081'
  );

  // SAC / Tax
  const [sacCode, setSacCode] = useState('997212');
  const [taxRatePercent, setTaxRatePercent] = useState(18);
  const [isInterState, setIsInterState] = useState(false);

  // Bank Details
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [accountNumber, setAccountNumber] = useState('50200081928374');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [accountHolder, setAccountHolder] = useState('Royal Palace Convention & Hospitality');

  // Authorized Signatory
  const [signatoryName, setSignatoryName] = useState('R. K. Varma');
  const [signatoryRole, setSignatoryRole] = useState('Authorized Signatory & Managing Director');

  // Styling & Terms
  const [accentColor, setAccentColor] = useState('#4f46e5');
  const [termsText, setTermsText] = useState(
    '1. 100% full refund if cancelled 30 days prior. 2. Any damage to property is subject to penalty. 3. Jurisdiction is Hyderabad, Telangana.'
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sample calculations for the Live Invoice Preview
  const basePrice = 35000;
  const halfTax = basePrice * (taxRatePercent / 200);
  const totalTax = basePrice * (taxRatePercent / 100);
  const totalAmount = basePrice + totalTax;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
            Finance, GST & Legal Compliance Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            GST Tax Invoice & HSN/SAC Configurator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure GSTIN, SAC codes, banking settlement details, and customize the printable tax invoice template.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Settings (5 Cols) */}
        <form onSubmit={handleSave} className="lg:col-span-5 space-y-5">
          {/* Venue Selector */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Configure Invoice For:</label>
            <select
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
            >
              <option value="global">Platform Default Template (BookMySpace)</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.category.name})
                </option>
              ))}
            </select>
          </div>

          {/* Business & GST Profile */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-black text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Trade Entity & Tax Identifiers
            </h3>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Legal Trade / Entity Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">PAN Number</label>
                <input
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">State Code</label>
                <input
                  type="text"
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">SAC Code</label>
                <select
                  value={sacCode}
                  onChange={(e) => setSacCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                >
                  <option value="997212">997212 (Banquet & Hall Rentals)</option>
                  <option value="999651">999651 (Sports & Turf Facility)</option>
                  <option value="996311">996311 (Hostel / Accommodation)</option>
                  <option value="999293">999293 (Coaching & Tuition)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Registered Billing Address</label>
              <textarea
                rows={2}
                value={registeredAddress}
                onChange={(e) => setRegisteredAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Bank Settlement Details */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-black text-slate-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Settlement Bank Account
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Signatory & Accent Color */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-black text-slate-900 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-600" />
              Signatory & Template Branding
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Authorized Person</label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Designation</label>
                <input
                  type="text"
                  value={signatoryRole}
                  onChange={(e) => setSignatoryRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Invoice Accent Brand Color</label>
              <div className="flex gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setAccentColor(c.hex)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      accentColor === c.hex ? 'scale-110 border-slate-900' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Template Saved!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Invoice Template</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live GST Tax Invoice Preview (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 text-slate-800 text-xs">
          {/* Header Row */}
          <div className="border-b-2 pb-4 flex justify-between items-start" style={{ borderColor: accentColor }}>
            <div>
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded text-white inline-block mb-1"
                style={{ backgroundColor: accentColor }}
              >
                TAX INVOICE
              </span>
              <h2 className="text-base font-black text-slate-900">{businessName}</h2>
              <p className="text-[11px] text-slate-500 max-w-sm">{registeredAddress}</p>
              <p className="text-[11px] font-mono text-slate-600 font-semibold mt-1">
                GSTIN: {gstin} | PAN: {pan} | State Code: {stateCode} ({stateName})
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="text-sm font-black text-slate-900">INVOICE #BMS-2026-9042</div>
              <div className="text-[11px] text-slate-500">Date: {new Date().toLocaleDateString('en-IN')}</div>
              <div className="text-[11px] text-slate-500">SAC Code: {sacCode}</div>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed To (Customer):</span>
              <div className="font-bold text-slate-900">Anil Kumar Sharma</div>
              <div className="text-slate-500 text-[11px]">+91 98490 11223</div>
              <div className="text-slate-500 text-[11px]">Hyderabad, Telangana</div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Booking Particulars:</span>
              <div className="font-bold text-slate-900">Morning Muhurtham Slot (07:00 AM - 02:00 PM)</div>
              <div className="text-slate-500 text-[11px]">Venue: Royal Palace Grand Banquet Hall</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5 text-center">SAC Code</th>
                  <th className="p-2.5 text-right">Taxable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5">
                    <div className="font-bold text-slate-900">Banquet & Convention Hall Rental</div>
                    <div className="text-[10px] text-slate-500">Zero double-booking guarantee lock</div>
                  </td>
                  <td className="p-2.5 text-center font-mono">{sacCode}</td>
                  <td className="p-2.5 text-right font-bold text-slate-900">₹{basePrice.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span className="font-semibold">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>

              {!isInterState ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (9.0%):</span>
                    <span className="font-semibold">₹{halfTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (9.0%):</span>
                    <span className="font-semibold">₹{halfTax.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-600">
                  <span>IGST (18.0%):</span>
                  <span className="font-semibold">₹{totalTax.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div
                className="flex justify-between text-sm font-black pt-2 border-t text-slate-900"
                style={{ borderColor: accentColor }}
              >
                <span>Total Payable:</span>
                <span style={{ color: accentColor }}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Bank & Signatory Footer */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Account for NEFT/RTGS:</span>
              <div className="font-semibold text-[11px] text-slate-800">{bankName}</div>
              <div className="font-mono text-[10px] text-slate-600">A/C: {accountNumber}</div>
              <div className="font-mono text-[10px] text-slate-600">IFSC: {ifscCode}</div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">For {businessName}:</span>
              <div className="h-10"></div>
              <div className="font-bold text-slate-900 text-xs">{signatoryName}</div>
              <div className="text-[10px] text-slate-500">{signatoryRole}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500">
            <span className="font-bold text-slate-700 block mb-0.5">Terms & Conditions:</span>
            {termsText}
          </div>
        </div>
      </div>
    </div>
  );
};
