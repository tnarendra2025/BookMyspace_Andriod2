import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'es' | 'fr' | 'de' | 'ar';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', dir: 'rtl' },
];

export interface TranslationDictionary {
  // Navigation & Branding
  brandTitle: string;
  brandTagline: string;
  explore: string;
  glassStage: string;
  mapBooking: string;
  pinBooking: string;
  aiBooking: string;
  myBookings: string;
  savedSpaces: string;
  switchCity: string;
  selectLanguage: string;
  quickSearch: string;
  searchPlaceholder: string;

  // Mode toggles
  interactiveMap: string;
  locationPin: string;
  mapModeSub: string;
  pinModeSub: string;

  // Pin & Map Controls
  dropPin: string;
  useMyLocation: string;
  searchAreaOrLandmark: string;
  searchRadiusKm: string;
  venuesFound: string;
  distanceFromPin: string;
  bookFromPin: string;
  bookOnMap: string;
  recenterMap: string;
  viewDetails: string;
  instantBook: string;
  withinRadius: string;
  selectedCoordinates: string;
  kmAway: string;

  // AI Booking Assistant
  aiAssistantTitle: string;
  aiAssistantSubtitle: string;
  aiInputPlaceholder: string;
  findAndBookAi: string;
  aiAnalyzing: string;
  aiMatchHeader: string;
  aiCriteriaExtracted: string;
  ai1ClickBook: string;
  aiTryPrompts: string;
  aiPrompt1: string;
  aiPrompt2: string;
  aiPrompt3: string;
  aiConciergeTip: string;

  // Categories
  allSpaces: string;
  functionHalls: string;
  marriageHalls: string;
  banquetHalls: string;
  hourlyRooms: string;
  hotelsSuites: string;
  pgHostels: string;
  sportsTurfs: string;
  coachingClasses: string;
  studiosDance: string;
  coworkingDesks: string;

  // Common UI
  capacity: string;
  guests: string;
  price: string;
  perSlot: string;
  perHour: string;
  perDay: string;
  verifiedBadge: string;
  availableNow: string;
  confirmBooking: string;
  close: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    brandTitle: 'BookMySpace',
    brandTagline: 'Smart venue, court, hotel, PG & workspace booking',
    explore: 'Explore',
    glassStage: '3D Glass Stage',
    mapBooking: 'Map Booking',
    pinBooking: 'Pin Drop Booking',
    aiBooking: 'AI Booking',
    myBookings: 'My Bookings',
    savedSpaces: 'Saved',
    switchCity: 'Switch City',
    selectLanguage: 'Language',
    quickSearch: 'Quick Search',
    searchPlaceholder: 'Search banquet, turf, hotel, coworking...',

    interactiveMap: 'Interactive Map Booking',
    locationPin: 'Location Pin & Radius Booking',
    mapModeSub: 'Explore pins directly on the live vector map canvas with price markers',
    pinModeSub: 'Drop a pin or use GPS to find and book spaces within your chosen radius',

    dropPin: 'Drop Location Pin',
    useMyLocation: 'Use My Current GPS Location',
    searchAreaOrLandmark: 'Search area, landmark or neighborhood...',
    searchRadiusKm: 'Search Radius',
    venuesFound: 'Spaces Found',
    distanceFromPin: 'Distance from Pin',
    bookFromPin: 'Book from Pin',
    bookOnMap: 'Book This Space',
    recenterMap: 'Recenter Map',
    viewDetails: 'View Details',
    instantBook: 'Instant Book',
    withinRadius: 'within radius',
    selectedCoordinates: 'Pinned Coordinates',
    kmAway: 'km away',

    aiAssistantTitle: 'AI Space Booking Concierge',
    aiAssistantSubtitle: 'Describe your requirement in natural language and book instantly',
    aiInputPlaceholder: 'e.g. Need a grand banquet hall for 400 guests in Hyderabad this weekend with catering under ₹1,80,000...',
    findAndBookAi: 'Find & Match with AI',
    aiAnalyzing: 'AI Analyzing requirements & matching catalogue...',
    aiMatchHeader: 'Top Matched Spaces',
    aiCriteriaExtracted: 'Analyzed Booking Criteria',
    ai1ClickBook: '⚡ 1-Click Instant Book',
    aiTryPrompts: 'Try asking our AI:',
    aiPrompt1: 'Banquet hall for 350 guests with parking in Jubilee Hills',
    aiPrompt2: 'Badminton turf in Bangalore for 2 hours tomorrow evening',
    aiPrompt3: 'Private quiet meeting room for 6 people under ₹1,500/hr',
    aiConciergeTip: 'Our Gemini-powered AI parses capacity, dates, and budget to find ideal matches.',

    allSpaces: 'All Spaces',
    functionHalls: 'Function Halls',
    marriageHalls: 'Marriage Halls',
    banquetHalls: 'Banquet Halls',
    hourlyRooms: 'Hourly Stays',
    hotelsSuites: 'Hotels & Suites',
    pgHostels: 'PG & Hostels',
    sportsTurfs: 'Sports & Turf',
    coachingClasses: 'Classes & Coaching',
    studiosDance: 'Studios & Dance',
    coworkingDesks: 'Co-Working & Desks',

