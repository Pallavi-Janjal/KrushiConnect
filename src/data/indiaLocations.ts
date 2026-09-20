export interface StateDistrictMap {
  [state: string]: string[];
}

export const STATE_DISTRICTS_MAP: StateDistrictMap = {
  'Maharashtra': [
    'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar', 'Beed', 'Bhandara', 'Buldhana',
    'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur',
    'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik',
    'Dharashiv', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
    'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
  ],
  'Punjab': [
    'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur',
    'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa',
    'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar', 'Sangrur',
    'Shahid Bhagat Singh Nagar', 'Tarn Taran'
  ],
  'Haryana': [
    'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar',
    'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal',
    'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
  ],
  'Gujarat': [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad',
    'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar',
    'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari',
    'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi',
    'Vadodara', 'Valsad'
  ],
  'Madhya Pradesh': [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind',
    'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar',
    'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua',
    'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch',
    'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni',
    'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain',
    'Umaria', 'Vidisha'
  ],
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh',
    'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
    'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
    'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur',
    'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi',
    'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar',
    'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut',
    'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli',
    'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shrawasti',
    'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
  ],
  'Rajasthan': [
    'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi',
    'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer',
    'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh',
    'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'
  ],
  'Karnataka': [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar',
    'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad',
    'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru',
    'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'
  ],
  'Andhra Pradesh': [
    'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla', 'Chittoor',
    'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR',
    'Palnadu', 'Prakasam', 'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Tirupati',
    'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR'
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Kamareddy',
    'Karimnagar', 'Khammam', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak',
    'Medchal Malkajgiri', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad',
    'Peddapalli', 'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet', 'Suryapet',
    'Vikarabad', 'Wanaparthy', 'Warangal', 'Hanamkonda', 'Yadadri Bhuvanagiri'
  ],
  'Tamil Nadu': [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
    'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
    'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
    'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
    'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
    'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
  ],
  'Bihar': [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
    'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar',
    'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur',
    'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran',
    'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
    'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
    'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
    'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
  ],
  'Odisha': [
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh',
    'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi',
    'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj',
    'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'
  ],
  'Kerala': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam',
    'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
  ],
  'Assam': [
    'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang',
    'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai',
    'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur',
    'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar',
    'Tinsukia', 'Udalguri', 'West Karbi Anglong'
  ],
  'Jharkhand': [
    'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih',
    'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga',
    'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
  ],
  'Chhattisgarh': [
    'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada',
    'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham',
    'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh',
    'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja'
  ],
  'Himachal Pradesh': [
    'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti',
    'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
  ],
  'Uttarakhand': [
    'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital',
    'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'
  ],
  'Goa': [
    'North Goa', 'South Goa'
  ],
  'Tripura': [
    'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'
  ],
  'Meghalaya': [
    'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri Bhoi',
    'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills',
    'West Jaintia Hills', 'West Khasi Hills'
  ],
  'Manipur': [
    'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching',
    'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'
  ],
  'Nagaland': [
    'Chumoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Niuland',
    'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyu', 'Tuensang', 'Wokha', 'Zunheboto'
  ],
  'Mizoram': [
    'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei',
    'Mamit', 'Saiha', 'Saitual', 'Serchhip'
  ],
  'Arunachal Pradesh': [
    'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 'Kra Daadi',
    'Kurung Kumey', 'Leparada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang',
    'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi', 'Siang', 'Tawang',
    'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang'
  ],
  'Sikkim': [
    'East Sikkim', 'North Sikkim', 'Pakyong', 'Soreng', 'South Sikkim', 'West Sikkim'
  ],
  'Jammu and Kashmir': [
    'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua',
    'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi',
    'Samba', 'Shopian', 'Srinagar', 'Udhampur'
  ],
  'Ladakh': [
    'Kargil', 'Leh'
  ],
  'Delhi': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi',
    'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
  ],
  'Puducherry': [
    'Karaikal', 'Mahe', 'Puducherry', 'Yanam'
  ],
  'Chandigarh': [
    'Chandigarh'
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    'Dadra and Nagar Haveli', 'Daman', 'Diu'
  ],
  'Andaman and Nicobar Islands': [
    'Nicobar', 'North and Middle Andaman', 'South Andaman'
  ],
  'Lakshadweep': [
    'Lakshadweep'
  ]
};

