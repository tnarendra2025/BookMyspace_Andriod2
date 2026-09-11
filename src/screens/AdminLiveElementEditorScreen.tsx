import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  Search,
  RotateCcw,
  Download,
  Upload,
  Check,
  Edit3,
  X,
  Plus,
  Layers,
  Sparkles,
  Terminal,
  CheckCircle2,
  FileCode,
} from 'lucide-react';

interface EditableElement {
  id: string;
  key: string;
  displayName: string;
  screenName: string;
  elementType: 'TEXT' | 'BUTTON_LABEL' | 'INPUT_PLACEHOLDER' | 'BADGE' | 'BANNER_NOTICE';
  defaultValue: string;
  currentValue: string;
  placeholder?: string;
  isModified: boolean;
}

const INITIAL_CMS_ELEMENTS: EditableElement[] = [
  {
    id: 'el_1',
    key: 'home_hero_badge',
    displayName: 'Hero Top Pill Badge',
    screenName: 'HomeScreen',
    elementType: 'BADGE',
    defaultValue: 'Zero Double-Booking Guarantee',
    currentValue: 'Zero Double-Booking Guarantee',
    isModified: false,
  },
  {
    id: 'el_2',
    key: 'home_search_placeholder',
    displayName: 'Universal Search Input Placeholder',
    screenName: 'HomeScreen',
    elementType: 'INPUT_PLACEHOLDER',
    defaultValue: 'Search marriage halls, cricket turfs, PG rooms...',
    currentValue: 'Search marriage halls, cricket turfs, PG rooms...',
    placeholder: 'Type search text...',
    isModified: false,
  },
  {
    id: 'el_3',
    key: 'booking_cta_button',
    displayName: 'Slot Checkout Action CTA',
    screenName: 'BookingModal',
    elementType: 'BUTTON_LABEL',
    defaultValue: 'Lock Slot & Proceed to Pay',
    currentValue: 'Lock Slot & Proceed to Pay',
    isModified: false,
  },
  {
    id: 'el_4',
    key: 'owner_walkin_advance_label',
    displayName: 'Walk-in Advance Paid Input Label',
    screenName: 'OwnerDashboard',
    elementType: 'TEXT',
    defaultValue: 'Advance Amount Collected (₹)',
    currentValue: 'Advance Amount Collected (₹)',
    isModified: false,
  },
  {
    id: 'el_5',
    key: 'support_hotline_banner',
    displayName: 'Support Screen Helpline Notice',
    screenName: 'SupportScreen',
    elementType: 'BANNER_NOTICE',
    defaultValue: '24/7 Multi-lingual Concierge available on WhatsApp & Toll-Free Phone',
    currentValue: '24/7 Multi-lingual Concierge available on WhatsApp & Toll-Free Phone',
    isModified: false,
  },
  {
    id: 'el_6',
    key: 'venue_detail_muhurtham_alert',
    displayName: 'Muhurtham High Demand Callout',
    screenName: 'VenueDetailScreen',
    elementType: 'BADGE',
    defaultValue: '⚡ Auspicious Wedding Muhurtham dates filling fast!',
    currentValue: '⚡ Auspicious Wedding Muhurtham dates filling fast!',
    isModified: false,
  },
];

