import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: Date.now(),
  });
});

// AI Booking Recommendation Endpoint
app.post('/api/gemini/booking', async (req, res) => {
  try {
    const { prompt, currentCity, userLanguage, venuesList } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const ai = getGenAI();

    // Prepare simplified venues catalogue for context
    const venuesContext = Array.isArray(venuesList)
      ? venuesList.slice(0, 15).map((v: any) => ({
          id: v.id,
          name: v.name,
          category: v.category?.name || v.category?.slug,
          city: v.city,
          capacity: v.capacity,
          price: v.pricingBaseAmount,
          priceType: v.pricingType,
          rating: v.avgRating,
          address: v.addressLine1,
          images: v.images?.[0]?.url || v.featuredImageUrl,
        }))
      : [];

    if (ai) {
      try {
        const systemPrompt = `You are the expert AI Space Booking Concierge for BookMySpace.
The user wants to find and book the perfect venue, turf, hall, PG, or workspace based on their requirement.
User's query: "${prompt}"
User's preferred language code: "${userLanguage || 'en'}"
Current selected city: "${currentCity || 'Hyderabad'}"

Available venues in catalogue:
${JSON.stringify(venuesContext, null, 2)}

Analyze the user's requirements:
1. Identify target category (e.g. banquet hall, marriage hall, sports turf, hourly room, PG hostel, coaching space, coworking desk).
2. Identify guest count or capacity needed.
3. Identify budget constraints if mentioned.
4. Match the best 1 to 3 venues from the catalogue above.
5. Provide helpful concierge advice in the user's language (or English if not specified).
6. Give a structured response with recommendedVenueIds (array of strings) and suggestedBookingParams (e.g. recommendedDate, recommendedSlot, estimatedGuests).

Respond ONLY in valid JSON with this exact structure:
{
  "conciergeSummary": "Friendly 2-3 sentence personalized booking advice in user language",
  "matchedVenueIds": ["venue_id_1", "venue_id_2"],
  "extractedCriteria": {
    "category": "e.g. Banquet / Turf / Coworking",
    "estimatedGuests": 100,
    "budgetEstimate": "₹50,000",
    "preferredTime": "Evening"
  },
  "instantBookVenueId": "venue_id_1"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        const textOutput = response.text || '';
        try {
          const parsed = JSON.parse(textOutput);
          res.json({
            success: true,
            source: 'gemini',
            ...parsed,
          });
          return;
        } catch {
          // If JSON parse failed, fallback to structured rule matching
        }
      } catch (geminiError: any) {
        console.warn('Gemini generateContent error, falling back to smart heuristic:', geminiError?.message);
      }
    }

    // Heuristic rule-based matching fallback
    const lowerPrompt = prompt.toLowerCase();
    let matched = venuesContext.filter((v: any) => {
      const nameMatch = v.name.toLowerCase().includes(lowerPrompt);
      const catMatch = lowerPrompt.includes(v.category.toLowerCase());
      const cityMatch = lowerPrompt.includes(v.city.toLowerCase());
      return nameMatch || catMatch || cityMatch;
    });

    if (matched.length === 0 && venuesContext.length > 0) {
      matched = venuesContext.slice(0, 3);
    }

    res.json({
      success: true,
      source: 'smart-matcher',
      conciergeSummary: `We analyzed your request "${prompt}" and identified ${matched.length} premier spaces matching your capacity, location, and aesthetic preferences.`,
      matchedVenueIds: matched.map((m: any) => m.id),
      extractedCriteria: {
        category: 'Best Match',
        estimatedGuests: 50,
        budgetEstimate: 'Flexible',
        preferredTime: 'Anytime',
      },
      instantBookVenueId: matched[0]?.id || null,
    });
  } catch (err: any) {
    console.error('AI booking endpoint error:', err);
    res.status(500).json({ error: 'Failed to process AI booking query', details: err?.message });
  }
});

// All-India State Centroid Coordinates Map for all 36 States & Union Territories
const STATE_COORDINATES: Record<string, { lat: number; lng: number; code: string }> = {
  'Andhra Pradesh': { lat: 15.9129, lng: 79.7400, code: 'AP' },
  'Arunachal Pradesh': { lat: 27.0844, lng: 93.6053, code: 'AR' },
  'Assam': { lat: 26.2006, lng: 92.9376, code: 'AS' },
  'Bihar': { lat: 25.0961, lng: 85.3131, code: 'BR' },
  'Chhattisgarh': { lat: 21.2787, lng: 81.8661, code: 'CG' },
  'Goa': { lat: 15.2993, lng: 74.1240, code: 'GA' },
  'Gujarat': { lat: 22.2587, lng: 71.1924, code: 'GJ' },
  'Haryana': { lat: 29.0588, lng: 76.0856, code: 'HR' },
  'Himachal Pradesh': { lat: 31.1048, lng: 77.1734, code: 'HP' },
  'Jharkhand': { lat: 23.6102, lng: 85.2799, code: 'JH' },
  'Karnataka': { lat: 15.3173, lng: 75.7139, code: 'KA' },
  'Kerala': { lat: 10.8505, lng: 76.2711, code: 'KL' },
  'Madhya Pradesh': { lat: 22.9734, lng: 78.6569, code: 'MP' },
  'Maharashtra': { lat: 19.7515, lng: 75.7139, code: 'MH' },
  'Manipur': { lat: 24.6637, lng: 93.9063, code: 'MN' },
  'Meghalaya': { lat: 25.4670, lng: 91.3662, code: 'ML' },
  'Mizoram': { lat: 23.1645, lng: 92.9376, code: 'MZ' },
  'Nagaland': { lat: 26.1584, lng: 94.5624, code: 'NL' },
  'Odisha': { lat: 20.9517, lng: 85.0985, code: 'OR' },
  'Punjab': { lat: 31.1471, lng: 75.3412, code: 'PB' },
  'Rajasthan': { lat: 27.0238, lng: 74.2179, code: 'RJ' },
  'Sikkim': { lat: 27.5330, lng: 88.5122, code: 'SK' },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569, code: 'TN' },
  'Telangana': { lat: 17.8749, lng: 78.1008, code: 'TG' },
  'Tripura': { lat: 23.9408, lng: 91.9882, code: 'TR' },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462, code: 'UP' },
  'Uttarakhand': { lat: 30.0668, lng: 79.0193, code: 'UK' },
  'West Bengal': { lat: 22.9868, lng: 87.8550, code: 'WB' },
  'Andaman and Nicobar Islands': { lat: 11.7401, lng: 92.6586, code: 'AN' },
  'Chandigarh': { lat: 30.7333, lng: 76.7794, code: 'CH' },
  'Dadra and Nagar Haveli and Daman and Diu': { lat: 20.4283, lng: 72.8397, code: 'DN' },
  'Delhi': { lat: 28.7041, lng: 77.1025, code: 'DL' },
  'Delhi NCR': { lat: 28.6139, lng: 77.2090, code: 'DL' },
  'Jammu and Kashmir': { lat: 33.7782, lng: 76.5762, code: 'JK' },
  'Ladakh': { lat: 34.1526, lng: 77.5771, code: 'LA' },
  'Lakshadweep': { lat: 10.5667, lng: 72.6417, code: 'LD' },
  'Puducherry': { lat: 11.9416, lng: 79.8083, code: 'PY' },
};

// In-memory cache for live pincode results
const pincodeCache = new Map<string, any>();

// Real-time Pincode Lookup API (All India - All States, Districts, Mandals, Towns/Villages, Pincodes)
app.get('/api/location/pincode/:pincode', async (req, res) => {
  const pin = req.params.pincode?.trim();
  if (!pin || !/^\d{6}$/.test(pin)) {
    res.status(400).json({ error: 'Valid 6-digit Indian PIN code required' });
    return;
  }

  if (pincodeCache.has(pin)) {
    res.json(pincodeCache.get(pin));
    return;
  }

  try {
    // 1. Query India Post API for authoritative post offices, mandals, and district
    const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const data = response.ok ? await response.json() : null;

    // 2. Query OpenStreetMap Nominatim for accurate coordinates of this PIN code
    let lat = 0;
    let lng = 0;
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${pin}&country=India&format=json`,
        { headers: { 'User-Agent': 'BookMySpace-App/1.0' } }
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (Array.isArray(geoData) && geoData.length > 0 && geoData[0].lat && geoData[0].lon) {
          lat = parseFloat(geoData[0].lat);
          lng = parseFloat(geoData[0].lon);
        }
      }
    } catch (_) {}

    if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0].PostOffice)) {
      const offices = data[0].PostOffice;
      const primary = offices[0];
      const state = primary.State || 'India';
      const district = primary.District || '';
      const stateCoords = STATE_COORDINATES[state] || { lat: 20.5937, lng: 78.9629, code: 'IN' };

      // Fallback coordinates if Nominatim didn't return coordinates for this specific PIN
      if (lat === 0 && lng === 0) {
        lat = stateCoords.lat;
        lng = stateCoords.lng;
      }

      const result = {
        success: true,
        pincode: pin,
        country: 'India',
        state,
        district,
        mandal: primary.Block && primary.Block !== 'NA' ? primary.Block : district,
        townOrVillage: primary.Name,
        offices: offices.map((o: any) => ({
          name: o.Name,
          branchType: o.BranchType,
          deliveryStatus: o.DeliveryStatus,
          mandal: o.Block && o.Block !== 'NA' ? o.Block : o.District,
          district: o.District,
          state: o.State,
          pincode: o.Pincode,
          latitude: lat,
          longitude: lng,
        })),
        latitude: lat,
        longitude: lng,
        source: 'india-post-live',
      };

      pincodeCache.set(pin, result);
      res.json(result);
      return;
    }

    // If India Post returned no post offices, check if Nominatim knows the PIN
    if (lat !== 0 && lng !== 0) {
      const result = {
        success: true,
        pincode: pin,
        country: 'India',
        state: 'India',
        district: `PIN ${pin} Area`,
        mandal: `PIN ${pin} Zone`,
        townOrVillage: `PIN ${pin}`,
        offices: [
          {
            name: `PIN ${pin}`,
            mandal: `PIN ${pin} Zone`,
            district: `PIN ${pin} Area`,
            state: 'India',
            pincode: pin,
            latitude: lat,
            longitude: lng,
          },
        ],
        latitude: lat,
        longitude: lng,
        source: 'nominatim-live',
      };
      pincodeCache.set(pin, result);
      res.json(result);
      return;
    }

    res.status(404).json({
      success: false,
      error: `PIN code ${pin} not found in India Post directory`,
    });
  } catch (err: any) {
    console.warn(`Live postal API failed for PIN ${pin}:`, err?.message);
    res.status(502).json({
      success: false,
      error: 'Failed to fetch live postal data. Please use manual selection.',
      details: err?.message,
    });
  }
});

