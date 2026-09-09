import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Sparkles,
  Layers,
  Building2,
  Hotel,
  Home,
  GraduationCap,
  Trophy,
  Check,
  Zap,
} from 'lucide-react';
import { Venue } from '../types';

export interface CustomSubSection {
  id: string;
  name: string;
  emoji: string;
  parentSectionId: string;
  slugs: string[];
  isCustom: boolean;
  createdAt: number;
  tagline?: string;
  starterVenueId?: string;
}

interface IntegrateSubSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSectionId?: string;
  onIntegrate: (newSub: CustomSubSection, starterVenue?: Partial<Venue>) => void;
  currentCity?: string;
}

const CATEGORY_CHOICES = [
  { id: 'function_halls', label: 'Function Halls', icon: Building2, color: 'text-rose-500', defaultSlug: 'function_hall', basePrice: 25000, priceUnit: '/day' },
  { id: 'lodge_rooms', label: 'Hotels & Rooms', icon: Hotel, color: 'text-sky-500', defaultSlug: 'hotel_stay', basePrice: 599, priceUnit: '/hr' },
  { id: 'pg_hostels', label: 'PG & Hostels', icon: Home, color: 'text-amber-500', defaultSlug: 'pg_hostel', basePrice: 5500, priceUnit: '/mo' },
  { id: 'institutes_classes', label: 'Classes & Labs', icon: GraduationCap, color: 'text-purple-500', defaultSlug: 'coaching', basePrice: 1500, priceUnit: '/mo' },
  { id: 'sports_workspaces', label: 'Sports & Desks', icon: Trophy, color: 'text-emerald-500', defaultSlug: 'sports_turf', basePrice: 800, priceUnit: '/hr' },
];

const POPULAR_EMOJIS = [
  '🎪', '🎙️', '🏕️', '🧘', '🏊', '🐾', '🍳', '🌟', '🏷️', '🎸',
  '🎮', '🛹', '☕', '🌺', '🎨', '🏎️', '🏏', '🏛️', '🛎️', '📚',
  '🎬', '🥋', '🚤', '🏸',
];

const PRESET_IDEAS = [
  { name: 'Rooftop Party Gazebos', emoji: '🎪', cat: 'function_halls' },
  { name: 'Soundproof Podcast Studio', emoji: '🎙️', cat: 'sports_workspaces' },
  { name: 'Pet Daycare & Boarding', emoji: '🐾', cat: 'pg_hostels' },
  { name: 'Pilates & Yoga Studio', emoji: '🧘', cat: 'institutes_classes' },
  { name: 'Luxury Villa Daycation', emoji: '🌴', cat: 'lodge_rooms' },
  { name: 'Pickleball & Badminton Court', emoji: '🏸', cat: 'sports_workspaces' },
];

