import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Palette, Play, Pause, ChevronRight, Check } from 'lucide-react';

export type AmbientThemeMode = 'auto' | 'sunset' | 'ocean' | 'midnight' | 'aurora' | 'sunrise' | 'minimal';
export type FlowSpeed = 'fast' | 'normal' | 'slow';

interface ThemePalette {
  id: AmbientThemeMode;
  name: string;
  emoji: string;
  tagline: string;
  gradient: string;
  blob1: string;
  blob2: string;
  blob3: string;
  accentBadge: string;
}

export const THEME_PALETTES: Record<AmbientThemeMode, ThemePalette> = {
  auto: {
    id: 'auto',
    name: 'Crystal White Glass',
    emoji: '💎',
    tagline: "World's Best Light White Glass with Prismatic Refractions",
    gradient: 'from-white via-slate-50/50 to-sky-50/30',
    blob1: 'bg-pink-300/18',
    blob2: 'bg-sky-300/18',
    blob3: 'bg-purple-300/14',
    accentBadge: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white',
  },
  ocean: {
    id: 'ocean',
    name: 'Glacier Ice White Glass',
    emoji: '❄️',
    tagline: 'Pure diamond white with crisp sky cyan refractions',
    gradient: 'from-white via-cyan-50/40 to-sky-50/30',
    blob1: 'bg-cyan-300/20',
    blob2: 'bg-sky-400/16',
    blob3: 'bg-teal-200/16',
    accentBadge: 'bg-sky-600 text-white',
  },
  sunset: {
    id: 'sunset',
    name: 'Rose Quartz White Glass',
    emoji: '🌸',
    tagline: 'Milky-white crystal with delicate rose & champagne bloom',
    gradient: 'from-white via-rose-50/45 to-orange-50/25',
    blob1: 'bg-rose-300/18',
    blob2: 'bg-orange-300/15',
    blob3: 'bg-pink-200/16',
    accentBadge: 'bg-rose-500 text-white',
  },
  aurora: {
    id: 'aurora',
    name: 'Opal Emerald White Glass',
    emoji: '🍃',
    tagline: 'Frosted white glass with soft mint & iridescent emerald sheen',
    gradient: 'from-white via-emerald-50/40 to-teal-50/30',
    blob1: 'bg-emerald-300/18',
    blob2: 'bg-teal-300/16',
    blob3: 'bg-lime-200/14',
    accentBadge: 'bg-emerald-600 text-white',
  },
  midnight: {
    id: 'midnight',
    name: 'Lilac Prism White Glass',
    emoji: '🔮',
    tagline: 'Luminous white crystal with airy periwinkle & lavender caustics',
    gradient: 'from-white via-purple-50/45 to-indigo-50/30',
    blob1: 'bg-purple-300/18',
    blob2: 'bg-indigo-300/16',
    blob3: 'bg-fuchsia-200/14',
    accentBadge: 'bg-purple-600 text-white',
  },
  sunrise: {
    id: 'sunrise',
    name: 'Pearl Champagne White Glass',
    emoji: '✨',
    tagline: 'Warm radiant white glass with lustrous golden pearl glints',
    gradient: 'from-white via-amber-50/50 to-yellow-50/30',
    blob1: 'bg-amber-300/18',
    blob2: 'bg-yellow-300/16',
    blob3: 'bg-orange-200/14',
    accentBadge: 'bg-amber-500 text-white',
  },
  minimal: {
    id: 'minimal',
    name: 'Pure Frosted Studio Glass',
    emoji: '🤍',
    tagline: 'Ultra-clean architectural white frosted glass with pure clarity',
    gradient: 'from-white via-slate-50/70 to-white',
    blob1: 'bg-slate-200/25',
    blob2: 'bg-slate-100/40',
    blob3: 'bg-slate-200/20',
    accentBadge: 'bg-slate-800 text-white',
  },
};

interface AmbientThemeContextType {
  currentTheme: AmbientThemeMode;
  setTheme: (mode: AmbientThemeMode) => void;
  isAnimated: boolean;
  setIsAnimated: (val: boolean) => void;
  flowSpeed: FlowSpeed;
  setFlowSpeed: (speed: FlowSpeed) => void;
  cycleNextTheme: () => void;
  palette: ThemePalette;
}

