import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ListFilter,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  CheckCircle2,
  Layers,
  X,
  Eye,
  Sliders,
  Sparkles,
  Camera,
  ShieldCheck,
  FileText,
  Building,
  RotateCcw,
  Search,
  Check,
  AlertCircle,
  HelpCircle,
  Zap,
  Home,
  SlidersHorizontal,
} from 'lucide-react';
import {
  CustomerRegistrationField,
  RegistrationFieldType,
  RegistrationFieldCategoryScope,
  CustomerRegistrationData,
} from '../types';
import { CustomerRegistrationForm } from '../components/CustomerRegistrationForm';

interface ConfigField {
  id: string;
  key: string;
  label: string;
  category: 'ALL' | 'BANQUET' | 'TURF' | 'PG_HOSTEL' | 'ACADEMY';
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DROPDOWN' | 'TEXTAREA';
  isRequired: boolean;
  helpText: string;
  options?: string[];
  displayOrder: number;
}

const INITIAL_LISTING_FIELDS: ConfigField[] = [
  {
    id: 'f1',
    key: 'muhurtham_morning_slot',
    label: 'Morning Muhurtham Slot Support (07:00 AM - 02:00 PM)',
    category: 'BANQUET',
    type: 'BOOLEAN',
    isRequired: true,
    helpText: 'Locks morning auspicious marriage window for traditional ceremonies',
    displayOrder: 1,
  },
  {
    id: 'f2',
    key: 'fire_safety_noc',
    label: 'Fire Safety NOC Certificate Number',
    category: 'BANQUET',
    type: 'TEXT',
    isRequired: true,
    helpText: 'Mandatory municipal fire department clearance code',
    displayOrder: 2,
  },
  {
    id: 'f3',
    key: 'valet_parking_capacity',
    label: 'Valet Car Parking Capacity',
    category: 'BANQUET',
    type: 'NUMBER',
    isRequired: false,
    helpText: 'Total vehicles managed by dedicated valet drivers',
    displayOrder: 3,
  },
  {
    id: 'f4',
    key: 'bwf_mat_spec',
    label: 'Badminton Flooring Specification',
    category: 'TURF',
    type: 'DROPDOWN',
    isRequired: true,
    helpText: 'BWF certified tournament wooden cushion or vinyl synthetic',
    options: ['BWF Grade 1 Teak Wood', 'Vinyl Mat on Rubber Cushion', 'Standard Hardcourt'],
    displayOrder: 4,
  },
  {
    id: 'f5',
    key: 'food_plan_type',
    label: 'Included Food & Mess Plan',
    category: 'PG_HOSTEL',
    type: 'DROPDOWN',
    isRequired: true,
    helpText: 'Meal service included in monthly room rent',
    options: ['3 Times South & North Indian Food', 'Breakfast & Dinner Only', 'Self-Cooking Kitchen Allowed'],
    displayOrder: 5,
  },
  {
    id: 'f6',
    key: 'faculty_accreditation',
    label: 'Lead Faculty Qualifications',
    category: 'ACADEMY',
    type: 'TEXTAREA',
    isRequired: false,
    helpText: 'Notable ranks, degrees, and civil service coaching accolades',
    displayOrder: 6,
  },
];

