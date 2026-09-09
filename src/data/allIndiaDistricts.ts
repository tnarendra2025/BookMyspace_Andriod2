// Complete official list of all 780+ districts across all 36 States & Union Territories of India.

export interface StateDistrictMeta {
  capital: string;
  zone: 'South' | 'North' | 'West' | 'East' | 'Central' | 'NorthEast';
  districts: string[];
}

export const ALL_INDIA_DISTRICTS_BY_STATE: Record<string, StateDistrictMeta> = {
  // ---------------------------------------------------------------------------
  // 28 STATES
  // ---------------------------------------------------------------------------
  'Andhra Pradesh': {
    capital: 'Amaravati',
    zone: 'South',
    districts: [
      'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya',
      'Bapatla', 'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari',
      'Eluru', 'Guntur', 'Kakinada', 'Krishna', 'Kurnool', 'Nandyal',
      'NTR (Vijayawada)', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam (Ongole)',
      'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai (Puttaparthi)',
      'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari (Bhimavaram)', 'YSR Kadapa',
    ],
  },
  'Arunachal Pradesh': {
    capital: 'Itanagar',
    zone: 'NorthEast',
    districts: [
      'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang',
      'Itanagar Capital Complex', 'Kamle', 'Kra Daadi', 'Kurung Kumey',
      'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang',
      'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi',
      'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri',
      'West Kameng', 'West Siang',
    ],
  },
  'Assam': {
    capital: 'Dispur / Guwahati',
    zone: 'NorthEast',
    districts: [
      'Bajali', 'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar (Silchar)',
      'Charaideo', 'Chirang', 'Darrang (Mangaldai)', 'Dhemaji', 'Dhubri',
      'Dibrugarh', 'Dima Hasao (Haflong)', 'Goalpara', 'Golaghat', 'Hailakandi',
      'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan (Guwahati)',
      'Karbi Anglong (Diphu)', 'Karimganj', 'Kokrajhar', 'Lakhimpur (North Lakhimpur)',
      'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur (Tezpur)',
      'South Salmara-Mankachar', 'Tamulpur', 'Tinsukia', 'Udalguri', 'West Karbi Anglong',
    ],
  },
  'Bihar': {
    capital: 'Patna',
    zone: 'East',
    districts: [
      'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur',
      'Bhojpur (Ara)', 'Buxar', 'Darbhanga', 'East Champaran (Motihari)',
      'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur (Bhabua)',
      'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura',
      'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda (Bihar Sharif)',
      'Nawada', 'Patna', 'Purnia', 'Rohtas (Sasaram)', 'Saharsa',
      'Samastipur', 'Saran (Chhapra)', 'Sheikhpura', 'Sheohar',
      'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali (Hajipur)', 'West Champaran (Bettiah)',
    ],
  },
  'Chhattisgarh': {
    capital: 'Raipur',
    zone: 'Central',
    districts: [
      'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar (Jagdalpur)', 'Bemetara',
      'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband',
      'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham (Kawardha)',
      'Kanker', 'Khairagarh-Chhuikhadan-Gandai', 'Kondagaon', 'Korba', 'Koriya',
      'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki',
      'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon',
      'Sarangarh-Bilaigarh', 'Sakti', 'Sukma', 'Surajpur', 'Surguja (Ambikapur)',
    ],
  },
  'Goa': {
    capital: 'Panaji',
    zone: 'West',
    districts: ['North Goa (Panaji / Mapusa)', 'South Goa (Margao / Vasco da Gama)'],
  },
  'Gujarat': {
    capital: 'Gandhinagar',
    zone: 'West',
    districts: [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli (Modasa)', 'Banaskantha (Palanpur)',
      'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang (Ahwa)',
      'Devbhumi Dwarka', 'Gandhinagar', 'Gir Somnath (Veraval)', 'Jamnagar',
      'Junagadh', 'Kheda (Nadiad)', 'Kutch (Bhuj)', 'Mahisagar (Lunawada)',
      'Mehsana', 'Morbi', 'Narmada (Rajpipla)', 'Navsari', 'Panchmahal (Godhra)',
      'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha (Himmatnagar)', 'Surat',
      'Surendranagar', 'Tapi (Vyara)', 'Vadodara', 'Valsad',
    ],
  },
  'Haryana': {
    capital: 'Chandigarh',
    zone: 'North',
    districts: [
      'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad',
      'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal',
      'Kurukshetra', 'Mahendragarh (Narnaul)', 'Nuh (Mewat)', 'Palwal',
      'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar',
    ],
  },
  'Himachal Pradesh': {
    capital: 'Shimla',
    zone: 'North',
    districts: [
      'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra (Dharamshala)', 'Kinnaur (Reckong Peo)',
      'Kullu (Manali)', 'Lahaul and Spiti (Keylong)', 'Mandi', 'Shimla',
      'Sirmaur (Nahan)', 'Solan', 'Una',
    ],
  },
  'Jharkhand': {
    capital: 'Ranchi',
    zone: 'East',
    districts: [
      'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum (Jamshedpur)',
      'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara',
      'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu (Daltonganj)',
      'Ramgarh', 'Ranchi', 'Sahibganj', 'Saraikela Kharsawan', 'Simdega', 'West Singhbhum (Chaibasa)',
    ],
  },
  'Karnataka': {
    capital: 'Bengaluru',
    zone: 'South',
    districts: [
      'Bagalkote', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
      'Bidar', 'Chamarajanagara', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga',
      'Dakshina Kannada (Mangaluru)', 'Davanagere', 'Dharwad (Hubballi)', 'Gadag',
      'Hassan', 'Haveri', 'Kalaburagi (Gulbarga)', 'Kodagu (Madikeri)', 'Kolar',
      'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
      'Tumakuru', 'Udupi', 'Uttara Kannada (Karwar)', 'Vijayanagara (Hosapete)',
      'Vijayapura (Bijapur)', 'Yadgir',
    ],
  },
  'Kerala': {
    capital: 'Thiruvananthapuram',
    zone: 'South',
    districts: [
      'Alappuzha', 'Ernakulam (Kochi)', 'Idukki (Painavu / Munnar)', 'Kannur',
      'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram',
      'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad (Kalpetta)',
    ],
  },
  'Madhya Pradesh': {
    capital: 'Bhopal',
    zone: 'Central',
    districts: [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani',
      'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara',
      'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior',
      'Harda', 'Narmadapuram (Hoshangabad)', 'Indore', 'Jabalpur', 'Jhabua',
      'Katni', 'Khandwa', 'Khargone', 'Maihar', 'Mandla', 'Mandsaur',
      'Mauganj', 'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Pandhurna',
      'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna',
      'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri',
      'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha',
    ],
  },
  'Maharashtra': {
    capital: 'Mumbai',
    zone: 'West',
    districts: [
      'Ahmednagar (Ahilyanagar)', 'Akola', 'Amravati', 'Chhatrapati Sambhaji Nagar (Aurangabad)',
      'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dharashiv (Osmanabad)',
      'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
      'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur',
      'Nanded', 'Nandurbar', 'Nashik', 'Palghar', 'Parbhani', 'Pune',
      'Raigad (Alibag)', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg (Oros)',
      'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
    ],
  },
  'Manipur': {
    capital: 'Imphal',
    zone: 'NorthEast',
    districts: [
      'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West',
      'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl',
      'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul',
    ],
  },
  'Meghalaya': {
    capital: 'Shillong',
    zone: 'NorthEast',
    districts: [
      'East Garo Hills (Williamnagar)', 'East Jaintia Hills (Khliehriat)',
      'East Khasi Hills (Shillong)', 'Eastern West Khasi Hills (Mairang)',
      'North Garo Hills (Resubelpara)', 'Ri Bhoi (Nongpoh)',
      'South Garo Hills (Baghmara)', 'South West Garo Hills (Ampati)',
      'South West Khasi Hills (Mawkyrwat)', 'West Garo Hills (Tura)',
      'West Jaintia Hills (Jowai)', 'West Khasi Hills (Nongstoin)',
    ],
  },
  'Mizoram': {
    capital: 'Aizawl',
    zone: 'NorthEast',
    districts: [
      'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib',
      'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Saitual', 'Serchhip',
    ],
  },
  'Nagaland': {
    capital: 'Kohima',
    zone: 'NorthEast',
    districts: [
      'Chümoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng',
      'Mokokchung', 'Mon', 'Niuland', 'Noklak', 'Peren', 'Phek',
      'Shamator', 'Tseminyü', 'Tuensang', 'Wokha', 'Zünheboto',
    ],
  },
  'Odisha': {
    capital: 'Bhubaneswar',
    zone: 'East',
    districts: [
      'Angul', 'Balangir', 'Balasore (Baleswar)', 'Bargarh', 'Bhadrak',
      'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati (Paralakhemundi)',
      'Ganjam (Chhatrapur / Berhampur)', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda',
      'Kalahandi (Bhawanipatna)', 'Kandhamal (Phulbani)', 'Kendrapara',
      'Kendujhar (Keonjhar)', 'Khordha (Bhubaneswar)', 'Koraput', 'Malkangiri',
      'Mayurbhanj (Baripada)', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri',
      'Rayagada', 'Sambalpur', 'Subarnapur (Sonepur)', 'Sundergarh (Rourkela)',
    ],
  },
  'Punjab': {
    capital: 'Chandigarh',
    zone: 'North',
    districts: [
      'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib',
      'Fazilka', 'Firozpur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar',
      'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa', 'Moga',
      'Mohali (SAS Nagar)', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar (Ropar)',
      'Sangrur', 'SBS Nagar (Nawanshahr)', 'Tarn Taran',
    ],
  },
  'Rajasthan': {
    capital: 'Jaipur',
    zone: 'North',
    districts: [
      'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer',
      'Beawar', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh',
      'Churu', 'Dausa', 'Deeg', 'Dholpur', 'Didwana-Kuchaman', 'Dudu',
      'Dungarpur', 'Ganganagar (Sri Ganganagar)', 'Gangapur City', 'Hanumangarh',
      'Hindaun', 'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar',
      'Jhunjhunu', 'Jodhpur', 'Jodhpur Rural', 'Karauli', 'Kekri',
      'Khairthal-Tijara', 'Kota', 'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana',
      'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar', 'Sanchore',
      'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur',
    ],
  },
  'Sikkim': {
    capital: 'Gangtok',
    zone: 'NorthEast',
    districts: ['Gangtok', 'Gyalshing', 'Mangan', 'Namchi', 'Pakyong', 'Soreng'],
  },
  'Tamil Nadu': {
    capital: 'Chennai',
    zone: 'South',
    districts: [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
      'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
      'Kanyakumari (Nagercoil)', 'Karur', 'Krishnagiri (Hosur)', 'Madurai',
      'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris (Udhagamandalam / Ooty)',
      'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem',
      'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi (Tuticorin)',
      'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
      'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar',
    ],
  },
  'Telangana': {
    capital: 'Hyderabad',
    zone: 'South',
    districts: [
      'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad',
      'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal',
      'Kamareddy', 'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad',
      'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri',
      'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal',
      'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy',
      'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy',
      'Warangal', 'Yadadri Bhuvanagiri',
    ],
  },
  'Tripura': {
    capital: 'Agartala',
    zone: 'NorthEast',
    districts: [
      'Dhalai (Ambassa)', 'Gomati (Udaipur)', 'Khowai', 'North Tripura (Dharmanagar)',
      'Sepahijala (Bishramganj)', 'South Tripura (Belonia)', 'Unakoti (Kailashahar)', 'West Tripura (Agartala)',
    ],
  },
  'Uttar Pradesh': {
    capital: 'Lucknow',
    zone: 'North',
    districts: [
      'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya',
      'Ayodhya (Faizabad)', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia',
      'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi',
      'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria',
      'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad',
      'Gautam Buddha Nagar (Noida / Greater Noida)', 'Ghaziabad', 'Ghazipur',
      'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras',
      'Jalaun (Orai)', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat',
      'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri (Lakhimpur)', 'Kushinagar',
      'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura',
      'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit',
      'Pratapgarh', 'Prayagraj (Allahabad)', 'Raebareli', 'Rampur', 'Saharanpur',
      'Sambhal', 'Sant Kabir Nagar (Khalilabad)', 'Shahjahanpur', 'Shamli',
      'Shravasti', 'Siddharthnagar (Naugarh)', 'Sitapur', 'Sonbhadra (Robertsganj)',
      'Sultanpur', 'Unnao', 'Varanasi',
    ],
  },
  'Uttarakhand': {
    capital: 'Dehradun',
    zone: 'North',
    districts: [
      'Almora', 'Bageshwar', 'Chamoli (Gopeshwar)', 'Champawat',
      'Dehradun (Rishikesh)', 'Haridwar (Roorkee)', 'Nainital (Haldwani)',
      'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal (New Tehri)',
      'Udham Singh Nagar (Rudrapur / Kashipur)', 'Uttarkashi',
    ],
  },
  'West Bengal': {
    capital: 'Kolkata',
    zone: 'East',
    districts: [
      'Alipurduar', 'Bankura', 'Birbhum (Suri / Bolpur Santiniketan)', 'Cooch Behar',
      'Dakshin Dinajpur (Balurghat)', 'Darjeeling (Siliguri)', 'Hooghly (Chinsurah)',
      'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
      'Murshidabad (Baharampur)', 'Nadia (Krishnanagar / Kalyani)',
      'North 24 Parganas (Barasat / Salt Lake / Newtown)', 'Paschim Bardhaman (Asansol / Durgapur)',
      'Paschim Medinipur (Midnapore / Kharagpur)', 'Purba Bardhaman (Bardhaman)',
      'Purba Medinipur (Tamluk / Haldia / Digha)', 'Purulia',
      'South 24 Parganas (Alipore)', 'Uttar Dinajpur (Raiganj)',
    ],
  },

  // ---------------------------------------------------------------------------
  // 8 UNION TERRITORIES
  // ---------------------------------------------------------------------------
  'Andaman and Nicobar Islands': {
    capital: 'Port Blair',
    zone: 'South',
    districts: ['Nicobar (Car Nicobar)', 'North and Middle Andaman (Mayabunder)', 'South Andaman (Port Blair)'],
  },
  'Chandigarh': {
    capital: 'Chandigarh',
    zone: 'North',
    districts: ['Chandigarh (UT Central, North & South Sectors)'],
  },
  'Dadra and Nagar Haveli and Daman and Diu': {
    capital: 'Daman',
    zone: 'West',
    districts: ['Dadra and Nagar Haveli (Silvassa)', 'Daman', 'Diu'],
  },
  'Delhi': {
    capital: 'New Delhi',
    zone: 'North',
    districts: [
      'Central Delhi (Connaught Place / Daryaganj)', 'East Delhi (Preet Vihar / Mayur Vihar)',
      'New Delhi (Chanakyapuri / Parliament)', 'North Delhi (Civil Lines / Sadar Bazar)',
      'North East Delhi (Seelampur / Yamuna Vihar)', 'North West Delhi (Rohini / Saraswati Vihar)',
      'Shahdara (Vivek Vihar / Dilshad Garden)', 'South Delhi (Saket / Hauz Khas / Greater Kailash)',
      'South East Delhi (Defence Colony / Nehru Place)', 'South West Delhi (Dwarka / Vasant Vihar)',
      'West Delhi (Rajouri Garden / Patel Nagar)',
    ],
  },
  'Jammu and Kashmir': {
    capital: 'Srinagar (Summer) / Jammu (Winter)',
    zone: 'North',
    districts: [
      'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal',
      'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch',
      'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian',
      'Srinagar', 'Udhampur',
    ],
  },
  'Ladakh': {
    capital: 'Leh',
    zone: 'North',
    districts: ['Kargil', 'Leh'],
  },
  'Lakshadweep': {
    capital: 'Kavaratti',
    zone: 'South',
    districts: ['Lakshadweep (Kavaratti / Agatti / Minicoy)'],
  },
  'Puducherry': {
    capital: 'Puducherry',
    zone: 'South',
    districts: ['Karaikal', 'Mahe', 'Puducherry', 'Yanam'],
  },
};
