import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowLeft,
  LifeBuoy,
  MessageCircle,
} from 'lucide-react';

export const SupportScreen: React.FC = () => {
  const { setActiveScreen, setIsHelpChatOpen, setIsAIBookingOpen } = useApp();

  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Booking Issue');
  const [message, setMessage] = useState('');
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const faqs = [
    {
      q: 'How do I cancel my booking and receive a refund?',
      a: 'You can cancel any confirmed booking up to 2 hours before the start time directly from the "My Bookings" tab. 90% of the amount will be automatically refunded to your original payment method within 2-3 business days without manual questions.',
    },
    {
      q: 'What should I present at the venue check-in desk?',
      a: 'Open your confirmed booking in "My Bookings" and tap "QR Pass". Present the high-contrast dynamic QR code to the venue front desk scanner for instant contactless verification.',
    },
    {
      q: 'How do 10-minute inventory holds work?',
      a: 'When you proceed to checkout, BookMySpace acquires an atomic 10-minute inventory lock. This prevents other customers or offline walk-ins from booking that exact slot or date while you complete payment.',
    },
    {
      q: 'How do I list my convention hall, sports turf, or coaching academy?',
      a: 'Go to Profile > Switch to Venue Owner Portal / Institute Owner Portal and submit your space details, photos, and slot pricing. Our verification team reviews and activates listings within 24 hours.',
    },
    {
      q: 'Is there a referral reward for inviting friends?',
      a: 'Yes! Share your unique referral code from your Profile page. Both you and your invited friend receive ₹500 in BookMySpace wallet credits immediately after their first completed booking.',
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const ticketId = `BMS-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicketId(ticketId);
    setSubject('');
    setMessage('');
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent('Hi BookMySpace Support team, I need assistance regarding my booking reservation.');
    window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('home')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Help & 24/7 Support</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                Online
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant AI assistance, direct WhatsApp booking helpline & ticket resolution
            </p>
          </div>
        </div>
      </div>

      {/* Direct Contact Channels Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* AI Chatbot Assistant */}
        <div
          onClick={() => setIsHelpChatOpen(true)}
          className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-indigo-50 border border-indigo-200 rounded-3xl p-5 cursor-pointer hover:border-indigo-400 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
              Instant
            </span>
          </div>
          <h3 className="text-sm font-black text-slate-900 mt-3">AI Support Copilot</h3>
          <p className="text-xs text-slate-600 mt-1">Get instant answers on slot holds, refunds, and pricing.</p>
        </div>

        {/* WhatsApp Helpline */}
        <div
          onClick={handleOpenWhatsApp}
          className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-50 border border-emerald-200 rounded-3xl p-5 cursor-pointer hover:border-emerald-400 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              WhatsApp
            </span>
          </div>
          <h3 className="text-sm font-black text-slate-900 mt-3">WhatsApp Concierge</h3>
          <p className="text-xs text-slate-600 mt-1">Chat directly with our team for bulk & wedding inquiries.</p>
        </div>

        {/* Phone Helpline */}
        <a
          href="tel:+918000000000"
          className="bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-sky-50 border border-sky-200 rounded-3xl p-5 hover:border-sky-400 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-sky-600 text-white rounded-2xl group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
              Toll Free
            </span>
          </div>
          <h3 className="text-sm font-black text-slate-900 mt-3">1800-BMS-PACE</h3>
          <p className="text-xs text-slate-600 mt-1">Available 24/7 across India for urgent check-in support.</p>
        </a>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="divide-y divide-slate-100 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaqIndex === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-2.5 text-xs text-slate-600 leading-relaxed pr-6 pl-0.5 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Support Ticket Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Submit an Official Helpdesk Ticket</h2>
            <p className="text-xs text-slate-500">Our customer success team responds within 2 hours</p>
          </div>
        </div>

        {submittedTicketId ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-emerald-900">Support Ticket Created Successfully</h3>
            <p className="text-xs text-emerald-800">
              Your Reference ID is <strong>{submittedTicketId}</strong>. We have sent a confirmation copy to your registered email.
            </p>
            <button
              onClick={() => setSubmittedTicketId(null)}
              className="mt-2 px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
            >
              Submit Another Query
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 bg-slate-50"
                >
                  <option value="Booking Issue">Booking Confirmation & Slots</option>
                  <option value="Refund Request">Cancellation & 90% Refund</option>
                  <option value="Payment Dispute">Payment Gateway or UPI Issue</option>
                  <option value="Host Verification">Venue Host Onboarding</option>
                  <option value="Other">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject / Booking Ref</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Refund for Booking #BMS-9281"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Message / Details</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your issue or query in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 bg-slate-50 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
