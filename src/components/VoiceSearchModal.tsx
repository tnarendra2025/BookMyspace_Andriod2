import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mic, MicOff, Sparkles, ArrowRight, Volume2 } from 'lucide-react';

export const VoiceSearchModal: React.FC = () => {
  const {
    isVoiceSearchOpen,
    setIsVoiceSearchOpen,
    setSearchQuery,
    setSelectedCategoryId,
    setActiveScreen,
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  if (!isVoiceSearchOpen) return null;

  const sampleVoicePrompts = [
    { text: 'Find wedding halls in Hyderabad with 1000 guest capacity', cat: 'marriage_hall', q: 'wedding hall' },
    { text: 'Book badminton turf courts in Financial District', cat: 'sports_turf', q: 'badminton' },
    { text: 'Search luxury PG hostels near Hitec City', cat: 'pg_hostel', q: 'PG' },
    { text: 'Show 5-star hotels with flexi day stay', cat: 'hotel_stay', q: 'hotel' },
  ];

  const handleSimulateVoice = (prompt: { text: string; cat: string; q: string }) => {
    setTranscript(prompt.text);
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery(prompt.q);
      setSelectedCategoryId(prompt.cat);
      setIsVoiceSearchOpen(false);
      setActiveScreen('search');
    }, 1200);
  };

  const handleStartRealSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening for your booking requirement...');
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
        setIsListening(false);
        setSearchQuery(spoken);
        setIsVoiceSearchOpen(false);
        setActiveScreen('search');
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('Could not capture audio. Please try one of the prompt presets below.');
      };

      recognition.start();
    } else {
      // Fallback
      handleSimulateVoice(sampleVoicePrompts[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-700">Voice Assistant Search</span>
          </div>
          <button
            onClick={() => setIsVoiceSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Mic Button */}
        <div className="my-8 flex flex-col items-center justify-center text-center">
          <button
            onClick={handleStartRealSpeech}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <h3 className="text-sm font-bold text-slate-900 mt-4">
            {isListening ? 'Listening...' : 'Tap microphone to speak'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            {transcript || 'Tell us what venue, sport court, hotel, or PG you want to book.'}
          </p>
        </div>

        {/* Quick Voice Presets */}
        <div className="space-y-2 border-t border-slate-100 pt-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Or tap a voice command example:
          </div>
          {sampleVoicePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSimulateVoice(p)}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs text-slate-700 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                <span>"{p.text}"</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