export const INDIAN_STATES = Object.keys(STATE_DISTRICTS_MAP);

export const getDistrictsForState = (stateName: string): string[] => {
  if (!stateName || stateName === 'ALL') return [];
  
  // Exact match
  if (STATE_DISTRICTS_MAP[stateName]) {
    return STATE_DISTRICTS_MAP[stateName];
  }

  // Case-insensitive fallback match
  const normalized = stateName.trim().toLowerCase();
  const matchedKey = Object.keys(STATE_DISTRICTS_MAP).find(
    (k) => k.toLowerCase() === normalized
  );

  return matchedKey ? STATE_DISTRICTS_MAP[matchedKey] : [];
};

export const DISTRICT_TALUKAS_MAP: Record<string, string[]> = {
  // Maharashtra
  'Chhatrapati Sambhajinagar': ['Aurangabad', 'Kannad', 'Soegaon', 'Sillod', 'Phulambri', 'Khuldabad', 'Vaijapur', 'Gangapur', 'Paithan'],
  'Pune': ['Haveli', 'Pune City', 'Khed', 'Junnar', 'Ambegaon', 'Maval', 'Mulshi', 'Shirur', 'Purandar', 'Velhe', 'Bhor', 'Baramati', 'Indapur', 'Daund'],
  'Ahmednagar': ['Nagar', 'Rahuri', 'Sangamner', 'Kopargaon', 'Akole', 'Shrirampur', 'Newasa', 'Shevgaon', 'Pathardi', 'Jamkhed', 'Karjat', 'Shrigonda', 'Parner', 'Rahata'],
  'Nashik': ['Nashik', 'Igatpuri', 'Dindori', 'Peth', 'Trimbakeshwar', 'Kalwan', 'Deola', 'Surgana', 'Baglan', 'Malegaon', 'Nandgaon', 'Chandwad', 'Niphad', 'Sinnar', 'Yeola'],
  'Jalna': ['Jalna', 'Ambad', 'Bhokardan', 'Badnapur', 'Ghansawangi', 'Partur', 'Mantha', 'Jafrabad'],
  'Beed': ['Beed', 'Georai', 'Majalgaon', 'Wadwani', 'Ashti', 'Patoda', 'Shirur (Kasar)', 'Kaij', 'Dharur', 'Parli (Vaijnath)', 'Ambejogai'],
  'Dharashiv': ['Dharashiv', 'Tuljapur', 'Bhum', 'Paranda', 'Kalamb', 'Omerga', 'Lohara', 'Washi'],
  'Latur': ['Latur', 'Ausa', 'Renapur', 'Shirur-Anantpal', 'Nilanga', 'Deoni', 'Udgir', 'Jalkot', 'Chakur', 'Ahmadpur'],
  'Nanded': ['Nanded', 'Biloli', 'Mukhed', 'Kandhar', 'Loha', 'Mudkhed', 'Ardhapur', 'Bhokar', 'Umri', 'Dharmabad', 'Kinwat', 'Himayatnagar', 'Hadgaon', 'Mahoor', 'Deglur', 'Naigaon'],
  'Parbhani': ['Parbhani', 'Gangakhed', 'Sonpeth', 'Pathri', 'Manwath', 'Palam', 'Purna', 'Sailu', 'Jintur'],
  'Hingoli': ['Hingoli', 'Kalamnuri', 'Basmath', 'Aundha Nagnath', 'Sengaon'],
  'Kolhapur': ['Karvir', 'Panhala', 'Shahuwadi', 'Kagal', 'Hatkanangle', 'Shirol', 'Radhanagari', 'Gaganbawda', 'Bhudargad', 'Ajra', 'Gadhinglaj', 'Chandgad'],
  'Sangli': ['Miraj', 'Kavathe Mahankal', 'Tasgaon', 'Jat', 'Walwa', 'Shirala', 'Khanapur', 'Atpadi', 'Palus', 'Kadegaon'],
  'Satara': ['Satara', 'Karad', 'Wai', 'Mahabaleshwar', 'Phaltan', 'Man', 'Khatav', 'Koregaon', 'Patan', 'Jaoli', 'Khandala'],
  'Solapur': ['Solapur North', 'Solapur South', 'Barshi', 'Akkalkot', 'Mohol', 'Madha', 'Karmala', 'Pandharpur', 'Sangola', 'Malshiras', 'Mangalwedha'],
  'Nagpur': ['Nagpur Urban', 'Nagpur Rural', 'Kamptee', 'Hingna', 'Katol', 'Narkhed', 'Savner', 'Kalameshwar', 'Ramtek', 'Mouda', 'Parseoni', 'Umred', 'Kuhi', 'Bhiwapur'],
  'Amravati': ['Amravati', 'Bhatkuli', 'Nandgaon Khandeshwar', 'Dharni', 'Chikhaldara', 'Achalpur', 'Chandurbazar', 'Morshi', 'Warud', 'Daryapur', 'Anjangaon Surji', 'Chandur Railway', 'Dhamangaon Railway', 'Tiosa'],
  'Akola': ['Akola', 'Akot', 'Telhara', 'Balapur', 'Patur', 'Murtizapur', 'Barshitakli'],
  'Buldhana': ['Buldhana', 'Chikhli', 'Deulgaon Raja', 'Jalgaon (Jamod)', 'Sangrampur', 'Malkapur', 'Motala', 'Nandura', 'Khamgaon', 'Shegaon', 'Mehkar', 'Sindkhed Raja', 'Lonar'],
  'Washim': ['Washim', 'Malegaon', 'Risod', 'Mangrulpir', 'Karanja', 'Manora'],
  'Yavatmal': ['Yavatmal', 'Arni', 'Babhulgaon', 'Kalamb', 'Darwha', 'Digras', 'Ner', 'Pusad', 'Umarkhed', 'Mahagaon', 'Ghatanji', 'Kelapur', 'Ralegaon', 'Wani', 'Maregaon', 'Zari-Jamani'],
  'Wardha': ['Wardha', 'Deoli', 'Seloo', 'Arvi', 'Ashti', 'Karanja', 'Hinganghat', 'Samudrapur'],
  'Chandrapur': ['Chandrapur', 'Bhadravati', 'Warora', 'Chimur', 'Nagbhid', 'Brahmapuri', 'Sindewahi', 'Mul', 'Saoli', 'Pombhurna', 'Ballarpur', 'Korpurna', 'Jiwati', 'Rajura', 'Gondpipri'],
  'Bhandara': ['Bhandara', 'Tumsar', 'Pauni', 'Mohadi', 'Sakoli', 'Lakhani', 'Lakhandur'],
  'Gondia': ['Gondia', 'Tirora', 'Goregaon', 'Amgaon', 'Salekasa', 'Sadak Arjuni', 'Arjuni Morgaon', 'Deori'],
  'Gadchiroli': ['Gadchiroli', 'Dhanora', 'Chamorshi', 'Armori', 'Kurkheda', 'Korchi', 'Desaiganj (Wadsa)', 'Aheri', 'Bhamragad', 'Etapalli', 'Mulchera', 'Sironcha'],
  'Dhule': ['Dhule', 'Sakri', 'Sindkheda', 'Shirpur'],
  'Jalgaon': ['Jalgaon', 'Jamner', 'Erandol', 'Dharangaon', 'Bhusawal', 'Raver', 'Muktainagar', 'Bodwad', 'Yawal', 'Amalner', 'Parola', 'Chopda', 'Pachora', 'Bhadgaon', 'Chalisgaon'],
  'Nandurbar': ['Nandurbar', 'Navapur', 'Shahada', 'Taloda', 'Akkalkuwa', 'Akrani'],
  'Raigad': ['Alibag', 'Pen', 'Murud', 'Panvel', 'Uran', 'Karjat', 'Khalapur', 'Mangaon', 'Roha', 'Sudhagad', 'Tala', 'Mahad', 'Poladpur', 'Shrivardhan', 'Mhasla'],
  'Ratnagiri': ['Ratnagiri', 'Chiplun', 'Guhagar', 'Dapoli', 'Mandangad', 'Khed', 'Sangameshwar', 'Rajapur', 'Lanja'],
  'Sindhudurg': ['Kudal', 'Sawantwadi', 'Vengurla', 'Malvan', 'Kankavli', 'Devgad', 'Vaibhavwadi', 'Dodamarg'],
  'Thane': ['Thane', 'Kalyan', 'Murbad', 'Bhiwandi', 'Shahapur', 'Ulhasnagar', 'Ambarnath'],
  'Palghar': ['Palghar', 'Vada', 'Vikramgad', 'Jawhar', 'Mokhada', 'Dahanu', 'Talasari', 'Vasai'],
  'Mumbai City': ['Mumbai City'],
  'Mumbai Suburban': ['Kurla', 'Andheri', 'Borivali'],

  // Punjab (Major Agricultural Districts)
  'Amritsar': ['Amritsar-1', 'Amritsar-2', 'Ajnala', 'Baba Bakala', 'Majitha'],
  'Ludhiana': ['Ludhiana East', 'Ludhiana West', 'Jagraon', 'Khanna', 'Samrala', 'Payal', 'Raikot'],
  'Bathinda': ['Bathinda', 'Rampura Phul', 'Talwandi Sabo', 'Maur'],
  'Patiala': ['Patiala', 'Nabha', 'Rajpura', 'Samana', 'Patran'],
  'Jalandhar': ['Jalandhar-1', 'Jalandhar-2', 'Nakodar', 'Phillaur', 'Shahkot'],

  // Haryana (Major Districts)
  'Karnal': ['Karnal', 'Indri', 'Nilokheri', 'Gharaunda', 'Assandh'],
  'Hisar': ['Hisar', 'Hansi', 'Barwala', 'Narnaund', 'Adampur'],
  'Ambala': ['Ambala', 'Ambala Cantt', 'Barara', 'Naraingarh'],
  'Kurukshetra': ['Thanesar', 'Pehowa', 'Shahbad', 'Ladwa'],

  // Gujarat (Major Districts)
  'Ahmedabad': ['Ahmedabad City', 'Daskroi', 'Sanand', 'Dholka', 'Dhandhuka', 'Viramgam', 'Mandal', 'Detroj', 'Bavla'],
  'Rajkot': ['Rajkot', 'Gondal', 'Jetpur', 'Dhoraji', 'Upleta', 'Jasdan', 'Kotda Sangani', 'Lodhika'],
  'Surat': ['Choryasi', 'Olpad', 'Kamrej', 'Mangrol', 'Mandvi', 'Bardoli', 'Mahuva'],
  'Vadodara': ['Vadodara', 'Padra', 'Karjan', 'Dabhoi', 'Waghodia', 'Savli', 'Desar']
};

export const getTalukasForDistrict = (districtName: string): string[] => {
  if (!districtName) return [];
  
  if (DISTRICT_TALUKAS_MAP[districtName]) {
    return DISTRICT_TALUKAS_MAP[districtName];
  }

  const normalized = districtName.trim().toLowerCase();
  const matchedKey = Object.keys(DISTRICT_TALUKAS_MAP).find(
    (k) => k.toLowerCase() === normalized
  );

  return matchedKey ? DISTRICT_TALUKAS_MAP[matchedKey] : [];
};
