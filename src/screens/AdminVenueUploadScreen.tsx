import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  MapPin,
  Camera,
  Video,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  DollarSign,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  Eye,
  Sliders,
  ShieldCheck,
  Search,
  Maximize2,
  Clock,
  Layers,
  Phone,
  MessageCircle,
  Car,
  Users,
  Film,
  FolderOpen,
  Loader2,
  AlertCircle,
  X,
  RefreshCw,
  FileVideo,
  UploadCloud,
} from 'lucide-react';
import { Venue, VenueImage, VenueVideo } from '../types';
import { SAMPLE_CATEGORIES } from '../data/mockData';

// Curated HD stock photo packs for rapid admin testing & venue creation
const STOCK_PHOTO_PACKS = {
  function_hall: [
    { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80', title: 'Grand Crystal Ballroom' },
    { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', title: 'Grand Floral Stage' },
    { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80', title: 'Banquet Royal Dining' },
    { url: 'https://images.unsplash.com/photo-1545232979-fbf6a8c3d9b0?auto=format&fit=crop&w=1200&q=80', title: 'Night Lawn & Chandelier' },
  ],
  sports_turf: [
    { url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80', title: 'BWF Synthetic Badminton Mat' },
    { url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80', title: 'Box Cricket & Football Pitch' },
    { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', title: 'Player Dugout & Floodlights' },
  ],
  pg_hostel: [
    { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', title: 'Co-Living Premium Sharing Suite' },
    { url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', title: 'Twin Sharing AC Bedroom' },
    { url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80', title: 'Hostel Dining & Study Area' },
  ],
  hotel_stay: [
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', title: 'Luxury Hotel Suite' },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', title: 'Executive Deluxe Bedroom' },
    { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80', title: 'Resting Lounge & Pool' },
  ],
  coaching: [
    { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80', title: 'Smart Classroom & Audio Setup' },
    { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80', title: 'Seminar & Workshop Hall' },
  ],
  co_working: [
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', title: 'Modern Ergonomic Hot Desks' },
    { url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80', title: 'Glass Video Boardroom' },
  ],
};

// Curated high quality short video / reel presets for testing
const PRESET_SHORT_VIDEOS = [
  {
    title: '30s Drone & Architectural Walkthrough Reel',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-banquet-hall-ready-for-a-wedding-41122-large.mp4',
    aspectRatio: '9:16' as const,
    durationSeconds: 32,
    tag: 'Banquet / Luxury Hall',
  },
  {
    title: 'Floodlit Turf Cricket Action & Boundary Reel',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-match-bowling-and-batting-in-the-nets-49938-large.mp4',
    aspectRatio: '9:16' as const,
    durationSeconds: 28,
    tag: 'Sports Turf',
  },
  {
    title: 'Luxury Hotel Suite, Pool & Garden Tour',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-luxury-hotel-resort-with-swimming-pools-41484-large.mp4',
    aspectRatio: '16:9' as const,
    durationSeconds: 45,
    tag: 'Hotel / Resort',
  },
  {
    title: 'Modern High-Speed Co-Working Space Tour',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-office-with-bright-windows-41380-large.mp4',
    aspectRatio: '9:16' as const,
    durationSeconds: 30,
    tag: 'Co-Working & Desks',
  },
];

export const AdminVenueUploadScreen: React.FC = () => {
  const {
    venues,
    addVenue,
    updateVenue,
    selectedLocation,
    setActiveScreen,
    setSelectedVenueId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'NEW_VENUE' | 'MANAGE_EXISTING'>('NEW_VENUE');
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);

  // Search in existing venues tab
  const [searchVenueTerm, setSearchVenueTerm] = useState('');

  // Form State: Core Details
  const [categorySlug, setCategorySlug] = useState('function_hall');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState(selectedLocation.city || 'Hyderabad');
  const [state, setState] = useState(selectedLocation.state || 'Telangana');
  const [pincode, setPincode] = useState('500033');
  const [contactPhone, setContactPhone] = useState('+91 98765 12345');
  const [contactWhatsapp, setContactWhatsapp] = useState('919876512345');

  // Form State: Capacity & Pricing
  const [capacity, setCapacity] = useState('800');
  const [minGuests, setMinGuests] = useState('150');
  const [parkingCapacity, setParkingCapacity] = useState('120');
  const [basePrice, setBasePrice] = useState('95000');
  const [taxRate, setTaxRate] = useState('18.0');
  const [foodOptions, setFoodOptions] = useState('In-house masterchefs & external caterers permitted');
  const [rules, setRules] = useState('Music allowed till 11:30 PM. Valet parking provided. Fire safety strictly enforced.');

  // Form State: Admin Status & Verification
  const [publishStatus, setPublishStatus] = useState<'APPROVED' | 'PENDING'>('APPROVED');
  const [isVerified, setIsVerified] = useState(true);

  // Form State: Photos / Pictures
  const [uploadedPhotos, setUploadedPhotos] = useState<VenueImage[]>([
    {
      id: 'p_1',
      url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      altText: 'Main Grand Hall with Crystal Lighting',
      isCover: true,
    },
    {
      id: 'p_2',
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      altText: 'Stage & Backdrop Floral Decor',
      isCover: false,
    },
  ]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');

  // Form State: Short Videos / Reels
  const [uploadedVideos, setUploadedVideos] = useState<VenueVideo[]>([
    {
      id: 'v_reel_1',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-banquet-hall-ready-for-a-wedding-41122-large.mp4',
      title: 'Grand Ballroom Drone 30s Walkthrough Reel',
      aspectRatio: '9:16',
      durationSeconds: 32,
      isShort: true,
      viewsCount: 1250,
      uploadedAt: 'Admin Uploaded',
    },
  ]);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [videoAspectInput, setVideoAspectInput] = useState<'9:16' | '16:9'>('9:16');
  const [videoDurationInput, setVideoDurationInput] = useState('30');

  // Video Upload Lifecycle State (idle | uploading | success | error)
  const [videoUploadState, setVideoUploadState] = useState<{
    status: 'idle' | 'uploading' | 'success' | 'error';
    progress: number;
    sourceType?: 'file' | 'url';
    fileName?: string;
    fileSizeMb?: string;
    stageMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    uploadedVideoId?: string;
  }>({
    status: 'idle',
    progress: 0,
  });

  const [videoSourceTab, setVideoSourceTab] = useState<'file' | 'url' | 'presets'>('file');
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const videoTimersRef = useRef<NodeJS.Timeout[]>([]);

  const clearVideoTimers = () => {
    videoTimersRef.current.forEach(clearTimeout);
    videoTimersRef.current = [];
  };

  // Interactive Video Player State & Pre-Save Content Verification
  const [activeVerificationVideo, setActiveVerificationVideo] = useState<VenueVideo | null>(null);
  const [previewingVideoUrl, setPreviewingVideoUrl] = useState<string | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [urlStreamError, setUrlStreamError] = useState(false);
  const [urlStreamLoaded, setUrlStreamLoaded] = useState(false);

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Central Air Conditioning',
    '100% Genset Power Backup',
    'VIP Bridal Dressing Suites',
    'Valet Parking Staff',
    'Pioneer Pro Audio & Stage Lighting',
  ]);
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  // Notification Toast
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // File Input Refs
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Switch to editing an existing venue
  const handleStartEditVenue = (v: Venue) => {
    setEditingVenueId(v.id);
    setName(v.name);
    setDescription(v.description);
    setAddressLine(v.addressLine1);
    setCity(v.city);
    setState(v.state);
    setCategorySlug(v.category?.slug || 'function_hall');
    setCapacity(String(v.capacity || 500));
    setMinGuests(String(v.minGuests || 100));
    setParkingCapacity(String(v.parkingCapacity || 50));
    setBasePrice(String(v.pricingBaseAmount || 50000));
    setTaxRate(String(v.taxRate || 18.0));
    setPublishStatus(v.status === 'APPROVED' ? 'APPROVED' : 'PENDING');
    setIsVerified(v.isVerified);
    setContactPhone(v.contactPhone || '+91 98765 12345');
    setContactWhatsapp(v.contactWhatsapp || '919876512345');
    setFoodOptions(v.foodOptions || 'External catering permitted');
    setRules(v.rules || 'Standard venue rules apply.');
    setUploadedPhotos(v.images || []);
    setUploadedVideos(v.videos || []);
    setSelectedAmenities(v.facilities?.map((f) => f.facility) || []);
    setActiveTab('NEW_VENUE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingVenueId(null);
    setName('');
    setDescription('');
    setAddressLine('');
    setBasePrice('95000');
    setCapacity('800');
    setUploadedPhotos([]);
    setUploadedVideos([]);
  };

  // Image Upload via File Picker (FileReader to Data URL)
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImg: VenueImage = {
            id: `pic_${Date.now()}_${i}`,
            url: event.target.result as string,
            altText: file.name.replace(/\.[^/.]+$/, ''),
            isCover: uploadedPhotos.length === 0 && i === 0,
          };
          setUploadedPhotos((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  // Image Upload via Direct URL
  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    const newImg: VenueImage = {
      id: `pic_${Date.now()}`,
      url: photoUrlInput.trim(),
      altText: photoCaptionInput.trim() || 'Venue Photo',
      isCover: uploadedPhotos.length === 0,
    };
    setUploadedPhotos([...uploadedPhotos, newImg]);
    setPhotoUrlInput('');
    setPhotoCaptionInput('');
  };

  // Add Preset Stock Photo Pack
  const handleApplyStockPhotos = () => {
    const pack = STOCK_PHOTO_PACKS[categorySlug as keyof typeof STOCK_PHOTO_PACKS] || STOCK_PHOTO_PACKS.function_hall;
    const mapped: VenueImage[] = pack.map((item, idx) => ({
      id: `pack_${Date.now()}_${idx}`,
      url: item.url,
      altText: item.title,
      isCover: uploadedPhotos.length === 0 && idx === 0,
    }));
    setUploadedPhotos([...uploadedPhotos, ...mapped]);
  };

  // Set as Cover Photo
  const handleSetCoverPhoto = (id: string) => {
    setUploadedPhotos((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === id,
      }))
    );
  };

  // Delete Photo
  const handleDeletePhoto = (id: string) => {
    setUploadedPhotos((prev) => {
      const remaining = prev.filter((img) => img.id !== id);
      if (remaining.length > 0 && !remaining.some((img) => img.isCover)) {
        remaining[0].isCover = true;
      }
      return remaining;
    });
  };

  // Supported video formats & reasonable size boundaries
  const SUPPORTED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.m4v'] as const;
  const SUPPORTED_VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-m4v',
  ] as const;
  const MAX_VIDEO_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB reasonable limit for promotional shorts
  const MIN_VIDEO_FILE_SIZE_BYTES = 50 * 1024; // 50 KB minimum to catch 0-byte or corrupted files

  // Client-side video file validator
  const validateVideoFileBeforeUpload = (file: File): {
    isValid: boolean;
    errorTitle?: string;
    errorMessage?: string;
    fileSizeFormatted?: string;
  } => {
    if (!file) {
      return {
        isValid: false,
        errorTitle: 'No File Selected',
        errorMessage: 'Please select a valid video file to upload.',
      };
    }

    const fileName = file.name || 'video';
    const lastDot = fileName.lastIndexOf('.');
    const fileExt = lastDot !== -1 ? fileName.substring(lastDot).toLowerCase() : '';
    const mimeType = (file.type || '').toLowerCase();
    const fileSizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;

    // 1. Format validation: Strictly accept MP4, MOV, and WebM
    const isExtensionValid = (SUPPORTED_VIDEO_EXTENSIONS as readonly string[]).includes(fileExt);
    const isMimeValid = (SUPPORTED_VIDEO_MIME_TYPES as readonly string[]).includes(mimeType);

    if (!isExtensionValid && !isMimeValid) {
      const displayExt = fileExt ? fileExt.toUpperCase() : (mimeType || 'unknown');
      return {
        isValid: false,
        errorTitle: 'Unsupported Video Format',
        errorMessage: `Format "${displayExt}" is not supported. Only MP4 (.mp4), Apple QuickTime (.mov), and WebM (.webm) video files are accepted for venue promotional reels.`,
        fileSizeFormatted,
      };
    }

    // 2. Minimum file size validation (prevent 0-byte or truncated empty uploads)
    if (file.size < MIN_VIDEO_FILE_SIZE_BYTES) {
      return {
        isValid: false,
        errorTitle: 'File Too Small / Corrupted',
        errorMessage: `The selected file is only ${fileSizeFormatted}. Valid video files must be at least 50 KB. Please check the file and try again.`,
        fileSizeFormatted,
      };
    }

    // 3. Maximum reasonable file size validation (100 MB ceiling for fast mobile streaming)
    if (file.size > MAX_VIDEO_FILE_SIZE_BYTES) {
      return {
        isValid: false,
        errorTitle: 'File Size Exceeds Limit',
        errorMessage: `File size (${fileSizeFormatted}) exceeds the maximum allowed limit of 100 MB. Please compress the video or select a 15s–60s clip for smooth streaming.`,
        fileSizeFormatted,
      };
    }

    return {
      isValid: true,
      fileSizeFormatted,
    };
  };

  // Process and upload a video file with client-side validation and realistic state transitions
  const processVideoFile = (file: File) => {
    clearVideoTimers();

    // STRICT CLIENT-SIDE VALIDATION BEFORE TRIGGERING UPLOAD
    const validation = validateVideoFileBeforeUpload(file);
    if (!validation.isValid) {
      setVideoUploadState({
        status: 'error',
        progress: 0,
        sourceType: 'file',
        fileName: file.name,
        fileSizeMb: validation.fileSizeFormatted,
        errorMessage: validation.errorMessage,
      });
      return;
    }

    const fileSizeFormatted = validation.fileSizeFormatted || `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    // Client-side video decoder & metadata probe before initializing upload flow
    const testVideoUrl = URL.createObjectURL(file);
    const probeVideo = document.createElement('video');
    probeVideo.preload = 'metadata';
    probeVideo.src = testVideoUrl;

    probeVideo.onerror = () => {
      URL.revokeObjectURL(testVideoUrl);
      setVideoUploadState({
        status: 'error',
        progress: 0,
        sourceType: 'file',
        fileName: file.name,
        fileSizeMb: fileSizeFormatted,
        errorMessage: 'Unable to decode video. The file appears to be corrupted, incomplete, or uses an unsupported video codec. Please ensure it is a valid MP4, MOV, or WebM file.',
      });
    };

    probeVideo.onloadedmetadata = () => {
      // Auto-detect aspect ratio (9:16 vertical vs 16:9 landscape) and duration
      const isVertical = probeVideo.videoHeight > probeVideo.videoWidth;
      const detectedAspect: '9:16' | '16:9' = isVertical ? '9:16' : '16:9';
      const detectedDuration = Math.round(probeVideo.duration) || 30;

      // Auto-apply detected properties for optimal preview
      setVideoAspectInput(detectedAspect);
      setVideoDurationInput(String(Math.min(detectedDuration, 120)));

      // Step 1: Initialize Uploading State only after client validation succeeds
      setVideoUploadState({
        status: 'uploading',
        progress: 15,
        sourceType: 'file',
        fileName: file.name,
        fileSizeMb: fileSizeFormatted,
        stageMessage: `Validated ${detectedAspect} ${detectedDuration}s stream. Reading video buffer...`,
      });

      // Step 2: Multi-step realistic progress simulation
      const t1 = setTimeout(() => {
        setVideoUploadState((prev) => ({
          ...prev,
          progress: 45,
          stageMessage: `Analyzing ${detectedAspect} video frames (${probeVideo.videoWidth}x${probeVideo.videoHeight}) & audio codecs...`,
        }));
      }, 450);

      const t2 = setTimeout(() => {
        setVideoUploadState((prev) => ({
          ...prev,
          progress: 75,
          stageMessage: 'Transcoding short promo reel for fast multi-device streaming...',
        }));
      }, 950);

      const t3 = setTimeout(() => {
        setVideoUploadState((prev) => ({
          ...prev,
          progress: 94,
          stageMessage: 'Finalizing media attachment to venue listing...',
        }));
      }, 1450);

      const t4 = setTimeout(() => {
        const videoTitle = videoTitleInput.trim() || file.name.replace(/\.[^/.]+$/, '');
        const newVid: VenueVideo = {
          id: `vid_${Date.now()}`,
          url: testVideoUrl,
          title: videoTitle,
          aspectRatio: detectedAspect,
          durationSeconds: detectedDuration,
          isShort: true,
          viewsCount: 1,
          uploadedAt: 'Admin Uploaded',
        };

        setUploadedVideos((prev) => [newVid, ...prev]);
        setActiveVerificationVideo(newVid);
        setVideoTitleInput('');

        setVideoUploadState({
          status: 'success',
          progress: 100,
          sourceType: 'file',
          fileName: file.name,
          fileSizeMb: fileSizeFormatted,
          successMessage: `Promotional video "${newVid.title}" (${detectedAspect}, ${detectedDuration}s) validated & uploaded successfully!`,
          uploadedVideoId: newVid.id,
        });
      }, 1850);

      videoTimersRef.current.push(t1, t2, t3, t4);
    };
  };

  // Short Video Upload via File Picker (Change Event)
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    processVideoFile(file);
    if (e.target) e.target.value = '';
  };

  // Drag & Drop for Video
  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(true);
  };

  const handleVideoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(false);
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processVideoFile(files[0]);
    }
  };

  // Short Video Upload via Direct URL
  const handleAddVideoUrl = () => {
    clearVideoTimers();
    const trimmedUrl = videoUrlInput.trim();

    // Validation 1: Empty check
    if (!trimmedUrl) {
      setVideoUploadState({
        status: 'error',
        progress: 0,
        sourceType: 'url',
        errorMessage: 'Video URL cannot be empty. Please enter a valid video stream or MP4 link.',
      });
      return;
    }

    // Validation 2: URL format
    const isValidUrl = /^(https?:\/\/|blob:|data:)/i.test(trimmedUrl);
    if (!isValidUrl) {
      setVideoUploadState({
        status: 'error',
        progress: 0,
        sourceType: 'url',
        errorMessage: 'Invalid URL format. Video links must start with https:// or http://',
      });
      return;
    }

    // Validation 3: Format check on URL (ensure points to supported video stream or MP4/MOV/WebM)
    const urlWithoutQuery = trimmedUrl.toLowerCase().split('?')[0].split('#')[0];
    const isUnsupportedDocOrImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg|pdf|zip|mp3|wav|doc|docx|exe|txt)$/i.test(urlWithoutQuery);
    const hasSupportedVideoExt = /\.(mp4|mov|webm|m4v|m3u8)$/i.test(urlWithoutQuery);
    const isRecognizedVideoProvider = /(assets\.mixkit\.co|youtube\.com|youtu\.be|vimeo\.com|cloudinary\.com|storage\.googleapis\.com|blob:|stream|video)/i.test(trimmedUrl);

    if (isUnsupportedDocOrImage || (!hasSupportedVideoExt && !isRecognizedVideoProvider)) {
      setVideoUploadState({
        status: 'error',
        progress: 0,
        sourceType: 'url',
        errorMessage: 'Unsupported video format in URL. Please provide a direct link to an MP4, MOV, or WebM media file or a supported video streaming CDN.',
      });
      return;
    }

    // Start Uploading/Verifying State
    setVideoUploadState({
      status: 'uploading',
      progress: 25,
      sourceType: 'url',
      fileName: trimmedUrl,
      stageMessage: 'Connecting to video host & validating media stream...',
    });

    const t1 = setTimeout(() => {
      setVideoUploadState((prev) => ({
        ...prev,
        progress: 70,
        stageMessage: 'Fetching video stream headers & verifying codec availability...',
      }));
    }, 550);

    const t2 = setTimeout(() => {
      const videoTitle = videoTitleInput.trim() || 'Venue Walkthrough Reel';
      const newVid: VenueVideo = {
        id: `vid_${Date.now()}`,
        url: trimmedUrl,
        title: videoTitle,
        aspectRatio: videoAspectInput,
        durationSeconds: parseInt(videoDurationInput, 10) || 30,
        isShort: true,
        viewsCount: 1,
        uploadedAt: 'Admin Stream Link',
      };

      setUploadedVideos((prev) => [newVid, ...prev]);
      setActiveVerificationVideo(newVid);
      setVideoUrlInput('');
      setVideoTitleInput('');
      setUrlStreamLoaded(false);
      setUrlStreamError(false);

      setVideoUploadState({
        status: 'success',
        progress: 100,
        sourceType: 'url',
        fileName: trimmedUrl,
        successMessage: `Remote promotional video "${newVid.title}" verified & attached successfully!`,
        uploadedVideoId: newVid.id,
      });
    }, 1150);

    videoTimersRef.current.push(t1, t2);
  };

  // Cancel ongoing upload
  const handleCancelVideoUpload = () => {
    clearVideoTimers();
    setVideoUploadState({
      status: 'idle',
      progress: 0,
    });
  };

  // Dismiss status notification
  const handleDismissVideoStatus = () => {
    setVideoUploadState({
      status: 'idle',
      progress: 0,
    });
  };

  // Apply Preset Short Video
  const handleApplyPresetVideo = (preset: typeof PRESET_SHORT_VIDEOS[0]) => {
    const newVid: VenueVideo = {
      id: `vid_pre_${Date.now()}`,
      url: preset.url,
      title: preset.title,
      aspectRatio: preset.aspectRatio,
      durationSeconds: preset.durationSeconds,
      isShort: true,
      viewsCount: 450,
      uploadedAt: 'Admin Curated',
    };
    setUploadedVideos([...uploadedVideos, newVid]);
    setActiveVerificationVideo(newVid);
  };

  // Delete Short Video
  const handleDeleteVideo = (id: string) => {
    setUploadedVideos((prev) => {
      const remaining = prev.filter((v) => v.id !== id);
      if (activeVerificationVideo?.id === id) {
        setActiveVerificationVideo(remaining.length > 0 ? remaining[0] : null);
      }
      return remaining;
    });
    if (previewingVideoUrl) setPreviewingVideoUrl(null);
  };

  // Save / Update Venue
  const handleSaveVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !addressLine.trim()) {
      alert('Please provide at least the Venue Name and Address Line.');
      return;
    }

    const categoryObj = SAMPLE_CATEGORIES.find((c) => c.slug === categorySlug) || SAMPLE_CATEGORIES[0];
    const coverPhoto = uploadedPhotos.find((p) => p.isCover)?.url || uploadedPhotos[0]?.url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80';

    const payload: Partial<Venue> = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim() || `Spectacular ${categoryObj.name} destination in ${city}. Features modern amenities, high capacity, and premier hosting infrastructure.`,
      addressLine1: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      category: categoryObj,
      capacity: parseInt(capacity, 10) || 500,
      minGuests: parseInt(minGuests, 10) || 100,
      maxGuests: (parseInt(capacity, 10) || 500) * 1.5,
      parkingCapacity: parseInt(parkingCapacity, 10) || 50,
      pricingBaseAmount: parseInt(basePrice, 10) || 50000,
      taxRate: parseFloat(taxRate) || 18.0,
      foodOptions,
      rules,
      status: publishStatus,
      isVerified,
      isActive: true,
      images: uploadedPhotos.length > 0 ? uploadedPhotos : [
        {
          id: 'img_default',
          url: coverPhoto,
          altText: name,
          isCover: true,
        },
      ],
      videos: uploadedVideos,
      facilities: selectedAmenities.map((a) => ({ facility: a, isAvailable: true })),
      contactPhone,
      contactWhatsapp,
      featuredImageUrl: coverPhoto,
    };

    if (editingVenueId) {
      updateVenue(editingVenueId, payload);
      setSaveSuccessMessage(`Venue "${name}" updated successfully with ${uploadedPhotos.length} photos and ${uploadedVideos.length} short videos!`);
    } else {
      const created = addVenue(payload);
      setSaveSuccessMessage(`New venue "${created.name}" published live with ${uploadedPhotos.length} photos and ${uploadedVideos.length} short videos!`);
      handleResetForm();
    }

    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 5000);
  };

  // Filter existing venues for management tab
  const filteredExistingVenues = venues.filter((v) => {
    const q = searchVenueTerm.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.category?.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-24 md:pb-16 max-w-6xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Admin Portal
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Direct Instant Publishing
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2.5">
            <Film className="w-6 h-6 text-purple-600" />
            Upload Venue Details, Pictures & Short Videos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create brand new spaces or enrich existing venues with high-resolution photo galleries and 9:16 walkthrough video reels.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('NEW_VENUE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'NEW_VENUE'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingVenueId ? 'Editing Venue' : 'Upload New Venue'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MANAGE_EXISTING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'MANAGE_EXISTING'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Manage All Venues ({venues.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-black ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: UPLOAD NEW VENUE / EDIT VENUE */}
      {activeTab === 'NEW_VENUE' && (
        <form onSubmit={handleSaveVenue} className="space-y-6">
          {editingVenueId && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>You are currently editing <strong>"{name}"</strong>. Changes will update immediately in the database.</span>
              </div>
              <button
                type="button"
                onClick={handleResetForm}
                className="px-3 py-1 bg-white hover:bg-amber-100 rounded-lg text-[11px] font-bold border border-amber-300 text-amber-800"
              >
                Cancel Edit / Upload Fresh
              </button>
            </div>
          )}

          {/* SECTION 1: CORE VENUE IDENTITY & CATEGORY */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900">1. Space Classification & Core Identity</h2>
                  <p className="text-[11px] text-slate-500">Select the space archetype and define official venue name</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                Step 1 of 4
              </span>
            </div>

            {/* Category Selector Buttons */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Space Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {[
                  { slug: 'function_hall', label: 'Banquet & Hall', icon: '🏛️' },
                  { slug: 'sports_turf', label: 'Sports Turf', icon: '🏸' },
                  { slug: 'hotel_stay', label: 'Hotel & Stay', icon: '🏨' },
                  { slug: 'pg_hostel', label: 'PG & Co-Living', icon: '🏠' },
                  { slug: 'coaching', label: 'Academy & Class', icon: '🎓' },
                  { slug: 'co_working', label: 'Co-Working Desk', icon: '💼' },
                ].map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setCategorySlug(cat.slug)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      categorySlug === cat.slug
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-2xs ring-2 ring-purple-600/20 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs leading-tight">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Venue Name & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Official Venue / Property Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Royal Imperial Grand Palace & Convention Center"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Comprehensive Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Highlight key architecture, chandeliers, acoustics, seating layout, lawn area, and accessibility..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Street Address / Landmark *</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g., Plot 88, Road No 36, Jubilee Hills"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden text-xs"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp Concierge (without +)</label>
                <input
                  type="text"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden text-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: HIGH-RESOLUTION PICTURES UPLOAD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900">2. Venue Pictures & Photo Gallery</h2>
                  <p className="text-[11px] text-slate-500">Upload multiple photos via device files, URL links, or instant curated HD packs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyStockPhotos}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Insert HD Presets</span>
                </button>
                <button
                  type="button"
                  onClick={() => photoFileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Files</span>
                </button>
                <input
                  ref={photoFileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Drag & Drop File Box */}
            <div
              onClick={() => photoFileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-purple-500 bg-slate-50/70 hover:bg-purple-50/30 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to select photos or drag & drop high-resolution images
                </p>
                <p className="text-[11px] text-slate-500">
                  Supports JPG, PNG, WEBP. Instant client-side conversion allows real-time preview without wait.
                </p>
              </div>
            </div>

            {/* Direct URL Input Row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder="Or paste an Image URL (e.g. Unsplash, CDN link)..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
              />
              <input
                type="text"
                value={photoCaptionInput}
                onChange={(e) => setPhotoCaptionInput(e.target.value)}
                placeholder="Photo caption (e.g., Dining Foyer)..."
                className="w-full sm:w-60 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddPhotoUrl}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shrink-0"
              >
                Add URL
              </button>
            </div>

            {/* Uploaded Photos Grid */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Current Photo Gallery ({uploadedPhotos.length})</span>
                {uploadedPhotos.length > 0 && (
                  <span className="text-[11px] text-purple-600 font-semibold">
                    First photo or tagged 'Cover' appears as primary card banner
                  </span>
                )}
              </div>

              {uploadedPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {uploadedPhotos.map((photo, idx) => (
                    <div
                      key={photo.id}
                      className="relative h-36 rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100 shadow-2xs"
                    >
                      <img src={photo.url} alt={photo.altText} className="w-full h-full object-cover" />

                      {photo.isCover && (
                        <span className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                          Cover Photo
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                        <div className="flex justify-end gap-1">
                          {!photo.isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCoverPhoto(photo.id)}
                              className="px-2 py-1 bg-white text-slate-900 text-[10px] font-bold rounded-md hover:bg-purple-50"
                              title="Set as Cover"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="p-1 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-white font-medium line-clamp-1 truncate">
                          {photo.altText || `Photo ${idx + 1}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                  No pictures uploaded yet. Click "Upload Files" or "Insert HD Presets" above.
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: SHORT PROMOTIONAL VIDEOS & WALKTHROUGH REELS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900">3. Short Promotional Videos & Walkthrough Reels</h2>
                  <p className="text-[11px] text-slate-500">
                    Upload 15-60s vertical shorts or paste promo video URLs to boost venue bookings by up to 3.5x
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={videoUploadState.status === 'uploading'}
                  onClick={() => videoFileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Video File</span>
                </button>
                <input
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm,.m4v"
                  onChange={handleVideoFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* VIDEO UPLOAD STATE BANNER (Uploading with Spinner | Success | Error) */}
            {videoUploadState.status === 'uploading' && (
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 shadow-2xs space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Loader2 className="w-5 h-5 text-rose-600 animate-spin shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span>Uploading & Processing Promotional Video...</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                          {videoUploadState.sourceType === 'file' ? 'Local File' : 'Stream URL'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5">
                        {videoUploadState.fileName} {videoUploadState.fileSizeMb && `(${videoUploadState.fileSizeMb})`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCancelVideoUpload}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                </div>

                {/* Progress Bar Track */}
                <div className="space-y-1.5">
                  <div className="w-full h-2 rounded-full bg-rose-200/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${videoUploadState.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-rose-800 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-500" />
                      <span>{videoUploadState.stageMessage || 'Encoding promotional stream...'}</span>
                    </span>
                    <span className="font-black text-rose-900">{videoUploadState.progress}%</span>
                  </div>
                </div>
              </div>
            )}

            {videoUploadState.status === 'success' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-emerald-900">Video Uploaded & Attached!</h4>
                    <p className="text-[11px] text-emerald-700 mt-0.5 line-clamp-1">
                      {videoUploadState.successMessage || 'The promotional short has been successfully added to your venue.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {videoUploadState.uploadedVideoId && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetVid = uploadedVideos.find((v) => v.id === videoUploadState.uploadedVideoId);
                        if (targetVid) {
                          setActiveVerificationVideo(targetVid);
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Verify in Preview Player</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDismissVideoStatus}
                    className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="Dismiss notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {videoUploadState.status === 'error' && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-rose-900">Video Upload Blocked (Validation Failed)</h4>
                      {videoUploadState.fileSizeMb && (
                        <span className="px-1.5 py-0.5 rounded-md bg-rose-200/80 text-rose-900 text-[10px] font-bold">
                          {videoUploadState.fileSizeMb}
                        </span>
                      )}
                      {videoUploadState.fileName && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white border border-rose-200 text-rose-800 text-[10px] font-medium max-w-[180px] truncate">
                          {videoUploadState.fileName}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-rose-700 mt-1">
                      {videoUploadState.errorMessage || 'The video file did not pass client-side format or size validation.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      handleDismissVideoStatus();
                      if (videoUploadState.sourceType === 'file') {
                        videoFileInputRef.current?.click();
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Choose Supported Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDismissVideoStatus}
                    className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded-lg transition-colors"
                    title="Dismiss error"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Video Source Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 max-w-fit">
              <button
                type="button"
                onClick={() => setVideoSourceTab('file')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  videoSourceTab === 'file'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileVideo className="w-3.5 h-3.5" />
                <span>Upload Video File</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoSourceTab('url')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  videoSourceTab === 'url'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Paste Video URL</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoSourceTab('presets')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  videoSourceTab === 'presets'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Curated 4K Sample Reels</span>
              </button>
            </div>

            {/* TAB 1: VIDEO FILE PICKER & DRAG/DROP ZONE */}
            {videoSourceTab === 'file' && (
              <div className="space-y-3">
                <div
                  onDragOver={handleVideoDragOver}
                  onDragLeave={handleVideoDragLeave}
                  onDrop={handleVideoDrop}
                  onClick={() => {
                    if (videoUploadState.status !== 'uploading') {
                      videoFileInputRef.current?.click();
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all space-y-2.5 ${
                    isDraggingVideo
                      ? 'border-rose-500 bg-rose-50/60 scale-[1.01]'
                      : 'border-slate-200 hover:border-rose-500 bg-slate-50/70 hover:bg-rose-50/30'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                    {videoUploadState.status === 'uploading' ? (
                      <Loader2 className="w-6 h-6 animate-spin text-rose-600" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {isDraggingVideo
                        ? 'Drop your video file to begin upload...'
                        : 'Click to select promotional video or drag & drop file here'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                      Only MP4, MOV, and WebM format videos up to 100MB accepted (minimum 50KB). Videos are validated client-side for supported media codecs before upload begins.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      📹 MP4 / MOV / WebM
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      ⚡ Max 100MB (Min 50KB)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      📱 9:16 Reel or 16:9 HD
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <span>🛡️ Client Validated</span>
                    </span>
                  </div>
                </div>

                {/* Optional Metadata Controls for Next Uploaded File */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="sm:col-span-5">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Video Title (Optional):</label>
                    <input
                      type="text"
                      value={videoTitleInput}
                      onChange={(e) => setVideoTitleInput(e.target.value)}
                      placeholder="e.g. 30s Drone Walkthrough Reel"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Aspect Ratio Format:</label>
                    <select
                      value={videoAspectInput}
                      onChange={(e) => setVideoAspectInput(e.target.value as '9:16' | '16:9')}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden"
                    >
                      <option value="9:16">9:16 Vertical Short (Instagram/YouTube Reel)</option>
                      <option value="16:9">16:9 Landscape Video</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Duration:</label>
                    <select
                      value={videoDurationInput}
                      onChange={(e) => setVideoDurationInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden"
                    >
                      <option value="15">15 Seconds</option>
                      <option value="30">30 Seconds</option>
                      <option value="45">45 Seconds</option>
                      <option value="60">60 Seconds</option>
                    </select>
                  </div>
                </div>

                {/* Immediate In-Tab File Upload Preview Player */}
                {activeVerificationVideo && (videoUploadState.status === 'success' || activeVerificationVideo.uploadedAt === 'Admin Uploaded') && (
                  <div className="p-3.5 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-sm space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black text-white">
                          Uploaded Video Verification Preview
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          ✓ File Processed
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        Play & verify content before saving listing
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start bg-black/60 p-2.5 rounded-xl border border-slate-800">
                      <div className={`relative rounded-xl overflow-hidden bg-black shrink-0 flex items-center justify-center ${activeVerificationVideo.aspectRatio === '9:16' ? 'w-32 h-52' : 'w-56 h-36'}`}>
                        <video
                          key={activeVerificationVideo.url}
                          src={activeVerificationVideo.url}
                          controls
                          autoPlay
                          muted={isVideoMuted}
                          playsInline
                          loop
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setIsVideoMuted(!isVideoMuted)}
                          className="absolute bottom-1.5 right-1.5 p-1 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors"
                          title={isVideoMuted ? 'Unmute audio' : 'Mute audio'}
                        >
                          {isVideoMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                        </button>
                      </div>

                      <div className="text-xs space-y-2 flex-1 min-w-0 py-1">
                        <div>
                          <h5 className="font-bold text-white truncate text-sm">
                            {activeVerificationVideo.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                            {activeVerificationVideo.url}
                          </p>
                        </div>

                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Client validation passed & video stream decoded</span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Aspect Ratio: {activeVerificationVideo.aspectRatio} • Duration: {activeVerificationVideo.durationSeconds}s • Ready to save with venue
                          </p>
                        </div>

                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              videoFileInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Replace Video File</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(activeVerificationVideo.id)}
                            className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DIRECT VIDEO URL & METADATA FORM */}
            {videoSourceTab === 'url' && (
              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 block">
                    Attach Promotional Video from Web or CDN URL:
                  </span>
                  <span className="text-[10px] text-slate-400">Direct MP4, WebM, or HLS stream links</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={videoUrlInput}
                      onChange={(e) => {
                        setVideoUrlInput(e.target.value);
                        setUrlStreamLoaded(false);
                        setUrlStreamError(false);
                      }}
                      placeholder="https://assets.cdn.com/videos/promo_walkthrough.mp4"
                      disabled={videoUploadState.status === 'uploading'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={videoTitleInput}
                      onChange={(e) => setVideoTitleInput(e.target.value)}
                      placeholder="Title (e.g. VIP Foyer Tour)"
                      disabled={videoUploadState.status === 'uploading'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <select
                      value={videoAspectInput}
                      onChange={(e) => setVideoAspectInput(e.target.value as '9:16' | '16:9')}
                      disabled={videoUploadState.status === 'uploading'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden"
                    >
                      <option value="9:16">9:16 Short (Reel)</option>
                      <option value="16:9">16:9 Standard</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      disabled={videoUploadState.status === 'uploading'}
                      onClick={handleAddVideoUrl}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      {videoUploadState.status === 'uploading' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Attach Video</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Small Video Preview Player for Entered URL */}
                {videoUrlInput.trim().length > 6 && /^(https?:\/\/|blob:)/i.test(videoUrlInput.trim()) && (
                  <div className="mt-3 p-3.5 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-sm space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-xs font-black text-white">
                          Live URL Video Preview Player
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                          {videoAspectInput === '9:16' ? '📱 9:16 Vertical Reel' : '🖥️ 16:9 Standard'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        Verify stream and content before attaching
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start bg-black/60 p-2.5 rounded-xl border border-slate-800">
                      <div className={`relative rounded-xl overflow-hidden bg-black shrink-0 flex items-center justify-center ${videoAspectInput === '9:16' ? 'w-32 h-52' : 'w-56 h-36'}`}>
                        <video
                          key={videoUrlInput.trim()}
                          src={videoUrlInput.trim()}
                          controls
                          autoPlay
                          muted={isVideoMuted}
                          playsInline
                          loop
                          onLoadedData={() => {
                            setUrlStreamLoaded(true);
                            setUrlStreamError(false);
                          }}
                          onError={() => {
                            setUrlStreamError(true);
                            setUrlStreamLoaded(false);
                          }}
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setIsVideoMuted(!isVideoMuted)}
                          className="absolute bottom-1.5 right-1.5 p-1 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors"
                          title={isVideoMuted ? 'Unmute audio' : 'Mute audio'}
                        >
                          {isVideoMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                        </button>
                      </div>

                      <div className="text-xs space-y-2 flex-1 min-w-0 py-1">
                        <div>
                          <h5 className="font-bold text-white truncate text-sm">
                            {videoTitleInput.trim() || 'Venue Promotional Walkthrough'}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                            {videoUrlInput.trim()}
                          </p>
                        </div>

                        {urlStreamError ? (
                          <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px] flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                            <span>Stream playback warning: Ensure this URL points directly to an accessible MP4/WebM media stream.</span>
                          </div>
                        ) : urlStreamLoaded ? (
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Live video stream decoded & playing smoothly</span>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Format: {videoAspectInput} • Duration: ~{videoDurationInput}s • Audio & video ready to attach
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                            <span>Loading stream preview & verifying codecs...</span>
                          </div>
                        )}

                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleAddVideoUrl}
                            disabled={videoUploadState.status === 'uploading'}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Verify & Attach to Listing</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setVideoUrlInput('');
                              setUrlStreamLoaded(false);
                              setUrlStreamError(false);
                            }}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                          >
                            Clear URL
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CURATED SHORT VIDEO PRESETS */}
            {videoSourceTab === 'presets' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Quick-Add Curated 4K Sample Promotional Reels (Click to Attach):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {PRESET_SHORT_VIDEOS.map((pre, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPresetVideo(pre)}
                      className="p-3 bg-slate-50 hover:bg-rose-50/50 border border-slate-200 hover:border-rose-300 rounded-2xl text-left transition-all group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-rose-600 mb-1">
                        <span>{pre.aspectRatio === '9:16' ? '📱 9:16 Vertical Reel' : '🖥️ 16:9 Landscape'}</span>
                        <span>{pre.durationSeconds}s</span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-rose-700">
                        {pre.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Plus className="w-3 h-3 text-rose-600" />
                        <span>Attach to venue</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SMALL VIDEO VERIFICATION PREVIEW PLAYER */}
            {activeVerificationVideo && (
              <div id="video-verification-section" className="p-4 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-md space-y-3 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-xs font-black tracking-wide text-white uppercase flex items-center gap-2">
                      <span>Listing Video Preview Player</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold normal-case flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Pre-Save Inspected</span>
                      </span>
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      Verify audio & video content before saving listing
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveVerificationVideo(null)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Dismiss preview player"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Compact Player Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Video Frame */}
                  <div className="sm:col-span-4 flex justify-center bg-black/60 rounded-2xl p-2.5 border border-slate-800/90">
                    <div className={`relative overflow-hidden rounded-xl bg-black ${activeVerificationVideo.aspectRatio === '9:16' ? 'w-36 h-56' : 'w-full max-w-[260px] h-38'}`}>
                      <video
                        key={activeVerificationVideo.url}
                        src={activeVerificationVideo.url}
                        controls
                        autoPlay
                        muted={isVideoMuted}
                        playsInline
                        loop
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setIsVideoMuted(!isVideoMuted)}
                        className="absolute bottom-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full backdrop-blur-xs transition-colors"
                        title={isVideoMuted ? 'Unmute audio' : 'Mute audio'}
                      >
                        {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Video Details & Checklist */}
                  <div className="sm:col-span-8 space-y-2.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase">
                          {activeVerificationVideo.aspectRatio || '9:16'} Reel
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {activeVerificationVideo.durationSeconds || 30}s Duration
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium">
                          {activeVerificationVideo.uploadedAt || 'Attached Video'}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white leading-snug">
                        {activeVerificationVideo.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate max-w-md mt-0.5 font-mono">
                        {activeVerificationVideo.url}
                      </p>
                    </div>

                    {/* Verification Checkpoints */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-slate-300">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Media decoded & stream playable</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Compliant with listing reel specs</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Audio & visual sync verified</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>Attached to venue listing payload</span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSaveSuccessMessage(`Video "${activeVerificationVideo.title}" verified! Ready to be saved with the venue listing.`);
                          setTimeout(() => setSaveSuccessMessage(null), 4000);
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Content Verified ✓</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(activeVerificationVideo.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Video</span>
                      </button>

                      {uploadedVideos.length > 1 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 ml-auto">
                          <span>Switch reel:</span>
                          <select
                            value={activeVerificationVideo.id}
                            onChange={(e) => {
                              const target = uploadedVideos.find((v) => v.id === e.target.value);
                              if (target) setActiveVerificationVideo(target);
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-[11px] font-bold focus:outline-hidden"
                          >
                            {uploadedVideos.map((v, i) => (
                              <option key={v.id} value={v.id}>
                                Reel #{i + 1}: {v.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Uploaded Short Videos List & Interactive Player */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Attached Short Videos & Reels ({uploadedVideos.length})</span>
                <span className="text-[11px] text-slate-400">
                  Select any card to verify in the preview player above
                </span>
              </div>

              {uploadedVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {uploadedVideos.map((video) => (
                    <div
                      key={video.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 flex flex-col justify-between ${
                        activeVerificationVideo?.id === video.id
                          ? 'border-purple-500 bg-purple-50/40 shadow-xs ring-2 ring-purple-500/20'
                          : 'border-slate-200 bg-white shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-black uppercase">
                            {video.aspectRatio || '9:16'} Reel
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.durationSeconds || 30}s
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{video.title}</h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">{video.url}</p>
                      </div>

                      {/* Video Player or Play Trigger */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveVerificationVideo(video);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                            activeVerificationVideo?.id === video.id
                              ? 'bg-purple-600 text-white shadow-2xs'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>{activeVerificationVideo?.id === video.id ? 'Now Previewing' : 'Verify Content'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Remove video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                  No short videos attached yet. Click "Choose Video File", paste a URL, or attach a curated 4K preset.
                </div>
              )}
            </div>

            {/* Live In-Studio Reel Player Modal / Box */}
            {previewingVideoUrl && (
              <div className="p-4 bg-slate-950 text-white rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-black text-rose-400 uppercase text-[10px]">Studio Live Video Reel Preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                    >
                      {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewingVideoUrl(null)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-bold text-slate-300"
                    >
                      Close Player
                    </button>
                  </div>
                </div>

                <div className="flex justify-center bg-black/40 rounded-2xl p-2">
                  <video
                    src={previewingVideoUrl}
                    controls
                    autoPlay
                    muted={isVideoMuted}
                    playsInline
                    className="max-h-96 rounded-xl object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: CAPACITY, PRICING, AMENITIES & ADMIN PUBLISHING */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900">4. Capacity, Pricing & Admin Publishing Gate</h2>
                  <p className="text-[11px] text-slate-500">Configure guests, rental amount, tax rates, and live verification status</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                Step 4 of 4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Max Guest Capacity</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-bold"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-bold text-purple-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Parking Spots (Cars/Bikes)</label>
                <input
                  type="number"
                  value={parkingCapacity}
                  onChange={(e) => setParkingCapacity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Amenities Tag Manager */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Key Amenities</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Central Air Conditioning',
                  '100% Genset Power Backup',
                  'Valet Parking Staff',
                  'VIP Bridal Dressing Suites',
                  'Pioneer Pro Audio & Stage Lighting',
                  'BWF Approved Synthetic Courts',
                  'High Speed Wi-Fi Fiber (1 Gbps)',
                  'Wheelchair Ramps & Elevators',
                  'Biometric Gate Access',
                ].map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                        } else {
                          setSelectedAmenities([...selectedAmenities, amenity]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? '✓' : '+'} {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Publishing Privileges Box */}
            <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3 pt-3">
              <div className="flex items-center gap-2 text-xs font-black text-purple-950">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                <span>Admin Authority: Direct Publishing & Live Status</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Publishing Moderation Status</label>
                  <select
                    value={publishStatus}
                    onChange={(e) => setPublishStatus(e.target.value as 'APPROVED' | 'PENDING')}
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-white font-bold text-purple-900"
                  >
                    <option value="APPROVED">APPROVED (Instantly visible & bookable online)</option>
                    <option value="PENDING">PENDING (Saved to moderation approval queue)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-4 sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={isVerified}
                      onChange={(e) => setIsVerified(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Attach "Verified Space" Official Shield Badge</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Pre-Saving Media & Video Verification Summary */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">
                      Promotional Video Pre-Save Verification:
                    </span>
                    {uploadedVideos.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{uploadedVideos.length} Video{uploadedVideos.length > 1 ? 's' : ''} Ready to Publish</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-semibold">
                        No video attached (optional)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {uploadedVideos.length > 0
                      ? `Active Reel: "${activeVerificationVideo?.title || uploadedVideos[0].title}" (${activeVerificationVideo?.aspectRatio || '9:16'}, ${activeVerificationVideo?.durationSeconds || 30}s duration)`
                      : 'Upload a 15-60s vertical reel or paste a promo URL to boost venue bookings by up to 3.5x.'}
                  </p>
                </div>
              </div>

              {uploadedVideos.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (uploadedVideos.length > 0 && !activeVerificationVideo) {
                      setActiveVerificationVideo(uploadedVideos[0]);
                    }
                    const el = document.getElementById('video-verification-section');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Verify Content in Player</span>
                </button>
              )}
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Reset All Fields
              </button>

              <button
                type="submit"
                className="px-7 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingVenueId ? 'Save Updates & Publish' : 'Upload & Publish Venue Live'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: MANAGE ALL EXISTING VENUES */}
      {activeTab === 'MANAGE_EXISTING' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchVenueTerm}
                onChange={(e) => setSearchVenueTerm(e.target.value)}
                placeholder="Search venues by title, city, or space category..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
            <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Showing {filteredExistingVenues.length} of {venues.length} properties
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExistingVenues.map((venue) => {
              const photoCount = venue.images?.length || 0;
              const videoCount = venue.videos?.length || 0;

              return (
                <div
                  key={venue.id}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-colors"
                >
                  <div className="flex gap-3">
                    <img
                      src={venue.images?.[0]?.url || venue.featuredImageUrl}
                      alt={venue.name}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {venue.category?.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            venue.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {venue.status || 'APPROVED'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 truncate">{venue.name}</h3>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        {venue.addressLine1}, {venue.city}
                      </p>
                      <div className="text-[11px] text-slate-700 font-semibold">
                        Base: ₹{venue.pricingBaseAmount?.toLocaleString('en-IN')} • Capacity: {venue.capacity}
                      </div>
                    </div>
                  </div>

                  {/* Media Stats Pills & Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-[10px] font-bold flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        <span>{photoCount} Photos</span>
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 ${
                          videoCount > 0
                            ? 'bg-rose-50 text-rose-700 font-extrabold ring-1 ring-rose-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Video className="w-3 h-3" />
                        <span>{videoCount} Reels</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVenueId(venue.id);
                          setActiveScreen('venue-detail');
                        }}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                        title="View Live Listing Page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEditVenue(venue)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Edit Details & Media</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