export const AdminLiveElementEditorScreen: React.FC = () => {
  const [elements, setElements] = useState<EditableElement[]>(INITIAL_CMS_ELEMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedScreen, setSelectedScreen] = useState<string>('ALL');

  // Active Editor Modal
  const [editingElement, setEditingElement] = useState<EditableElement | null>(null);
  const [editVal, setEditVal] = useState('');
  const [editPlaceholder, setEditPlaceholder] = useState('');

  // JSON Import / Export
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState('');

  const screens = ['ALL', ...Array.from(new Set(elements.map((e) => e.screenName)))];
  const types = ['ALL', 'TEXT', 'BUTTON_LABEL', 'INPUT_PLACEHOLDER', 'BADGE', 'BANNER_NOTICE'];

  const filteredElements = elements.filter((el) => {
    const matchesSearch =
      searchQuery === '' ||
      el.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.currentValue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'ALL' || el.elementType === selectedType;
    const matchesScreen = selectedScreen === 'ALL' || el.screenName === selectedScreen;

    return matchesSearch && matchesType && matchesScreen;
  });

  const modifiedCount = elements.filter((e) => e.isModified).length;

  const handleOpenEdit = (el: EditableElement) => {
    setEditingElement(el);
    setEditVal(el.currentValue);
    setEditPlaceholder(el.placeholder || '');
  };

  const handleSaveEdit = () => {
    if (!editingElement) return;
    setElements((prev) =>
      prev.map((item) => {
        if (item.id === editingElement.id) {
          const isChanged = editVal !== item.defaultValue || (editPlaceholder && editPlaceholder !== item.defaultValue);
          return {
            ...item,
            currentValue: editVal,
            placeholder: editPlaceholder,
            isModified: isChanged,
          };
        }
        return item;
      })
    );
    setEditingElement(null);
  };

  const handleResetSingle = (id: string) => {
    setElements((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            currentValue: item.defaultValue,
            isModified: false,
          };
        }
        return item;
      })
    );
  };

  const handleResetAll = () => {
    if (confirm('Reset all CMS customizations back to factory defaults?')) {
      setElements(INITIAL_CMS_ELEMENTS);
    }
  };

  const handleExportJson = () => {
    setJsonText(JSON.stringify(elements, null, 2));
    setShowJsonModal(true);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        setElements(parsed);
        setShowJsonModal(false);
        alert('Elements successfully imported and applied!');
      }
    } catch {
      alert('Invalid JSON format. Please verify your syntax.');
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
              CMS Studio & Visual Customizer
            </span>
            {modifiedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {modifiedCount} element(s) edited
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-purple-600" />
            Universal Live Element & Object CMS Master Editor
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamically update any UI label, CTA button, input placeholder, or banner text in real-time across all screens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CMS</span>
          </button>
          <button
            onClick={handleResetAll}
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by label name, key, or value..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl"
          >
            {screens.map((sc) => (
              <option key={sc} value={sc}>
                Screen: {sc}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl"
          >
            {types.map((tp) => (
              <option key={tp} value={tp}>
                Type: {tp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Elements Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {filteredElements.map((el) => (
            <div key={el.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{el.displayName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                    {el.elementType}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                    {el.screenName}
                  </span>
                  {el.isModified && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Modified
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  Current: <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-mono">{el.currentValue}</span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono truncate">
                  Key: {el.key} • Default: "{el.defaultValue}"
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(el)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {el.isModified && (
                  <button
                    onClick={() => handleResetSingle(el.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Revert to Default"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In-line Edit Modal */}
      {editingElement && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Edit UI Element</h3>
                <span className="font-mono text-xs text-slate-400">{editingElement.key}</span>
              </div>
              <button onClick={() => setEditingElement(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Display Label / Current Text *</label>
                <textarea
                  rows={3}
                  value={editVal}
                  onChange={(e) => setEditVal(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-hidden font-medium text-xs"
                />
              </div>

              {editingElement.elementType === 'INPUT_PLACEHOLDER' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custom Placeholder Text</label>
                  <input
                    type="text"
                    value={editPlaceholder}
                    onChange={(e) => setEditPlaceholder(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-500">
                <div>Original Factory Default:</div>
                <div className="font-mono text-slate-700 font-bold">"{editingElement.defaultValue}"</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setEditingElement(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
              >
                Apply Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Import/Export Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-purple-600" />
                CMS Configuration JSON
              </h3>
              <button onClick={() => setShowJsonModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={12}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 focus:outline-hidden"
            />

            <div className="pt-2 flex justify-between items-center border-t border-slate-100">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(jsonText);
                  alert('Copied JSON to clipboard!');
                }}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Copy to Clipboard
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={handleImportJson}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
                >
                  Import & Override
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
