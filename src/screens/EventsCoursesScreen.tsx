import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Ticket,
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';

export const EventsCoursesScreen: React.FC = () => {
  const { events, institutes, setBookingModalVenue, venues } = useApp();
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'INSTITUTES'>('EVENTS');

  const handleBookEventPass = (evt: any) => {
    // Select partner venue associated with the event
    const fallbackVenue = venues.find((v) => v.id === 'v_smash_arena') || venues[0];
    setBookingModalVenue(fallbackVenue);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-5xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-indigo-600" />
            Events, Tournaments & Coaching Academies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Book entries for badminton championships, wedding lifestyle expos, and enroll in certified academies
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('EVENTS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'EVENTS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Events & Workshops ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('INSTITUTES')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'INSTITUTES' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Coaching Academies ({institutes.length})
          </button>
        </div>
      </div>

      {/* TAB 1: EVENTS */}
      {activeTab === 'EVENTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => {
            const bookedPct = Math.round((evt.seatsBooked / evt.seatsTotal) * 100);

            return (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48">
                    <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-900 shadow-xs">
                      {evt.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                      <Calendar className="w-4 h-4" />
                      {evt.date} • {evt.time}
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base">{evt.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{evt.description}</p>

                    <div className="text-xs text-slate-600 space-y-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{evt.venueName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        <span>Organized by: {evt.organizer}</span>
                      </div>
                    </div>

                    {/* Seat availability bar */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Registration Status</span>
                        <span>{evt.seatsBooked}/{evt.seatsTotal} passes reserved ({bookedPct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${bookedPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">ENTRY PASS</span>
                    <span className="text-lg font-black text-slate-900">
                      ₹{evt.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBookEventPass(evt)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
                  >
                    Reserve Pass <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: COACHING INSTITUTES */}
      {activeTab === 'INSTITUTES' && (
        <div className="space-y-4">
          {institutes.map((inst) => (
            <div
              key={inst.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              <div className="flex gap-4">
                <img
                  src={inst.coverImageUrl}
                  alt={inst.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {inst.category}
                    </span>
                    {inst.verified && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Institute
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{inst.name}</h3>
                  <p className="text-xs text-slate-500">{inst.tagline}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    {inst.address}
                  </p>

                  <div className="text-xs text-slate-700 pt-1">
                    <span className="font-semibold text-slate-900">Flagship: </span>
                    <span>{inst.popularCourse}</span>
                    <span className="text-indigo-600 font-bold ml-2">({inst.feeRange})</span>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col gap-2 shrink-0 self-end md:self-center">
                <a
                  href={`tel:${inst.phone}`}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  Contact Desk
                </a>
                <button
                  onClick={() => alert(`Admissions brochure request sent for ${inst.name}. Campus coordinator will call ${inst.phone}.`)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Enquire Admission
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
