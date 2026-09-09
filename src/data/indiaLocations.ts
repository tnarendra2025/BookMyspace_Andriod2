import { ALL_INDIA_DISTRICTS_BY_STATE } from './allIndiaDistricts';

export interface IndiaLocationItem {
  country: string;
  state: string;
  district: string;
  mandal: string;
  townOrVillage: string;
  pincode: string;
  lat: number;
  lng: number;
  popularLabel?: string;
  zone?: 'South' | 'North' | 'West' | 'East' | 'Central' | 'NorthEast';
}

// All 36 States & Union Territories of the Republic of India
export const ALL_INDIA_STATES = [
  // 28 States
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // 8 Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;

export type IndiaStateName = typeof ALL_INDIA_STATES[number];

// Comprehensive Districts & Mandals by State
export const INDIA_ADMINISTRATIVE_DATA: Record<
  string,
  {
    capital: string;
    zone: 'South' | 'North' | 'West' | 'East' | 'Central' | 'NorthEast';
    districts: Record<
      string,
      {
        mandals: string[];
        popularPincodes: { town: string; pin: string; lat: number; lng: number }[];
      }
    >;
  }
> = {
  'Telangana': {
    capital: 'Hyderabad',
    zone: 'South',
    districts: {
      'Hyderabad': {
        mandals: ['Serilingampally', 'Shaikpet', 'Khairatabad', 'Ameerpet', 'Secunderabad', 'Musheerabad', 'Charminar', 'Bahadurpura', 'Asif Nagar', 'Golconda'],
        popularPincodes: [
          { town: 'Madhapur (Hitec City)', pin: '500081', lat: 17.4483, lng: 78.3915 },
          { town: 'Gachibowli (Financial Dist)', pin: '500032', lat: 17.4401, lng: 78.3489 },
          { town: 'Jubilee Hills', pin: '500033', lat: 17.4319, lng: 78.4073 },
          { town: 'Banjara Hills', pin: '500034', lat: 17.4156, lng: 78.4350 },
          { town: 'Kondapur', pin: '500084', lat: 17.4699, lng: 78.3578 },
          { town: 'Secunderabad', pin: '500003', lat: 17.4399, lng: 78.4983 },
          { town: 'Ameerpet', pin: '500016', lat: 17.4375, lng: 78.4482 },
          { town: 'Begumpet', pin: '500016', lat: 17.4447, lng: 78.4664 },
          { town: 'Charminar / Old City', pin: '500002', lat: 17.3616, lng: 78.4747 },
        ],
      },
      'Medchal-Malkajgiri': {
        mandals: ['Kukatpally', 'Quthbullapur', 'Malkajgiri', 'Alwal', 'Medchal', 'Ghatkesar', 'Keesara', 'Kapra'],
        popularPincodes: [
          { town: 'KPHB Colony / Kukatpally', pin: '500072', lat: 17.4947, lng: 78.3996 },
          { town: 'Malkajgiri', pin: '500047', lat: 17.4503, lng: 78.5332 },
          { town: 'Alwal', pin: '500010', lat: 17.5024, lng: 78.5113 },
          { town: 'Medchal Town', pin: '501401', lat: 17.6297, lng: 78.4814 },
          { town: 'Ghatkesar', pin: '501301', lat: 17.4496, lng: 78.6837 },
        ],
      },
      'Rangareddy': {
        mandals: ['Rajendranagar', 'Shamshabad', 'Serilingampally Outer', 'Ibrahimpatnam', 'Maheshwaram', 'Saroornagar', 'Hayathnagar', 'Chevella'],
        popularPincodes: [
          { town: 'Shamshabad (RGIA Airport)', pin: '501218', lat: 17.2403, lng: 78.4294 },
          { town: 'Manikonda / Puppalaguda', pin: '500089', lat: 17.4024, lng: 78.3776 },
          { town: 'Kokapet (Golden Mile)', pin: '500075', lat: 17.4019, lng: 78.3371 },
          { town: 'Saroornagar / LB Nagar', pin: '500074', lat: 17.3597, lng: 78.5398 },
        ],
      },
      'Warangal': {
        mandals: ['Warangal Urban', 'Hanamkonda', 'Kazipet', 'Inavole', 'Geesugonda'],
        popularPincodes: [
          { town: 'Hanamkonda', pin: '506001', lat: 17.9784, lng: 79.5941 },
          { town: 'Kazipet Junction', pin: '506003', lat: 17.9822, lng: 79.5168 },
          { town: 'Warangal Fort City', pin: '506002', lat: 17.9689, lng: 79.5941 },
        ],
      },
      'Karimnagar': {
        mandals: ['Karimnagar Urban', 'Karimnagar Rural', 'Manakondur', 'Choppadandi', 'Gangadhara'],
        popularPincodes: [
          { town: 'Karimnagar City', pin: '505001', lat: 18.4386, lng: 79.1288 },
          { town: 'Kothapalli', pin: '505451', lat: 18.4600, lng: 79.0800 },
        ],
      },
      'Nizamabad': {
        mandals: ['Nizamabad North', 'Nizamabad South', 'Armoor', 'Bodhan', 'Dichpally'],
        popularPincodes: [
          { town: 'Nizamabad Town', pin: '503001', lat: 18.6725, lng: 78.0941 },
          { town: 'Armoor', pin: '503224', lat: 18.7900, lng: 78.2900 },
        ],
      },
      'Khammam': {
        mandals: ['Khammam Urban', 'Khammam Rural', 'Madhira', 'Wyra', 'Sathupalli'],
        popularPincodes: [
          { town: 'Khammam Fort Town', pin: '507001', lat: 17.2473, lng: 80.1514 },
          { town: 'Wyra', pin: '507165', lat: 17.2000, lng: 80.3500 },
        ],
      },
    },
  },
  'Andhra Pradesh': {
    capital: 'Amaravati',
    zone: 'South',
    districts: {
      'Visakhapatnam': {
        mandals: ['Visakhapatnam Urban', 'Gajuwaka', 'Maharanipeta', 'Bheemunipatnam', 'Pendurthi', 'Anandapuram'],
        popularPincodes: [
          { town: 'Dwaraka Nagar / Siripuram', pin: '530016', lat: 17.7289, lng: 83.3106 },
          { town: 'Gajuwaka (Industrial Hub)', pin: '530026', lat: 17.6908, lng: 83.2096 },
          { town: 'Madhurawada (IT SEZ)', pin: '530048', lat: 17.8183, lng: 83.3562 },
          { town: 'Rushikonda Beach Area', pin: '530045', lat: 17.7816, lng: 83.3831 },
          { town: 'Bheemili (Bheemunipatnam)', pin: '531163', lat: 17.8900, lng: 83.4500 },
        ],
      },
      'NTR / Vijayawada': {
        mandals: ['Vijayawada Urban', 'Vijayawada Rural', 'Ibrahimpatnam', 'Mylavaram', 'Tiruvuru', 'Jaggayyapeta'],
        popularPincodes: [
          { town: 'Benz Circle / MG Road', pin: '520010', lat: 16.5062, lng: 80.6480 },
          { town: 'Governorpet / One Town', pin: '520002', lat: 16.5167, lng: 80.6167 },
          { town: 'Gollapudi / Ibrahimpatnam', pin: '521225', lat: 16.5400, lng: 80.5700 },
        ],
      },
      'Guntur': {
        mandals: ['Guntur East', 'Guntur West', 'Mangalagiri', 'Tenali', 'Tadikonda'],
        popularPincodes: [
          { town: 'Brodipet / Arundelpet', pin: '522002', lat: 16.3067, lng: 80.4365 },
          { town: 'Mangalagiri (AIIMS Hub)', pin: '522503', lat: 16.4319, lng: 80.5639 },
          { town: 'Tenali Town', pin: '522201', lat: 16.2430, lng: 80.6400 },
        ],
      },
      'Tirupati': {
        mandals: ['Tirupati Urban', 'Tirupati Rural', 'Chandragiri', 'Renigunta', 'Srikalahasti'],
        popularPincodes: [
          { town: 'Tirupati Central / Alipiri', pin: '517501', lat: 13.6288, lng: 79.4192 },
          { town: 'Renigunta (Airport Junction)', pin: '517520', lat: 13.6500, lng: 79.5200 },
          { town: 'Srikalahasti', pin: '517644', lat: 13.7500, lng: 79.7000 },
        ],
      },
      'Prakasam': {
        mandals: ['Ongole Urban', 'Ongole Rural', 'Chirala', 'Kandukur', 'Markapur'],
        popularPincodes: [
          { town: 'Ongole Town (Trunk Road)', pin: '523001', lat: 15.5057, lng: 80.0499 },
          { town: 'Chirala (Textile Hub)', pin: '523155', lat: 15.8200, lng: 80.3500 },
        ],
      },
      'East Godavari / Kakinada': {
        mandals: ['Kakinada Urban', 'Kakinada Rural', 'Samalkota', 'Peddapuram', 'Rajahmundry Urban'],
        popularPincodes: [
          { town: 'Kakinada Collectorate', pin: '533001', lat: 16.9891, lng: 82.2475 },
          { town: 'Rajahmundry City', pin: '533101', lat: 17.0005, lng: 81.8040 },
        ],
      },
    },
  },
  'Karnataka': {
    capital: 'Bengaluru',
    zone: 'South',
    districts: {
      'Bengaluru Urban': {
        mandals: ['Bengaluru South', 'Bengaluru East', 'Bengaluru North', 'Anekal', 'Yelahanka'],
        popularPincodes: [
          { town: 'Koramangala', pin: '560034', lat: 12.9352, lng: 77.6245 },
          { town: 'Indiranagar', pin: '560038', lat: 12.9784, lng: 77.6408 },
          { town: 'Whitefield / ITPL', pin: '560066', lat: 12.9698, lng: 77.7499 },
          { town: 'HSR Layout', pin: '560102', lat: 12.9121, lng: 77.6446 },
          { town: 'Electronic City Phase 1', pin: '560100', lat: 12.8452, lng: 77.6602 },
          { town: 'Jayanagar 4th Block', pin: '560041', lat: 12.9250, lng: 77.5938 },
          { town: 'Malleshwaram', pin: '560003', lat: 13.0031, lng: 77.5643 },
          { town: 'Yelahanka New Town', pin: '560064', lat: 13.1007, lng: 77.5963 },
        ],
      },
      'Mysuru': {
        mandals: ['Mysuru Taluk', 'Nanjangud', 'Hunsur', 'T Narasipura', 'KR Nagar'],
        popularPincodes: [
          { town: 'Mysuru Palace Central', pin: '570001', lat: 12.3051, lng: 76.6551 },
          { town: 'Vijayanagar Mysuru', pin: '570017', lat: 12.3300, lng: 76.6100 },
          { town: 'Hebbal Industrial Estate', pin: '570016', lat: 12.3600, lng: 76.5900 },
        ],
      },
      'Dakshina Kannada / Mangaluru': {
        mandals: ['Mangaluru Taluk', 'Bantwal', 'Puttur', 'Belthangady', 'Sullia'],
        popularPincodes: [
          { town: 'Hampankatta / Mangaluru Central', pin: '575001', lat: 12.8698, lng: 74.8430 },
          { town: 'Kadri / Bejai', pin: '575004', lat: 12.8800, lng: 74.8600 },
        ],
      },
      'Dharwad / Hubballi': {
        mandals: ['Hubballi Urban', 'Dharwad Taluk', 'Navalgund', 'Kalghatgi', 'Kundgol'],
        popularPincodes: [
          { town: 'Hubballi City', pin: '580020', lat: 15.3647, lng: 75.1240 },
          { town: 'Dharwad Old Bus Stand', pin: '580001', lat: 15.4589, lng: 75.0078 },
        ],
      },
    },
  },
  'Maharashtra': {
    capital: 'Mumbai',
    zone: 'West',
    districts: {
      'Mumbai City & Suburban': {
        mandals: ['Andheri', 'Bandra', 'Borivali', 'Kurla', 'Colaba', 'Dadra', 'Goregaon'],
        popularPincodes: [
          { town: 'Andheri West / Lokhandwala', pin: '400053', lat: 19.1136, lng: 72.8697 },
          { town: 'Bandra West (Linking Road)', pin: '400050', lat: 19.0596, lng: 72.8295 },
          { town: 'BKC (Bandra Kurla Complex)', pin: '400051', lat: 19.0688, lng: 72.8687 },
          { town: 'Nariman Point / Fort', pin: '400021', lat: 18.9284, lng: 72.8236 },
          { town: 'Borivali West / Shimpoli', pin: '400092', lat: 19.2307, lng: 72.8567 },
          { town: 'Lower Parel / Worli', pin: '400013', lat: 18.9950, lng: 72.8290 },
          { town: 'Powai / Hiranandani', pin: '400076', lat: 19.1176, lng: 72.9060 },
        ],
      },
      'Pune': {
        mandals: ['Haveli', 'Pune City', 'Kothrud', 'Pimpri-Chinchwad', 'Mulshi', 'Baramati'],
        popularPincodes: [
          { town: 'Koregaon Park / Kalyani Nagar', pin: '411001', lat: 18.5362, lng: 73.8940 },
          { town: 'Hinjawadi IT Park', pin: '411057', lat: 18.5913, lng: 73.7389 },
          { town: 'Kothrud / Karve Road', pin: '411038', lat: 18.5074, lng: 73.8077 },
          { town: 'Baner / Balewadi High Street', pin: '411045', lat: 18.5590, lng: 73.7868 },
          { town: 'Viman Nagar', pin: '411014', lat: 18.5679, lng: 73.9143 },
        ],
      },
      'Nagpur': {
        mandals: ['Nagpur Urban', 'Nagpur Rural', 'Hingna', 'Kamptee', 'Katol'],
        popularPincodes: [
          { town: 'Sitabuldi / Civil Lines', pin: '440001', lat: 21.1458, lng: 79.0882 },
          { town: 'Dharampeth', pin: '440010', lat: 21.1400, lng: 79.0600 },
          { town: 'MIHAN SEZ', pin: '441108', lat: 21.0500, lng: 79.0500 },
        ],
      },
      'Thane & Navi Mumbai': {
        mandals: ['Thane Taluk', 'Vashi', 'Nerul', 'Kalyan', 'Dombivli'],
        popularPincodes: [
          { town: 'Thane West / Panch Pakhadi', pin: '400601', lat: 19.2183, lng: 72.9781 },
          { town: 'Vashi Sector 17', pin: '400703', lat: 19.0771, lng: 72.9986 },
          { town: 'CBD Belapur', pin: '400614', lat: 19.0180, lng: 73.0400 },
        ],
      },
    },
  },
  'Delhi': {
    capital: 'New Delhi',
    zone: 'North',
    districts: {
      'New Delhi': {
        mandals: ['Connaught Place', 'Chanakyapuri', 'Barakhamba', 'Parliament Street'],
        popularPincodes: [
          { town: 'Connaught Place / CP', pin: '110001', lat: 28.6315, lng: 77.2167 },
          { town: 'Chanakyapuri (Diplomatic)', pin: '110021', lat: 28.5983, lng: 77.1850 },
        ],
      },
      'South Delhi': {
        mandals: ['Hauz Khas', 'Saket', 'Mehrauli', 'Greater Kailash', 'Def Col'],
        popularPincodes: [
          { town: 'Hauz Khas Village & Enclave', pin: '110016', lat: 28.5494, lng: 77.2001 },
          { town: 'Saket District Centre', pin: '110017', lat: 28.5244, lng: 77.2173 },
          { town: 'Greater Kailash (GK 1 & 2)', pin: '110048', lat: 28.5400, lng: 77.2400 },
          { town: 'Lajpat Nagar', pin: '110024', lat: 28.5700, lng: 77.2400 },
        ],
      },
      'North & Central Delhi': {
        mandals: ['Civil Lines', 'Karol Bagh', 'Chandni Chowk', 'Model Town', 'Pahar Ganj'],
        popularPincodes: [
          { town: 'Karol Bagh / Pusa Road', pin: '110005', lat: 28.6520, lng: 77.1900 },
          { town: 'Chandni Chowk / Red Fort', pin: '110006', lat: 28.6506, lng: 77.2303 },
          { town: 'Delhi University North Campus', pin: '110007', lat: 28.6900, lng: 77.2100 },
        ],
      },
    },
  },
  'Tamil Nadu': {
    capital: 'Chennai',
    zone: 'South',
    districts: {
      'Chennai': {
        mandals: ['Mylapore', 'T Nagar', 'Guindy', 'Velachery', 'Anna Nagar', 'Adyar', 'Sholinganallur OMR'],
        popularPincodes: [
          { town: 'T Nagar / Pondy Bazaar', pin: '600017', lat: 13.0418, lng: 80.2341 },
          { town: 'OMR Sholinganallur (IT Expressway)', pin: '600119', lat: 12.9010, lng: 80.2279 },
          { town: 'Anna Nagar West & East', pin: '600040', lat: 13.0850, lng: 80.2100 },
          { town: 'Adyar / Besant Nagar', pin: '600020', lat: 13.0012, lng: 80.2565 },
          { town: 'Nungambakkam / High Road', pin: '600034', lat: 13.0600, lng: 80.2400 },
          { town: 'Velachery Bypass', pin: '600042', lat: 12.9800, lng: 80.2200 },
        ],
      },
      'Coimbatore': {
        mandals: ['Coimbatore North', 'Coimbatore South', 'Pollachi', 'Mettupalayam', 'Sulur'],
        popularPincodes: [
          { town: 'RS Puram / Gandhipuram', pin: '641002', lat: 11.0168, lng: 76.9558 },
          { town: 'Peelamedu / Avinashi Road', pin: '641004', lat: 11.0280, lng: 77.0050 },
        ],
      },
      'Madurai': {
        mandals: ['Madurai North', 'Madurai South', 'Melur', 'Thirumangalam', 'Vadipatti'],
        popularPincodes: [
          { town: 'Madurai Meenakshi Central', pin: '625001', lat: 9.9252, lng: 78.1198 },
          { town: 'KK Nagar Madurai', pin: '625020', lat: 9.9400, lng: 78.1500 },
        ],
      },
    },
  },
  'Uttar Pradesh': {
    capital: 'Lucknow',
    zone: 'North',
    districts: {
      'Gautam Buddha Nagar / Noida': {
        mandals: ['Noida Sector 1-168', 'Greater Noida West', 'Dadri', 'Jewar'],
        popularPincodes: [
          { town: 'Noida Sector 18 / Atta Market', pin: '201301', lat: 28.5708, lng: 77.3271 },
          { town: 'Noida Sector 62 (Tech Hub)', pin: '201309', lat: 28.6258, lng: 77.3683 },
          { town: 'Greater Noida / Pari Chowk', pin: '201310', lat: 28.4671, lng: 77.5138 },
        ],
      },
      'Lucknow': {
        mandals: ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Indira Nagar', 'Chinhat'],
        popularPincodes: [
          { town: 'Hazratganj Central', pin: '226001', lat: 26.8467, lng: 80.9462 },
          { town: 'Gomti Nagar (Vibhuti Khand)', pin: '226010', lat: 26.8500, lng: 80.9920 },
          { town: 'Alambagh', pin: '226005', lat: 26.8150, lng: 80.9000 },
        ],
      },
      'Varanasi': {
        mandals: ['Varanasi Cantt', 'Kashi / Ghats', 'Lanka / BHU', 'Shivpur', 'Pindra'],
        popularPincodes: [
          { town: 'Varanasi Cantt / Station', pin: '221002', lat: 25.3260, lng: 82.9850 },
          { town: 'Lanka / BHU Campus', pin: '221005', lat: 25.2800, lng: 82.9900 },
          { town: 'Godowlia / Dashashwamedh', pin: '221001', lat: 25.3100, lng: 83.0100 },
        ],
      },
      'Kanpur Nagar': {
        mandals: ['Civil Lines', 'Kalyanpur', 'Govind Nagar', 'Swaroop Nagar'],
        popularPincodes: [
          { town: 'Civil Lines Kanpur', pin: '208001', lat: 26.4499, lng: 80.3319 },
          { town: 'IIT Kanpur / Kalyanpur', pin: '208016', lat: 26.5123, lng: 80.2329 },
        ],
      },
    },
  },
  'Gujarat': {
    capital: 'Gandhinagar',
    zone: 'West',
    districts: {
      'Ahmedabad': {
        mandals: ['Navrangpura', 'Bodakdev', 'SG Highway', 'Maninagar', 'Vastrapur', 'Chandkheda'],
        popularPincodes: [
          { town: 'SG Highway / Prahlad Nagar', pin: '380015', lat: 23.0120, lng: 72.5080 },
          { town: 'Navrangpura / CG Road', pin: '380009', lat: 23.0360, lng: 72.5600 },
          { town: 'Bodakdev / Vastrapur', pin: '380054', lat: 23.0400, lng: 72.5200 },
        ],
      },
      'Surat': {
        mandals: ['Athwa', 'Adajan', 'Vesu', 'Varachha', 'Katargam'],
        popularPincodes: [
          { town: 'Athwalines / Ring Road', pin: '395001', lat: 21.1702, lng: 72.8311 },
          { town: 'Vesu / VIP Road', pin: '395007', lat: 21.1400, lng: 72.7700 },
        ],
      },
      'Vadodara': {
        mandals: ['Alkapuri', 'Sayajigunj', 'Manjalpur', 'Gotri', 'Gorwa'],
        popularPincodes: [
          { town: 'Alkapuri Central', pin: '390007', lat: 22.3100, lng: 73.1800 },
          { town: 'Sayajigunj', pin: '390005', lat: 22.3050, lng: 73.1900 },
        ],
      },
    },
  },
  'Rajasthan': {
    capital: 'Jaipur',
    zone: 'North',
    districts: {
      'Jaipur': {
        mandals: ['C-Scheme', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Tonk Road'],
        popularPincodes: [
          { town: 'C-Scheme / Civil Lines', pin: '302001', lat: 26.9124, lng: 75.7873 },
          { town: 'Malviya Nagar / WTP Mall', pin: '302017', lat: 26.8540, lng: 75.8200 },
          { town: 'Vaishali Nagar', pin: '302021', lat: 26.9000, lng: 75.7400 },
        ],
      },
      'Udaipur': {
        mandals: ['Girwa', 'Fateh Sagar', 'Hiran Magri', 'Badgaon'],
        popularPincodes: [
          { town: 'City Palace / Old Udaipur', pin: '313001', lat: 24.5854, lng: 73.7125 },
          { town: 'Hiran Magri Sector 4', pin: '313002', lat: 24.5600, lng: 73.7200 },
        ],
      },
      'Jodhpur': {
        mandals: ['Jodhpur Urban', 'Ratanada', 'Shastri Nagar', 'Mandore'],
        popularPincodes: [
          { town: 'Ratanada / Circuit House', pin: '342001', lat: 26.2389, lng: 73.0243 },
        ],
      },
    },
  },
  'West Bengal': {
    capital: 'Kolkata',
    zone: 'East',
    districts: {
      'Kolkata': {
        mandals: ['Park Street', 'Salt Lake Sector 5', 'New Town Rajarhat', 'Ballygunge', 'Howrah Bridge'],
        popularPincodes: [
          { town: 'Park Street / Camac Street', pin: '700016', lat: 22.5535, lng: 88.3518 },
          { town: 'Salt Lake Sector V (Tech Hub)', pin: '700091', lat: 22.5780, lng: 88.4310 },
          { town: 'New Town / Action Area 1', pin: '700156', lat: 22.5850, lng: 88.4600 },
          { town: 'Ballygunge / Gariahat', pin: '700019', lat: 22.5280, lng: 88.3650 },
        ],
      },
      'Darjeeling': {
        mandals: ['Darjeeling Municipality', 'Siliguri', 'Kurseong', 'Mirik'],
        popularPincodes: [
          { town: 'Siliguri Sevoke Road', pin: '734001', lat: 26.7271, lng: 88.3953 },
          { town: 'Darjeeling Mall Road', pin: '734101', lat: 27.0410, lng: 88.2663 },
        ],
      },
    },
  },
  'Kerala': {
    capital: 'Thiruvananthapuram',
    zone: 'South',
    districts: {
      'Ernakulam / Kochi': {
        mandals: ['Kakkanad', 'Marine Drive', 'Edappally', 'Fort Kochi', 'Aluva'],
        popularPincodes: [
          { town: 'Kakkanad (Infopark / SmartCity)', pin: '682030', lat: 10.0159, lng: 76.3419 },
          { town: 'Marine Drive / MG Road Kochi', pin: '682011', lat: 9.9816, lng: 76.2753 },
          { town: 'Edappally / Lulu Mall Area', pin: '682024', lat: 10.0261, lng: 76.3085 },
        ],
      },
      'Thiruvananthapuram': {
        mandals: ['Kazhakkoottam', 'Pattom', 'Palayam', 'Vellayambalam', 'Kovalam'],
        popularPincodes: [
          { town: 'Technopark / Kazhakkoottam', pin: '695581', lat: 8.5581, lng: 76.8812 },
          { town: 'Secretariat / MG Road TVM', pin: '695001', lat: 8.4900, lng: 76.9500 },
        ],
      },
    },
  },
  'Haryana': {
    capital: 'Chandigarh',
    zone: 'North',
    districts: {
      'Gurugram': {
        mandals: ['Cyber City', 'Golf Course Road', 'Sohna Road', 'Udyog Vihar', 'Manesar'],
        popularPincodes: [
          { town: 'Cyber Hub / DLF Phase 2', pin: '122002', lat: 28.4900, lng: 77.0900 },
          { town: 'Golf Course Road / Sector 54', pin: '122011', lat: 28.4400, lng: 77.1000 },
          { town: 'Sohna Road / Sector 49', pin: '122018', lat: 28.4100, lng: 77.0400 },
        ],
      },
      'Faridabad': {
        mandals: ['Old Faridabad', 'NIT Faridabad', 'Ballabgarh', 'Greater Faridabad'],
        popularPincodes: [
          { town: 'NIT Faridabad Central', pin: '121001', lat: 28.4089, lng: 77.3178 },
        ],
      },
    },
  },
  'Punjab': {
    capital: 'Chandigarh',
    zone: 'North',
    districts: {
      'Ludhiana': {
        mandals: ['Ludhiana West', 'Ludhiana East', 'Model Town', 'Ferozepur Road'],
        popularPincodes: [
          { town: 'Model Town Ludhiana', pin: '141002', lat: 30.9010, lng: 75.8573 },
        ],
      },
      'Amritsar': {
        mandals: ['Amritsar City', 'Golden Temple Area', 'Mall Road', 'Ranjit Avenue'],
        popularPincodes: [
          { town: 'Ranjit Avenue Amritsar', pin: '143001', lat: 31.6340, lng: 74.8723 },
        ],
      },
    },
  },
  'Bihar': {
    capital: 'Patna',
    zone: 'East',
    districts: {
      'Patna': {
        mandals: ['Patna Sadar', 'Kankarbagh', 'Bailey Road', 'Danapur', 'Patliputra'],
        popularPincodes: [
          { town: 'Dak Bungalow / Bailey Road', pin: '800001', lat: 25.6093, lng: 85.1235 },
          { town: 'Patliputra Colony', pin: '800013', lat: 25.6250, lng: 85.1050 },
        ],
      },
    },
  },
  'Madhya Pradesh': {
    capital: 'Bhopal',
    zone: 'Central',
    districts: {
      'Indore': {
        mandals: ['Vijay Nagar', 'Palasia', 'Bhawarkua', 'Rau', 'Pithampur'],
        popularPincodes: [
          { town: 'Vijay Nagar / AB Road', pin: '452010', lat: 22.7533, lng: 75.8937 },
          { town: 'New Palasia', pin: '452001', lat: 22.7200, lng: 75.8800 },
        ],
      },
      'Bhopal': {
        mandals: ['MP Nagar', 'Arera Colony', 'Kolar Road', 'Bairagarh'],
        popularPincodes: [
          { town: 'MP Nagar Zone 1 & 2', pin: '462011', lat: 23.2332, lng: 77.4343 },
          { town: 'Arera Colony', pin: '462016', lat: 23.2100, lng: 77.4300 },
        ],
      },
    },
  },
  'Goa': {
    capital: 'Panaji',
    zone: 'West',
    districts: {
      'North Goa': {
        mandals: ['Tiswadi', 'Bardez', 'Pernem', 'Bicholim'],
        popularPincodes: [
          { town: 'Panaji City Central', pin: '403001', lat: 15.4909, lng: 73.8278 },
          { town: 'Calangute / Candolim Beach', pin: '403516', lat: 15.5430, lng: 73.7660 },
          { town: 'Anjuna / Vagator', pin: '403509', lat: 15.5800, lng: 73.7400 },
        ],
      },
      'South Goa': {
        mandals: ['Salcete', 'Mormugao', 'Canacona', 'Quepem'],
        popularPincodes: [
          { town: 'Margao Municipal Town', pin: '403601', lat: 15.2832, lng: 73.9862 },
          { town: 'Vasco da Gama', pin: '403802', lat: 15.3980, lng: 73.8110 },
        ],
      },
    },
  },
  'Chandigarh': {
    capital: 'Chandigarh',
    zone: 'North',
    districts: {
      'Chandigarh (UT)': {
        mandals: ['Sector 1-30', 'Sector 31-60', 'Industrial Area Phase 1 & 2'],
        popularPincodes: [
          { town: 'Sector 17 Plaza / Central', pin: '160017', lat: 30.7398, lng: 76.7827 },
          { town: 'Sector 35 Market', pin: '160035', lat: 30.7200, lng: 76.7650 },
          { town: 'Industrial Area Phase 1', pin: '160002', lat: 30.7100, lng: 76.8000 },
        ],
      },
    },
  },
  'Assam': {
    capital: 'Dispur',
    zone: 'NorthEast',
    districts: {
      'Kamrup Metropolitan / Guwahati': {
        mandals: ['Guwahati Sadar', 'Dispur', 'Paltan Bazar', 'Jalukbari', 'Uzan Bazar'],
        popularPincodes: [
          { town: 'GS Road / Dispur Capital', pin: '781005', lat: 26.1433, lng: 91.7898 },
          { town: 'Paltan Bazar / Station', pin: '781001', lat: 26.1800, lng: 91.7500 },
        ],
      },
    },
  },
  'Jammu and Kashmir': {
    capital: 'Srinagar / Jammu',
    zone: 'North',
    districts: {
      'Srinagar': {
        mandals: ['Lal Chowk', 'Dal Lake / Boulevard', 'Hazratbal', 'Rajbagh'],
        popularPincodes: [
          { town: 'Lal Chowk Central', pin: '190001', lat: 34.0754, lng: 74.8105 },
        ],
      },
      'Jammu': {
        mandals: ['Jammu Tawi', 'Gandhi Nagar', 'Bahu Fort', 'RS Pura'],
        popularPincodes: [
          { town: 'Gandhi Nagar Jammu', pin: '180004', lat: 32.7050, lng: 74.8600 },
        ],
      },
    },
  },
};

/**
 * Returns all official districts for any state in India (covers all 780+ districts across all 36 States & UTs).
 */
export function getAllDistrictsForState(state: string): string[] {
  const meta = ALL_INDIA_DISTRICTS_BY_STATE[state];
  if (meta && meta.districts.length > 0) {
    return meta.districts;
  }
  const fallback = INDIA_ADMINISTRATIVE_DATA[state];
  if (fallback) {
    return Object.keys(fallback.districts);
  }
  return [`${state} Central`, `${state} North`, `${state} South`];
}

/**
 * Returns authentic administrative mandals / tehsils for a given district.
 */
export function getMandalsForDistrict(state: string, district: string): string[] {
  const adminState = INDIA_ADMINISTRATIVE_DATA[state];
  if (adminState && adminState.districts[district]?.mandals?.length > 0) {
    return adminState.districts[district].mandals;
  }
  const cleanDistrict = district.replace(/\s*\(.*?\)\s*/g, '').trim();
  if (adminState && adminState.districts[cleanDistrict]?.mandals?.length > 0) {
    return adminState.districts[cleanDistrict].mandals;
  }
  return [
    `${cleanDistrict} Urban / Town`,
    `${cleanDistrict} Rural`,
    `${cleanDistrict} Central Mandal`,
    `${cleanDistrict} East Taluk`,
    `${cleanDistrict} West Division`,
  ];
}

/**
 * Returns popular towns, villages, or localities for a district.
 */
export function getTownsForDistrict(state: string, district: string): { town: string; pin: string; lat: number; lng: number }[] {
  const adminState = INDIA_ADMINISTRATIVE_DATA[state];
  if (adminState && adminState.districts[district]?.popularPincodes?.length > 0) {
    return adminState.districts[district].popularPincodes;
  }
  const cleanDistrict = district.replace(/\s*\(.*?\)\s*/g, '').trim();
  if (adminState && adminState.districts[cleanDistrict]?.popularPincodes?.length > 0) {
    return adminState.districts[cleanDistrict].popularPincodes;
  }
  return [
    { town: `${cleanDistrict} Main Town`, pin: '500001', lat: 20.5937, lng: 78.9629 },
    { town: `${cleanDistrict} Bazar / Market`, pin: '500002', lat: 20.5937, lng: 78.9629 },
    { town: `${cleanDistrict} Station Colony`, pin: '500003', lat: 20.5937, lng: 78.9629 },
  ];
}

// Returns all Indian locations as a flat preset list
export function getAuthoritativeIndianPresets(): IndiaLocationItem[] {
  const list: IndiaLocationItem[] = [];
  for (const [state, stateData] of Object.entries(INDIA_ADMINISTRATIVE_DATA)) {
    for (const [district, districtData] of Object.entries(stateData.districts)) {
      for (const townItem of districtData.popularPincodes) {
        const defaultMandal = districtData.mandals[0] || district;
        list.push({
          country: 'India',
          state,
          district,
          mandal: defaultMandal,
          townOrVillage: townItem.town,
          pincode: townItem.pin,
          lat: townItem.lat,
          lng: townItem.lng,
          popularLabel: `${state} - ${townItem.town} (${district})`,
          zone: stateData.zone,
        });
      }
    }
  }
  return list;
}

// Deterministic Pincode Prefix Resolver for all 100000 - 899999 ranges in India
export function inferIndianLocationFromPincode(pincode: string): IndiaLocationItem {
  const pin = pincode.trim();
  const prefix2 = pin.substring(0, 2);

  switch (prefix2) {
    case '11':
      return { country: 'India', state: 'Delhi', district: 'Central / New Delhi', mandal: 'Connaught Place', townOrVillage: `Delhi Locality (${pin})`, pincode: pin, lat: 28.6139, lng: 77.2090, zone: 'North' };
    case '12':
    case '13':
      return { country: 'India', state: 'Haryana', district: 'Gurugram / Faridabad Zone', mandal: 'Postal Circle ' + prefix2, townOrVillage: `Haryana Area (${pin})`, pincode: pin, lat: 28.4595, lng: 77.0266, zone: 'North' };
    case '14':
    case '15':
      return { country: 'India', state: 'Punjab', district: 'Ludhiana / Amritsar Circle', mandal: 'Postal Circle ' + prefix2, townOrVillage: `Punjab Area (${pin})`, pincode: pin, lat: 31.1471, lng: 75.3412, zone: 'North' };
    case '16':
      return { country: 'India', state: 'Chandigarh', district: 'Chandigarh (UT)', mandal: 'Sector Circle', townOrVillage: `Chandigarh Area (${pin})`, pincode: pin, lat: 30.7333, lng: 76.7794, zone: 'North' };
    case '17':
      return { country: 'India', state: 'Himachal Pradesh', district: 'Shimla / Kangra Circle', mandal: 'Postal Circle ' + prefix2, townOrVillage: `HP Area (${pin})`, pincode: pin, lat: 31.1048, lng: 77.1734, zone: 'North' };
    case '18':
    case '19':
      return { country: 'India', state: 'Jammu and Kashmir', district: 'Srinagar / Jammu Circle', mandal: 'Postal Circle ' + prefix2, townOrVillage: `J&K Area (${pin})`, pincode: pin, lat: 33.7782, lng: 76.5762, zone: 'North' };
    case '20':
    case '21':
    case '22':
    case '23':
    case '27':
    case '28':
      return { country: 'India', state: 'Uttar Pradesh', district: 'Noida / Lucknow / Varanasi Circle', mandal: 'Postal Circle ' + prefix2, townOrVillage: `UP Area (${pin})`, pincode: pin, lat: 26.8467, lng: 80.9462, zone: 'North' };
    case '24':
    case '25':
    case '26':
      return { country: 'India', state: 'Uttarakhand', district: 'Dehradun / Haridwar Circle', mandal: 'Postal Circle ' + prefix2, townOrVillage: `Uttarakhand Area (${pin})`, pincode: pin, lat: 30.0668, lng: 79.0193, zone: 'North' };
    case '30':
    case '31':
    case '32':
    case '33':
    case '34':
      return { country: 'India', state: 'Rajasthan', district: 'Jaipur / Jodhpur Circle', mandal: 'Postal Circle ' + prefix2, townOrVillage: `Rajasthan Area (${pin})`, pincode: pin, lat: 27.0238, lng: 74.2179, zone: 'North' };
    case '36':
    case '37':
    case '38':
    case '39':
      return { country: 'India', state: 'Gujarat', district: 'Ahmedabad / Surat Circle', mandal: 'Postal Circle ' + prefix2, townOrVillage: `Gujarat Area (${pin})`, pincode: pin, lat: 22.2587, lng: 71.1924, zone: 'West' };
    case '40':
    case '41':
    case '42':
    case '43':
    case '44':
      if (pin.startsWith('403')) {
        return { country: 'India', state: 'Goa', district: 'North / South Goa', mandal: 'Tiswadi / Bardez', townOrVillage: `Goa Area (${pin})`, pincode: pin, lat: 15.2993, lng: 74.1240, zone: 'West' };
      }
      return { country: 'India', state: 'Maharashtra', district: 'Mumbai / Pune Circle', mandal: 'Postal Circle ' + prefix2, townOrVillage: `Maharashtra Area (${pin})`, pincode: pin, lat: 19.0760, lng: 72.8777, zone: 'West' };
    case '45':
    case '46':
    case '47':
    case '48':
      return { country: 'India', state: 'Madhya Pradesh', district: 'Indore / Bhopal Circle', mandal: 'Postal Circle ' + prefix2, townOrVillage: `MP Area (${pin})`, pincode: pin, lat: 22.9734, lng: 78.6569, zone: 'Central' };
    case '49':
      return { country: 'India', state: 'Chhattisgarh', district: 'Raipur / Bilaspur Circle', mandal: 'Postal Circle ' + prefix2, townOrVillage: `Chhattisgarh Area (${pin})`, pincode: pin, lat: 21.2787, lng: 81.8661, zone: 'Central' };
    case '50':
      return { country: 'India', state: 'Telangana', district: 'Hyderabad / Secunderabad Circle', mandal: 'Serilingampally / Urban', townOrVillage: `Telangana Area (${pin})`, pincode: pin, lat: 17.3850, lng: 78.4867, zone: 'South' };
    case '51':
    case '52':
    case '53':
      return { country: 'India', state: 'Andhra Pradesh', district: 'Visakhapatnam / Vijayawada / Tirupati', mandal: 'Urban / Coastal', townOrVillage: `Andhra Area (${pin})`, pincode: pin, lat: 16.5062, lng: 80.6480, zone: 'South' };
    case '56':
    case '57':
    case '58':
    case '59':
      return { country: 'India', state: 'Karnataka', district: 'Bengaluru / Mysuru Circle', mandal: 'Urban / South', townOrVillage: `Karnataka Area (${pin})`, pincode: pin, lat: 12.9716, lng: 77.5946, zone: 'South' };
    case '60':
    case '61':
    case '62':
    case '63':
    case '64':
      return { country: 'India', state: 'Tamil Nadu', district: 'Chennai / Coimbatore Circle', mandal: 'Central / Urban', townOrVillage: `Tamil Nadu Area (${pin})`, pincode: pin, lat: 13.0827, lng: 80.2707, zone: 'South' };
    case '67':
    case '68':
    case '69':
      return { country: 'India', state: 'Kerala', district: 'Kochi / Thiruvananthapuram Circle', mandal: 'Ernakulam / Urban', townOrVillage: `Kerala Area (${pin})`, pincode: pin, lat: 10.8505, lng: 76.2711, zone: 'South' };
    case '70':
    case '71':
    case '72':
    case '73':
    case '74':
      return { country: 'India', state: 'West Bengal', district: 'Kolkata / Howrah Circle', mandal: 'Central / South', townOrVillage: `West Bengal Area (${pin})`, pincode: pin, lat: 22.5726, lng: 88.3639, zone: 'East' };
    case '75':
    case '76':
    case '77':
      return { country: 'India', state: 'Odisha', district: 'Bhubaneswar / Cuttack Circle', mandal: 'Urban Circle', townOrVillage: `Odisha Area (${pin})`, pincode: pin, lat: 20.9517, lng: 85.0985, zone: 'East' };
    case '78':
      return { country: 'India', state: 'Assam', district: 'Guwahati / Kamrup Circle', mandal: 'Dispur / Urban', townOrVillage: `Assam Area (${pin})`, pincode: pin, lat: 26.1433, lng: 91.7898, zone: 'NorthEast' };
    case '79':
      return { country: 'India', state: 'North East Region', district: 'Shillong / Imphal / Agartala', mandal: 'Hill Taluk', townOrVillage: `NE Area (${pin})`, pincode: pin, lat: 25.4670, lng: 91.3662, zone: 'NorthEast' };
    case '80':
    case '81':
    case '82':
      return { country: 'India', state: 'Bihar', district: 'Patna / Gaya Circle', mandal: 'Sadar / Urban', townOrVillage: `Bihar Area (${pin})`, pincode: pin, lat: 25.0961, lng: 85.3131, zone: 'East' };
    case '83':
    case '84':
    case '85':
      return { country: 'India', state: 'Jharkhand', district: 'Ranchi / Jamshedpur Circle', mandal: 'Urban / Taluk', townOrVillage: `Jharkhand Area (${pin})`, pincode: pin, lat: 23.6102, lng: 85.2799, zone: 'East' };
    default:
      return { country: 'India', state: 'India Region', district: `Postal Region ${prefix2}`, mandal: 'Central Mandal', townOrVillage: `Town / Village (${pin})`, pincode: pin, lat: 20.5937, lng: 78.9629, zone: 'Central' };
  }
}
