import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
  Building2,
  Ticket,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export const ContextAwareHelpFab: React.FC = () => {
  const { isHelpChatOpen, setIsHelpChatOpen, isFeatureEnabled } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Namaste! Welcome to BookMySpace Support. I can help you with bookings, slot availability holds, GST invoices, or owner listings. How may I assist you today?',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isFeatureEnabled('AI_SMART_COPILOT')) return null;

  const quickQuestions = [
    { label: 'How do 10-minute holds work?', query: 'How do 10-minute inventory holds work?' },
    { label: 'Cancellation & Refund policy', query: 'What is your cancellation refund policy?' },
    { label: 'How to list as an Owner?', query: 'How can venue owners list properties?' },
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('hold') || lower.includes('lock') || lower.includes('concurrency')) {
        reply =
          'When you proceed to checkout, BookMySpace acquires an atomic 10-minute lock on that date and slot. This prevents any other online user or walk-in offline customer from double-booking while you complete payment.';
      } else if (lower.includes('cancel') || lower.includes('refund')) {
        reply =
          'Per BookMySpace Business Rules, bookings cancelled at least 24 hours prior to slot commencement receive an instant 90% refund directly credited to your original payment source. You can trigger cancellation anytime from "My Bookings".';
      } else if (lower.includes('owner') || lower.includes('list') || lower.includes('host')) {
        reply =
          'You can switch your active role to "Venue Host / Owner" via the top badge. In the Owner Portal, you can submit new listings with photo galleries, manage offline walk-in bookings, and view your unified availability calendar.';
      } else if (lower.includes('invoice') || lower.includes('gst')) {
        reply =
          'Every confirmed booking generates an official GST-compliant tax invoice with itemized line items, CGST/SGST breakdown, and booking reference. You can view or print it anytime under "My Bookings".';
      } else {
        reply =
          'Thank you for reaching out. BookMySpace provides verified function halls, marriage mandapams, sports courts, and PG hostels. You can filter by city or date on our search screen, or call our 24/7 helpline at +91 98765 43210.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: reply,
        },
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isHelpChatOpen && (
        <button
          onClick={() => setIsHelpChatOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white p-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group ring-4 ring-indigo-500/20"
          title="BookMySpace Assistant"
        >
          <Sparkles className="w-5 h-5 animate-spin-slow" />
          <span className="text-xs font-bold hidden group-hover:inline pr-1">Need Help?</span>
        </button>
      )}

      {/* Chat Drawer */}
      {isHelpChatOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-none">BMS Smart Assistant</h4>
                <span className="text-[10px] text-indigo-300">Instant AI Support & Booking Guide</span>
              </div>
            </div>
            <button
              onClick={() => setIsHelpChatOpen(false)}
              className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick FAQ Chips */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.query)}
                className="shrink-0 text-[10px] font-semibold px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-full border border-slate-200 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask anything about spaces, slots, rules..."
              className="flex-1 text-xs px-3 py-2.5 bg-slate-100 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 border border-transparent"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
