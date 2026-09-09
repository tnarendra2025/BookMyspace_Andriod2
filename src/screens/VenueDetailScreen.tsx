import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  ShieldCheck,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Car,
  Utensils,
  CheckCircle2,
  Heart,
  Share2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_REVIEWS } from '../data/mockData';

export const VenueDetailScreen: React.FC = () => {
  const {
    selectedVenueId,
    venues,
    setActiveScreen,
    setBookingModalVenue,
    toggleFavoriteVenue,
  } = useApp();

  const venue = venues.find((v) => v.id === selectedVenueId) || venues[0];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [reviewsList, setReviewsList] = useState(
    SAMPLE_REVIEWS.filter((r) => r.venueId === venue?.id).concat(
      SAMPLE_REVIEWS.slice(0, 1)
    )
  );

  if (!venue) return null;

  const currentPhoto = venue.images[selectedPhotoIndex]?.url || venue.featuredImageUrl;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      id: `rev_${Date.now()}`,
      venueId: venue.id,
      userName: 'Narendra Reddy',
      rating: newReviewRating,
      comment: newReviewText.trim(),
      date: 'Just now',
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText('');
  };

  return (
    <div className="space-y-6 pb-24 md:pb-16 max-w-5xl mx-auto">
      {/* Top navigation back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavoriteVenue(venue.id)}
            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full border border-slate-200 transition-colors"
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${venue.isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: venue.name, text: venue.description, url: window.location.href });
              }
            }}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full border border-slate-200 transition-colors"
            title="Share property"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Photo Gallery with Thumbnails */}
      <div className="space-y-3">
        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md">
          <img
            src={currentPhoto}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-extrabold rounded-full shadow-xs">
              {venue.category.name}
            </span>
            {venue.isVerified && (
              <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Space
              </span>
            )}
          </div>
        </div>

        {venue.images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {venue.images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedPhotoIndex === idx
                    ? 'border-indigo-600 scale-95 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Amenities, Packages */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{venue.name}</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              {venue.addressLine1}, {venue.city}, {venue.state}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-bold text-amber-600">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {venue.avgRating} ({venue.ratingCount} Reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-4 h-4 text-indigo-600" />
                Capacity: {venue.capacity} guests
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <Car className="w-4 h-4 text-slate-500" />
                {venue.parkingCapacity}+ parking spots
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">About this Space</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{venue.description}</p>
          </div>

          {/* Facilities & Amenities */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Facilities & Key Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {venue.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{fac.facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Packages (if available) */}
          {venue.packages.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Curated Packages
              </h3>
              <div className="space-y-3">
                {venue.packages.map((pkg) => (
                  <div key={pkg.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900">{pkg.name}</h4>
                      <span className="text-sm font-extrabold text-indigo-600">
                        ₹{pkg.priceAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {pkg.itemsIncluded.map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PG Details (if PG category) */}
          {venue.pgDetails && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Co-Living & PG Stays Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-bold">TYPE</span>
                  <span className="font-semibold text-slate-800">{venue.pgDetails.pgType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-bold">MEAL PLAN</span>
                  <span className="font-semibold text-slate-800">{venue.pgDetails.mealPlan}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-bold">GATE CLOSING</span>
                  <span className="font-semibold text-slate-800">{venue.pgDetails.gateLockTime}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-bold">OCCUPANTS</span>
                  <span className="font-semibold text-slate-800">{venue.pgDetails.preferredOccupants}</span>
                </div>
              </div>
            </div>
          )}

          {/* Rules and Policies */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Venue Policies & Rules
            </h3>
            <p className="text-xs text-slate-600">{venue.rules}</p>
            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-slate-400" />
              Food & Catering: {venue.foodOptions}
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Attendee Reviews ({reviewsList.length})
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                {venue.avgRating} Out of 5.0
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{rev.userName}</span>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    {'★'.repeat(Math.floor(rev.rating))}
                  </div>
                  <p className="text-xs text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Write a review */}
            <form onSubmit={handleAddReview} className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Leave a Review</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Rating:</span>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                  className="text-xs p-1 rounded border border-slate-200 font-bold text-amber-600"
                >
                  <option value={5}>5 ★ - Outstanding</option>
                  <option value={4}>4 ★ - Very Good</option>
                  <option value={3}>3 ★ - Average</option>
                </select>
              </div>
              <textarea
                rows={2}
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Share your experience at this space..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Post Review
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Host Contact & Reservation Sticky Card */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-md space-y-4 sticky top-20">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">STARTING RATE</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                ₹{venue.pricingBaseAmount.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-500">
                  {venue.category.slug === 'sports_turf' ? '/ hour' : '/ slot'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                +18% GST Applicable • Free cancellation up to 24h
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="text-xs font-bold text-slate-700">Available Slots Preview</div>
              {venue.timeSlots.slice(0, 3).map((slot) => (
                <div
                  key={slot.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold text-slate-800">{slot.label}</div>
                    <div className="text-[10px] text-slate-500">{slot.startTime} - {slot.endTime}</div>
                  </div>
                  <span className="font-bold text-indigo-600">₹{slot.priceAmount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setBookingModalVenue(venue)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              Check Availability & Book Slot
            </button>

            {/* Direct Host Contact Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Direct Host Contact
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${venue.contactPhone}`}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  Call Host
                </a>
                <a
                  href={`https://wa.me/${venue.contactWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