    capacity: 'Capacity',
    guests: 'Guests',
    price: 'Price',
    perSlot: '/ slot',
    perHour: '/ hr',
    perDay: '/ day',
    verifiedBadge: 'Verified',
    availableNow: 'Available Now',
    confirmBooking: 'Confirm Booking',
    close: 'Close',
  },

  hi: {
    brandTitle: 'BookMySpace',
    brandTagline: 'स्मार्ट वेन्यू, टर्फ, होटल, पीजी और वर्कस्पेस बुकिंग',
    explore: 'खोजें',
    glassStage: '3D ग्लास स्टेज',
    mapBooking: 'मैप बुकिंग',
    pinBooking: 'पिन ड्रॉप बुकिंग',
    aiBooking: 'AI बुकिंग',
    myBookings: 'मेरी बुकिंग्स',
    savedSpaces: 'सहेजे गए',
    switchCity: 'शहर बदलें',
    selectLanguage: 'भाषा',
    quickSearch: 'त्वरित खोज',
    searchPlaceholder: 'बैंक्वेट, टर्फ, होटल, को-वर्किंग खोजें...',

    interactiveMap: 'इंटरएक्टिव मैप बुकिंग',
    locationPin: 'लोकेशन पिन और रेडियस बुकिंग',
    mapModeSub: 'लाइव मैप पर वेन्यू पिन देखकर सीधे बुक करें',
    pinModeSub: 'पिन सेट करें या जीपीएस द्वारा अपने दायरे में बुक करें',

    dropPin: 'लोकेशन पिन लगाएं',
    useMyLocation: 'मेरे मौजूदा जीपीएस का उपयोग करें',
    searchAreaOrLandmark: 'क्षेत्र, लैंडमार्क या मोहल्ला खोजें...',
    searchRadiusKm: 'खोज दायरा (रेडियस)',
    venuesFound: 'उपलब्ध स्पेस मिले',
    distanceFromPin: 'पिन से दूरी',
    bookFromPin: 'पिन से सीधे बुक करें',
    bookOnMap: 'यह स्पेस बुक करें',
    recenterMap: 'मैप रीसेंटर करें',
    viewDetails: 'विवरण देखें',
    instantBook: 'तुरंत बुक करें',
    withinRadius: 'दायरे में',
    selectedCoordinates: 'पिन किए निर्देशांक',
    kmAway: 'किमी दूर',

    aiAssistantTitle: 'AI स्पेस बुकिंग सहायक',
    aiAssistantSubtitle: 'अपनी आवश्यकता सरल भाषा में लिखें और तुरंत बुक करें',
    aiInputPlaceholder: 'उदा. हैदराबाद में इस शनिवार 400 लोगों के लिए खानपान सहित ₹1,80,000 के अंदर बैंक्वेट हॉल चाहिए...',
    findAndBookAi: 'AI से खोजें और मैच करें',
    aiAnalyzing: 'AI आवश्यकता का विश्लेषण कर रहा है...',
    aiMatchHeader: 'सर्वश्रेष्ठ मैच स्पेस',
    aiCriteriaExtracted: 'विश्लेषित बुकिंग मापदंड',
    ai1ClickBook: '⚡ 1-क्लिक तुरंत बुक करें',
    aiTryPrompts: 'AI से पूछें:',
    aiPrompt1: 'जुबली हिल्स में 350 मेहमानों के लिए बैंक्वेट हॉल',
    aiPrompt2: 'बैंगलोर में कल शाम 2 घंटे के लिए बैडमिंटन कोर्ट',
    aiPrompt3: '6 लोगों के लिए शांत मीटिंग रूम ₹1500/घंटा के अंदर',
    aiConciergeTip: 'Gemini AI आपकी क्षमता, बजट और तारीख के अनुसार सर्वोत्तम विकल्प चुनता है।',

    allSpaces: 'सभी स्पेस',
    functionHalls: 'फंक्शन हॉल',
    marriageHalls: 'विवाह मंडप',
    banquetHalls: 'बैंक्वेट हॉल',
    hourlyRooms: 'घंटे के आधार पर स्टे',
    hotelsSuites: 'होटल और सूट',
    pgHostels: 'पीजी और हॉस्टल',
    sportsTurfs: 'स्पोर्ट्स टर्फ और कोर्ट',
    coachingClasses: 'कोचिंग और क्लासरूम',
    studiosDance: 'स्टूडियो और डांस हॉल',
    coworkingDesks: 'को-वर्किंग और डेस्क',

    capacity: 'क्षमता',
    guests: 'मेहमान',
    price: 'मूल्य',
    perSlot: '/ स्लॉट',
    perHour: '/ घंटा',
    perDay: '/ दिन',
    verifiedBadge: 'सत्यापित',
    availableNow: 'अभी उपलब्ध',
    confirmBooking: 'बुकिंग कन्फर्म करें',
    close: 'बंद करें',
  },

  te: {
    brandTitle: 'BookMySpace',
    brandTagline: 'స్మార్ట్ వేదికలు, టర్ఫ్‌లు, హోటళ్లు మరియు పీజీ బుకింగ్',
    explore: 'అన్వేషించండి',
    glassStage: '3D గ్లాస్ స్టేజ్',
    mapBooking: 'మ్యాప్ బుకింగ్',
    pinBooking: 'పిన్ డ్రాప్ బుకింగ్',
    aiBooking: 'AI బుకింగ్',
    myBookings: 'నా బుకింగ్‌లు',
    savedSpaces: 'సేవ్ చేసినవి',
    switchCity: 'నగరం మార్చండి',
    selectLanguage: 'భాష',
    quickSearch: 'శీఘ్ర శోధన',
    searchPlaceholder: 'కళ్యాణ మండపం, టర్ఫ్, హోటల్ శోధించండి...',

    interactiveMap: 'ఇంటరాక్టివ్ మ్యాప్ బుకింగ్',
    locationPin: 'లొకేషన్ పిన్ & దూరం ఆధారంగా బుకింగ్',
    mapModeSub: 'లైవ్ మ్యాప్‌లో పిన్‌లను ఎంచుకొని నేరుగా బుక్ చేసుకోండి',
    pinModeSub: 'పిన్ వేసి లేదా GPS ద్వారా సమీప వేదికలను సులభంగా బుక్ చేయండి',

    dropPin: 'లొకేషన్ పిన్ వేయండి',
    useMyLocation: 'నా ప్రస్తుత GPS లొకేషన్ వాడండి',
    searchAreaOrLandmark: 'ప్రాంతం లేదా ల్యాండ్‌మార్క్ శోధించండి...',
    searchRadiusKm: 'శోధన వ్యాసార్థం (కిమీ)',
    venuesFound: 'లభించిన వేదికలు',
    distanceFromPin: 'పిన్ నుండి దూరం',
    bookFromPin: 'పిన్ నుండి బుక్ చేయండి',
    bookOnMap: 'ఈ వేదికను బుక్ చేయండి',
    recenterMap: 'మ్యాప్ రీసెంటర్',
    viewDetails: 'వివరాలు చూడండి',
    instantBook: 'వెంటనే బుక్ చేయండి',
    withinRadius: 'పరిధిలో',
    selectedCoordinates: 'పిన్ చేసిన కోఆర్డినేట్స్',
    kmAway: 'కిమీ దూరంలో',

    aiAssistantTitle: 'AI స్పేస్ బుకింగ్ అసిస్టెంట్',
    aiAssistantSubtitle: 'మీ అవసరాన్ని సాధారణ భాషలో వివరించండి, వెంటనే బుక్ చేయండి',
    aiInputPlaceholder: 'ఉదా. హైదరాబాద్‌లో ఈ శనివారం 400 మంది కోసం భోజన సదుపాయంతో మంచి కళ్యాణ మండపం కావాలి...',
    findAndBookAi: 'AI తో శోధించి మ్యాచ్ చేయండి',
    aiAnalyzing: 'AI వివరాలను విశ్లేషిస్తోంది...',
    aiMatchHeader: 'అత్యుత్తమ వేదికలు',
    aiCriteriaExtracted: 'విశ్లేషించిన వివరాలు',
    ai1ClickBook: '⚡ 1-క్లిక్ తక్షణ బుకింగ్',
    aiTryPrompts: 'AI ని అడగండి:',
    aiPrompt1: 'జూబ్లీ హిల్స్ వద్ద 350 మందికి ఫంక్షన్ హాల్',
    aiPrompt2: 'బెంగళూరులో రేపు సాయంత్రం 2 గంటల బ్యాడ్మింటన్ కోర్టు',
    aiPrompt3: '6 మందికి ప్రైవేట్ మీటింగ్ రూమ్ గంటకు ₹1500 లోపు',
    aiConciergeTip: 'Gemini AI మీ బడ్జెట్ మరియు స్థలం ఆధారంగా సరైన ఎంపికలను అందిస్తుంది.',

    allSpaces: 'అన్ని వేదికలు',
    functionHalls: 'ఫంక్షన్ హాళ్ళు',
    marriageHalls: 'కళ్యాణ మండపాలు',
    banquetHalls: 'బాంక్వెట్ హాళ్ళు',
    hourlyRooms: 'గంటల ఆధారిత బస',
    hotelsSuites: 'హోటళ్లు & సూట్లు',
    pgHostels: 'పీజీ & హాస్టళ్లు',
    sportsTurfs: 'స్పోర్ట్స్ టర్ఫ్‌లు',
    coachingClasses: 'కోచింగ్ & తరగతులు',
    studiosDance: 'స్టూడియోలు & నృత్యం',
    coworkingDesks: 'కో-వర్కింగ్ & డెస్క్‌లు',

    capacity: 'సామర్థ్యం',
    guests: 'అతిథులు',
    price: 'ధర',
    perSlot: '/ స్లాట్',
    perHour: '/ గంట',
    perDay: '/ రోజు',
    verifiedBadge: 'ధృవీకరించబడింది',
    availableNow: 'ఇప్పుడు అందుబాటులో ఉంది',
    confirmBooking: 'బుకింగ్ నిర్ధారించండి',
    close: 'మూసివేయి',
  },

  ta: {
    brandTitle: 'BookMySpace',
    brandTagline: 'ஸ்மார்ட் அரங்கம், டர்ஃப், ஹோட்டல் மற்றும் பிஜி முன்பதிவு',
    explore: 'ஆராயுங்கள்',
    glassStage: '3D கண்ணாடி மேடை',
    mapBooking: 'வரைபட முன்பதிவு',
    pinBooking: 'பின் போட்டு முன்பதிவு',
    aiBooking: 'AI முன்பதிவு',
    myBookings: 'எனது முன்பதிவுகள்',
    savedSpaces: 'சேமித்தவை',
    switchCity: 'நகரம் மாற்றவும்',
    selectLanguage: 'மொழி',
    quickSearch: 'விரைவு தேடல்',
    searchPlaceholder: 'மண்டபம், டர்ஃப், ஹோட்டல் தேடுங்கள்...',

    interactiveMap: 'ஊடாடும் வரைபட முன்பதிவு',
    locationPin: 'இடப் பின் மற்றும் தூர முன்பதிவு',
    mapModeSub: 'நேரடி வரைபடத்தில் பின்களைத் தேர்ந்தெடுத்து முன்பதிவு செய்யுங்கள்',
    pinModeSub: 'பின் வைத்து உங்கள் பகுதியில் உள்ள இடங்களை முன்பதிவு செய்யுங்கள்',

    dropPin: 'இடப் பின் வைக்கவும்',
    useMyLocation: 'எனது ஜிபிஎஸ் இருப்பிடத்தைப் பயன்படுத்துங்கள்',
    searchAreaOrLandmark: 'பகுதி அல்லது அடையாளத்தைத் தேடுங்கள்...',
    searchRadiusKm: 'தேடல் ஆரம் (கிமீ)',
    venuesFound: 'கிடைத்த இடங்கள்',
    distanceFromPin: 'பின்னிலிருந்து தூரம்',
    bookFromPin: 'பின்னிலிருந்து முன்பதிவு',
    bookOnMap: 'இவ்விடத்தை முன்பதிவு செய்',
    recenterMap: 'வரைபடம் மீட்டமை',
    viewDetails: 'விவரங்களைக் காண்க',
    instantBook: 'உடனடி முன்பதிவு',
    withinRadius: 'சுற்றளவிற்குள்',
    selectedCoordinates: 'பின் செய்யப்பட்ட ஆயத்தொலைவுகள்',
    kmAway: 'கிமீ தொலைவில்',

    aiAssistantTitle: 'AI முன்பதிவு உதவியாளர்',
    aiAssistantSubtitle: 'உங்கள் தேவையை எளிய தமிழில் கூறுங்கள், உடனே முன்பதிவு செய்யுங்கள்',
    aiInputPlaceholder: 'எ.கா. சென்னையில் 300 பேருக்கு உணவுடன் மண்டபம் ₹1,50,000க்குள் வேண்டும்...',
    findAndBookAi: 'AI மூலம் தேடி இணைக்கவும்',
    aiAnalyzing: 'AI விவரங்களை பகுப்பாய்வு செய்கிறது...',
    aiMatchHeader: 'பொருத்தமான இடங்கள்',
    aiCriteriaExtracted: 'பகுப்பாய்வு செய்யப்பட்ட விவரங்கள்',
    ai1ClickBook: '⚡ 1-கிளிக் உடனடி முன்பதிவு',
    aiTryPrompts: 'AI விடம் கேட்கலாம்:',
    aiPrompt1: 'அண்ணா நகரில் 300 பேருக்கு திருமண மண்டபம்',
    aiPrompt2: 'நாளை மாலை 2 மணி நேர கிரிக்கெட் அல்லது பேட்மிண்டன் டர்ஃப்',
    aiPrompt3: 'அமைதியான ஆலோசனைக் கூடம் ₹1200/மணிக்கு கீழ்',
    aiConciergeTip: 'Gemini AI உங்கள் பட்ஜெட் மற்றும் விருந்தினர் எண்ணிக்கைக்கு ஏற்ப தேர்வு செய்கிறது.',

    allSpaces: 'அனைத்து இடங்கள்',
    functionHalls: 'விழா அரங்குகள்',
    marriageHalls: 'திருமண மண்டபங்கள்',
    banquetHalls: 'விருந்து அரங்குகள்',
    hourlyRooms: 'மணிநேர தங்குமிடம்',
    hotelsSuites: 'ஹோட்டல்கள் & அறைகள்',
    pgHostels: 'பிஜி & விடுதிகள்',
    sportsTurfs: 'விளையாட்டு டர்ஃப்',
    coachingClasses: 'பயிற்சி வகுப்புகள்',
    studiosDance: 'நடன ஸ்டுடியோக்கள்',
    coworkingDesks: 'பகிர்வு அலுவலகங்கள்',

    capacity: 'கொள்ளளவு',
    guests: 'விருந்தினர்கள்',
    price: 'விலை',
    perSlot: '/ ஸ்லாட்',
    perHour: '/ மணி',
    perDay: '/ நாள்',
    verifiedBadge: 'சரிபார்க்கப்பட்டது',
    availableNow: 'இப்போது கிடைக்கிறது',
    confirmBooking: 'முன்பதிவை உறுதிசெய்',
    close: 'மூடு',
  },

  kn: {
    brandTitle: 'BookMySpace',
    brandTagline: 'ಸ್ಮಾರ್ಟ್ ಕಲ್ಯಾಣ ಮಂಟಪ, ಟರ್ಫ್, ಹೋಟೆಲ್ ಮತ್ತು ಪಿಜಿ ಬುಕಿಂಗ್',
    explore: 'ಅನ್ವೇಷಿಸಿ',
    glassStage: '3D ಗ್ಲಾಸ್ ಸ್ಟೇಜ್',
    mapBooking: 'ಮ್ಯಾಪ್ ಬುಕಿಂಗ್',
    pinBooking: 'ಪಿನ್ ಡ್ರಾಪ್ ಬುಕಿಂಗ್',
    aiBooking: 'AI ಬುಕಿಂಗ್',
    myBookings: 'ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು',
    savedSpaces: 'ಉಳಿಸಿದ ಸ್ಥಳಗಳು',
    switchCity: 'ನಗರ ಬದಲಾಯಿಸಿ',
    selectLanguage: 'ಭಾಷೆ',
    quickSearch: 'ತ್ವರಿತ ಹುಡುಕಾಟ',
    searchPlaceholder: 'ಕಲ್ಯಾಣ ಮಂಟಪ, ಟರ್ಫ್, ಹೋಟೆಲ್ ಹುಡುಕಿ...',

    interactiveMap: 'ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಮ್ಯಾಪ್ ಬುಕಿಂಗ್',
    locationPin: 'ಸ್ಥಳ ಪಿನ್ ಮತ್ತು ದೂರ ಆಧಾರಿತ ಬುಕಿಂಗ್',
    mapModeSub: 'ಲೈವ್ ಮ್ಯಾಪ್‌ನಲ್ಲಿ ಪಿನ್‌ಗಳ ಮೂಲಕ ನೇರವಾಗಿ ಬುಕ್ ಮಾಡಿ',
    pinModeSub: 'ಪಿನ್ ಹಾಕಿ ನಿಮ್ಮ ಸುತ್ತಮುತ್ತಲಿನ ಸ್ಥಳಗಳನ್ನು ಸುಲಭವಾಗಿ ಬುಕ್ ಮಾಡಿ',

    dropPin: 'ಸ್ಥಳ ಪಿನ್ ಇರಿಸಿ',
    useMyLocation: 'ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಬಳಸಿ',
    searchAreaOrLandmark: 'ಏರಿಯಾ ಅಥವಾ ಲ್ಯಾಂಡ್‌ಮಾರ್ಕ್ ಹುಡುಕಿ...',
    searchRadiusKm: 'ಹುಡುಕಾಟ ವ್ಯಾಪ್ತಿ (ಕಿಮೀ)',
    venuesFound: 'ಲಭ್ಯವಿರುವ ಸ್ಥಳಗಳು',
    distanceFromPin: 'ಪಿನ್‌ನಿಂದ ದೂರ',
    bookFromPin: 'ಪಿನ್‌ನಿಂದ ಬುಕ್ ಮಾಡಿ',
    bookOnMap: 'ಸ್ಥಳವನ್ನು ಬುಕ್ ಮಾಡಿ',
    recenterMap: 'ಮ್ಯಾಪ್ ಮರುಹೊಂದಿಸಿ',
    viewDetails: 'ವಿವರಗಳನ್ನು ನೋಡಿ',
    instantBook: 'ತಕ್ಷಣ ಬುಕ್ ಮಾಡಿ',
    withinRadius: 'ವ್ಯಾಪ್ತಿಯೊಳಗೆ',
    selectedCoordinates: 'ಪಿನ್ ಮಾಡಿದ ನಿರ್ದೇಶಾಂಕಗಳು',
    kmAway: 'ಕಿಮೀ ದೂರ',

    aiAssistantTitle: 'AI ಸ್ಥಳ ಬುಕಿಂಗ್ ಸಹಾಯಕ',
    aiAssistantSubtitle: 'ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ಸರಳವಾಗಿ ಹೇಳಿ, ತಕ್ಷಣ ಬುಕ್ ಮಾಡಿ',
    aiInputPlaceholder: 'ಉದಾ. ಬೆಂಗಳೂರಿನಲ್ಲಿ 300 ಜನರಿಗೆ ಕಲ್ಯಾಣ ಮಂಟಪ ಬೇಕು...',
    findAndBookAi: 'AI ಮೂಲಕ ಹುಡುಕಿ ಮ್ಯಾಚ್ ಮಾಡಿ',
    aiAnalyzing: 'AI ವಿವರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',
    aiMatchHeader: 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆಯ ಸ್ಥಳಗಳು',
    aiCriteriaExtracted: 'ವಿಶ್ಲೇಷಿಸಿದ ವಿವರಗಳು',
    ai1ClickBook: '⚡ 1-ಕ್ಲಿಕ್ ತಕ್ಷಣ ಬುಕಿಂಗ್',
    aiTryPrompts: 'AI ಅನ್ನು ಕೇಳಿ:',
    aiPrompt1: 'ಇಂದಿರಾನಗರದಲ್ಲಿ 300 ಜನರಿಗೆ ಬ್ಯಾಂಕ್ವೆಟ್ ಹಾಲ್',
    aiPrompt2: 'ಕೋರಮಂಗಲದಲ್ಲಿ 2 ಗಂಟೆಗಳ ಬ್ಯಾಡ್ಮಿಂಟನ್ ಟರ್ಫ್',
    aiPrompt3: 'ಸಣ್ಣ ಮೀಟಿಂಗ್ ರೂಮ್ ಗಂಟೆಗೆ ₹1500 ಒಳಗೆ',
    aiConciergeTip: 'Gemini AI ನಿಮ್ಮ ಬಜೆಟ್ ಮತ್ತು ಜನಸಂಖ್ಯೆಗೆ ತಕ್ಕಂತೆ ಹೊಂದಿಸುತ್ತದೆ.',

    allSpaces: 'ಎಲ್ಲಾ ಸ್ಥಳಗಳು',
    functionHalls: 'ಕಾರ್ಯಕ್ರಮ ಭವನಗಳು',
    marriageHalls: 'ಕಲ್ಯಾಣ ಮಂಟಪಗಳು',
    banquetHalls: 'ಬ್ಯಾಂಕ್ವೆಟ್ ಹಾಲ್‌ಗಳು',
    hourlyRooms: 'ಗಂಟೆಗಳ ವಾಸ್ತವ್ಯ',
    hotelsSuites: 'ಹೋಟೆಲ್‌ಗಳು & ಸೂಟ್‌ಗಳು',
    pgHostels: 'ಪಿಜಿ & ಹಾಸ್ಟೆಲ್‌ಗಳು',
    sportsTurfs: 'ಕ್ರೀಡಾ ಟರ್ಫ್‌ಗಳು',
    coachingClasses: 'ತರಬೇತಿ ತರಗತಿಗಳು',
    studiosDance: 'ಸ್ಟುಡಿಯೋ ಮತ್ತು ನೃತ್ಯ',
    coworkingDesks: 'ಕೋ-ವರ್ಕಿಂಗ್ ಡೆಸ್ಕ್',

    capacity: 'ಸಾಮರ್ಥ್ಯ',
    guests: 'ಅತಿಥಿಗಳು',
    price: 'ಬೆಲೆ',
    perSlot: '/ ಸ್ಲಾಟ್',
    perHour: '/ ಗಂಟೆ',
    perDay: '/ ದಿನ',
    verifiedBadge: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    availableNow: 'ಈಗ ಲಭ್ಯವಿದೆ',
    confirmBooking: 'ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
  },

  es: {
    brandTitle: 'BookMySpace',
    brandTagline: 'Reserva inteligente de salas, canchas, hoteles, residencias y oficinas',
    explore: 'Explorar',
    glassStage: 'Escenario de Cristal 3D',
    mapBooking: 'Reserva por Mapa',
    pinBooking: 'Reserva por Pin',
    aiBooking: 'Reserva con IA',
    myBookings: 'Mis Reservas',
    savedSpaces: 'Guardados',
    switchCity: 'Cambiar Ciudad',
    selectLanguage: 'Idioma',
    quickSearch: 'Búsqueda Rápida',
    searchPlaceholder: 'Buscar salones, canchas, hoteles, coworking...',

    interactiveMap: 'Reserva en Mapa Interactivo',
    locationPin: 'Reserva por Pin de Ubicación y Radio',
    mapModeSub: 'Explora pines en el mapa interactivo y reserva al instante',
    pinModeSub: 'Coloca un pin o usa tu GPS para encontrar y reservar espacios cercanos',

    dropPin: 'Fijar Pin de Ubicación',
    useMyLocation: 'Usar Mi Ubicación GPS Actual',
    searchAreaOrLandmark: 'Buscar zona, barrio o punto de referencia...',
    searchRadiusKm: 'Radio de Búsqueda',
    venuesFound: 'Espacios Encontrados',
    distanceFromPin: 'Distancia desde el Pin',
    bookFromPin: 'Reservar desde el Pin',
    bookOnMap: 'Reservar Este Espacio',
    recenterMap: 'Recentrar Mapa',
    viewDetails: 'Ver Detalles',
    instantBook: 'Reserva Inmediata',
    withinRadius: 'dentro del radio',
    selectedCoordinates: 'Coordenadas Fijadas',
    kmAway: 'km de distancia',

    aiAssistantTitle: 'Conserje de Reservas con IA',
    aiAssistantSubtitle: 'Describe lo que necesitas en lenguaje natural y reserva al instante',
    aiInputPlaceholder: 'ej. Necesito un salón de banquetes para 200 personas con catering este fin de semana...',
    findAndBookAi: 'Buscar y Coincidir con IA',
    aiAnalyzing: 'La IA está analizando los requisitos y el catálogo...',
    aiMatchHeader: 'Espacios Mejor Coincidentes',
    aiCriteriaExtracted: 'Criterios de Reserva Analizados',
    ai1ClickBook: '⚡ Reserva en 1-Clic',
    aiTryPrompts: 'Prueba preguntar a la IA:',
    aiPrompt1: 'Salón para 200 personas con estacionamiento',
    aiPrompt2: 'Cancha deportiva para 2 horas mañana por la tarde',
    aiPrompt3: 'Sala de reuniones privada para 6 personas',
    aiConciergeTip: 'Nuestra IA impulsada por Gemini encuentra el espacio óptimo según tus criterios.',

    allSpaces: 'Todos los Espacios',
    functionHalls: 'Salones de Fiestas',
    marriageHalls: 'Salones de Bodas',
    banquetHalls: 'Salones de Banquetes',
    hourlyRooms: 'Estancias por Horas',
    hotelsSuites: 'Hoteles y Suites',
    pgHostels: 'Residencias y Hostales',
    sportsTurfs: 'Canchas Deportivas',
    coachingClasses: 'Aulas y Clases',
    studiosDance: 'Estudios y Danza',
    coworkingDesks: 'Coworking y Escritorios',

    capacity: 'Capacidad',
    guests: 'Invitados',
    price: 'Precio',
    perSlot: '/ turno',
    perHour: '/ h',
    perDay: '/ día',
    verifiedBadge: 'Verificado',
    availableNow: 'Disponible Ahora',
    confirmBooking: 'Confirmar Reserva',
    close: 'Cerrar',
  },

  fr: {
    brandTitle: 'BookMySpace',
    brandTagline: 'Réservation intelligente de salles, terrains, hôtels et bureaux',
    explore: 'Explorer',
    glassStage: 'Scène Verre 3D',
    mapBooking: 'Réservation sur Carte',
    pinBooking: 'Réservation par Épingle',
    aiBooking: 'Réservation IA',
    myBookings: 'Mes Réservations',
    savedSpaces: 'Enregistrés',
    switchCity: 'Changer de Ville',
    selectLanguage: 'Langue',
    quickSearch: 'Recherche Rapide',
    searchPlaceholder: 'Rechercher salle, terrain, hôtel, coworking...',

    interactiveMap: 'Réservation Carte Interactive',
    locationPin: 'Réservation par Épingle et Rayon',
    mapModeSub: 'Explorez les épingles sur la carte en direct et réservez directement',
    pinModeSub: 'Placez une épingle ou utilisez le GPS pour trouver et réserver à proximité',

    dropPin: 'Placer une Épingle',
    useMyLocation: 'Utiliser Ma Position GPS Actuelle',
    searchAreaOrLandmark: 'Rechercher une zone, un quartier...',
    searchRadiusKm: 'Rayon de Recherche',
    venuesFound: 'Espaces Trouvés',
    distanceFromPin: 'Distance de l\'Épingle',
    bookFromPin: 'Réserver depuis l\'Épingle',
    bookOnMap: 'Réserver cet Espace',
    recenterMap: 'Recentrer la Carte',
    viewDetails: 'Voir Détails',
    instantBook: 'Réservation Instantanée',
    withinRadius: 'dans le rayon',
    selectedCoordinates: 'Coordonnées Épinglées',
    kmAway: 'km de distance',

    aiAssistantTitle: 'Concierge IA de Réservation d\'Espaces',
    aiAssistantSubtitle: 'Décrivez votre besoin en langage naturel et réservez instantanément',
    aiInputPlaceholder: 'ex. Je cherche une salle de banquet pour 150 personnes avec traiteur ce samedi...',
    findAndBookAi: 'Rechercher avec l\'IA',
    aiAnalyzing: 'L\'IA analyse votre demande...',
    aiMatchHeader: 'Meilleurs Espaces Correspondants',
    aiCriteriaExtracted: 'Critères Identifiés',
    ai1ClickBook: '⚡ Réservation Instantanée 1-Clic',
    aiTryPrompts: 'Demandez à l\'IA :',
    aiPrompt1: 'Grande salle pour 200 personnes avec parking',
    aiPrompt2: 'Terrain de sport pour 2 heures demain après-midi',
    aiPrompt3: 'Salle de réunion privée pour 6 personnes',
    aiConciergeTip: 'Notre IA optimisée par Gemini sélectionne les meilleurs lieux disponibles.',

    allSpaces: 'Tous les Espaces',
    functionHalls: 'Salles de Fêtes',
    marriageHalls: 'Salles de Mariage',
    banquetHalls: 'Salles de Banquet',
    hourlyRooms: 'Chambres à l\'Heure',
    hotelsSuites: 'Hôtels & Suites',
    pgHostels: 'Résidences & Auberges',
    sportsTurfs: 'Terrains & Sports',
    coachingClasses: 'Cours & Coaching',
    studiosDance: 'Studios & Danse',
    coworkingDesks: 'Espaces Coworking',

    capacity: 'Capacité',
    guests: 'Invités',
    price: 'Prix',
    perSlot: '/ créneau',
    perHour: '/ h',
    perDay: '/ jour',
    verifiedBadge: 'Vérifié',
    availableNow: 'Disponible',
    confirmBooking: 'Confirmer la Réservation',
    close: 'Fermer',
  },

  de: {
    brandTitle: 'BookMySpace',
    brandTagline: 'Smarte Buchung von Sälen, Sportplätzen, Hotels und Coworking',
    explore: 'Entdecken',
    glassStage: '3D-Glasbühne',
    mapBooking: 'Kartenbuchung',
    pinBooking: 'Pin-Drop-Buchung',
    aiBooking: 'KI-Buchung',
    myBookings: 'Meine Buchungen',
    savedSpaces: 'Gespeichert',
    switchCity: 'Stadt wechseln',
    selectLanguage: 'Sprache',
    quickSearch: 'Schnellsuche',
    searchPlaceholder: 'Saal, Sportplatz, Hotel, Coworking suchen...',

    interactiveMap: 'Interaktive Kartenbuchung',
    locationPin: 'Standort-Pin & Radiusbuchung',
    mapModeSub: 'Entdecken Sie Pins auf der Karte und buchen Sie direkt mit Preismarkern',
    pinModeSub: 'Setzen Sie einen Pin oder nutzen Sie GPS, um nahegelegene Räume zu buchen',

    dropPin: 'Standort-Pin setzen',
    useMyLocation: 'Meinen aktuellen GPS-Standort nutzen',
    searchAreaOrLandmark: 'Bereich, Viertel oder Orientierungspunkt suchen...',
    searchRadiusKm: 'Suchradius',
    venuesFound: 'Gefundene Räume',
    distanceFromPin: 'Entfernung vom Pin',
    bookFromPin: 'Vom Pin buchen',
    bookOnMap: 'Diesen Raum buchen',
    recenterMap: 'Karte zentrieren',
    viewDetails: 'Details ansehen',
    instantBook: 'Sofort buchen',
    withinRadius: 'im Radius',
    selectedCoordinates: 'Gepinnte Koordinaten',
    kmAway: 'km entfernt',

    aiAssistantTitle: 'KI-Raumbuchungs-Concierge',
    aiAssistantSubtitle: 'Beschreiben Sie Ihren Wunsch in natürlicher Sprache und buchen Sie sofort',
    aiInputPlaceholder: 'z.B. Ich benötige einen Festsaal für 200 Gäste mit Catering für Samstag...',
    findAndBookAi: 'Mit KI finden & abgleichen',
    aiAnalyzing: 'KI analysiert Anforderungen...',
    aiMatchHeader: 'Beste Raumanpassungen',
    aiCriteriaExtracted: 'Erkannte Kriterien',
    ai1ClickBook: '⚡ 1-Klick-Sofortbuchung',
    aiTryPrompts: 'Fragen Sie unsere KI:',
    aiPrompt1: 'Festsaal für 300 Personen mit Parkplatz',
    aiPrompt2: 'Sportplatz für 2 Stunden morgen Nachmittag',
    aiPrompt3: 'Ruhiger Meetingraum für 6 Personen unter 20 €/Std.',
    aiConciergeTip: 'Unsere Gemini-gestützte KI wählt die passenden Räume für Ihr Budget aus.',

    allSpaces: 'Alle Räume',
    functionHalls: 'Veranstaltungssäle',
    marriageHalls: 'Hochzeitssäle',
    banquetHalls: 'Bankettsäle',
    hourlyRooms: 'Stundenaufenthalte',
    hotelsSuites: 'Hotels & Suiten',
    pgHostels: 'Wohnheime & Hostels',
    sportsTurfs: 'Sportplätze & Plätze',
    coachingClasses: 'Schulungsräume',
    studiosDance: 'Studios & Tanz',
    coworkingDesks: 'Coworking & Arbeitsplätze',

    capacity: 'Kapazität',
    guests: 'Gäste',
    price: 'Preis',
    perSlot: '/ Slot',
    perHour: '/ Std.',
    perDay: '/ Tag',
    verifiedBadge: 'Verifiziert',
    availableNow: 'Jetzt verfügbar',
    confirmBooking: 'Buchung bestätigen',
    close: 'Schließen',
  },

  ar: {
    brandTitle: 'بوك ماي سبيس',
    brandTagline: 'حجز ذكي للقاعات، الملاعب الرياضية، الفنادق ومساحات العمل',
    explore: 'استكشاف',
    glassStage: 'منصة زجاجية 3D',
    mapBooking: 'حجز الخريطة',
    pinBooking: 'حجز بتحديد النقطة',
    aiBooking: 'الحجز بالذكاء الاصطناعي',
    myBookings: 'حجوزاتي',
    savedSpaces: 'المحفوظة',
    switchCity: 'تغيير المدينة',
    selectLanguage: 'اللغة',
    quickSearch: 'بحث سريع',
    searchPlaceholder: 'ابحث عن قاعة، ملعب، فندق، مساحة عمل...',

    interactiveMap: 'حجز تفاعلي عبر الخريطة',
    locationPin: 'حجز بدبوس الموقع ونطاق المسافة',
    mapModeSub: 'استكشف دبابيس الخريطة المباشرة واحجز فوراً بأسعار واضحة',
    pinModeSub: 'حدد نقطة أو استخدم موقعك الحالي لحجز المساحات القريبة منك',

    dropPin: 'إسقاط دبوس الموقع',
    useMyLocation: 'استخدام موقعي الحالي (GPS)',
    searchAreaOrLandmark: 'ابحث عن منطقة، حي، أو معلم...',
    searchRadiusKm: 'نطاق البحث (كم)',
    venuesFound: 'المساحات المتاحة',
    distanceFromPin: 'المسافة من النقطة',
    bookFromPin: 'احجز من النقطة',
    bookOnMap: 'احجز هذه المساحة',
    recenterMap: 'إعادة توسيط الخريطة',
    viewDetails: 'عرض التفاصيل',
    instantBook: 'حجز فوري',
    withinRadius: 'ضمن النطاق',
    selectedCoordinates: 'الإحداثيات المحددة',
    kmAway: 'كم يبعد',

    aiAssistantTitle: 'مساعد الحجز الذكي',
    aiAssistantSubtitle: 'صف طلبك باللغة الطبيعية واحجز فوراً بنقرة واحدة',
    aiInputPlaceholder: 'مثال: أحتاج قاعة مناسبات تتسع لـ 300 ضيف مع وجبات في نهاية الأسبوع...',
    findAndBookAi: 'بحث ومطابقة بالذكاء الاصطناعي',
    aiAnalyzing: 'الذكاء الاصطناعي يحلل الطلب ويطابق الخيارات...',
    aiMatchHeader: 'أفضل المساحات المطابقة',
    aiCriteriaExtracted: 'المعايير المحددة للحجز',
    ai1ClickBook: '⚡ حجز فوري بنقرة واحدة',
    aiTryPrompts: 'جرب أن تطلب من الذكاء الاصطناعي:',
    aiPrompt1: 'قاعة مناسبات لـ 350 ضيف مع موقف سيارات',
    aiPrompt2: 'ملعب رياضي لمدة ساعتين مساء الغد',
    aiPrompt3: 'غرفة اجتماعات خاصة هادئة لـ 6 أشخاص',
    aiConciergeTip: 'يستخدم مساعدنا Gemini لاقتراح أفضل الأماكن وفق ميزانيتك وموقعك.',

    allSpaces: 'جميع المساحات',
    functionHalls: 'قاعات الحفلات',
    marriageHalls: 'قاعات الأعراس',
    banquetHalls: 'قاعات الولائم',
    hourlyRooms: 'إقامات بالساعة',
    hotelsSuites: 'فنادق وأجنحة',
    pgHostels: 'سكن مشترك ونزل',
    sportsTurfs: 'ملاعب ورياضات',
    coachingClasses: 'قاعات تدريب وتعليم',
    studiosDance: 'استوديوهات ورقص',
    coworkingDesks: 'مساحات عمل مشتركة',

    capacity: 'السعة',
    guests: 'الضيوف',
    price: 'السعر',
    perSlot: '/ فترة',
    perHour: '/ ساعة',
    perDay: '/ يوم',
    verifiedBadge: 'موثوق',
    availableNow: 'متاح الآن',
    confirmBooking: 'تأكيد الحجز',
    close: 'إغلاق',
  },
};

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  languages: LanguageOption[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('bookmyspace_lang') as LanguageCode;
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('bookmyspace_lang', lang);
    } catch {
      // ignore
    }
  };

  const currentOption = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);
  const isRTL = currentOption?.dir === 'rtl';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
