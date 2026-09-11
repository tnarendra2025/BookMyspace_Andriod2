import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gift,
  Share2,
  Copy,
  Check,
  Award,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Coins,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const ReferralScreen: React.FC = () => {
  const { currentUser } = useApp();

  const [copied, setCopied] = useState(false);
  const referralCode = `BMS-${(currentUser.fullName.split(' ')[0] || 'GUEST').toUpperCase()}-2026`;
  const referralLink = `https://bookmyspace.app/invite?ref=${referralCode}`;

  const [walletBalance, setWalletBalance] = useState(1450);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemedVoucher, setRedeemedVoucher] = useState<string | null>(null);

  const friendsList = [
    { name: 'Siddharth Varma', date: 'Sept 04, 2026', status: 'COMPLETED', reward: '+ ₹500', venue: 'Smash Arena BWF Courts' },
    { name: 'Ananya Deshmukh', date: 'Aug 28, 2026', status: 'COMPLETED', reward: '+ ₹500', venue: 'The Royal Imperial Palace' },
    { name: 'Vikram Joshi', date: 'Aug 15, 2026', status: 'JOINED', reward: 'Pending first booking', venue: 'Signed Up' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Book verified wedding halls, sports turfs, hostels & coaching classes with zero double-booking on BookMySpace! Use my code ${referralCode} to get flat 15% off: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleRedeemPoints = () => {
    if (walletBalance < 500) return;
    setIsRedeeming(true);
    setTimeout(() => {
      setWalletBalance((prev) => prev - 500);
      setRedeemedVoucher('BMS-VOUCHER-500-DISCOUNT');
      setIsRedeeming(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
          Community & Rewards
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
          <Gift className="w-6 h-6 text-amber-600" />
          Refer Friends & Earn Booking Rewards
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Give friends 15% off their first reservation, and earn ₹500 reward cash when they check in.
        </p>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Gold Member Tier (Level 2)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black">
            Earn Unlimited Free Hours & Banquet Credits
          </h2>
          <p className="text-xs sm:text-sm text-amber-50 leading-relaxed">
            Your personal referral link gives your friends an instant 15% discount across all categories, and credits ₹500 BMS Wallet coins directly to your balance.
          </p>

          {/* Referral Link Copy Box */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <div className="w-full sm:w-auto flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3">
              <span className="font-mono font-bold text-xs sm:text-sm text-white tracking-wider truncate">
                {referralCode}
              </span>
              <button
                onClick={handleCopy}
                className="text-xs font-bold px-3 py-1 bg-white text-slate-900 rounded-xl hover:bg-amber-50 transition-colors flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link!' : 'Copy Code'}</span>
              </button>
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rewards Wallet & Tier Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Wallet Coins</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-slate-900">₹{walletBalance}</span>
              <span className="text-xs text-slate-500 font-bold">({walletBalance} Coins)</span>
            </div>
            <span className="text-xs text-emerald-600 font-bold mt-1 block">1 Coin = ₹1.00 INR Value</span>
          </div>

          <button
            onClick={handleRedeemPoints}
            disabled={walletBalance < 500 || isRedeeming}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all"
          >
            {isRedeeming ? 'Redeeming...' : 'Redeem ₹500 Booking Voucher'}
          </button>
        </div>

        {/* Invited Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Friends Invited</span>
            <div className="text-3xl font-black text-slate-900 mt-1">3 Friends</div>
            <span className="text-xs text-indigo-600 font-bold mt-1 block">2 Bookings Completed</span>
          </div>
          <div className="text-xs text-slate-400">Total earned: ₹1,000 from referrals</div>
        </div>

        {/* Tier Advancement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tier Status</span>
            <div className="text-lg font-black text-amber-600 mt-1 flex items-center gap-1.5">
              <Award className="w-5 h-5" />
              <span>Gold Tier Partner</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Invite 2 more friends to unlock <strong>Platinum Tier (₹750 per referral + VIP support)</strong>.
            </p>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-3/5" />
          </div>
        </div>
      </div>

      {/* Redeemed Voucher Banner */}
      {redeemedVoucher && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-900 block">Voucher Successfully Generated!</span>
              <span className="font-mono text-xs font-bold text-emerald-700">{redeemedVoucher}</span>
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(redeemedVoucher);
              alert('Copied voucher code to clipboard! Apply during checkout.');
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
          >
            Copy Voucher
          </button>
        </div>
      )}

      {/* Referral History */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-black text-slate-900">Your Referral Activity</span>
          <span className="text-[11px] text-slate-400">Showing {friendsList.length} invitations</span>
        </div>

        <div className="divide-y divide-slate-100">
          {friendsList.map((f, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                  {f.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{f.name}</div>
                  <div className="text-[11px] text-slate-500">{f.venue} • {f.date}</div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    f.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {f.status}
                </span>
                <div className="text-xs font-black text-emerald-600 mt-0.5">{f.reward}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