export const IntegrateSubSectionModal: React.FC<IntegrateSubSectionModalProps> = ({
  isOpen,
  onClose,
  defaultSectionId = 'function_halls',
  onIntegrate,
  currentCity = 'Hyderabad',
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(defaultSectionId);
  const [subSectionName, setSubSectionName] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('✨');
  const [tagline, setTagline] = useState<string>('');
  const [createStarterVenue, setCreateStarterVenue] = useState<boolean>(true);

  // Sync default category when prop changes
  React.useEffect(() => {
    if (defaultSectionId) {
      setSelectedSectionId(defaultSectionId);
    }
  }, [defaultSectionId]);

  if (!isOpen) return null;

  const currentCatMeta = CATEGORY_CHOICES.find((c) => c.id === selectedSectionId) || CATEGORY_CHOICES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subSectionName.trim()) return;

    const cleanSlug = subSectionName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    const newSubId = `custom_sub_${Date.now()}`;
    const customSub: CustomSubSection = {
      id: newSubId,
      name: subSectionName.trim(),
      emoji: selectedEmoji,
      parentSectionId: selectedSectionId,
      slugs: [cleanSlug, currentCatMeta.defaultSlug],
      isCustom: true,
      createdAt: Date.now(),
      tagline: tagline.trim() || `Verified spaces for ${subSectionName.trim()}`,
    };

    let starterVenue: Partial<Venue> | undefined = undefined;
    if (createStarterVenue) {
      starterVenue = {
        id: `v_starter_${Date.now()}`,
        name: `Signature ${subSectionName.trim()} Hub`,
        slug: `${cleanSlug}-signature-hub`,
        description: `Premier verified ${subSectionName.trim()} space featuring modern facilities, high-speed connectivity, professional amenities, and flexible instant booking slots.`,
        addressLine1: 'Prime Commercial Hub, Main Avenue',
        city: currentCity,
        state: 'Telangana',
        latitude: 17.43,
        longitude: 78.41,
        capacity: 150,
        pricingBaseAmount: currentCatMeta.basePrice,
        taxRate: 18.0,
        parkingCapacity: 40,
        foodOptions: 'Catering & refreshment services available on demand',
        rules: 'Standard safety protocols apply. Verified ID required at check-in.',
        isVerified: true,
        isActive: true,
        status: 'APPROVED',
        avgRating: 4.8,
        ratingCount: 34,
        category: {
          id: `cat_${cleanSlug}`,
          slug: cleanSlug,
          name: subSectionName.trim(),
          iconName: 'sparkles',
          icon: selectedEmoji,
          isActive: true,
          isUnifiedRegistrationEnabled: true,
          customEmoji: selectedEmoji,
          parentSection: selectedSectionId,
        },
        featuredImageUrl:
          selectedSectionId === 'function_halls'
            ? 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'
            : selectedSectionId === 'lodge_rooms'
            ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
            : selectedSectionId === 'pg_hostels'
            ? 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'
            : selectedSectionId === 'institutes_classes'
            ? 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80'
            : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
        images: [
          {
            id: `img_starter_1`,
            url:
              selectedSectionId === 'function_halls'
                ? 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'
                : selectedSectionId === 'lodge_rooms'
                ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
                : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
            altText: `${subSectionName.trim()} Interior View`,
            isCover: true,
          },
        ],
        facilities: [
          { facility: 'High-Speed Optical WiFi', isAvailable: true },
          { facility: 'Air Conditioned Climate Control', isAvailable: true },
          { facility: '100% Power Generator Backup', isAvailable: true },
          { facility: 'Dedicated Parking & Security Guard', isAvailable: true },
        ],
        packages: [
          {
            id: `pkg_${newSubId}`,
            name: 'Standard Experience Access',
            priceAmount: currentCatMeta.basePrice,
            description: `Full access slot with all core amenities included.`,
            itemsIncluded: ['Space Access', 'Electricity Backup', 'Support Staff'],
          },
        ],
      };
    }

    onIntegrate(customSub, starterVenue);
    onClose();

    // Reset form
    setSubSectionName('');
    setSelectedEmoji('✨');
    setTagline('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/25 border border-indigo-400/30 flex items-center justify-center text-amber-300 shadow-inner">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-white tracking-tight flex items-center gap-2">
                    Integrate New Sub-Section
                  </h3>
                  <p className="text-xs text-indigo-200/90">
                    Add custom space types dynamically to any master category
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* 1. Target Master Category */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Select Master Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_CHOICES.map((cat) => {
                  const isSelected = selectedSectionId === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedSectionId(cat.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon className={`w-4 h-4 ${cat.color}`} />
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Inspiration Pills */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Quick Ideas (1-Tap Fill):</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IDEAS.map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSubSectionName(idea.name);
                      setSelectedEmoji(idea.emoji);
                      setSelectedSectionId(idea.cat);
                    }}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors border border-slate-200/80 flex items-center gap-1"
                  >
                    <span>{idea.emoji}</span>
                    <span>{idea.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Sub-Section Title & Emoji */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Sub-Section Name & Icon
              </label>
              <div className="flex items-center gap-2">
                {/* Emoji Preview Button */}
                <div className="w-12 h-11 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-xl shrink-0">
                  {selectedEmoji}
                </div>
                <input
                  type="text"
                  required
                  value={subSectionName}
                  onChange={(e) => setSubSectionName(e.target.value)}
                  placeholder="e.g. Rooftop Gazebos, Art Workshops, Podcast Pods"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
                  autoFocus
                />
              </div>

              {/* Emoji Selector Grid */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Select Icon:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {POPULAR_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setSelectedEmoji(em)}
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm transition-all ${
                        selectedEmoji === em
                          ? 'bg-indigo-600 text-white scale-110 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Short Tagline */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Tagline / Description (Optional)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Hourly micro-rentals for creative professionals"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 4. Instant Live Starter Venue Switch */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
              <input
                type="checkbox"
                id="createStarterSwitch"
                checked={createStarterVenue}
                onChange={(e) => setCreateStarterVenue(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="createStarterSwitch" className="text-xs text-indigo-950 cursor-pointer select-none">
                <span className="font-black block flex items-center gap-1 text-indigo-900">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Generate instant live starter space in {currentCity}
                </span>
                <span className="text-indigo-700/80 text-[11px] block mt-0.5">
                  Automatically populates a verified space priced at ₹{currentCatMeta.basePrice.toLocaleString('en-IN')}{currentCatMeta.priceUnit} so you can immediately see and book spaces in this new sub-section.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!subSectionName.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md shadow-indigo-500/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Integrate Sub-Section</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