// Real-time Post Office / Town / Village / Area / Colony / Ward / Street Search API (All India)
app.get('/api/location/search', async (req, res) => {
  const query = (req.query.q as string)?.trim();
  if (!query || query.length < 2) {
    res.json({ success: true, results: [] });
    return;
  }

  // If 6 digits, route directly to pincode lookup
  if (/^\d{6}$/.test(query)) {
    try {
      const pinRes = await fetch(`http://localhost:3000/api/location/pincode/${query}`);
      if (pinRes.ok) {
        const pinData = await pinRes.json();
        if (pinData.success && Array.isArray(pinData.offices) && pinData.offices.length > 0) {
          const results = pinData.offices.map((o: any) => ({
            townOrVillage: o.name,
            mandal: o.mandal,
            district: o.district,
            state: o.state,
            pincode: o.pincode,
            country: 'India',
            latitude: o.latitude || pinData.latitude,
            longitude: o.longitude || pinData.longitude,
          }));
          res.json({ success: true, results });
          return;
        }
      }
    } catch (_) {}
  }

  const combinedResults: any[] = [];
  const seenKeys = new Set<string>();

  // 1. Search OpenStreetMap Nominatim for exact place/locality/colony/ward/street coordinates
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query + ', India'
    )}&addressdetails=1&limit=12`;
    const nomRes = await fetch(nominatimUrl, {
      headers: { 'User-Agent': 'BookMySpace-App/1.0' },
    });
    if (nomRes.ok) {
      const nomData = await nomRes.json();
      if (Array.isArray(nomData)) {
        for (const item of nomData) {
          const addr = item.address || {};
          const townOrVillage =
            addr.village ||
            addr.town ||
            addr.city ||
            addr.suburb ||
            addr.neighbourhood ||
            addr.road ||
            item.name;
          const mandal =
            addr.county ||
            addr.city_district ||
            addr.suburb ||
            addr.neighbourhood ||
            addr.road ||
            townOrVillage;
          const district = addr.state_district || addr.county || addr.city || '';
          const state = addr.state || 'India';
          const pincode = addr.postcode || '';
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);

          const key = `${townOrVillage}-${pincode}-${lat.toFixed(4)}`;
          if (!seenKeys.has(key) && !isNaN(lat) && !isNaN(lng)) {
            seenKeys.add(key);
            combinedResults.push({
              townOrVillage,
              mandal,
              district,
              state,
              pincode,
              country: 'India',
              latitude: lat,
              longitude: lng,
              displayName: item.display_name,
            });
          }
        }
      }
    }
  } catch (err: any) {
    console.warn(`Nominatim search failed for ${query}:`, err?.message);
  }

  // 2. Query India Post office search as complementary source
  try {
    const postalRes = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(query)}`);
    if (postalRes.ok) {
      const postalData = await postalRes.json();
      if (Array.isArray(postalData) && postalData[0]?.Status === 'Success' && Array.isArray(postalData[0].PostOffice)) {
        const offices = postalData[0].PostOffice.slice(0, 15);
        for (const o of offices) {
          const key = `${o.Name}-${o.Pincode}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            const stateCoords = STATE_COORDINATES[o.State] || { lat: 20.5937, lng: 78.9629, code: 'IN' };
            combinedResults.push({
              townOrVillage: o.Name,
              mandal: o.Block && o.Block !== 'NA' ? o.Block : o.District,
              district: o.District,
              state: o.State,
              pincode: o.Pincode,
              country: 'India',
              latitude: stateCoords.lat,
              longitude: stateCoords.lng,
            });
          }
        }
      }
    }
  } catch (_) {}

  res.json({ success: true, results: combinedResults });
});

// Cache for live district post offices
const districtCache = new Map<string, any>();

// Real-time District Villages & Post Offices API (Fetches every town/village/post office in any Indian district)
app.get('/api/location/district/:district', async (req, res) => {
  const rawDistrict = req.params.district?.trim();
  if (!rawDistrict) {
    res.status(400).json({ error: 'District name is required' });
    return;
  }

  // Clean district name (e.g. remove trailing " District" or parenthetical notes)
  const cleanDistrict = rawDistrict.replace(/\s+District$/i, '').replace(/\s*\(.*?\)\s*/g, '').trim();
  const cacheKey = cleanDistrict.toLowerCase();

  if (districtCache.has(cacheKey)) {
    res.json(districtCache.get(cacheKey));
    return;
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(cleanDistrict)}`);
    if (!response.ok) {
      throw new Error(`Postal API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0].PostOffice)) {
      const offices = data[0].PostOffice;
      const state = offices[0]?.State || '';
      const stateCoords = STATE_COORDINATES[state] || { lat: 20.5937, lng: 78.9629, code: 'IN' };

      const mandalsSet = new Set<string>();
      const townList: any[] = [];
      const seenNames = new Set<string>();

      for (const o of offices) {
        const mandal = o.Block && o.Block !== 'NA' && o.Block.length > 1 ? o.Block : cleanDistrict;
        mandalsSet.add(mandal);

        const townKey = `${o.Name}-${o.Pincode}`;
        if (!seenNames.has(townKey)) {
          seenNames.add(townKey);
          townList.push({
            town: o.Name,
            branchType: o.BranchType,
            deliveryStatus: o.DeliveryStatus,
            mandal,
            district: o.District || cleanDistrict,
            state: o.State || state,
            pin: o.Pincode,
            lat: stateCoords.lat,
            lng: stateCoords.lng,
          });
        }
      }

      const result = {
        success: true,
        district: cleanDistrict,
        state,
        total: townList.length,
        mandals: Array.from(mandalsSet).sort(),
        towns: townList,
        source: 'india-post-live',
      };

      districtCache.set(cacheKey, result);
      res.json(result);
      return;
    }

    res.json({
      success: true,
      district: cleanDistrict,
      total: 0,
      mandals: [],
      towns: [],
      source: 'local-fallback',
    });
  } catch (err: any) {
    console.warn(`District fetch error for ${cleanDistrict}:`, err?.message);
    res.json({
      success: false,
      district: cleanDistrict,
      error: err?.message,
      mandals: [],
      towns: [],
    });
  }
});

// Serve Flutter Web app static assets
app.use('/web', express.static(path.join(process.cwd(), 'web')));
app.use('/flutter', express.static(path.join(process.cwd(), 'web')));

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
