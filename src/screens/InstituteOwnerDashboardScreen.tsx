import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Users,
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  DollarSign,
  TrendingUp,
  MapPin,
  Save,
  X,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { InstituteClass } from '../types';
import { SAMPLE_INSTITUTE_CLASSES } from '../data/mockData';

export const InstituteOwnerDashboardScreen: React.FC = () => {
  const { setActiveScreen, selectedLocation } = useApp();

  const [activeTab, setActiveTab] = useState<'batches' | 'admissions' | 'faculty' | 'profile'>('batches');
  const [batches, setBatches] = useState<InstituteClass[]>(SAMPLE_INSTITUTE_CLASSES);

  // Add / Edit Batch Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<InstituteClass | null>(null);

  // Form State
  const [batchTitle, setBatchTitle] = useState('');
  const [batchSubject, setBatchSubject] = useState('');
  const [batchCategory, setBatchCategory] = useState('Sports & Fitness');
  const [batchTiming, setBatchTiming] = useState('06:00 AM - 08:00 AM');
  const [batchMode, setBatchMode] = useState<'OFFLINE' | 'ONLINE' | 'HYBRID'>('OFFLINE');
  const [batchFee, setBatchFee] = useState('12000');
  const [batchTotalSeats, setBatchTotalSeats] = useState('30');
  const [batchFaculty, setBatchFaculty] = useState('Coach Rajeev Reddy');

  // Trial Admissions
  const [admissions, setAdmissions] = useState([
    { id: 'adm_1', student: 'Rohan Sharma', phone: '+91 98480 11223', batch: 'Elite Junior Badminton Training', type: 'Free Trial', status: 'PENDING' },
    { id: 'adm_2', student: 'Pooja Iyer', phone: '+91 98850 44556', batch: 'Full Stack Generative AI & Antigravity Lab', type: 'Paid Admission', status: 'APPROVED' },
    { id: 'adm_3', student: 'Karthik Rao', phone: '+91 94400 77889', batch: 'UPSC CSE 2027 General Studies', type: 'Paid Admission', status: 'PENDING' },
  ]);

  const handleOpenAdd = () => {
    setEditingBatch(null);
    setBatchTitle('');
    setBatchSubject('');
    setBatchCategory('Sports & Fitness');
    setBatchTiming('06:00 AM - 08:00 AM');
    setBatchMode('OFFLINE');
    setBatchFee('12000');
    setBatchTotalSeats('30');
    setBatchFaculty('Coach Rajeev Reddy');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (batch: InstituteClass) => {
    setEditingBatch(batch);
    setBatchTitle(batch.title);
    setBatchSubject(batch.subject);
    setBatchCategory(batch.category);
    setBatchTiming(batch.batchTiming);
    setBatchMode(batch.deliveryMode);
    setBatchFee(batch.monthlyFee.toString());
    setBatchTotalSeats(batch.totalSeats.toString());
    setBatchFaculty(batch.facultyName);
    setIsModalOpen(true);
  };

  const handleSaveBatch = () => {
    if (!batchTitle) return;

    if (editingBatch) {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === editingBatch.id
            ? {
                ...b,
                title: batchTitle,
                subject: batchSubject,
                category: batchCategory,
                batchTiming,
                deliveryMode: batchMode,
                monthlyFee: parseInt(batchFee, 10) || 10000,
                totalSeats: parseInt(batchTotalSeats, 10) || 25,
                facultyName: batchFaculty,
              }
            : b
        )
      );
    } else {
      const newBatch: InstituteClass = {
        id: `cls_${Date.now()}`,
        instituteId: 'inst_1',
        instituteName: 'Pullela Gopichand Badminton Academy',
        title: batchTitle,
        subject: batchSubject,
        category: batchCategory,
        batchTiming,
        deliveryMode: batchMode,
        totalSeats: parseInt(batchTotalSeats, 10) || 30,
        availableSeats: parseInt(batchTotalSeats, 10) || 30,
        monthlyFee: parseInt(batchFee, 10) || 12000,
        facultyName: batchFaculty,
        facultyBio: 'Experienced certified professional mentor.',
        facultyExperience: '8+ Years',
        location: `${selectedLocation.city}, Telangana`,
        isTodayOngoing: false,
        isUpcomingBatch: true,
        enrollmentOpen: true,
        imageUrl: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=600&q=80',
        rating: 5.0,
      };
      setBatches([newBatch, ...batches]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((b) => b.id !== id));
  };

  const totalRevenue = batches.reduce((sum, b) => sum + (b.totalSeats - b.availableSeats) * b.monthlyFee, 0);
  const totalEnrolled = batches.reduce((sum, b) => sum + (b.totalSeats - b.availableSeats), 0);

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => setActiveScreen('institutes')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Discovery Hub
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Institute & Academy Owner Portal</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              Live Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage batches, schedules, seat admissions, faculty rosters, and fee collections.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Batch</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Batches</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{batches.length}</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">100% On-Schedule</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enrolled Students</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalEnrolled}</div>
          <span className="text-[10px] text-indigo-600 font-bold mt-0.5 block">Across all slots</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Gross Run-Rate</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{(totalRevenue / 1000).toFixed(0)}k</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">+18% this quarter</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Admissions</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {admissions.filter((a) => a.status === 'PENDING').length}
          </div>
          <span className="text-[10px] text-slate-500 font-bold mt-0.5 block">Requires review</span>
        </div>
      </div>

      {/* Portal Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'batches' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Batches & Classes ({batches.length})
        </button>
        <button
          onClick={() => setActiveTab('admissions')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'admissions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Admissions & Trials ({admissions.length})
        </button>
        <button
          onClick={() => setActiveTab('faculty')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'faculty' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Faculty & Coaches
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Institute Profile & Facilities
        </button>
      </div>

      {/* Tab 1: Batches Management */}
      {activeTab === 'batches' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {batches.map((batch) => (
              <div key={batch.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{batch.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {batch.deliveryMode}
                    </span>
                    {batch.availableSeats <= 4 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                        {batch.availableSeats} seats left
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{batch.subject}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {batch.batchTiming}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {batch.totalSeats - batch.availableSeats} / {batch.totalSeats} Enrolled
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      ₹{batch.monthlyFee.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(batch)}
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 text-xs font-bold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBatch(batch.id)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Admissions & Trials */}
      {activeTab === 'admissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Incoming Student Registrations</span>
            <span className="text-[11px] text-slate-400">Showing {admissions.length} requests</span>
          </div>
          <div className="divide-y divide-slate-100">
            {admissions.map((adm) => (
              <div key={adm.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{adm.student}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      adm.type === 'Free Trial' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {adm.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      adm.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {adm.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{adm.batch} • {adm.phone}</div>
                </div>

                {adm.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setAdmissions((prev) =>
                          prev.map((a) => (a.id === adm.id ? { ...a, status: 'APPROVED' } : a))
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() =>
                        setAdmissions((prev) =>
                          prev.map((a) => (a.id === adm.id ? { ...a, status: 'REJECTED' } : a))
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Faculty & Coaches */}
      {activeTab === 'faculty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-base">
                R
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Coach Rajeev Reddy</h3>
                <span className="text-xs text-indigo-600 font-bold">14+ Years Coaching • BWF Level 2</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Former National Championship semi-finalist mentoring India top junior seed rankings. Specializes in advanced footwork, deception, and stroke consistency.
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
              <span>Assigned Batches: <strong>2 Batches</strong></span>
              <span className="text-emerald-600 font-bold">Active Full-Time</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-base">
                S
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Coach Sandhya Rao</h3>
                <span className="text-xs text-purple-600 font-bold">9+ Years Experience • SAI Certified</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Senior agility trainer and certified sports nutritionist focusing on endurance drills, aerobic stamina, and recovery regimens.
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
              <span>Assigned Batches: <strong>1 Batch</strong></span>
              <span className="text-emerald-600 font-bold">Weekend Special</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Profile & Center Info */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-2xl">
          <h3 className="text-sm font-black text-slate-900">Academy Profile & Credentials</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Academy / Center Legal Name</label>
              <input
                type="text"
                defaultValue="Pullela Gopichand Badminton Academy"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Registration / Accreditation Number</label>
              <input
                type="text"
                defaultValue="TS-HYD-SPT-2018-9941"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Center Physical Address</label>
              <textarea
                rows={2}
                defaultValue="ISB Road, Financial District, Gachibowli, Hyderabad, Telangana 500032"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs">
              Save Center Profile
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingBatch ? 'Edit Batch Schedule' : 'Create New Course Batch'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Batch / Class Title</label>
                <input
                  type="text"
                  value={batchTitle}
                  onChange={(e) => setBatchTitle(e.target.value)}
                  placeholder="e.g. Advanced Knockout Training"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject & Topics Covered</label>
                <input
                  type="text"
                  value={batchSubject}
                  onChange={(e) => setBatchSubject(e.target.value)}
                  placeholder="e.g. Footwork, Smashing, Physical Agility"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delivery Mode</label>
                  <select
                    value={batchMode}
                    onChange={(e) => setBatchMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                  >
                    <option value="OFFLINE">Offline (In-Person)</option>
                    <option value="ONLINE">Online (Live Virtual)</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={batchFee}
                    onChange={(e) => setBatchFee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Batch Timings</label>
                  <input
                    type="text"
                    value={batchTiming}
                    onChange={(e) => setBatchTiming(e.target.value)}
                    placeholder="06:00 AM - 08:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Capacity</label>
                  <input
                    type="number"
                    value={batchTotalSeats}
                    onChange={(e) => setBatchTotalSeats(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lead Faculty / Coach</label>
                <input
                  type="text"
                  value={batchFaculty}
                  onChange={(e) => setBatchFaculty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBatch}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                Save Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
