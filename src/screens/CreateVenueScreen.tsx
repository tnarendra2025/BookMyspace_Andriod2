import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  MapPin,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  ShieldCheck,
  Clock,
  DollarSign,
  AlertCircle,
  FileText,
  Sparkles,
  Info,
  Video,
  Film,
  Play,
} from 'lucide-react';
import { Venue, VenueVideo } from '../types';

export const CreateVenueScreen: React.FC = () => {
  const { addVenue, setActiveScreen, selectedLocation, currentUser } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form State
  const [category, setCategory] = useState('function_hall');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState(selectedLocation.city || 'Hyderabad');
  const [state, setState] = useState(selectedLocation.state || 'Telangana');
  const [pincode, setPincode] = useState('500033');

  // Specs & Capacity
  const [capacity, setCapacity] = useState('800');
  const [minGuests, setMinGuests] = useState('200');
  const [parkingCapacity, setParkingCapacity] = useState('150');
  const [basePrice, setBasePrice] = useState('95000');
  const [taxRate, setTaxRate] = useState('18.0');

  // Amenities
  const [amenities, setAmenities] = useState<string[]>([
    'Air Conditioned Hall',
    'Generator Power Backup',
    'Valet Parking',
    'VIP Bridal Green Room',
    'Stage Light & Sound Setup',
  ]);
  const [newAmenity, setNewAmenity] = useState('');

  // Photos
  const [photoUrls, setPhotoUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80',
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Short Videos & Reels
  const [videos, setVideos] = useState<VenueVideo[]>([
    {
      id: 'vid_init_1',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-banquet-hall-ready-for-a-wedding-41122-large.mp4',
      title: 'Drone Walkthrough 30s Reel',
      aspectRatio: '9:16',
      durationSeconds: 30,
      isShort: true,
      viewsCount: 1,
      uploadedAt: 'Host Uploaded',
    },
  ]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  // KYC & Compliance
  const [gstin, setGstin] = useState('36AABCU9603R1ZM');
  const [fireNoc, setFireNoc] = useState('NOC-FIRE-TEL-2026-8812');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedVenue, setSubmittedVenue] = useState<Venue | null>(null);

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (idx: number) => {
    setAmenities(amenities.filter((_, i) => i !== idx));
  };

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotoUrls([...photoUrls, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const handleAddVideo = () => {
    if (newVideoUrl.trim()) {
      const newVid: VenueVideo = {
        id: `vid_${Date.now()}`,
        url: newVideoUrl.trim(),
        title: newVideoTitle.trim() || 'Short Walkthrough Reel',
        aspectRatio: '9:16',
        durationSeconds: 30,
        isShort: true,
        viewsCount: 1,
        uploadedAt: 'Host Uploaded',
      };
      setVideos([...videos, newVid]);
      setNewVideoUrl('');
      setNewVideoTitle('');
    }
  };

  const handleSubmitListing = () => {
    if (!name || !addressLine) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const created = addVenue({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        addressLine1: addressLine,
        city,
        state,
        capacity: parseInt(capacity, 10) || 500,
        minGuests: parseInt(minGuests, 10) || 100,
        maxGuests: (parseInt(capacity, 10) || 500) * 1.5,
        parkingCapacity: parseInt(parkingCapacity, 10) || 50,
        pricingBaseAmount: parseInt(basePrice, 10) || 50000,
        taxRate: parseFloat(taxRate) || 18.0,
        status: currentUser?.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
        isVerified: currentUser?.role === 'ADMIN',
        isActive: true,
        images: photoUrls.map((url, i) => ({
          id: `img_${i}`,
          url,
          altText: name,
          isCover: i === 0,
        })),
        videos,
        facilities: amenities.map((a) => ({ facility: a, isAvailable: true })),
        packages: [
          {
            id: 'pkg_standard',
            name: 'Standard Hall Rental',
            priceAmount: parseInt(basePrice, 10) || 50000,
            description: 'Includes hall access, air conditioning, and basic generator backup.',
            itemsIncluded: ['Hall Access (12 Hrs)', 'AC', 'Security Staff'],
          },
        ],
        addons: [
          { id: 'add_valet', name: 'Dedicated Valet Parking Staff', priceAmount: 4500, description: '4 Uniformed Drivers' },
          { id: 'add_dj', name: 'DJ Sound and Ambient Lighting', priceAmount: 12000, description: 'Bass JBL Rig' },
        ],
      });

      setIsSubmitting(false);
      setSubmittedVenue(created);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveScreen('owner')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Owner Dashboard
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">List Your Venue or Space</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase">
            Host Onboarding Wizard
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Follow our 5-step onboarding guide to list your banquet hall, sports turf, PG, or academy on BookMySpace.
        </p>
      </div>

      {/* Wizard Step Progress Tracker */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        {[
          { step: 1, label: 'Space Type' },
          { step: 2, label: 'Location' },
          { step: 3, label: 'Capacity & Pricing' },
          { step: 4, label: 'Photos & Amenities' },
          { step: 5, label: 'KYC & Review' },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-2 flex-1 last:flex-none">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === item.step
                  ? 'bg-indigo-600 text-white shadow-md'
                  : currentStep > item.step
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {currentStep > item.step ? '✓' : item.step}
            </div>
            <span
              className={`text-xs font-bold hidden sm:inline ${
                currentStep === item.step ? 'text-indigo-600' : currentStep > item.step ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {item.label}
            </span>
            {item.step < totalSteps && (
              <div
                className={`hidden sm:block h-0.5 flex-1 mx-2 ${
                  currentStep > item.step ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Category Selection */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-black text-slate-900">Step 1: Choose Your Space Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select the classification that best matches your venue. Custom pricing options and rules adapt automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'function_hall', title: 'Wedding & Function Hall', desc: 'Banquet halls, convention centers, muhurtham slots', icon: '🏛️' },
              { id: 'sports_turf', title: 'Sports Turf & Courts', desc: 'Badminton BWF mats, box cricket, football turf', icon: '🏸' },
              { id: 'hotel_stay', title: 'Hotel Stay & Hourly Rooms', desc: 'Standard suites, lodge rooms, short-stay resting slots', icon: '🏨' },
              { id: 'pg_hostel', title: 'PG & Co-Living Hostel', desc: 'Monthly sharing rooms, meal plans, biometric gates', icon: '🏠' },
              { id: 'coaching', title: 'Coaching Class & Academy', desc: 'Tuition batches, training labs, certified faculties', icon: '🎓' },
              { id: 'co_working', title: 'Co-Working & Private Desks', desc: 'Day passes, meeting rooms, high-speed fiber', icon: '💼' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  category === cat.id
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs border border-slate-100">{cat.icon}</span>
                <div>
                  <span className="font-bold text-slate-900 text-xs block">{cat.title}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{cat.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Location & Basic Info */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900">Step 2: Property Name & Address</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Accurate details help prospective guests locate your space easily on Google Maps.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Venue / Property Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grand Emerald Convention & Lawns"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Description & Key Highlights</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell guests about your air conditioning, chandeliers, lawn capacity, and catering options..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Street Address / Landmark *</label>
              <input
                type="text"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="e.g. Plot No 44, Road No 12, Banjara Hills"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Capacity & Pricing */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900">Step 3: Capacity, Parking & Pricing</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set standard base amounts, guest limits, and applicable tax rates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Guest Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Min Guests Required</label>
              <input
                type="number"
                value={minGuests}
                onChange={(e) => setMinGuests(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Base Price Amount (₹)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Parking Vehicle Capacity</label>
              <input
                type="number"
                value={parkingCapacity}
                onChange={(e) => setParkingCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center gap-3 text-xs text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Smart Concurrency Lock:</strong> Once listed, online and walk-in requests share the same atomic 10-minute hold engine to guarantee zero double-bookings.
            </span>
          </div>
        </div>
      )}

      {/* Step 4: Photos & Amenities */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-black text-slate-900">Step 4: Photos & Amenities</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High quality photos significantly increase booking conversion rates.
            </p>
          </div>

          {/* Photo Gallery Manager */}
          <div className="space-y-3">
            <label className="font-bold text-xs text-slate-700 block">Uploaded Photo Previews</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photoUrls.map((url, idx) => (
                <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={url} alt="Venue preview" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setPhotoUrls(photoUrls.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Paste Image URL (Unsplash or CDN link)..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Add Photo
              </button>
            </div>
          </div>

          {/* Short Videos & Walkthrough Reels Manager */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-rose-600" />
                <span>Short Videos & Walkthrough Reels ({videos.length})</span>
              </label>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                9:16 Shorts
              </span>
            </div>

            {videos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videos.map((vid, idx) => (
                  <div
                    key={vid.id || idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <Play className="w-4 h-4 fill-rose-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{vid.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{vid.url}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideos(videos.filter((_, i) => i !== idx))}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="Video MP4 or Stream link..."
                className="sm:col-span-6 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
              />
              <input
                type="text"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder="Title (e.g. Lawn Drone Tour)..."
                className="sm:col-span-4 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddVideo}
                className="sm:col-span-2 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Add Reel
              </button>
            </div>
          </div>

          {/* Amenities Manager */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="font-bold text-xs text-slate-700 block">Facilities & Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(idx)}
                    className="text-slate-400 hover:text-slate-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add custom amenity (e.g., Synthetic BWF Floor)..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: KYC Compliance & Final Submission */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-black text-slate-900">Step 5: KYC & Business Verification</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              BookMySpace guarantees customer safety. All listings undergo mandatory administrative verification before going public.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">GSTIN (Goods & Services Tax ID)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Fire Safety NOC / Property Certificate Ref</label>
              <input
                type="text"
                value={fireNoc}
                onChange={(e) => setFireNoc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-mono"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Listing Summary:</span>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>Venue: <strong className="text-slate-800">{name || 'Unnamed Venue'}</strong></div>
                <div>Category: <strong className="text-slate-800">{category}</strong></div>
                <div>Location: <strong className="text-slate-800">{city}, {state}</strong></div>
                <div>Base Price: <strong className="text-slate-800">₹{basePrice}</strong></div>
              </div>
            </div>

            <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-600">
                I hereby declare that all provided documents and property details are authentic, and I agree to BookMySpace Host Partner Agreement.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        {currentStep > 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < totalSteps ? (
          <button
            onClick={() => {
              if (currentStep === 2 && !name) {
                alert('Please enter a venue name to proceed.');
                return;
              }
              setCurrentStep(currentStep + 1);
            }}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            disabled={isSubmitting || !name || !agreeTerms}
            onClick={handleSubmitListing}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting for Approval...' : 'Submit Listing for Approval'}</span>
          </button>
        )}
      </div>

      {/* Submission Success Dialog */}
      {submittedVenue && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Submitted to Admin Queue</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">{submittedVenue.name}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your listing has been created with status <strong className="text-amber-600 font-bold">PENDING</strong>. As per business rule compliance, our platform administrators will review your fire safety and GSTIN within 24 hours.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setActiveScreen('owner')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Go to Owner Inventory Portal
              </button>
              <button
                onClick={() => setActiveScreen('admin-audit')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Inspect in Admin Audit Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
