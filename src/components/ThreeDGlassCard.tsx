import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, Layers, Plus, ArrowRight } from 'lucide-react';

export type GlassStyle = 'crystal_white' | 'opal_white' | 'prismatic' | 'liquid' | 'obsidian' | 'aurora';

export interface SubSectionItem {
  id: string;
  name: string;
  emoji: string;
  slugs: string[];
  isCustom?: boolean;
}

export interface SectionData {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  tagline: string;
  startingPrice: string;
  highlightStat: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  iconBg: string;
  borderAccent: string;
  glowShadow: string;
  bgDarkGradient: string;
  chipBg: string;
  imageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  subsections: SubSectionItem[];
}

interface ThreeDGlassCardProps {
  section: SectionData;
  index: number;
  spacesCount: number;
  city: string;
  glassStyle?: GlassStyle;
  enable3DTilt?: boolean;
  onOpenSection: (sectionId: string, subsectionId: string) => void;
  getSubsectionSpacesCount: (sectionId: string, subId: string) => number;
  onOpenIntegrateModal: (sectionId: string) => void;
}

export const ThreeDGlassCard: React.FC<ThreeDGlassCardProps> = ({
  section,
  index,
  spacesCount,
  city,
  glassStyle = 'prismatic',
  enable3DTilt = true,
  onOpenSection,
  getSubsectionSpacesCount,
  onOpenIntegrateModal,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for weight and tactile glass feel
  const springConfig = { damping: 20, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  // Dynamic specular light reflection coordinate
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !enable3DTilt) return;
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Normalized coordinates from -0.5 to 0.5
      const xPct = clientX / width - 0.5;
      const yPct = clientY / height - 0.5;

      mouseX.set(xPct);
      mouseY.set(yPct);

      setGlarePos({
        x: Math.round((clientX / width) * 100),
        y: Math.round((clientY / height) * 100),
        opacity: 1,
      });
    },
    [enable3DTilt, mouseX, mouseY]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    setGlarePos((prev) => ({ ...prev, opacity: 1 }));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  // Touch support: subtle dynamic tilt on touch drag
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !enable3DTilt || !e.touches[0]) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const clientX = touch.clientX - rect.left;
    const clientY = touch.clientY - rect.top;
    const xPct = Math.max(-0.5, Math.min(0.5, clientX / rect.width - 0.5));
    const yPct = Math.max(-0.5, Math.min(0.5, clientY / rect.height - 0.5));
    mouseX.set(xPct * 0.7);
    mouseY.set(yPct * 0.7);
  };

  const handleTouchEnd = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const IconComp = section.icon;

  // Glass style appearance configurations
  const glassStyleClasses = {
    crystal_white: {
      isLight: true,
      cardBorder: 'border-white/95 hover:border-white shadow-[0_20px_60px_rgba(0,0,0,0.07),inset_0_1.5px_2px_rgba(255,255,255,1)]',
      glassPlate: 'bg-white/80 backdrop-blur-3xl text-slate-900',
      specularTint: 'from-white/95 via-white/40 to-transparent',
      shimmerBorder: 'from-sky-300/80 via-pink-300/80 to-amber-300/80',
      reflectionOrb: 'bg-gradient-to-tr from-sky-200/50 via-pink-200/40 to-amber-200/40',
    },
    opal_white: {
      isLight: true,
      cardBorder: 'border-white/95 hover:border-white shadow-[0_20px_60px_rgba(245,158,11,0.08),inset_0_1.5px_2px_rgba(255,255,255,1)]',
      glassPlate: 'bg-white/85 backdrop-blur-3xl text-slate-900',
      specularTint: 'from-amber-100/90 via-rose-100/40 to-transparent',
      shimmerBorder: 'from-amber-300/80 via-rose-300/80 to-purple-300/80',
      reflectionOrb: 'bg-gradient-to-tr from-amber-200/45 via-rose-200/35 to-violet-200/35',
    },
    prismatic: {
      isLight: false,
      cardBorder: 'border-white/30 hover:border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.7)]',
      glassPlate: 'bg-slate-950/65 backdrop-blur-2xl text-white',
      specularTint: 'from-white/35 via-white/10 to-transparent',
      shimmerBorder: 'from-indigo-400/40 via-pink-400/50 to-amber-300/40',
      reflectionOrb: 'bg-gradient-to-tr from-white/20 via-sky-300/30 to-rose-300/20',
    },
    liquid: {
      isLight: false,
      cardBorder: 'border-cyan-300/35 hover:border-cyan-200/70 shadow-[0_22px_60px_rgba(6,182,212,0.25),inset_0_1px_2px_rgba(255,255,255,0.8)]',
      glassPlate: 'bg-slate-950/70 backdrop-blur-3xl text-white',
      specularTint: 'from-cyan-200/40 via-sky-100/15 to-transparent',
      shimmerBorder: 'from-cyan-400/50 via-teal-300/50 to-blue-400/50',
      reflectionOrb: 'bg-gradient-to-tr from-cyan-400/25 via-teal-300/30 to-blue-500/20',
    },
    obsidian: {
      isLight: false,
      cardBorder: 'border-purple-500/30 hover:border-purple-400/60 shadow-[0_24px_70px_rgba(147,51,234,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)]',
      glassPlate: 'bg-black/80 backdrop-blur-2xl text-white',
      specularTint: 'from-fuchsia-300/35 via-purple-200/10 to-transparent',
      shimmerBorder: 'from-purple-500/50 via-fuchsia-400/50 to-indigo-500/50',
      reflectionOrb: 'bg-gradient-to-tr from-purple-600/30 via-fuchsia-400/20 to-indigo-600/30',
    },
    aurora: {
      isLight: false,
      cardBorder: 'border-emerald-400/35 hover:border-emerald-300/70 shadow-[0_22px_60px_rgba(16,185,129,0.28),inset_0_1px_2px_rgba(255,255,255,0.8)]',
      glassPlate: 'bg-slate-950/70 backdrop-blur-3xl text-white',
      specularTint: 'from-emerald-200/40 via-teal-100/15 to-transparent',
      shimmerBorder: 'from-emerald-400/50 via-lime-300/50 to-teal-400/50',
      reflectionOrb: 'bg-gradient-to-tr from-emerald-500/25 via-teal-400/30 to-amber-300/20',
    },
  }[glassStyle];

  const isLight = glassStyleClasses.isLight;

  return (
    <div className="perspective-1400 w-full">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        style={{
          rotateX: enable3DTilt ? rotateX : 0,
          rotateY: enable3DTilt ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => onOpenSection(section.id, 'all')}
        className={`group relative flex flex-col justify-between rounded-3xl overflow-hidden cursor-pointer min-h-[420px] transition-all duration-500 border ${glassStyleClasses.cardBorder} ${glassStyleClasses.glassPlate}`}
      >
        {/* ======================================================== */}
        {/* 3D LAYER -1: DEEP PHOTOGRAPHIC BACKDROP & REFRACTIVE TINT */}
        {/* ======================================================== */}
        <div
          style={{ transform: 'translateZ(-15px) scale(1.05)' }}
          className="absolute inset-0 overflow-hidden pointer-events-none transition-transform duration-700 ease-out"
        >
          <img
            src={section.imageUrl}
            alt={section.title}
            className={`w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out ${
              isLight
                ? 'brightness-[0.9] contrast-[1.04] opacity-50'
                : 'brightness-[0.72] contrast-[1.08]'
            }`}
          />
          {/* Atmospheric Multi-stop Gradient Tint */}
          {isLight ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-white/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
            </>
          ) : (
            <>
              <div className={`absolute inset-0 bg-gradient-to-t ${section.bgDarkGradient} opacity-90`} />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent" />
            </>
          )}

          {/* Ambient Glass Optical Refraction Orb */}
          <div
            className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-85 transition-opacity duration-700 ${glassStyleClasses.reflectionOrb}`}
          />
        </div>

        {/* ======================================================== */}
        {/* 3D LAYER 0: SPECULAR GLASS GLARE & CAUSTIC SHEEN         */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 z-10"
          style={{
            opacity: glarePos.opacity,
            background: isLight
              ? `radial-gradient(circle 380px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.25) 40%, transparent 75%)`
              : `radial-gradient(circle 380px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.12) 35%, transparent 75%)`,
            mixBlendMode: isLight ? 'overlay' : 'screen',
          }}
        />

        {/* Prismatic Rainbow Edge Glint on Top Border */}
        <div
          className={`absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r ${glassStyleClasses.shimmerBorder} opacity-70 group-hover:opacity-100 transition-opacity duration-500 z-20`}
        />

        {/* Diagonal Frosted Glass Light Sheen Sweep */}
        <div
          className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/20 to-transparent -rotate-45 pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-10"
        />

        {/* ======================================================== */}
        {/* 3D LAYER 1: FOREGROUND INTERACTIVE CONTENT (ELEVATED 3D)  */}
        {/* ======================================================== */}
        <div
          style={{ transform: 'translateZ(26px)', transformStyle: 'preserve-3d' }}
          className="relative z-20 p-5 sm:p-6 flex flex-col justify-between h-full space-y-4"
        >
          {/* Top Deck: 3D Floating Glass Icon & Badges */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-3.5">
              {/* 3D Floating Glass Icon Pod */}
              <div
                style={{ transform: 'translateZ(24px)' }}
                className="relative group/icon"
              >
                {/* 3D Glass Dome Enclosure */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all duration-300 group-hover:scale-110 ${
                    isLight
                      ? 'bg-white/90 border-white text-indigo-600 shadow-[0_10px_25px_rgba(0,0,0,0.08),inset_0_1.5px_2px_rgba(255,255,255,1)] group-hover:border-indigo-300'
                      : 'bg-white/15 border-white/40 text-white shadow-[0_8px_20px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.7)] group-hover:border-white'
                  }`}
                >
                  <IconComp
                    className={`w-7 h-7 transition-colors ${
                      isLight
                        ? 'text-indigo-600 drop-shadow-xs group-hover:text-amber-500'
                        : 'text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] group-hover:text-amber-300'
                    }`}
                  />

                  {/* Glass highlight crescent ring */}
                  <div className="absolute top-1 left-1.5 right-1.5 h-3 rounded-t-xl bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
                </div>

                {/* Pulse Indicator */}
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white" />
                </span>
              </div>

              {/* Badges Stack with 3D Float */}
              <div
                style={{ transform: 'translateZ(18px)' }}
                className="flex flex-col items-end gap-1.5"
              >
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md border ${
                    isLight
                      ? 'bg-indigo-50/90 text-indigo-700 border-indigo-200/80 shadow-xs'
                      : `${section.badgeColor} shadow-md`
                  }`}
                >
                  <Sparkles className={`w-3 h-3 ${isLight ? 'text-indigo-600' : 'text-amber-300'}`} />
                  {section.badge}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs backdrop-blur-md ${
                    isLight
                      ? 'text-slate-700 bg-white/90 border-slate-200/90'
                      : 'text-slate-200 bg-black/50 border-white/20'
                  }`}
                >
                  {spacesCount} Spaces in {city}
                </span>
              </div>
            </div>

            {/* Title & Subtitle with 3D Depth */}
            <div style={{ transform: 'translateZ(14px)' }} className="space-y-1">
              <h3
                className={`text-xl sm:text-2xl font-black tracking-tight transition-colors ${
                  isLight
                    ? 'text-slate-950 group-hover:text-indigo-600'
                    : 'text-white group-hover:text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]'
                }`}
              >
                {section.title}
              </h3>
              <p
                className={`text-xs font-medium leading-relaxed line-clamp-2 ${
                  isLight ? 'text-slate-600' : 'text-slate-300 drop-shadow-xs'
                }`}
              >
                {section.subtitle}
              </p>
              <div className="pt-1">
                <span
                  className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border backdrop-blur-md shadow-xs ${
                    isLight
                      ? 'text-amber-800 bg-amber-100/80 border-amber-200'
                      : 'text-amber-300 bg-amber-400/15 border-amber-400/30'
                  }`}
                >
                  {section.highlightStat}
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3D FLOATING SUB-SECTIONS DECK                             */}
          {/* ======================================================== */}
          <div style={{ transform: 'translateZ(20px)' }} className="space-y-2 pt-1">
            <div
              className={`flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider ${
                isLight ? 'text-slate-500' : 'text-slate-300'
              }`}
            >
              <span className="flex items-center gap-1">
                <Layers className={`w-3 h-3 ${isLight ? 'text-indigo-600' : 'text-amber-300'}`} />
                Sub-Sections Included:
              </span>
              <span
                className={`font-bold px-2 py-0.2 rounded-full border ${
                  isLight
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30'
                }`}
              >
                1-Click Filter
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {section.subsections.map((sub) => {
                if (sub.id === 'all') return null;
                const subCount = getSubsectionSpacesCount(section.id, sub.id);
                const isOther = sub.id === 'other';

                return (
                  <motion.button
                    key={sub.id}
                    whileHover={{ scale: 1.08, zIndex: 30 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSection(section.id, sub.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-xl transition-all flex items-center gap-1.5 shadow-xs border ${
                      isLight
                        ? isOther
                          ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900 shadow-amber-500/10'
                          : 'bg-white/90 hover:bg-white text-slate-800 border-slate-200/90 hover:border-indigo-300'
                        : isOther
                        ? 'bg-amber-400/20 hover:bg-amber-400/40 border-amber-300/50 text-amber-200 hover:text-white shadow-amber-500/10'
                        : `${section.chipBg} border-white/20 hover:border-white/50 text-white`
                    }`}
                  >
                    <span className="text-sm">{sub.emoji}</span>
                    <span>{sub.name}</span>
                    {subCount > 0 && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          isLight
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-black/50 text-white/90 border border-white/10'
                        }`}
                      >
                        {subCount}
                      </span>
                    )}
                  </motion.button>
                );
              })}

              {/* Quick Integrate Sub-Section Button */}
              <motion.button
                whileHover={{ scale: 1.06, zIndex: 30 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenIntegrateModal(section.id);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold backdrop-blur-xl transition-all flex items-center gap-1 shadow-xs border border-dashed ${
                  isLight
                    ? 'border-slate-300 bg-white/60 text-slate-700 hover:text-indigo-600 hover:bg-white hover:border-indigo-400'
                    : 'border-white/40 text-white/90 hover:text-white hover:border-white hover:bg-white/20'
                }`}
                title="Integrate new sub-section into this category"
              >
                <Plus className={`w-3 h-3 ${isLight ? 'text-indigo-600' : 'text-amber-300'}`} />
                <span>+ Sub-Section</span>
              </motion.button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD FOOTER: PRICING & 3D GLASS ACTION CTA BUTTON         */}
          {/* ======================================================== */}
          <div
            style={{ transform: 'translateZ(16px)' }}
            className={`pt-3.5 border-t flex items-center justify-between gap-2 ${
              isLight ? 'border-slate-200/80' : 'border-white/15'
            }`}
          >
            <div className="flex flex-col">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                Starts From
              </span>
              <span
                className={`text-sm font-black ${
                  isLight ? 'text-slate-950' : 'text-white drop-shadow-xs'
                }`}
              >
                {section.startingPrice}
              </span>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md border ${
                isLight
                  ? 'bg-slate-950 hover:bg-indigo-600 text-white border-slate-800 hover:border-indigo-500 shadow-slate-900/10'
                  : 'bg-white/90 hover:bg-amber-300 text-slate-950 border-white/80 shadow-[0_4px_15px_rgba(255,255,255,0.3)] hover:shadow-amber-400/40'
              }`}
            >
              <span>Explore Spaces</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