const AmbientThemeContext = createContext<AmbientThemeContextType | null>(null);

export const useAmbientTheme = () => {
  const ctx = useContext(AmbientThemeContext);
  if (!ctx) {
    throw new Error('useAmbientTheme must be used within AmbientThemeProvider');
  }
  return ctx;
};

export const AmbientThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<AmbientThemeMode>(() => {
    return (localStorage.getItem('bms_ambient_theme') as AmbientThemeMode) || 'auto';
  });
  const [isAnimated, setIsAnimated] = useState<boolean>(() => {
    const saved = localStorage.getItem('bms_ambient_anim');
    return saved !== null ? saved === 'true' : true;
  });
  const [flowSpeed, setFlowSpeedState] = useState<FlowSpeed>(() => {
    return (localStorage.getItem('bms_flow_speed') as FlowSpeed) || 'normal';
  });

  const setTheme = (mode: AmbientThemeMode) => {
    setCurrentTheme(mode);
    localStorage.setItem('bms_ambient_theme', mode);
  };

  const setAnimation = (val: boolean) => {
    setIsAnimated(val);
    localStorage.setItem('bms_ambient_anim', String(val));
  };

  const setFlowSpeed = (speed: FlowSpeed) => {
    setFlowSpeedState(speed);
    localStorage.setItem('bms_flow_speed', speed);
  };

  const themeKeys: AmbientThemeMode[] = ['auto', 'sunset', 'ocean', 'midnight', 'aurora', 'sunrise', 'minimal'];

  const cycleNextTheme = () => {
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  const palette = THEME_PALETTES[currentTheme] || THEME_PALETTES.auto;

  return (
    <AmbientThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        isAnimated,
        setIsAnimated: setAnimation,
        flowSpeed,
        setFlowSpeed,
        cycleNextTheme,
        palette,
      }}
    >
      {children}
    </AmbientThemeContext.Provider>
  );
};

export const AmbientBackgroundCanvas: React.FC = () => {
  const { currentTheme, isAnimated, flowSpeed, palette } = useAmbientTheme();

  const isDynamicFlow = currentTheme === 'auto' && isAnimated;
  const flowAnimClass =
    flowSpeed === 'fast'
      ? 'animate-dynamic-flow-fast'
      : flowSpeed === 'slow'
      ? 'animate-dynamic-flow-slow'
      : 'animate-dynamic-flow-normal';

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-colors duration-1000 bg-white">
      {/* Primary Dynamic White Glass Prismatic Refraction Canvas Layer */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          isDynamicFlow
            ? flowAnimClass
            : `bg-gradient-to-br ${palette.gradient}`
        }`}
      />

      {/* Floating Animated Ambient Crystal Orbs with Eye-Catching Glass Light Colors */}
      {isAnimated && (
        <>
          {/* Top-Right Ambient Glass Orb */}
          <div
            className={`absolute -top-28 -right-28 w-96 h-96 sm:w-[540px] sm:h-[540px] rounded-full blur-3xl transition-colors duration-1000 animate-blob-1 ${
              isDynamicFlow ? 'animate-orb-color-1' : palette.blob1
            }`}
          />

          {/* Center-Left Ambient Glass Orb */}
          <div
            className={`absolute top-1/3 -left-28 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full blur-3xl transition-colors duration-1000 animate-blob-2 ${
              isDynamicFlow ? 'animate-orb-color-2' : palette.blob2
            }`}
          />

          {/* Bottom-Center Ambient Glass Orb */}
          <div
            className={`absolute -bottom-20 left-1/4 w-96 h-96 sm:w-[560px] sm:h-[560px] rounded-full blur-3xl transition-colors duration-1000 animate-blob-3 ${
              isDynamicFlow ? 'animate-orb-color-3' : palette.blob3
            }`}
          />
        </>
      )}

      {/* Optical White Glass Frosted Plate Sheen */}
      <div className="absolute inset-0 bg-white/35 backdrop-blur-[1px]" />

      {/* Liquid Glass Caustics & Specular Light Reflection Layer */}
      <div
        className="absolute inset-0 opacity-45 mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 65% 45% at 20% 15%, rgba(255, 255, 255, 0.95) 0%, transparent 65%),
            radial-gradient(ellipse 55% 55% at 85% 75%, rgba(255, 255, 255, 0.9) 0%, transparent 65%),
            radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.6) 0%, transparent 75%)
          `,
        }}
      />

      {/* Iridescent Top Edge Prismatic Sparkle Accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-sky-400/40 via-pink-400/40 via-purple-300/35 to-amber-300/40 opacity-80" />

      {/* Architectural Crystal Glass Etched Micro-Grid */}
      <div
        className="absolute inset-0 opacity-[0.032] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden="true"
      />
    </div>
  );
};

