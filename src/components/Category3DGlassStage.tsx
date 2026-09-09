import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Layers, Plus, Compass, Sliders, Eye, Orbit } from 'lucide-react';
import { ThreeDGlassCard, SectionData, GlassStyle } from './ThreeDGlassCard';
import { AmbientColorSwitcherPill } from './AmbientBackground';

interface Category3DGlassStageProps {
  mainSections: SectionData[];
  selectedLocation: { city: string; area?: string };
  getSectionSpacesCount: (sectionId: string) => number;
  getSubsectionSpacesCount: (sectionId: string, subId: string) => number;
  handleOpenSection: (sectionId: string, subId: string) => void;
  onOpenIntegrateModal: (sectionId: string) => void;
  onOpenCustomCategoryModal: () => void;
}

export const Category3DGlassStage: React.FC<Category3DGlassStageProps> = ({
  mainSections,
  selectedLocation,
  getSectionSpacesCount,
  getSubsectionSpacesCount,
  handleOpenSection,
  onOpenIntegrateModal,
  onOpenCustomCategoryModal,
}) => {
  const [glassStyle, setGlassStyle] = useState<GlassStyle>('crystal_white');
  const [enable3DTilt, setEnable3DTilt] = useState<boolean>(true);
  const [showStyleMenu, setShowStyleMenu] = useState<boolean>(false);

  const glassStyleOptions: { id: GlassStyle; label: string; emoji: string; desc: string; glow: string }[] = [
    {
      id: 'crystal_white',
      label: 'Crystal White Glass',
      emoji: '💎',
      desc: "World's best high-clarity white glass with prismatic refractions",
      glow: 'from-white/90 via-sky-200/35 to-pink-200/30',
    },
    {
      id: 'opal_white',
      label: 'Opal Silk White',
      emoji: '🦪',
      desc: 'Pearlescent milky-white glass with champagne-rose caustics',
      glow: 'from-white/90 via-amber-200/35 to-rose-200/25',
    },
    {
      id: 'prismatic',
      label: 'Prismatic Crystal',
      emoji: '✨',
      desc: 'Dark crystal glass with prismatic chromatic reflections',
      glow: 'from-indigo-500/20 via-pink-500/20 to-amber-400/20',
    },
    {
      id: 'liquid',
      label: 'Liquid Glacier',
      emoji: '💧',
      desc: 'Deep frosted ice with luminous cyan caustics',
      glow: 'from-cyan-500/25 via-sky-500/20 to-blue-600/20',
    },
    {
      id: 'obsidian',
      label: 'Cosmic Obsidian',
      emoji: '🌌',
      desc: 'Smoked black luxury glass with ultraviolet glow',
      glow: 'from-purple-600/30 via-fuchsia-500/20 to-indigo-900/30',
    },
    {
      id: 'aurora',
      label: 'Aurora Emerald',
      emoji: '🍃',
      desc: 'Iridescent emerald-teal glass with jade specular reflections',
      glow: 'from-emerald-500/25 via-teal-500/20 to-lime-400/20',
    },
  ];

  const currentOption = glassStyleOptions.find((o) => o.id === glassStyle) || glassStyleOptions[0];

  return (
    <div className="relative rounded-[2.5rem] p-5 sm:p-8 lg:p-10 overflow-hidden border border-white/90 shadow-[0_30px_90px_rgba(0,0,0,0.07),inset_0_1.5px_2px_rgba(255,255,255,1)] bg-white/75 backdrop-blur-3xl transition-all duration-700">
      {/* ================================================================= */}
      {/* 3D GLASS STAGE BACKGROUND REFRACTIONS & FLOATING OPTICAL ELEMENTS */}
      {/* ================================================================= */}

      {/* Dynamic Colored Caustic Aura behind the glass */}
      <div
        className={`absolute -inset-10 bg-gradient-to-tr ${currentOption.glow} blur-3xl opacity-60 pointer-events-none transition-all duration-1000`}
      />

      {/* Subtle Micro-etched 3D Perspective Isometric Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(#000 1px, transparent 1px), linear-gradient(to right, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px, 64px 64px',
        }}
      />

      {/* Floating 3D Refractive Glass Crystal Prism (Top-Right) */}
      <div className="absolute -top-10 right-4 sm:right-16 w-36 h-36 pointer-events-none z-0 opacity-80 select-none">
        <div className="relative w-full h-full animate-rotate-glass-3d">
          {/* Glass Crystal Octahedron Faces */}
          <div className="absolute inset-2 rounded-2xl bg-gradient-to-tr from-white/40 via-indigo-300/30 to-pink-300/40 backdrop-blur-md border border-white/60 shadow-[0_10px_30px_rgba(99,102,241,0.25),inset_0_1px_2px_rgba(255,255,255,0.9)] transform rotate-45" />
          <div className="absolute inset-5 rounded-xl bg-gradient-to-br from-white/60 via-amber-200/30 to-purple-300/40 backdrop-blur-lg border border-white/80 transform -rotate-12" />
          {/* Specular Glint Center */}
          <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-white blur-[1px] shadow-[0_0_10px_#fff]" />
        </div>
      </div>

      {/* Floating 3D Liquid Glass Orb (Bottom-Left) */}
      <div className="absolute -bottom-14 -left-10 w-48 h-48 pointer-events-none z-0 opacity-70 select-none">
        <div className="relative w-full h-full animate-float-glass-orb">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/30 via-sky-300/25 to-indigo-400/30 backdrop-blur-xl border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(255,255,255,0.8)]" />
          <div className="absolute top-4 left-8 w-14 h-7 rounded-full bg-white/50 blur-xs rotate-[-35deg]" />
        </div>
      </div>

      {/* Floating 3D Liquid Glass Orb 2 (Center-Right ambient) */}
      <div className="absolute top-1/2 -right-8 w-32 h-32 pointer-events-none z-0 opacity-40 select-none">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-300/30 via-purple-300/20 to-white/40 backdrop-blur-lg border border-white/40 shadow-lg animate-float-glass-orb" />
      </div>

      {/* ================================================================= */}
      {/* STAGE HEADER & 3D CONTROLS BAR                                   */}
      {/* ================================================================= */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-900/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-950 text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>3D Glass Matrix</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/80 shadow-xs">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>5 Master Categories</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-2 flex items-center gap-2">
              <span>Explore Verified Spaces by Master Category</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Organized into 5 master sections with real-time 3D glass perspective & 1-click sub-section filters.
            </p>
          </div>

          {/* Interactive 3D Glass Controls & Shortcuts */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* 3D Tilt Toggle Pill */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setEnable3DTilt((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border shadow-xs backdrop-blur-md ${
                enable3DTilt
                  ? 'bg-slate-950 text-white border-slate-900'
                  : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
              }`}
              title="Toggle interactive 3D perspective mouse physics"
            >
              <Orbit className={`w-3.5 h-3.5 ${enable3DTilt ? 'text-amber-300 animate-spin' : 'text-slate-400'}`} style={{ animationDuration: '6s' }} />
              <span>{enable3DTilt ? '3D Tilt: Active' : '3D Tilt: Static'}</span>
            </motion.button>

            {/* Glass Material Selector Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowStyleMenu((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 text-xs font-black transition-all border border-slate-200/90 shadow-xs backdrop-blur-md"
                title="Change 3D Glass refraction material"
              >
                <span>{currentOption.emoji}</span>
                <span className="hidden sm:inline">{currentOption.label}</span>
                <span className="sm:hidden">Glass</span>
                <Sliders className="w-3 h-3 text-slate-500 ml-0.5" />
              </motion.button>

              {/* Glass Material Selector Menu */}
              {showStyleMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/60 shadow-2xl z-50 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    3D Glass Surface Refraction
                  </div>
                  {glassStyleOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setGlassStyle(opt.id);
                        setShowStyleMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                        glassStyle === opt.id
                          ? 'bg-slate-950 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-base">{opt.emoji}</span>
                      <div className="flex flex-col">
                        <span className="font-extrabold">{opt.label}</span>
                        <span className="text-[10px] opacity-75 font-normal line-clamp-1">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ambient Background Color Changer */}
            <AmbientColorSwitcherPill />

            {/* + Integrate Sub-Section Trigger */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onOpenIntegrateModal('function_halls')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white text-xs font-black transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Integrate Sub-Section</span>
            </motion.button>

            {/* Request Custom Space Trigger */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenCustomCategoryModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 text-xs font-black transition-all border border-indigo-200/70 shadow-xs hover:shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Request Custom Space</span>
              <span className="sm:hidden">Custom Space</span>
            </motion.button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* THE 5 MAIN SECTION CARDS WITH 3D GLASS INTERACTIVE DEPTH          */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {mainSections.map((section, index) => {
            const count = getSectionSpacesCount(section.id);

            return (
              <ThreeDGlassCard
                key={section.id}
                section={section}
                index={index}
                spacesCount={count}
                city={selectedLocation.city}
                glassStyle={glassStyle}
                enable3DTilt={enable3DTilt}
                onOpenSection={handleOpenSection}
                getSubsectionSpacesCount={getSubsectionSpacesCount}
                onOpenIntegrateModal={onOpenIntegrateModal}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
