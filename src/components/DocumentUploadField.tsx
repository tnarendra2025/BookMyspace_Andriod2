import React, { useRef } from 'react';
import { Upload, FileText, CheckCircle2, Trash2, Eye } from 'lucide-react';

interface DocumentUploadFieldProps {
  label: string;
  helpText?: string;
  required?: boolean;
  value?: string;
  onChange: (url: string) => void;
  sampleUrl?: string;
}

export const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
  label,
  helpText,
  required = false,
  value,
  onChange,
  sampleUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        {value && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Attached
          </span>
        )}
      </div>

      {helpText && <p className="text-[11px] text-slate-500">{helpText}</p>}

      {value ? (
        <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
          <img
            src={value}
            alt="Uploaded ID Document"
            className="w-16 h-12 rounded-lg object-cover border border-slate-200 shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">Document Attached</div>
            <div className="text-[10px] text-emerald-600 font-medium">Ready for verification</div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
            title="Remove document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Upload File
          </button>
          <button
            type="button"
            onClick={() => onChange(sampleUrl)}
            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Attach verified sample document"
          >
            <Eye className="w-3.5 h-3.5" /> Sample ID
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
