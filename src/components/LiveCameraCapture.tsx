import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Upload, CheckCircle2, AlertCircle, Eye } from 'lucide-react';

interface LiveCameraCaptureProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  required?: boolean;
  label?: string;
  helpText?: string;
}

export const LiveCameraCapture: React.FC<LiveCameraCaptureProps> = ({
  value,
  onChange,
  required = false,
  label = 'Live Selfie / Photo Verification',
  helpText = 'Real-time face capture required for hostel / hotel digital visitor entry pass',
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | undefined>(value);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCapturedImage(value);
  }, [value]);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser. Please upload a photo.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      // Connect stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          console.warn('Video play interrupted:', err);
        });
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      let msg = 'Could not access camera. You can upload a photo instead.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in browser or upload a selfie file.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera device found on this system. Please upload a photo.';
      }
      setCameraError(msg);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        onChange(dataUrl);
        stopCameraStream();
      }
    } catch (e) {
      console.error('Failed to capture snapshot:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCapturedImage(result);
        onChange(result);
        stopCameraStream();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(undefined);
    onChange('');
    startCamera();
  };

  const handleClear = () => {
    setCapturedImage(undefined);
    onChange('');
    stopCameraStream();
  };

  // Sample photo helper for quick testing in dev environments
  const handleUseSample = () => {
    const samplePhoto =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    setCapturedImage(samplePhoto);
    onChange(samplePhoto);
    stopCameraStream();
  };

  return (
    <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-indigo-600" />
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        {capturedImage && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Live Photo Attached
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">{helpText}</p>

      {/* Captured Image View */}
      {capturedImage ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/80 bg-slate-900 max-w-xs mx-auto shadow-md">
          <img
            src={capturedImage}
            alt="Live captured selfie"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-3">
            <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1 bg-slate-900/60 px-2 py-1 rounded-md backdrop-blur-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verified Snapshot
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRetake}
                className="px-2.5 py-1 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Retake
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : isCameraActive ? (
        /* Live Video Streaming Container */
        <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-600 bg-black max-w-xs mx-auto shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-56 object-cover transform -scale-x-100"
          />
          {/* Face positioning oval overlay guide */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-36 h-44 rounded-full border-2 border-dashed border-indigo-300/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          </div>

          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Camera className="w-4 h-4" /> Click to Capture
            </button>
            <button
              type="button"
              onClick={stopCameraStream}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-white rounded-full text-xs font-bold backdrop-blur-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Inactive State: Options to Start Camera or Upload File */
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-white space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Camera className="w-6 h-6" />
          </div>

          <div>
            <div className="text-xs font-bold text-slate-800">
              Capture or Upload Live Face Photo
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Ensure proper lighting and face clearly visible without sunglasses
            </div>
          </div>

          {cameraError && (
            <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-xl flex items-center gap-1.5 text-left">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={startCamera}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" /> Start Live Camera
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>

            <button
              type="button"
              onClick={handleUseSample}
              className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
              title="Use high-res test photo for rapid demo"
            >
              <Eye className="w-3.5 h-3.5 text-purple-600" /> Test Photo
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
