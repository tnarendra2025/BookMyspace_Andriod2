import React from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileBadge,
  Sparkles,
  ShieldCheck,
  Building,
  Car,
  Users,
  CheckCircle2,
  AlertCircle,
  Home,
} from 'lucide-react';
import { CustomerRegistrationData, CustomerRegistrationField } from '../types';
import { LiveCameraCapture } from './LiveCameraCapture';
import { DocumentUploadField } from './DocumentUploadField';

interface CustomerRegistrationFormProps {
  categorySlug: string;
  venueId?: string;
  fields: CustomerRegistrationField[];
  formData: CustomerRegistrationData;
  onChange: (updated: CustomerRegistrationData) => void;
}

export const CustomerRegistrationForm: React.FC<CustomerRegistrationFormProps> = ({
  categorySlug,
  venueId,
  fields,
  formData,
  onChange,
}) => {
  // Determine relevant scope for current venue
  const isHostelPg = categorySlug === 'pg_hostel' || categorySlug === 'hourly_rooms';
  const isHotel = categorySlug === 'hotel_stay' || categorySlug === 'hourly_rooms';
  const isFunctionHall =
    categorySlug === 'function_hall' ||
    categorySlug === 'marriage_hall' ||
    categorySlug === 'banquet_hall';

  // Filter fields: Must be enabled AND match the category scope or 'ALL', and venueId if specified
  const activeFields = fields
    .filter((f) => {
      if (!f.isEnabled) return false;
      if (f.venueId && venueId && f.venueId !== venueId) return false;
      if (f.categoryScope === 'ALL') return true;
      if (f.categoryScope === 'PG_HOSTEL' && isHostelPg) return true;
      if (f.categoryScope === 'HOTEL' && isHotel) return true;
      if (f.categoryScope === 'FUNCTION_HALL' && isFunctionHall) return true;
      if (f.categoryScope === 'RESORT' && (categorySlug.includes('resort') || categorySlug.includes('farmhouse'))) return true;
      if (f.categoryScope === 'SPORTS_TURF' && (categorySlug.includes('turf') || categorySlug.includes('sports'))) return true;
      return false;
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Field change helper
  const handleFieldChange = (key: string, value: any) => {
    onChange({
      ...formData,
      [key]: value,
    });
  };

  // Quick fill with verified sample data for rapid testing
  const handleAutoFillDemo = () => {
    onChange({
      fullName: 'Narendra T (Verified Guest)',
      phone: '+91 98765 43210',
      emergencyPhone: '+91 98480 12345',
      email: 'tnarendra2025@gmail.com',
      address: 'Plot 42, Silicon Valley Colony, Near DLF Cybercity',
      permanentAddress: 'D.No 4-18, Trunk Road, Near RTC Complex, Ongole, AP 523001',
      cityStatePincode: 'Hyderabad, Telangana - 500081',
      idProofType: 'Aadhaar Card (UIDAI)',
      idProofNumber: '5412 8923 7610',
      idProofFrontUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      idProofBackUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      livePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      dob: '1998-08-15',
      gender: 'Male',
      guardianName: 'V. Srinivasa Rao (Father)',
      guardianPhone: '+91 94400 98765',
      purposeOfStay: isHostelPg ? 'PG / Hostel IT & Job Stay' : isFunctionHall ? 'Wedding & Marriage Ceremony' : 'Hotel Room Transit / Vacation',
      occupationWorkplace: 'Lead Software Architect @ Hitec City',
      vehicleNumber: 'TS 09 EZ 4321',
      guestsCountSplit: '2 Adults, 0 Children',
      policeVerificationConsent: true,
      submittedAt: new Date().toISOString(),
    });
  };

  // Count mandatory fields completed
  const mandatoryFields = activeFields.filter((f) => f.isRequired);
  const completedCount = mandatoryFields.filter((f) => {
    const val = (formData as any)[f.key];
    if (f.type === 'BOOLEAN') return Boolean(val);
    return val && String(val).trim().length > 0;
  }).length;

  return (
    <div className="space-y-4">
      {/* Category KYC Banner */}
      <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Mandatory Guest Registration & Police KYC
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                {isHostelPg ? 'Hostel / PG Verification' : isFunctionHall ? 'Event Host KYC' : 'Standard Guest Pass'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Required by local municipal regulations. Admin & Property Host verified before check-in.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="self-start sm:self-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Auto-fill Sample KYC
        </button>
      </div>

      {/* Completion Meter */}
      <div className="bg-slate-100 rounded-xl p-2.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">
          Required Fields Filled: <strong className="text-slate-900">{completedCount} of {mandatoryFields.length}</strong>
        </span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                completedCount === mandatoryFields.length ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{
                width: `${mandatoryFields.length > 0 ? (completedCount / mandatoryFields.length) * 100 : 100}%`,
              }}
            />
          </div>
          {completedCount === mandatoryFields.length ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready
            </span>
          ) : (
            <span className="text-slate-500 text-[11px]">
              {mandatoryFields.length - completedCount} remaining
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Fields Grid */}
      <div className="space-y-3.5">
        {activeFields.map((field) => {
          const val = (formData as any)[field.key] || '';

          // Helper to render requirement tag
          const renderReqBadge = () =>
            field.isRequired ? (
              <span className="text-rose-500 font-bold ml-1">
                * <span className="text-[10px] font-semibold text-rose-600">(Required)</span>
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-400 ml-1.5 bg-slate-100 px-1.5 py-0.5 rounded">
                (Optional)
              </span>
            );

          // 1. LIVE_PHOTO Type
          if (field.type === 'LIVE_PHOTO') {
            return (
              <LiveCameraCapture
                key={field.id}
                value={val}
                onChange={(dataUrl) => handleFieldChange(field.key, dataUrl)}
                required={field.isRequired}
                label={field.label}
                helpText={field.helpText}
              />
            );
          }

          // 2. IMAGE_UPLOAD & FILE_UPLOAD Types
          if (field.type === 'IMAGE_UPLOAD' || field.type === 'FILE_UPLOAD') {
            return (
              <DocumentUploadField
                key={field.id}
                label={field.label}
                helpText={field.helpText}
                required={field.isRequired}
                value={val}
                onChange={(url) => handleFieldChange(field.key, url)}
              />
            );
          }

          // 3. TEXTAREA Type
          if (field.type === 'TEXTAREA') {
            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    {field.label}
                    {renderReqBadge()}
                  </span>
                  {field.categoryScope !== 'ALL' && (
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {field.categoryScope}
                    </span>
                  )}
                </label>
                <textarea
                  rows={2}
                  value={val}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder || 'Enter address details...'}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {field.helpText && <p className="text-[10px] text-slate-400">{field.helpText}</p>}
              </div>
            );
          }

          // 4. DROPDOWN Type
          if (field.type === 'DROPDOWN') {
            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <FileBadge className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    {field.label}
                    {renderReqBadge()}
                  </span>
                </label>
                <select
                  value={val}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
                >
                  <option value="">-- Select {field.label} --</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {field.helpText && <p className="text-[10px] text-slate-400">{field.helpText}</p>}
              </div>
            );
          }

          // 5. BOOLEAN Consent Checkbox
          if (field.type === 'BOOLEAN') {
            return (
              <div
                key={field.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors"
              >
                <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={Boolean(val)}
                    onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-bold text-slate-800">
                      {field.label}
                      {renderReqBadge()}
                    </span>
                    {field.helpText && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{field.helpText}</p>
                    )}
                  </div>
                </label>
              </div>
            );
          }

          // 6. Default Inputs (TEXT, PHONE, EMAIL, DATE, NUMBER)
          return (
            <div key={field.id} className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5 flex-wrap">
                  {field.type === 'PHONE' ? (
                    <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  ) : field.type === 'EMAIL' ? (
                    <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  ) : field.type === 'DATE' ? (
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  )}
                  {field.label}
                  {renderReqBadge()}
                </span>
                {field.categoryScope !== 'ALL' && (
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    {field.categoryScope}
                  </span>
                )}
              </label>
              <input
                type={
                  field.type === 'PHONE'
                    ? 'tel'
                    : field.type === 'EMAIL'
                    ? 'email'
                    : field.type === 'DATE'
                    ? 'date'
                    : field.type === 'NUMBER'
                    ? 'number'
                    : 'text'
                }
                value={val}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
              />
              {field.helpText && <p className="text-[10px] text-slate-400">{field.helpText}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