export const ListingFieldsConfigScreen: React.FC = () => {
  const {
    customerRegistrationFields,
    updateRegistrationField,
    toggleRegistrationFieldEnabled,
    toggleRegistrationFieldRequired,
    setRegistrationFieldRequirement,
    batchSetRegistrationRequirement,
    applyRegistrationPreset,
    addRegistrationField,
    deleteRegistrationField,
    resetRegistrationFields,
    currentUser,
  } = useApp();

  // Mode: KYC Registration Fields (Payment Flow) vs Venue Property Attributes
  const [activeMode, setActiveMode] = useState<'REGISTRATION_KYC' | 'VENUE_ATTRIBUTES'>('REGISTRATION_KYC');

  // KYC Screen State
  const [kycCategoryFilter, setKycCategoryFilter] = useState<'ALL' | 'PG_HOSTEL' | 'HOTEL' | 'FUNCTION_HALL'>('ALL');
  const [kycRequirementFilter, setKycRequirementFilter] = useState<'ALL' | 'MANDATORY' | 'OPTIONAL' | 'DISABLED'>('ALL');
  const [kycSearchQuery, setKycSearchQuery] = useState('');
  const [showKycPreview, setShowKycPreview] = useState(false);
  const [previewCategory, setPreviewCategory] = useState<'pg_hostel' | 'hotel_stay' | 'function_hall'>('pg_hostel');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((cur) => (cur?.text === text ? null : cur));
    }, 3000);
  };

  const [previewFormData, setPreviewFormData] = useState<CustomerRegistrationData>({
    fullName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    policeVerificationConsent: true,
  });

  // Edit / Add Modal for Customer Registration Fields
  const [showKycModal, setShowKycModal] = useState(false);
  const [editingKycField, setEditingKycField] = useState<CustomerRegistrationField | null>(null);
  const [kycLabel, setKycLabel] = useState('');
  const [kycKey, setKycKey] = useState('');
  const [kycType, setKycType] = useState<RegistrationFieldType>('TEXT');
  const [kycCategoryScope, setKycCategoryScope] = useState<RegistrationFieldCategoryScope>('ALL');
  const [kycIsRequired, setKycIsRequired] = useState(false);
  const [kycIsEnabled, setKycIsEnabled] = useState(true);
  const [kycHelpText, setKycHelpText] = useState('');
  const [kycPlaceholder, setKycPlaceholder] = useState('');
  const [kycOptionsStr, setKycOptionsStr] = useState('');

  // Venue Listing Fields State (Tab 2)
  const [listingFields, setListingFields] = useState<ConfigField[]>(INITIAL_LISTING_FIELDS);
  const [selectedListingCat, setSelectedListingCat] = useState<'ALL' | 'BANQUET' | 'TURF' | 'PG_HOSTEL' | 'ACADEMY'>('ALL');
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [editingListingFieldId, setEditingListingFieldId] = useState<string | null>(null);
  const [listingLabel, setListingLabel] = useState('');
  const [listingKeyName, setListingKeyName] = useState('');
  const [listingCategory, setListingCategory] = useState<'ALL' | 'BANQUET' | 'TURF' | 'PG_HOSTEL' | 'ACADEMY'>('BANQUET');
  const [listingType, setListingType] = useState<'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DROPDOWN' | 'TEXTAREA'>('TEXT');
  const [listingIsRequired, setListingIsRequired] = useState(false);
  const [listingHelpText, setListingHelpText] = useState('');
  const [listingOptionsStr, setListingOptionsStr] = useState('');

  // Filtered Customer Registration Fields
  const filteredKycFields = customerRegistrationFields
    .filter((f) => {
      if (kycCategoryFilter !== 'ALL' && f.categoryScope !== 'ALL' && f.categoryScope !== kycCategoryFilter) {
        return false;
      }
      if (kycRequirementFilter === 'MANDATORY' && (!f.isEnabled || !f.isRequired)) {
        return false;
      }
      if (kycRequirementFilter === 'OPTIONAL' && (!f.isEnabled || f.isRequired)) {
        return false;
      }
      if (kycRequirementFilter === 'DISABLED' && f.isEnabled) {
        return false;
      }
      if (kycSearchQuery.trim()) {
        const q = kycSearchQuery.toLowerCase();
        return (
          f.label.toLowerCase().includes(q) ||
          f.key.toLowerCase().includes(q) ||
          (f.helpText && f.helpText.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Statistics
  const totalKycFields = customerRegistrationFields.length;
  const enabledKycFields = customerRegistrationFields.filter((f) => f.isEnabled).length;
  const requiredKycFields = customerRegistrationFields.filter((f) => f.isEnabled && f.isRequired).length;
  const optionalKycFields = customerRegistrationFields.filter((f) => f.isEnabled && !f.isRequired).length;
  const disabledKycFields = customerRegistrationFields.filter((f) => !f.isEnabled).length;

  const handleOpenKycModal = (fieldToEdit?: CustomerRegistrationField) => {
    if (fieldToEdit) {
      setEditingKycField(fieldToEdit);
      setKycLabel(fieldToEdit.label);
      setKycKey(fieldToEdit.key);
      setKycType(fieldToEdit.type);
      setKycCategoryScope(fieldToEdit.categoryScope);
      setKycIsRequired(fieldToEdit.isRequired);
      setKycIsEnabled(fieldToEdit.isEnabled);
      setKycHelpText(fieldToEdit.helpText || '');
      setKycPlaceholder(fieldToEdit.placeholder || '');
      setKycOptionsStr(fieldToEdit.options?.join(', ') || '');
    } else {
      setEditingKycField(null);
      setKycLabel('');
      setKycKey('');
      setKycType('TEXT');
      setKycCategoryScope(kycCategoryFilter === 'ALL' ? 'ALL' : kycCategoryFilter);
      setKycIsRequired(false);
      setKycIsEnabled(true);
      setKycHelpText('');
      setKycPlaceholder('');
      setKycOptionsStr('');
    }
    setShowKycModal(true);
  };

  const handleSaveKycField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycLabel.trim()) return;

    const generatedKey = kycKey.trim() || kycLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const parsedOptions =
      kycType === 'DROPDOWN' ? kycOptionsStr.split(',').map((s) => s.trim()).filter(Boolean) : undefined;

    if (editingKycField) {
      updateRegistrationField({
        ...editingKycField,
        label: kycLabel.trim(),
        key: generatedKey,
        type: kycType,
        categoryScope: kycCategoryScope,
        isRequired: kycIsRequired,
        isEnabled: kycIsEnabled,
        helpText: kycHelpText.trim(),
        placeholder: kycPlaceholder.trim(),
        options: parsedOptions,
      });
    } else {
      addRegistrationField({
        label: kycLabel.trim(),
        key: generatedKey,
        type: kycType,
        categoryScope: kycCategoryScope,
        isRequired: kycIsRequired,
        isEnabled: kycIsEnabled,
        helpText: kycHelpText.trim(),
        placeholder: kycPlaceholder.trim(),
        options: parsedOptions,
        displayOrder: customerRegistrationFields.length + 1,
      });
    }

    setShowKycModal(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-6xl mx-auto px-3 sm:px-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
              Admin & Owner Field Governance
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Live in Payment Flow
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Customer Registration & KYC Fields Configurator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enable, disable, or customize mandatory customer details collected during checkout for Hostel/PG, Hotel, and Function Hall bookings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeMode === 'REGISTRATION_KYC' && (
            <>
              <button
                onClick={() => setShowKycPreview(!showKycPreview)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>{showKycPreview ? 'Back to Config List' : 'Live Form Preview'}</span>
              </button>

              <button
                onClick={() => handleOpenKycModal()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom KYC Field</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 max-w-xl">
        <button
          onClick={() => {
            setActiveMode('REGISTRATION_KYC');
            setShowKycPreview(false);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeMode === 'REGISTRATION_KYC'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Customer Registration & KYC (Payment)</span>
          <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded-full">
            {totalKycFields}
          </span>
        </button>

        <button
          onClick={() => setActiveMode('VENUE_ATTRIBUTES')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeMode === 'VENUE_ATTRIBUTES'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Venue Property Specs (Host Creation)</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* MODE 1: CUSTOMER REGISTRATION & KYC FIELDS (PAYMENT CHECKOUT FLOW) */}
      {/* ==================================================================== */}
      {activeMode === 'REGISTRATION_KYC' && !showKycPreview && (
        <div className="space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div
                className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border ${
                  toastMessage.type === 'success'
                    ? 'bg-slate-900 text-white border-slate-700'
                    : 'bg-indigo-900 text-white border-indigo-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{toastMessage.text}</span>
              </div>
            </div>
          )}

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Schema</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalKycFields}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Plug & Play fields</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-2xs">
              <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                <span>★ Mandatory</span>
              </div>
              <div className="text-2xl font-black text-rose-700 mt-1">{requiredKycFields}</div>
              <div className="text-[11px] text-rose-600/80 mt-0.5">Required before pay</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
              <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                <span>✓ Optional</span>
              </div>
              <div className="text-2xl font-black text-amber-700 mt-1">{optionalKycFields}</div>
              <div className="text-[11px] text-amber-600/80 mt-0.5">Guest discretion</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">⊘ Off (Disabled)</div>
                <div className="text-2xl font-black text-slate-600 mt-1">{disabledKycFields}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all registration fields to official top 20 default configuration?')) {
                    resetRegistrationFields();
                    showToast('Reset all fields to Top 20 balanced defaults', 'info');
                  }
                }}
                className="mt-2 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3 h-3" /> Reset Defaults
              </button>
            </div>
          </div>

          {/* ⚡ PLUG & PLAY PRESETS SECTION */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Plug & Play Industry Presets
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Quick Requirement Packs for Admin & Venue Owners
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                  Switch all mandatory, optional, and disabled fields in 1 click. Presets automatically calibrate compliance for PGs, Hotels, and Function Halls.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Active Role</span>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  {currentUser.role} (Governing)
                </span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  id: 'EXPRESS' as const,
                  name: 'Express Check-In',
                  tag: 'Zero Friction (20 Sec)',
                  desc: 'Only Name & Phone required. ID proofs optional. Rest turned off.',
                  counts: '2 Mandatory • 3 Optional • 16 Off',
                  icon: Zap,
                  theme: 'from-emerald-500/20 to-emerald-900/40 border-emerald-500/40 text-emerald-300',
                  btn: 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950',
                },
                {
                  id: 'HOSTEL_PG' as const,
                  name: 'PG & Hostel Inmate',
                  tag: 'Student & Working PG',
                  desc: 'Room stay, Guardian contact, Workplace/College, Live Photo, Food Mess mandatory.',
                  counts: '18 Mandatory • 3 Optional • 0 Off',
                  icon: Home,
                  theme: 'from-purple-500/20 to-purple-900/40 border-purple-500/40 text-purple-300',
                  btn: 'bg-purple-400 hover:bg-purple-300 text-purple-950',
                },
                {
                  id: 'HOTEL_STANDARD' as const,
                  name: 'Hotel & Transit Guest',
                  tag: 'Star Hotels & Lodges',
                  desc: 'Govt ID Proof, Live Photo, Origin City, and Vehicle Number mandatory.',
                  counts: '10 Mandatory • 7 Optional • 4 Off',
                  icon: Building,
                  theme: 'from-blue-500/20 to-blue-900/40 border-blue-500/40 text-blue-300',
                  btn: 'bg-blue-400 hover:bg-blue-300 text-blue-950',
                },
                {
                  id: 'STRICT_POLICE' as const,
                  name: 'Strict Police KYC',
                  tag: 'Statutory Verification',
                  desc: 'Aadhaar UIDAI, Live Photo, Permanent Address, Police Consent, Emergency Contact.',
                  counts: '14 Mandatory • 7 Optional • 0 Off',
                  icon: ShieldCheck,
                  theme: 'from-indigo-500/20 to-indigo-900/40 border-indigo-500/40 text-indigo-300',
                  btn: 'bg-indigo-400 hover:bg-indigo-300 text-indigo-950',
                },
                {
                  id: 'FUNCTION_HALL' as const,
                  name: 'Banquet & Event Host',
                  tag: 'Weddings & Conventions',
                  desc: 'Organizer KYC: Event Purpose, Headcount split, Secondary Coordinator mandatory.',
                  counts: '11 Mandatory • 6 Optional • 4 Off',
                  icon: Sparkles,
                  theme: 'from-amber-500/20 to-amber-900/40 border-amber-500/40 text-amber-300',
                  btn: 'bg-amber-400 hover:bg-amber-300 text-amber-950',
                },
                {
                  id: 'BALANCED' as const,
                  name: 'Top 20 Balanced',
                  tag: 'All-Venue Standard',
                  desc: 'Balanced official master configuration covering all venue categories seamlessly.',
                  counts: '14 Mandatory • 7 Optional • 0 Off',
                  icon: RotateCcw,
                  theme: 'from-slate-700/40 to-slate-800/40 border-slate-600 text-slate-300',
                  btn: 'bg-slate-200 hover:bg-white text-slate-900',
                },
              ].map((p) => {
                const IconComponent = p.icon;
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border bg-gradient-to-br ${p.theme} flex flex-col justify-between space-y-3 transition-all hover:scale-[1.01]`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white">
                          {p.tag}
                        </span>
                        <IconComponent className="w-4 h-4 text-white/80" />
                      </div>
                      <h3 className="text-sm font-black text-white mt-1.5">{p.name}</h3>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{p.desc}</p>
                      <div className="text-[10px] font-mono text-white/70 mt-2 bg-black/20 px-2 py-1 rounded-lg">
                        {p.counts}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        applyRegistrationPreset(p.id);
                        showToast(`⚡ Plug & Play preset "${p.name}" applied successfully!`);
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${p.btn}`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Apply Preset (1-Click)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Bar, Requirement Selector & Batch Actions */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Top Row: Category Scope & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Category Scope Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
                <span className="text-slate-400 text-xs mr-1 hidden sm:inline">Venue Scope:</span>
                {[
                  { key: 'ALL', label: 'All Venues' },
                  { key: 'PG_HOSTEL', label: 'PG & Hostels' },
                  { key: 'HOTEL', label: 'Hotels' },
                  { key: 'FUNCTION_HALL', label: 'Function Halls' },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setKycCategoryFilter(c.key as any)}
                    className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap text-xs ${
                      kycCategoryFilter === c.key
                        ? 'bg-indigo-600 text-white shadow-2xs font-extrabold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={kycSearchQuery}
                  onChange={(e) => setKycSearchQuery(e.target.value)}
                  placeholder="Search label, key, or UIDAI..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Bottom Row: Requirement Filter Tabs & Batch Operation Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {/* Requirement Filters */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-xs mr-1 hidden sm:inline font-bold">Show:</span>
                {[
                  { key: 'ALL', label: 'All Fields', count: totalKycFields },
                  { key: 'MANDATORY', label: '★ Mandatory', count: requiredKycFields },
                  { key: 'OPTIONAL', label: '✓ Optional', count: optionalKycFields },
                  { key: 'DISABLED', label: '⊘ Off', count: disabledKycFields },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setKycRequirementFilter(tab.key as any)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      kycRequirementFilter === tab.key
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        kycRequirementFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Batch Action Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 mr-1 hidden md:inline">Batch Actions ({filteredKycFields.length}):</span>
                <button
                  type="button"
                  onClick={() => {
                    const ids = filteredKycFields.map((f) => f.id);
                    if (ids.length === 0) return;
                    batchSetRegistrationRequirement(ids, 'MANDATORY');
                    showToast(`Set ${ids.length} visible fields to Mandatory ★`);
                  }}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
                  title="Make all currently filtered fields mandatory"
                >
                  ★ All Mandatory
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const ids = filteredKycFields.map((f) => f.id);
                    if (ids.length === 0) return;
                    batchSetRegistrationRequirement(ids, 'OPTIONAL');
                    showToast(`Set ${ids.length} visible fields to Optional ✓`);
                  }}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
                  title="Make all currently filtered fields optional"
                >
                  ✓ All Optional
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const ids = filteredKycFields.map((f) => f.id);
                    if (ids.length === 0) return;
                    batchSetRegistrationRequirement(ids, 'DISABLED');
                    showToast(`Turned OFF ${ids.length} visible fields`);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-colors"
                  title="Turn off all currently filtered fields"
                >
                  ⊘ All Off
                </button>
              </div>
            </div>
          </div>

          {/* Fields Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredKycFields.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                No fields match the selected scope & requirement filter.
              </div>
            ) : (
              filteredKycFields.map((field) => {
                const isAadhaar = field.type === 'AADHAAR';
                const isPhoto = field.type === 'LIVE_PHOTO';

                return (
                  <div
                    key={field.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      !field.isEnabled
                        ? 'bg-slate-50/70 border-slate-200 opacity-60'
                        : field.isRequired
                        ? 'bg-white border-rose-200 shadow-2xs ring-1 ring-rose-500/20'
                        : 'bg-white border-amber-200/80 shadow-2xs ring-1 ring-amber-500/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-sm text-slate-900">{field.label}</span>
                          {isPhoto && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                              <Camera className="w-3 h-3" /> Live Camera
                            </span>
                          )}
                          {isAadhaar && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> UIDAI KYC
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 flex-wrap">
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                            {field.type}
                          </span>
                          <span>•</span>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                            {field.categoryScope === 'ALL'
                              ? 'Universal (All Venues)'
                              : field.categoryScope === 'PG_HOSTEL'
                              ? 'Hostel / PG Only'
                              : field.categoryScope === 'HOTEL'
                              ? 'Hotels Only'
                              : 'Function Halls Only'}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">key: {field.key}</span>
                        </div>

                        {field.helpText && (
                          <p className="text-xs text-slate-600 pt-1 leading-snug">{field.helpText}</p>
                        )}
                      </div>

                      {/* Current Status Pill */}
                      <div className="shrink-0">
                        {!field.isEnabled ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200">
                            ⊘ Off
                          </span>
                        ) : field.isRequired ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <span className="text-rose-600">★</span> Mandatory
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Check className="w-3 h-3 text-amber-600" /> Optional
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Plug & Play Tactile 3-State Segmented Switcher */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                        {/* 1. OFF */}
                        <button
                          type="button"
                          onClick={() => {
                            setRegistrationFieldRequirement(field.id, 'DISABLED');
                            showToast(`"${field.label}" turned OFF (Hidden at checkout)`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            !field.isEnabled
                              ? 'bg-slate-800 text-white shadow-xs font-black'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                          title="Disable this field from checkout"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Off</span>
                        </button>

                        {/* 2. OPTIONAL */}
                        <button
                          type="button"
                          onClick={() => {
                            setRegistrationFieldRequirement(field.id, 'OPTIONAL');
                            showToast(`"${field.label}" set to Optional`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            field.isEnabled && !field.isRequired
                              ? 'bg-amber-500 text-white shadow-xs font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Show field as optional"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Optional</span>
                        </button>

                        {/* 3. MANDATORY */}
                        <button
                          type="button"
                          onClick={() => {
                            setRegistrationFieldRequirement(field.id, 'MANDATORY');
                            showToast(`"${field.label}" set to Mandatory ★`);
                          }}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            field.isEnabled && field.isRequired
                              ? 'bg-rose-600 text-white shadow-xs font-black ring-1 ring-rose-700'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Require customer to fill this field before paying"
                        >
                          <span className="text-amber-200">★</span>
                          <span>Mandatory *</span>
                        </button>
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleOpenKycModal(field)}
                          className="px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1"
                          title="Edit Field Schema Details"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>

                        {!field.id.startsWith('reg_') && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete custom field "${field.label}"?`)) {
                                deleteRegistrationField(field.id);
                                showToast(`Deleted custom field "${field.label}"`);
                              }
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg border border-slate-200"
                            title="Delete Custom Field"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 1 PREVIEW: LIVE REGISTRATION FORM PREVIEW */}
      {/* ==================================================================== */}
      {activeMode === 'REGISTRATION_KYC' && showKycPreview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
            <div>
              <h3 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                Live Customer Checkout Simulator
              </h3>
              <p className="text-xs text-indigo-800 mt-0.5">
                This is the exact KYC and live photo registration step the customer experiences during booking payment.
              </p>
            </div>

            {/* Category Simulator Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Simulate As:</span>
              <select
                value={previewCategory}
                onChange={(e) => setPreviewCategory(e.target.value as any)}
                className="text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-indigo-200 text-indigo-900"
              >
                <option value="pg_hostel">Hostel & PG (Inmate KYC)</option>
                <option value="hotel_stay">Hotel Room (Transit Guest)</option>
                <option value="function_hall">Function Hall (Organizer KYC)</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl max-w-2xl mx-auto">
            <CustomerRegistrationForm
              categorySlug={previewCategory}
              fields={customerRegistrationFields}
              formData={previewFormData}
              onChange={setPreviewFormData}
            />

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => alert('Customer Registration Verified Successfully!')}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Simulate Continue to Pay →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 2: VENUE PROPERTY SPECS (LISTING CREATION ATTRIBUTES) */}
      {/* ==================================================================== */}
      {activeMode === 'VENUE_ATTRIBUTES' && (
        <div className="space-y-4">
          <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {[
              { key: 'ALL', label: 'All Venue Types' },
              { key: 'BANQUET', label: 'Banquets & Halls' },
              { key: 'TURF', label: 'Sports Turfs & Courts' },
              { key: 'PG_HOSTEL', label: 'PG & Co-Living' },
              { key: 'ACADEMY', label: 'Coaching & Academies' },
            ].map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedListingCat(c.key as any)}
                className={`px-3.5 py-2 rounded-xl transition-colors ${
                  selectedListingCat === c.key
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {listingFields
              .filter(
                (f) =>
                  selectedListingCat === 'ALL' ||
                  f.category === selectedListingCat ||
                  f.category === 'ALL'
              )
              .map((field) => (
                <div key={field.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{field.label}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                        {field.type}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                        {field.category}
                      </span>
                      {field.isRequired && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{field.helpText}</p>
                    <span className="text-[10px] font-mono text-slate-400">key: {field.key}</span>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">Built-in Spec</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADD / EDIT CUSTOMER REGISTRATION FIELD */}
      {/* ==================================================================== */}
      {showKycModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">
                  {editingKycField ? 'Edit Customer Registration Field' : 'Add Custom Registration Field'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKycModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKycField} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Field Display Label *
                </label>
                <input
                  type="text"
                  required
                  value={kycLabel}
                  onChange={(e) => setKycLabel(e.target.value)}
                  placeholder="e.g. Aadhaar Card Number, Parent Contact, Company Name"
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Field Key (JSON)</label>
                  <input
                    type="text"
                    value={kycKey}
                    onChange={(e) => setKycKey(e.target.value)}
                    placeholder="e.g. idProofNumber"
                    className="w-full text-xs font-mono px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Input Field Type</label>
                  <select
                    value={kycType}
                    onChange={(e) => setKycType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden font-semibold"
                  >
                    <option value="TEXT">Short Text</option>
                    <option value="NUMBER">Number</option>
                    <option value="PHONE">Phone Number</option>
                    <option value="EMAIL">Email</option>
                    <option value="DATE">Date Picker</option>
                    <option value="TEXTAREA">Multi-line Address / Notes</option>
                    <option value="DROPDOWN">Dropdown Selector</option>
                    <option value="BOOLEAN">Consent Checkbox</option>
                    <option value="AADHAAR">UIDAI Aadhaar Verification</option>
                    <option value="LIVE_PHOTO">Webcam Live Photo Capture</option>
                    <option value="FILE_UPLOAD">ID Document File Upload</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Applicable Category Scope
                </label>
                <select
                  value={kycCategoryScope}
                  onChange={(e) => setKycCategoryScope(e.target.value as any)}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden font-semibold"
                >
                  <option value="ALL">Universal (All Venues: Hotel, PG, Function Hall)</option>
                  <option value="PG_HOSTEL">Hostel & PG (Inmate & Guardian details)</option>
                  <option value="HOTEL">Hotels (Transit guest details)</option>
                  <option value="FUNCTION_HALL">Function Halls & Banquets (Event Organizer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Placeholder / Input Hint
                </label>
                <input
                  type="text"
                  value={kycPlaceholder}
                  onChange={(e) => setKycPlaceholder(e.target.value)}
                  placeholder="e.g. 5412 8923 7610"
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Legal / Verification Guidance Help Text
                </label>
                <input
                  type="text"
                  value={kycHelpText}
                  onChange={(e) => setKycHelpText(e.target.value)}
                  placeholder="e.g. Required by Police Act for hostel resident record"
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              {kycType === 'DROPDOWN' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dropdown Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={kycOptionsStr}
                    onChange={(e) => setKycOptionsStr(e.target.value)}
                    placeholder="e.g. Aadhaar Card, Passport, Driving License, Voter ID"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              )}

              {/* Toggles */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kycIsRequired}
                    onChange={(e) => setKycIsRequired(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Mandatory Field (Required to Pay)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kycIsEnabled}
                    onChange={(e) => setKycIsEnabled(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Active in Form</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowKycModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
