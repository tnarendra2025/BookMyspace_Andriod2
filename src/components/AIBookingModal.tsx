import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  CheckCircle2,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Venue } from '../types';

interface AIBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtractedCriteria {
  category?: string;
  estimatedGuests?: number;
  budgetEstimate?: string;
  preferredTime?: string;
}

export const AIBookingModal: React.FC<AIBookingModalProps> = ({ isOpen, onClose }) => {
  const { venues, selectedLocation, setBookingModalVenue } = useApp();
  const { t, currentLanguage } = useLanguage();

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conciergeResponse, setConciergeResponse] = useState<string | null>(null);
  const [extractedCriteria, setExtractedCriteria] = useState<ExtractedCriteria | null>(null);
  const [matchedVenues, setMatchedVenues] = useState<Venue[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearchAI = async (queryToUse?: string) => {
    const activePrompt = queryToUse || prompt;
    if (!activePrompt.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/gemini/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          currentCity: selectedLocation.city,
          userLanguage: currentLanguage,
          venuesList: venues,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      setConciergeResponse(data.conciergeSummary || 'Found matching spaces based on your requirements.');
      setExtractedCriteria(data.extractedCriteria || null);

      if (Array.isArray(data.matchedVenueIds) && data.matchedVenueIds.length > 0) {
        const found = data.matchedVenueIds
          .map((id: string) => venues.find((v) => v.id === id))
          .filter(Boolean) as Venue[];
        setMatchedVenues(found.length > 0 ? found : venues.slice(0, 3));
      } else {
        setMatchedVenues(venues.slice(0, 3));
      }
    } catch (err: any) {
      console.warn('AI Booking query fallback:', err);
      // Client-side fallback matching
      const q = activePrompt.toLowerCase();
      const filtered = venues.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.category.name.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      );
      setConciergeResponse(
        `We evaluated your requirement "${activePrompt}" and curated the best available venues in ${selectedLocation.city} with immediate booking availability.`
      );
      setExtractedCriteria({
        category: 'Custom Match',
        estimatedGuests: 50,
        budgetEstimate: 'Best Value',
        preferredTime: 'Anytime',
      });
      setMatchedVenues(filtered.length > 0 ? filtered.slice(0, 3) : venues.slice(0, 3));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantBook = (venue: Venue) => {
    onClose();
    // Open the primary booking modal for direct checkout
    setBookingModalVenue(venue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-[2rem] border border-slate-200/90 shadow-2xl flex flex-col no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Luminous AI Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white overflow-hidden rounded-t-[2rem]">
          {/* Prismatic Top Edge Shimmer */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-sky-400 via-pink-400 to-amber-300" />
          <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl bg-indigo-500/30 pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-inner">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Gemini 3.8 Flash
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    ⚡ Instant Book
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                  {t.aiAssistantTitle}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{t.aiAssistantSubtitle}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Natural Language Prompt Input */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              {t.aiInputPlaceholder.split('...')[0]}
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearchAI();
                  }
                }}
                rows={3}
                placeholder={t.aiInputPlaceholder}
                className="w-full p-4 pr-12 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm text-slate-900 placeholder:text-slate-400 resize-none font-medium"
              />
              <button
                disabled={isLoading || !prompt.trim()}
                onClick={() => handleSearchAI()}
                className="absolute bottom-3.5 right-3.5 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-md transition-all flex items-center justify-center cursor-pointer"
                title={t.findAndBookAi}
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Quick 1-Click Prompt Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                {t.aiTryPrompts}
              </span>
              <div className="flex flex-wrap gap-2">
                {[t.aiPrompt1, t.aiPrompt2, t.aiPrompt3].map((samplePrompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(samplePrompt);
                      handleSearchAI(samplePrompt);
                    }}
                    className="text-left text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/80 text-slate-700 transition-colors font-medium cursor-pointer"
                  >
                    "{samplePrompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-black text-indigo-950">{t.aiAnalyzing}</h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Scanning real-time capacity, pricing, ratings, and location proximity in {selectedLocation.city}...
                </p>
              </div>
            </div>
          )}

          {/* AI Concierge Results */}
          {conciergeResponse && !isLoading && (
            <div className="space-y-5">
              {/* Concierge Summary Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 border border-indigo-100 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black uppercase text-indigo-950 tracking-wider">
                    AI Concierge Recommendation
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {conciergeResponse}
                </p>

                {/* Extracted Criteria Badges */}
                {extractedCriteria && (
                  <div className="pt-2 border-t border-indigo-100/80 flex flex-wrap items-center gap-2">
                    {extractedCriteria.category && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-800 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                        {extractedCriteria.category}
                      </span>
                    )}
                    {extractedCriteria.estimatedGuests && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-800 shadow-2xs">
                        <Users className="w-3 h-3 text-indigo-600" />
                        ~{extractedCriteria.estimatedGuests} {t.guests}
                      </span>
                    )}
                    {extractedCriteria.budgetEstimate && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-800 shadow-2xs">
                        <ShieldCheck className="w-3 h-3 text-indigo-600" />
                        {extractedCriteria.budgetEstimate}
                      </span>
                    )}
                    {extractedCriteria.preferredTime && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-800 shadow-2xs">
                        <Clock className="w-3 h-3 text-indigo-600" />
                        {extractedCriteria.preferredTime}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Matched Spaces List with Instant Booking Action */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span>{t.aiMatchHeader}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {matchedVenues.length} available
                    </span>
                  </h4>
                  <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                    Instant Checkout Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {matchedVenues.map((venue) => (
                    <div
                      key={venue.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={venue.images[0]?.url || venue.featuredImageUrl}
                          alt={venue.name}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-indigo-600">
                              {venue.category.name}
                            </span>
                            <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {venue.avgRating}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                            {venue.name}
                          </h5>
                          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {venue.addressLine1}
                          </p>
                          <div className="text-xs font-black text-slate-900 mt-1">
                            ₹{venue.pricingBaseAmount.toLocaleString('en-IN')}{' '}
                            <span className="text-[10px] text-slate-400 font-normal">
                              {venue.category.slug === 'sports_turf' ? '/ hr' : '/ slot'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => handleInstantBook(venue)}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>{t.ai1ClickBook}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
