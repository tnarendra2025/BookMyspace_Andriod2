import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Copy,
  Save,
  Database,
  RefreshCw,
  Sliders,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowUp,
  ArrowDown,
  Layers,
  ShieldCheck,
  FileText,
  Phone,
  Mail,
  Calendar,
  Search,
  Sparkles,
  Download,
  Upload,
  X,
  FileUp,
  Hash,
  Type,
  ToggleLeft,
  ChevronDown,
  Building2,
  HelpCircle,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  CustomerRegistrationField,
  RegistrationFieldType,
  RegistrationFieldCategoryScope,
  CustomerRegistrationData,
} from '../types';
import { CustomerRegistrationForm } from './CustomerRegistrationForm';

interface DynamicRegistrationBuilderProps {
  initialVenueId?: string;
  onClose?: () => void;
  embedded?: boolean;
}

const FIELD_TYPE_CONFIG: Record<
  RegistrationFieldType,
  { label: string; description: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  TEXT: {
    label: 'Single-line Text',
    description: 'General text input (e.g. Guardian Name, Workplace, Vehicle No)',
    icon: Type,
    color: 'text-sky-600 bg-sky-50 border-sky-200',
  },
  NUMBER: {
    label: 'Numeric Value',
    description: 'Numbers only (e.g. Number of Guests, Age, Stay Duration)',
    icon: Hash,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  FILE_UPLOAD: {
    label: 'File / Document Upload',
    description: 'Accepts PDF, scanned contracts, consent forms, student ID cards',
    icon: FileUp,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  BOOLEAN: {
    label: 'Toggle / Checkbox Agreement',
    description: 'Yes/No switch (e.g. Curfew Agreement, House Rules, Police Consent)',
    icon: ToggleLeft,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  DROPDOWN: {
    label: 'Dropdown Select',
    description: 'Predefined single choice selection (e.g. Room Sharing Type, Food Choice)',
    icon: ChevronDown,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  PHONE: {
    label: 'Phone / WhatsApp',
    description: 'Validated mobile number for WhatsApp alerts & verification',
    icon: Phone,
    color: 'text-teal-600 bg-teal-50 border-teal-200',
  },
  EMAIL: {
    label: 'Email Address',
    description: 'Email format validation for official GST invoice delivery',
    icon: Mail,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  TEXTAREA: {
    label: 'Multi-line Paragraph',
    description: 'Extended text area (e.g. Special Requirements, Permanent Address)',
    icon: FileText,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  },
  DATE: {
    label: 'Date Selector',
    description: 'Calendar date picker (e.g. Date of Birth, Event Commencement)',
    icon: Calendar,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  AADHAAR: {
    label: 'UIDAI Aadhaar 12-Digit',
    description: 'Government Indian ID number with format validation',
    icon: ShieldCheck,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
  },
  IMAGE_UPLOAD: {
    label: 'Image / ID Proof Photo',
    description: 'Scanned front/back ID proof photos (Aadhaar, Passport, DL)',
    icon: FileUp,
    color: 'text-violet-600 bg-violet-50 border-violet-200',
  },
  LIVE_PHOTO: {
    label: 'Webcam Selfie / Biometric',
    description: 'Real-time snapshot verification captured via device camera',
    icon: Eye,
    color: 'text-pink-600 bg-pink-50 border-pink-200',
  },
};

const POPULAR_TEMPLATES: Array<Omit<CustomerRegistrationField, 'id' | 'displayOrder'>> = [
  {
    key: 'collegeOrOfficeId',
    label: 'College or Office ID Card Scan',
    type: 'FILE_UPLOAD',
    isRequired: true,
    isEnabled: true,
    helpText: 'Upload your active institutional or employee badge for security clearance',
    placeholder: 'Attach ID photo or PDF',
    categoryScope: 'PG_HOSTEL',
  },
  {
    key: 'dietaryPreference',
    label: 'Dietary Preference & Meal Choice',
    type: 'DROPDOWN',
    isRequired: false,
    isEnabled: true,
    options: ['Pure Vegetarian', 'Non-Vegetarian', 'Jain (No Onion/Garlic)', 'Vegan'],
    helpText: 'Informs kitchen & catering staff of meal restrictions',
    categoryScope: 'ALL',
  },
  {
    key: 'attendeeCountAdults',
    label: 'Total Number of Attendees / Inmates',
    type: 'NUMBER',
    isRequired: true,
    isEnabled: true,
    placeholder: 'e.g. 2',
    minNumber: 1,
    maxNumber: 50,
    helpText: 'Official head count used for municipal fire safety limits',
    categoryScope: 'ALL',
  },
  {
    key: 'agreeCurfewHouseRules',
    label: 'Acceptance of Curfew (10:30 PM) & Hostel Rules',
    type: 'BOOLEAN',
    isRequired: true,
    isEnabled: true,
    helpText: 'I agree to strictly abide by quiet hours, gate lock timings, and visitor policies',
    categoryScope: 'PG_HOSTEL',
  },
  {
    key: 'vehiclePlateNumber',
    label: 'Vehicle Registration Plate Number (Car / Bike)',
    type: 'TEXT',
    isRequired: false,
    isEnabled: true,
    placeholder: 'e.g. TS 09 AB 1234',
    helpText: 'For automated boom barrier access and reserved parking bay assignment',
    categoryScope: 'ALL',
  },
  {
    key: 'gstCompanyName',
    label: 'Corporate Entity Name (for B2B Tax Invoice)',
    type: 'TEXT',
    isRequired: false,
    isEnabled: true,
    placeholder: 'e.g. Acme Technologies India Pvt Ltd',
    helpText: 'For claiming Input Tax Credit (ITC) under Section 16 CGST Act',
    categoryScope: 'ALL',
  },
];

export const DynamicRegistrationBuilder: React.FC<DynamicRegistrationBuilderProps> = ({
  initialVenueId,
  onClose,
  embedded = false,
}) => {
  const {
    customerRegistrationFields,
    updateRegistrationField,
    addRegistrationField,
    deleteRegistrationField,
    setRegistrationFieldRequirement,
    batchSetRegistrationRequirement,
    reorderRegistrationFields,
    duplicateRegistrationField,
    resetRegistrationFields,
    saveFieldsToDatabase,
    reloadFieldsFromDatabase,
    dbSyncStatus,
    lastDbSyncedAt,
    venues,
  } = useApp();

  // Scoping and Filters
  const [selectedVenueFilter, setSelectedVenueFilter] = useState<string>(initialVenueId || 'ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'MANDATORY' | 'OPTIONAL' | 'DISABLED'>('ALL');

  // UI tabs & states
  const [activeTab, setActiveTab] = useState<'BUILDER' | 'PREVIEW' | 'PRESETS' | 'JSON_SCHEMA'>('BUILDER');
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  // Field Editor Form State
  const [formLabel, setFormLabel] = useState('');
  const [formKey, setFormKey] = useState('');
  const [formType, setFormType] = useState<RegistrationFieldType>('TEXT');
  const [formRequirement, setFormRequirement] = useState<'MANDATORY' | 'OPTIONAL' | 'DISABLED'>('MANDATORY');
  const [formCategoryScope, setFormCategoryScope] = useState<RegistrationFieldCategoryScope>('ALL');
  const [formVenueId, setFormVenueId] = useState<string>('');
  const [formHelpText, setFormHelpText] = useState('');
  const [formPlaceholder, setFormPlaceholder] = useState('');
  const [formOptionsInput, setFormOptionsInput] = useState('');
  const [formMinNumber, setFormMinNumber] = useState<number | undefined>(undefined);
  const [formMaxNumber, setFormMaxNumber] = useState<number | undefined>(undefined);
  const [formFileAccept, setFormFileAccept] = useState('');

  // Notifications / Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingDb, setIsSavingDb] = useState(false);

  // Live Customer Preview Form State
  const [previewFormData, setPreviewFormData] = useState<CustomerRegistrationData>({
    fullName: 'Narendra T (Verified Host/Guest)',
    phone: '+91 98765 43210',
    email: 'tnarendra2025@gmail.com',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Helper to open editor for a new field
  const handleOpenNewFieldModal = (prefill?: Partial<CustomerRegistrationField>) => {
    setEditingFieldId(null);
    setFormLabel(prefill?.label || '');
    setFormKey(prefill?.key || '');
    setFormType(prefill?.type || 'TEXT');
    setFormRequirement(
      prefill?.isEnabled === false
        ? 'DISABLED'
        : prefill?.isRequired
        ? 'MANDATORY'
        : 'OPTIONAL'
    );
    setFormCategoryScope(prefill?.categoryScope || 'ALL');
    setFormVenueId(prefill?.venueId || (selectedVenueFilter !== 'ALL' ? selectedVenueFilter : ''));
    setFormHelpText(prefill?.helpText || '');
    setFormPlaceholder(prefill?.placeholder || '');
    setFormOptionsInput(prefill?.options?.join(', ') || '');
    setFormMinNumber(prefill?.minNumber);
    setFormMaxNumber(prefill?.maxNumber);
    setFormFileAccept(prefill?.fileAccept || '');
    setIsEditorModalOpen(true);
  };

  // Helper to open editor for an existing field
  const handleOpenEditFieldModal = (field: CustomerRegistrationField) => {
    setEditingFieldId(field.id);
    setFormLabel(field.label);
    setFormKey(field.key);
    setFormType(field.type);
    setFormRequirement(
      !field.isEnabled
        ? 'DISABLED'
        : field.isRequired
        ? 'MANDATORY'
        : 'OPTIONAL'
    );
    setFormCategoryScope(field.categoryScope);
    setFormVenueId(field.venueId || '');
    setFormHelpText(field.helpText || '');
    setFormPlaceholder(field.placeholder || '');
    setFormOptionsInput(field.options?.join(', ') || '');
    setFormMinNumber(field.minNumber);
    setFormMaxNumber(field.maxNumber);
    setFormFileAccept(field.fileAccept || '');
    setIsEditorModalOpen(true);
  };

  // Save from editor modal
  const handleSaveFieldForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim()) {
      showToast('Please enter a field label.');
      return;
    }

    const cleanedKey =
      formKey.trim() ||
      formLabel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

    const parsedOptions =
      formType === 'DROPDOWN'
        ? formOptionsInput
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    const isEnabled = formRequirement !== 'DISABLED';
    const isRequired = formRequirement === 'MANDATORY';

    const selectedVenueObj = venues.find((v) => v.id === formVenueId);

    if (editingFieldId) {
      // Update existing
      const existing = customerRegistrationFields.find((f) => f.id === editingFieldId);
      if (existing) {
        const updated: CustomerRegistrationField = {
          ...existing,
          label: formLabel.trim(),
          key: cleanedKey,
          type: formType,
          isEnabled,
          isRequired,
          categoryScope: formCategoryScope,
          venueId: formVenueId ? formVenueId : undefined,
          venueName: selectedVenueObj ? selectedVenueObj.name : undefined,
          helpText: formHelpText.trim() || undefined,
          placeholder: formPlaceholder.trim() || undefined,
          options: parsedOptions,
          minNumber: formMinNumber,
          maxNumber: formMaxNumber,
          fileAccept: formFileAccept.trim() || undefined,
        };
        updateRegistrationField(updated);
        showToast(`Updated "${formLabel}" configuration.`);
      }
    } else {
      // Create new
      addRegistrationField({
        label: formLabel.trim(),
        key: cleanedKey,
        type: formType,
        isEnabled,
        isRequired,
        categoryScope: formCategoryScope,
        venueId: formVenueId ? formVenueId : undefined,
        venueName: selectedVenueObj ? selectedVenueObj.name : undefined,
        helpText: formHelpText.trim() || undefined,
        placeholder: formPlaceholder.trim() || undefined,
        options: parsedOptions,
        displayOrder: customerRegistrationFields.length + 1,
        minNumber: formMinNumber,
        maxNumber: formMaxNumber,
        fileAccept: formFileAccept.trim() || undefined,
      });
      showToast(`Created new custom field "${formLabel}".`);
    }

    setIsEditorModalOpen(false);
  };

  // Persist to Server Database Action
  const handleSaveToDatabase = async () => {
    setIsSavingDb(true);
    const success = await saveFieldsToDatabase();
    setIsSavingDb(false);
    if (success) {
      showToast('All registration fields successfully persisted to Server Database!');
    } else {
      showToast('Saved locally. Database sync reported a warning.');
    }
  };

  // Reload from DB
  const handleReloadFromDatabase = async () => {
    setIsSavingDb(true);
    await reloadFieldsFromDatabase();
    setIsSavingDb(false);
    showToast('Configuration re-synchronized from database.');
  };

  // Filter fields based on search & filters
  const filteredFields = useMemo(() => {
    return customerRegistrationFields
      .filter((field) => {
        // Venue filter
        if (selectedVenueFilter !== 'ALL') {
          if (field.venueId && field.venueId !== selectedVenueFilter) return false;
        }

        // Category filter
        if (selectedCategoryFilter !== 'ALL') {
          if (field.categoryScope !== 'ALL' && field.categoryScope !== selectedCategoryFilter) return false;
        }

        // Type filter
        if (selectedTypeFilter !== 'ALL') {
          if (field.type !== selectedTypeFilter) return false;
        }

        // Status filter
        if (selectedStatusFilter === 'MANDATORY') {
          if (!field.isEnabled || !field.isRequired) return false;
        } else if (selectedStatusFilter === 'OPTIONAL') {
          if (!field.isEnabled || field.isRequired) return false;
        } else if (selectedStatusFilter === 'DISABLED') {
          if (field.isEnabled) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchLabel = field.label.toLowerCase().includes(q);
          const matchKey = field.key.toLowerCase().includes(q);
          const matchHelp = (field.helpText || '').toLowerCase().includes(q);
          return matchLabel || matchKey || matchHelp;
        }

        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [
    customerRegistrationFields,
    selectedVenueFilter,
    selectedCategoryFilter,
    selectedTypeFilter,
    selectedStatusFilter,
    searchQuery,
  ]);

  // Statistics
  const totalFieldsCount = customerRegistrationFields.length;
  const mandatoryCount = customerRegistrationFields.filter((f) => f.isEnabled && f.isRequired).length;
  const optionalCount = customerRegistrationFields.filter((f) => f.isEnabled && !f.isRequired).length;
  const disabledCount = customerRegistrationFields.filter((f) => !f.isEnabled).length;

  // Selected venue name
  const currentVenueName =
    selectedVenueFilter === 'ALL'
      ? 'Universal (All Venues)'
      : venues.find((v) => v.id === selectedVenueFilter)?.name || 'Custom Venue';

  return (
    <div className={`space-y-6 ${embedded ? '' : 'p-4 md:p-8 max-w-7xl mx-auto'}`}>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-indigo-100 text-indigo-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Dynamic Registration Builder
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                Owner & Admin Governance
              </span>
              {/* Live Database Sync Badge */}
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {dbSyncStatus === 'syncing'
                    ? 'Syncing with DB...'
                    : 'Server Database: data/registration_fields_db.json'}
                </span>
                {lastDbSyncedAt && (
                  <span className="text-[10px] text-emerald-600 font-normal">
                    (Saved {new Date(lastDbSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Venue Booking Registration & KYC Schema
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Define custom registration questions, KYC document requirements, and booking forms. Set fields as
              <strong> Mandatory</strong>, <strong>Optional</strong>, or <strong>Disabled</strong> with real-time customer form previews and persistent database synchronization.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenNewFieldModal()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Define Custom Field</span>
            </button>

            <button
              onClick={handleSaveToDatabase}
              disabled={isSavingDb}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all"
            >
              {isSavingDb ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Persist to Database</span>
            </button>

            <button
              onClick={handleReloadFromDatabase}
              title="Reload from server database"
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scope Context & Overview Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[10px] uppercase font-extrabold text-slate-400">Target Venue Context</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <select
                value={selectedVenueFilter}
                onChange={(e) => setSelectedVenueFilter(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer truncate max-w-full"
              >
                <option value="ALL">All Venues (Global Scope)</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.category.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[10px] uppercase font-extrabold text-slate-400">Total Configured Fields</div>
            <div className="text-base font-black text-slate-900 mt-1 flex items-baseline gap-2">
              <span>{totalFieldsCount} Fields</span>
              <span className="text-[11px] font-semibold text-slate-500">
                ({customerRegistrationFields.filter((f) => f.id.startsWith('crf_custom_') || f.venueId).length} Custom)
              </span>
            </div>
          </div>

          <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200/60">
            <div className="text-[10px] uppercase font-extrabold text-rose-600">Mandatory (Required)</div>
            <div className="text-base font-black text-rose-900 mt-1 flex items-baseline gap-2">
              <span>{mandatoryCount} Fields</span>
              <span className="text-[11px] font-semibold text-rose-700">Must be provided</span>
            </div>
          </div>

          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/60">
            <div className="text-[10px] uppercase font-extrabold text-emerald-600">Optional & Disabled</div>
            <div className="text-base font-black text-emerald-950 mt-1 flex items-baseline gap-2">
              <span>{optionalCount} Optional</span>
              <span className="text-[11px] font-semibold text-slate-500">({disabledCount} Hidden)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('BUILDER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'BUILDER'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Field Config & Toggles ({filteredFields.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'PREVIEW'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Guest Checkout Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('PRESETS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'PRESETS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Plug & Play Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('JSON_SCHEMA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'JSON_SCHEMA'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database JSON Schema</span>
          </button>
        </div>

        {/* Quick Batch Controls */}
        {activeTab === 'BUILDER' && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Batch:</span>
            <button
              onClick={() => {
                const ids = filteredFields.map((f) => f.id);
                batchSetRegistrationRequirement(ids, 'MANDATORY');
                showToast(`Set ${ids.length} visible fields to Mandatory.`);
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              All Mandatory
            </button>
            <button
              onClick={() => {
                const ids = filteredFields.map((f) => f.id);
                batchSetRegistrationRequirement(ids, 'OPTIONAL');
                showToast(`Set ${ids.length} visible fields to Optional.`);
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              All Optional
            </button>
            <button
              onClick={() => {
                const ids = filteredFields.map((f) => f.id);
                batchSetRegistrationRequirement(ids, 'DISABLED');
                showToast(`Turned off ${ids.length} visible fields.`);
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              Turn Off All
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: FIELD CONFIGURATION & BUILDER */}
      {activeTab === 'BUILDER' && (
        <div className="space-y-6">
          {/* Quick Template Shelf */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Quick-Add Field Templates (One-Click Insert)
              </span>
              <span className="text-[11px] text-slate-500">Click any preset to prefill and add</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {POPULAR_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOpenNewFieldModal(tmpl)}
                  className="px-3 py-1.5 bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-semibold text-slate-800 transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{tmpl.label}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                    {tmpl.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search, Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fields by name, key, or guidance text..."
                className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-slate-700 py-0.5 focus:ring-0 cursor-pointer"
                >
                  <option value="ALL">All Field Types</option>
                  <option value="TEXT">Text</option>
                  <option value="NUMBER">Number</option>
                  <option value="FILE_UPLOAD">File Upload</option>
                  <option value="BOOLEAN">Toggle Agreement</option>
                  <option value="DROPDOWN">Dropdown</option>
                  <option value="PHONE">Phone</option>
                  <option value="EMAIL">Email</option>
                  <option value="DATE">Date</option>
                  <option value="AADHAAR">Aadhaar</option>
                  <option value="IMAGE_UPLOAD">Image Proof</option>
                  <option value="LIVE_PHOTO">Live Selfie</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                  className="bg-transparent border-none text-xs font-bold text-slate-700 py-0.5 focus:ring-0 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="MANDATORY">Mandatory Only</option>
                  <option value="OPTIONAL">Optional Only</option>
                  <option value="DISABLED">Disabled / Hidden</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fields List */}
          <div className="space-y-3">
            {filteredFields.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No registration fields matched your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Adjust your search or filter tags, or define a new custom field to append to this venue's booking workflow.
                </p>
                <button
                  onClick={() => handleOpenNewFieldModal()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Custom Field</span>
                </button>
              </div>
            ) : (
              filteredFields.map((field, index) => {
                const typeCfg = FIELD_TYPE_CONFIG[field.type] || FIELD_TYPE_CONFIG.TEXT;
                const IconComponent = typeCfg.icon;

                const currentRequirement: 'MANDATORY' | 'OPTIONAL' | 'DISABLED' = !field.isEnabled
                  ? 'DISABLED'
                  : field.isRequired
                  ? 'MANDATORY'
                  : 'OPTIONAL';

                return (
                  <div
                    key={field.id}
                    className={`bg-white rounded-2xl p-4 md:p-5 border transition-all shadow-2xs hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      !field.isEnabled
                        ? 'border-slate-200/80 bg-slate-50/60 opacity-60'
                        : field.isRequired
                        ? 'border-indigo-200/90 bg-white ring-1 ring-indigo-500/10'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Left: Drag Handle, Icon, Details */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Order Controls */}
                      <div className="flex flex-col items-center justify-center shrink-0 pt-0.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => reorderRegistrationFields(index, index - 1)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-black text-slate-400 select-none">
                          {field.displayOrder || index + 1}
                        </span>
                        <button
                          type="button"
                          disabled={index === filteredFields.length - 1}
                          onClick={() => reorderRegistrationFields(index, index + 1)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Field Type Icon */}
                      <div className={`p-2.5 rounded-xl border shrink-0 ${typeCfg.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Field Meta */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
                            {field.label}
                          </h4>

                          {/* Type Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeCfg.color}`}>
                            {typeCfg.label}
                          </span>

                          {/* Scope / Venue Badge */}
                          {field.venueName ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                              Venue: {field.venueName}
                            </span>
                          ) : field.categoryScope !== 'ALL' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 uppercase">
                              {field.categoryScope}
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              Universal
                            </span>
                          )}

                          {/* Custom Tag */}
                          {(field.id.startsWith('crf_custom_') || field.venueId) && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                              CUSTOM
                            </span>
                          )}
                        </div>

                        {/* Subtitle / Help text */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                          <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {field.key}
                          </span>
                          {field.helpText && (
                            <span className="text-slate-600 truncate max-w-md">{field.helpText}</span>
                          )}
                        </div>

                        {/* Options if dropdown */}
                        {field.options && field.options.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap pt-1">
                            <span className="text-[10px] text-slate-400 font-semibold">Options:</span>
                            {field.options.slice(0, 4).map((opt, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200"
                              >
                                {opt}
                              </span>
                            ))}
                            {field.options.length > 4 && (
                              <span className="text-[10px] text-slate-400 font-semibold">
                                +{field.options.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Tactile 3-Way Requirement Switch & Actions */}
                    <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                      {/* Tactile 3-State Switcher: [ Off | Optional | Mandatory ] */}
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-inner">
                        <button
                          type="button"
                          onClick={() => {
                            setRegistrationFieldRequirement(field.id, 'DISABLED');
                            showToast(`"${field.label}" turned Off (Hidden).`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentRequirement === 'DISABLED'
                              ? 'bg-white text-slate-700 shadow-xs ring-1 ring-slate-300'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Off
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRegistrationFieldRequirement(field.id, 'OPTIONAL');
                            showToast(`"${field.label}" set to Optional.`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentRequirement === 'OPTIONAL'
                              ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-200 font-extrabold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Optional
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRegistrationFieldRequirement(field.id, 'MANDATORY');
                            showToast(`"${field.label}" set to Mandatory.`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentRequirement === 'MANDATORY'
                              ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Mandatory *
                        </button>
                      </div>

                      {/* Edit, Duplicate, Delete Actions */}
                      <div className="flex items-center gap-1 pl-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditFieldModal(field)}
                          title="Edit Field Configuration"
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            duplicateRegistrationField(field.id);
                            showToast(`Duplicated "${field.label}".`);
                          }}
                          title="Duplicate Field"
                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${field.label}" from registration schema?`)) {
                              deleteRegistrationField(field.id);
                              showToast(`Deleted field "${field.label}".`);
                            }
                          }}
                          title="Delete Field"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE GUEST CHECKOUT PREVIEW */}
      {activeTab === 'PREVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Preview Guidance & Category Switcher */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-900 uppercase">
                <Eye className="w-4 h-4 text-indigo-600" />
                Live Customer Checkout Simulator
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test your dynamic fields in real-time. This interactive pane renders the exact form and validations
                presented to customers when reserving this venue.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700">Simulate As Venue</label>
                <select
                  value={selectedVenueFilter}
                  onChange={(e) => setSelectedVenueFilter(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:border-indigo-500"
                >
                  <option value="ALL">Universal Standard Booking</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.category.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Validation Guarantee</span>
                </div>
                <p>
                  Any field toggled to <strong>Mandatory</strong> will prevent guest checkout from proceeding until
                  valid input or file proofs are supplied.
                </p>
              </div>

              <button
                onClick={() => {
                  setPreviewFormData({
                    fullName: 'Narendra T (Verified Host/Guest)',
                    phone: '+91 98765 43210',
                    email: 'tnarendra2025@gmail.com',
                  });
                  showToast('Preview form reset.');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Clear Preview Inputs
              </button>
            </div>
          </div>

          {/* Right: Actual Customer Registration Form Component */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <div className="mb-5 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Guest Registration Step &middot; {currentVenueName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Displaying enabled fields according to requirement rules.
                </p>
              </div>
              <span className="text-[11px] font-black px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                LIVE PREVIEW MODE
              </span>
            </div>

            <CustomerRegistrationForm
              categorySlug={
                selectedVenueFilter !== 'ALL'
                  ? venues.find((v) => v.id === selectedVenueFilter)?.category.slug || 'hourly_rooms'
                  : 'hourly_rooms'
              }
              venueId={selectedVenueFilter !== 'ALL' ? selectedVenueFilter : undefined}
              fields={customerRegistrationFields}
              formData={previewFormData}
              onChange={(updated) => setPreviewFormData(updated)}
            />
          </div>
        </div>
      )}

      {/* TAB 3: PLUG & PLAY PRESETS */}
      {activeTab === 'PRESETS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              key: 'EXPRESS' as const,
              title: 'Express Check-In',
              desc: 'High speed checkout. Name and WhatsApp only. Highest booking conversion.',
              badge: 'Quickest',
              color: 'border-emerald-200 hover:border-emerald-400 bg-white',
            },
            {
              key: 'HOSTEL_PG' as const,
              title: 'Hostel & PG Inmate KYC',
              desc: 'Parent phone, Aadhaar proof, biometric selfie, college/workplace affiliation.',
              badge: 'Compliant',
              color: 'border-indigo-200 hover:border-indigo-400 bg-white',
            },
            {
              key: 'HOTEL_STANDARD' as const,
              title: 'Hotel Standard Registry',
              desc: 'Guest ID proof, photo capture, permanent address & police declaration.',
              badge: 'Recommended',
              color: 'border-blue-200 hover:border-blue-400 bg-white',
            },
            {
              key: 'STRICT_POLICE' as const,
              title: 'Strict Police Verification',
              desc: 'All 21 fields mandatory. Strict compliance for sensitive or restricted zones.',
              badge: '100% Mandatory',
              color: 'border-rose-200 hover:border-rose-400 bg-white',
            },
            {
              key: 'FUNCTION_HALL' as const,
              title: 'Banquet & Marriage Hall',
              desc: 'Event host KYC, estimated male/female guest splits, parking vehicle passes.',
              badge: 'Event Focus',
              color: 'border-purple-200 hover:border-purple-400 bg-white',
            },
            {
              key: 'BALANCED' as const,
              title: 'Balanced Commercial',
              desc: 'Core identity required, operational fields (vehicles, emergency phone) optional.',
              badge: 'Default',
              color: 'border-amber-200 hover:border-amber-400 bg-white',
            },
          ].map((preset) => (
            <div
              key={preset.key}
              className={`p-6 rounded-3xl border transition-all shadow-2xs hover:shadow-xs space-y-4 flex flex-col justify-between ${preset.color}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {preset.badge}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <h4 className="text-base font-black text-slate-900 tracking-tight">{preset.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{preset.desc}</p>
              </div>

              <button
                onClick={() => {
                  useApp().applyRegistrationPreset(preset.key);
                  showToast(`Applied preset: ${preset.title}`);
                  setActiveTab('BUILDER');
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Apply This Preset
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: DATABASE JSON SCHEMA VIEW */}
      {activeTab === 'JSON_SCHEMA' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Persistent Database Schema (`data/registration_fields_db.json`)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct export and backup of active registration schema stored in the server database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const dataStr =
                    'data:text/json;charset=utf-8,' +
                    encodeURIComponent(JSON.stringify(customerRegistrationFields, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `bms_registration_schema_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  showToast('Schema JSON downloaded.');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Schema JSON</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset registration schema in database to official default?')) {
                    resetRegistrationFields();
                    showToast('Database reset to official default schema.');
                  }
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>
          </div>

          <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 border border-slate-800">
            {JSON.stringify(customerRegistrationFields, null, 2)}
          </pre>
        </div>
      )}

      {/* CREATE / EDIT FIELD MODAL */}
      {isEditorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  {editingFieldId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingFieldId ? 'Edit Registration Field' : 'Define New Registration Field'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingFieldId ? 'Update field parameters and requirement status' : 'Custom question or KYC proof for venue bookings'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFieldForm} className="space-y-4 pt-4">
              {/* Field Label */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Field Label (Displayed to Guest) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formLabel}
                  onChange={(e) => {
                    setFormLabel(e.target.value);
                    if (!editingFieldId && !formKey) {
                      setFormKey(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '_')
                          .replace(/^_+|_+$/g, '')
                      );
                    }
                  }}
                  placeholder="e.g. College / Company ID Card Upload"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-semibold text-slate-900"
                />
              </div>

              {/* Field Key & Type Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    Schema Key (Immutable Identifier)
                  </label>
                  <input
                    type="text"
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value)}
                    placeholder="e.g. college_id_proof"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-mono text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    Field Input Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as RegistrationFieldType)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-bold text-slate-800"
                  >
                    <option value="TEXT">Single-line Text</option>
                    <option value="NUMBER">Number (e.g. Guests / Age)</option>
                    <option value="FILE_UPLOAD">File / PDF Upload</option>
                    <option value="BOOLEAN">Toggle Agreement (Yes/No)</option>
                    <option value="DROPDOWN">Dropdown Menu</option>
                    <option value="PHONE">Phone / WhatsApp (+91)</option>
                    <option value="EMAIL">Email Address</option>
                    <option value="TEXTAREA">Multi-line Paragraph</option>
                    <option value="DATE">Date Selector</option>
                    <option value="AADHAAR">UIDAI Aadhaar 12-Digit</option>
                    <option value="IMAGE_UPLOAD">ID Proof Photo</option>
                    <option value="LIVE_PHOTO">Webcam Selfie / Biometric</option>
                  </select>
                </div>
              </div>

              {/* Requirement 3-State Segmented Control */}
              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Requirement & Visibility Status</span>
                  <span className="text-[10px] text-slate-500 font-normal">Controls booking gating</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormRequirement('DISABLED')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      formRequirement === 'DISABLED'
                        ? 'bg-white border-slate-300 text-slate-800 shadow-xs'
                        : 'bg-slate-100 border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Off (Hidden)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormRequirement('OPTIONAL')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      formRequirement === 'OPTIONAL'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs'
                        : 'bg-slate-100 border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Optional
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormRequirement('MANDATORY')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      formRequirement === 'MANDATORY'
                        ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Mandatory *
                  </button>
                </div>
              </div>

              {/* Specific Venue or Category Targeting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Target Specific Venue</label>
                  <select
                    value={formVenueId}
                    onChange={(e) => setFormVenueId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-medium text-slate-800"
                  >
                    <option value="">All Venues (Universal)</option>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Category Scope</label>
                  <select
                    value={formCategoryScope}
                    onChange={(e) => setFormCategoryScope(e.target.value as RegistrationFieldCategoryScope)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 font-medium text-slate-800"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="PG_HOSTEL">PG & Hostels Only</option>
                    <option value="HOTEL">Hotels & Hourly Rooms Only</option>
                    <option value="FUNCTION_HALL">Banquet & Function Halls</option>
                    <option value="RESORT">Resorts & Farmhouses</option>
                    <option value="SPORTS_TURF">Sports Turfs</option>
                  </select>
                </div>
              </div>

              {/* Dropdown Options (Conditional) */}
              {formType === 'DROPDOWN' && (
                <div className="space-y-1 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-200">
                  <label className="text-xs font-bold text-indigo-950">
                    Dropdown Options (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formOptionsInput}
                    onChange={(e) => setFormOptionsInput(e.target.value)}
                    placeholder="e.g. Vegetarian, Non-Vegetarian, Jain, Vegan"
                    className="w-full text-xs p-2.5 bg-white border border-indigo-200 rounded-xl focus:border-indigo-500 font-medium text-slate-800"
                  />
                  <p className="text-[10px] text-indigo-700">
                    Enter each option separated by commas.
                  </p>
                </div>
              )}

              {/* Number Bounds (Conditional) */}
              {formType === 'NUMBER' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-200">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950">Minimum Value</label>
                    <input
                      type="number"
                      value={formMinNumber ?? ''}
                      onChange={(e) => setFormMinNumber(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 1"
                      className="w-full text-xs p-2.5 bg-white border border-amber-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950">Maximum Value</label>
                    <input
                      type="number"
                      value={formMaxNumber ?? ''}
                      onChange={(e) => setFormMaxNumber(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 10"
                      className="w-full text-xs p-2.5 bg-white border border-amber-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Guidance & Placeholder */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Help Text / Guest Guidance
                </label>
                <input
                  type="text"
                  value={formHelpText}
                  onChange={(e) => setFormHelpText(e.target.value)}
                  placeholder="e.g. Required by local municipal police order for night-time entry pass"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Placeholder Text</label>
                <input
                  type="text"
                  value={formPlaceholder}
                  onChange={(e) => setFormPlaceholder(e.target.value)}
                  placeholder="e.g. Enter registered company ID or card number"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 text-slate-700"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditorModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingFieldId ? 'Save Field Changes' : 'Add Custom Field'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
