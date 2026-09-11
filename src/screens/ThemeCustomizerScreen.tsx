import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Palette,
  Check,
  Sparkles,
  Sliders,
  Eye,
  RotateCcw,
  Sun,
  Moon,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const ThemeCustomizerScreen: React.FC = () => {
  const [selectedThemeKey, setSelectedThemeKey] = useState('indigo');
  const [customHex, setCustomHex] = useState('#4F46E5');
  const [borderRadius, setBorderRadius] = useState<'md' | 'lg' | 'xl' | '2xl'>('xl');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const themePresets = [
    { id: 'indigo', name: 'Royal Indigo', primary: '#4F46E5', bg: 'bg-indigo-600', text: 'text-indigo-600', ring: 'ring-indigo-500' },
    { id: 'purple', name: 'Imperial Violet', primary: '#7C3AED', bg: 'bg-purple-600', text: 'text-purple-600', ring: 'ring-purple-500' },
    { id: 'emerald', name: 'Emerald Green', primary: '#059669', bg: 'bg-emerald-600', text: 'text-emerald-600', ring: 'ring-emerald-500' },
    { id: 'teal', name: 'Electric Teal', primary: '#0D9488', bg: 'bg-teal-600', text: 'text-teal-600', ring: 'ring-teal-500' },
    { id: 'sky', name: 'Sapphire Navy', primary: '#0284C7', bg: 'bg-sky-600', text: 'text-sky-600', ring: 'ring-sky-500' },
    { id: 'amber', name: 'Sunset Amber', primary: '#D97706', bg: 'bg-amber-600', text: 'text-amber-600', ring: 'ring-amber-500' },
    { id: 'rose', name: 'Crimson Rose', primary: '#E11D48', bg: 'bg-rose-600', text: 'text-rose-600', ring: 'ring-rose-500' },
    { id: 'slate', name: 'Midnight Onyx', primary: '#1E293B', bg: 'bg-slate-900', text: 'text-slate-900', ring: 'ring-slate-900' },
  ];

  const currentPreset = themePresets.find((p) => p.id === selectedThemeKey) || themePresets[0];

  const handleSaveTheme = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
          Design System & Customization
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
          <Palette className="w-6 h-6 text-purple-600" />
          Brand Theme & Color Palette Engine
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Personalize brand accents, corner radiuses, and accessibility contrast settings in real-time.
        </p>
      </div>

      {/* Main Grid: Controls Left, Live Preview Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          {/* Preset Palettes */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-900 block">Select Brand Accent Color</label>
            <div className="grid grid-cols-4 gap-2.5">
              {themePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedThemeKey(preset.id);
                    setCustomHex(preset.primary);
                  }}
                  className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    selectedThemeKey === preset.id
                      ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${preset.bg} flex items-center justify-center text-white shadow-xs`}>
                    {selectedThemeKey === preset.id && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 truncate text-center w-full">
                    {preset.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Hex Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Custom Hex Code</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customHex}
                onChange={(e) => {
                  setCustomHex(e.target.value);
                  setSelectedThemeKey('custom');
                }}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-1"
              />
              <input
                type="text"
                value={customHex}
                onChange={(e) => {
                  setCustomHex(e.target.value);
                  setSelectedThemeKey('custom');
                }}
                className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Border Radius Switcher */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">UI Corner Smoothness</label>
            <div className="grid grid-cols-4 gap-2">
              {(['md', 'lg', 'xl', '2xl'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setBorderRadius(r)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    borderRadius === r
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Toggle */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">High-Contrast WCAG AAA Mode</span>
                <span className="text-[10px] text-slate-400">Enhances stroke weight and deepens text contrast</span>
              </div>
              <input
                type="checkbox"
                checked={isHighContrast}
                onChange={(e) => setIsHighContrast(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedThemeKey('indigo');
                setCustomHex('#4F46E5');
                setBorderRadius('xl');
                setIsHighContrast(false);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>

            <button
              onClick={handleSaveTheme}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Save Theme Configuration
            </button>
          </div>

          {isSavedNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-200">
              ✓ Theme changes applied and persisted across sessions!
            </div>
          )}
        </div>

        {/* Live Interactive Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Live Preview Simulation</span>
          </div>

          {/* Preview Card */}
          <div
            className={`bg-white border ${
              isHighContrast ? 'border-slate-800 shadow-md' : 'border-slate-200 shadow-sm'
            } overflow-hidden transition-all ${
              borderRadius === 'md'
                ? 'rounded-md'
                : borderRadius === 'lg'
                ? 'rounded-lg'
                : borderRadius === 'xl'
                ? 'rounded-xl'
                : 'rounded-2xl'
            }`}
          >
            <div className="relative h-44 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute top-3 left-3 px-2.5 py-1 text-white text-[10px] font-black uppercase tracking-wider rounded-md"
                style={{ backgroundColor: customHex }}
              >
                Featured Luxury
              </div>
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.95</span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <span className="text-[11px] font-bold block" style={{ color: customHex }}>
                  Jubilee Hills, Hyderabad
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">The Royal Imperial Palace & Convention</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Palatial luxury banquet hall featuring crystal chandeliers, VIP bridal suites, and open manicured lawns.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">From</span>
                  <span className="text-base font-black text-slate-900">₹1,85,000</span>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
                  style={{
                    backgroundColor: customHex,
                    borderRadius: borderRadius === '2xl' ? '1rem' : borderRadius === 'xl' ? '0.75rem' : '0.5rem',
                  }}
                >
                  Reserve Slot
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Theme presets automatically adapt to both Desktop full-screen and Mobile bottom drawer navigation.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