/**
 * Compact, beautiful, user-friendly Theme & Background Color Switcher Pill
 */
export const AmbientColorSwitcherPill: React.FC<{ inline?: boolean }> = ({ inline = false }) => {
  const { currentTheme, setTheme, isAnimated, setIsAnimated, flowSpeed, setFlowSpeed, cycleNextTheme, palette } = useAmbientTheme();
  const [isOpen, setIsOpen] = useState(false);

  const isDynamicLoop = currentTheme === 'auto' && isAnimated;

  return (
    <div className={`relative ${inline ? 'inline-block' : ''}`}>
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-md transition-all">
        {/* Quick 1-Tap Cycle Color Button */}
        <button
          onClick={cycleNextTheme}
          title="Tap to cycle world's best white glass background colors"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 hover:text-indigo-600 transition-colors"
        >
          <span className="text-sm">{palette.emoji}</span>
          <span className="hidden sm:inline font-black text-[11px] uppercase tracking-wider text-slate-900">
            {palette.name}
          </span>
          {isDynamicLoop ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse ml-0.5" />
          )}
        </button>

        {/* Animation Motion Toggle (Play / Pause) */}
        <button
          onClick={() => setIsAnimated(!isAnimated)}
          title={isAnimated ? 'Pause dynamic glass color motion' : 'Play dynamic glass color motion'}
          className={`p-1.5 rounded-lg transition-colors ${
            isAnimated ? 'text-indigo-600 bg-indigo-50/90' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {isAnimated ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>

        {/* Dropdown Menu Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Customize background glass colors & shift speed"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Palette className="w-3.5 h-3.5 text-slate-700" />
        </button>
      </div>

      {/* Floating Selector Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Dismiss */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-full mt-2 z-50 w-80 p-4 rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] space-y-3 text-left"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 px-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-indigo-600" />
                      White Glass Colors
                    </span>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      World's Best
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Light, eye-catching white crystal glass aura</p>
                </div>
              </div>

              {/* Dynamic Shift Speeds (when in auto or enabled) */}
              <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1">
                  <span>Prism Refraction Speed:</span>
                  <span className="text-indigo-600 font-extrabold capitalize">{flowSpeed}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['fast', 'normal', 'slow'] as FlowSpeed[]).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setFlowSpeed(spd)}
                      className={`py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        flowSpeed === spd
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                      }`}
                    >
                      {spd === 'fast' ? '⚡ Fast' : spd === 'normal' ? '✨ Dynamic' : '🍃 Gentle'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood list */}
              <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-0.5">
                {(Object.keys(THEME_PALETTES) as AmbientThemeMode[]).map((mode) => {
                  const item = THEME_PALETTES[mode];
                  const isSelected = currentTheme === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        setTheme(mode);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-slate-950 text-white shadow-sm'
                          : 'text-slate-800 hover:bg-slate-100/90 hover:text-slate-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base shrink-0">{item.emoji}</span>
                        <div className="text-left">
                          <p className="font-bold text-xs">{item.name}</p>
                          <p className={`text-[10px] font-normal leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                            {item.tagline}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Animation Toggle Row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                <span className="text-xs text-slate-500 font-semibold">Dynamic Prism Motion</span>
                <button
                  onClick={() => setIsAnimated(!isAnimated)}
                  className={`text-[11px] font-black px-3 py-1 rounded-xl border transition-colors ${
                    isAnimated
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {isAnimated ? 'Looping 🌈' : 'Paused ⏸️'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
