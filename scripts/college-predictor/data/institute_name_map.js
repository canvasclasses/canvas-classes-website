/**
 * Explicit JoSAA-CSV-institute-name → college slug map.
 *
 * The josaa24.csv institute strings are inconsistent (commas, abbreviations,
 * casing) so a deterministic slugify() can't catch all of them reliably.
 * This file is the hand-curated authority.
 *
 * Every slug on the RHS must also exist as a `_id` in
 * scripts/college-predictor/data/josaa_institutes.js — otherwise the
 * ingester will skip those rows.
 *
 * Rows for institutes not listed here are reported as unmatched and skipped.
 * When we add a new PPP IIIT or GFTI to josaa_institutes.js, we must also add
 * its CSV name here.
 */

const INSTITUTE_NAME_TO_SLUG = {
  // ── NITs (31) — all present in josaa_institutes.js ─────────────────────────
  'National Institute of Technology Agartala': 'nit-agartala',
  'Motilal Nehru National Institute of Technology Allahabad': 'nit-allahabad',
  'National Institute of Technology, Andhra Pradesh': 'nit-andhra-pradesh',
  'National Institute of Technology Arunachal Pradesh': 'nit-arunachal-pradesh',
  'Maulana Azad National Institute of Technology Bhopal': 'nit-bhopal',
  'National Institute of Technology Calicut': 'nit-calicut',
  'National Institute of Technology Delhi': 'nit-delhi',
  'National Institute of Technology Durgapur': 'nit-durgapur',
  'National Institute of Technology Goa': 'nit-goa',
  'National Institute of Technology Hamirpur': 'nit-hamirpur',
  'Malaviya National Institute of Technology Jaipur': 'nit-jaipur',
  'Dr. B R Ambedkar National Institute of Technology, Jalandhar': 'nit-jalandhar',
  'National Institute of Technology, Jamshedpur': 'nit-jamshedpur',
  'National Institute of Technology, Kurukshetra': 'nit-kurukshetra',
  'National Institute of Technology, Manipur': 'nit-manipur',
  'National Institute of Technology Meghalaya': 'nit-meghalaya',
  'National Institute of Technology, Mizoram': 'nit-mizoram',
  'National Institute of Technology Nagaland': 'nit-nagaland',
  'Visvesvaraya National Institute of Technology, Nagpur': 'nit-nagpur',
  'National Institute of Technology Patna': 'nit-patna',
  'National Institute of Technology Puducherry': 'nit-puducherry',
  'National Institute of Technology Raipur': 'nit-raipur',
  'National Institute of Technology, Rourkela': 'nit-rourkela',
  'National Institute of Technology Sikkim': 'nit-sikkim',
  'National Institute of Technology, Silchar': 'nit-silchar',
  'National Institute of Technology, Srinagar': 'nit-srinagar',
  'Sardar Vallabhbhai National Institute of Technology, Surat': 'nit-surat',
  'National Institute of Technology Karnataka, Surathkal': 'nit-surathkal',
  'National Institute of Technology, Tiruchirappalli': 'nit-trichy',
  'National Institute of Technology, Uttarakhand': 'nit-uttarakhand',
  'National Institute of Technology, Warangal': 'nit-warangal',

  // ── IIITs — Institutes of National Importance (5) ──────────────────────────
  'Indian Institute of Information Technology, Allahabad': 'iiit-allahabad',
  'Pt. Dwarka Prasad Mishra Indian Institute of Information Technology, Design & Manufacture Jabalpur': 'iiitdm-jabalpur',
  'Indian Institute of Information Technology, Design & Manufacturing, Kancheepuram': 'iiitdm-kancheepuram',
  'Indian Institute of Information Technology Design & Manufacturing Kurnool, Andhra Pradesh': 'iiitdm-kurnool',
  'Atal Bihari Vajpayee Indian Institute of Information Technology & Management Gwalior': 'iiitm-gwalior',

  // ── IIITs — PPP model (20) ─────────────────────────────────────────────────
  'Indian Institute of Information Technology, Agartala': 'iiit-agartala',
  'Indian Institute of Information Technology Bhagalpur': 'iiit-bhagalpur',
  'Indian Institute of Information Technology Bhopal': 'iiit-bhopal',
  'Indian Institute of Information Technology(IIIT) Dharwad': 'iiit-dharwad',
  'Indian Institute of Information Technology Guwahati': 'iiit-guwahati',
  'Indian Institute of Information Technology(IIIT) Kalyani, West Bengal': 'iiit-kalyani',
  'Indian Institute of Information Technology(IIIT) Kilohrad, Sonepat, Haryana': 'iiit-sonepat',
  'Indian Institute of Information Technology(IIIT) Kottayam': 'iiit-kottayam',
  'Indian Institute of Information Technology (IIIT)Kota, Rajasthan': 'iiit-kota',
  'Indian Institute of Information Technology Lucknow': 'iiit-lucknow',
  'INDIAN INSTITUTE OF INFORMATION TECHNOLOGY SENAPATI MANIPUR': 'iiit-manipur',
  'Indian Institute of Information Technology (IIIT) Nagpur': 'iiit-nagpur',
  'Indian Institute of Information Technology (IIIT) Pune': 'iiit-pune',
  'Indian institute of information technology, Raichur, Karnataka': 'iiit-raichur',
  'Indian Institute of Information Technology (IIIT) Ranchi': 'iiit-ranchi',
  'Indian Institute of Information Technology (IIIT), Sri City, Chittoor': 'iiit-sri-city',
  'Indian Institute of Information Technology Surat': 'iiit-surat',
  'Indian Institute of Information Technology Tiruchirappalli': 'iiit-trichy',
  'Indian Institute of Information Technology(IIIT) Una, Himachal Pradesh': 'iiit-una',
  'Indian Institute of Information Technology(IIIT), Vadodara, Gujrat': 'iiit-vadodara',
  'Indian Institute of Information Technology, Vadodara International Campus Diu (IIITVICD)': 'iiit-vadodara-diu',

  // ── IIITs run by deemed universities that ARE in JoSAA ─────────────────────
  'International Institute of Information Technology, Bhubaneswar': 'iiit-bhubaneswar',
  'International Institute of Information Technology, Naya Raipur': 'iiit-naya-raipur',

  // ── GFTIs (key ones — expand as needed) ────────────────────────────────────
  'Assam University, Silchar': 'gfti-assam-university',
  'Birla Institute of Technology, Mesra, Ranchi': 'gfti-bit-mesra',
  'Birla Institute of Technology, Deoghar Off-Campus': 'gfti-bit-deoghar',
  'Birla Institute of Technology, Patna Off-Campus': 'gfti-bit-patna',
  'Central University of Rajasthan, Rajasthan': 'gfti-cu-rajasthan',
  'Central University of Haryana': 'gfti-cu-haryana',
  'Central University of Jammu': 'gfti-cu-jammu',
  'CU Jharkhand': 'gfti-cu-jharkhand',
  'Central institute of Technology Kokrajar, Assam': 'gfti-cit-kokrajar',
  'Chhattisgarh Swami Vivekanada Technical University, Bhilai (CSVTU Bhilai)': 'gfti-csvtu-bhilai',
  'Gati Shakti Vishwavidyalaya, Vadodara': 'gfti-gati-shakti',
  'Ghani Khan Choudhary Institute of Engineering and Technology, Malda, West Bengal': 'gfti-gkciet-malda',
  'Gurukula Kangri Vishwavidyalaya, Haridwar': 'gfti-gurukula-kangri',
  'Indian Institute of Carpet Technology, Bhadohi': 'gfti-iict-bhadohi',
  'Indian Institute of Engineering Science and Technology, Shibpur': 'gfti-iiest-shibpur',
  'Indian Institute of Handloom Technology, Salem': 'gfti-iiht-salem',
  'Indian Institute of Handloom Technology(IIHT), Varanasi': 'gfti-iiht-varanasi',
  'Institute of Chemical Technology, Mumbai: Indian Oil Odisha Campus, Bhubaneswar': 'gfti-ict-odisha',
  'Institute of Engineering and Technology, Dr. H. S. Gour University. Sagar (A Central University)': 'gfti-iet-sagar',
  'Institute of Infrastructure, Technology, Research and Management-Ahmedabad': 'gfti-iitram',
  'J.K. Institute of Applied Physics & Technology, Department of Electronics & Communication, University of Allahabad- Allahabad': 'gfti-jk-allahabad',
  'Jawaharlal Nehru University, Delhi': 'gfti-jnu-delhi',
  'Mizoram University, Aizawl': 'gfti-mizoram-university',
  'National Institute of Advanced Manufacturing Technology, Ranchi': 'gfti-niamt-ranchi',
  'National Institute of Electronics and Information Technology, Aurangabad (Maharashtra)': 'gfti-nielit-aurangabad',
  'National Institute of Food Technology Entrepreneurship and Management, Kundli': 'gfti-niftem-kundli',
  'National Institute of Food Technology Entrepreneurship and Management, Thanjavur': 'gfti-niftem-thanjavur',
  'North Eastern Regional Institute of Science and Technology, Nirjuli-791109 (Itanagar),Arunachal Pradesh': 'gfti-nerist',
  'North-Eastern Hill University, Shillong': 'gfti-nehu-shillong',
  'Puducherry Technological University, Puducherry': 'gfti-ptu-puducherry',
  'Punjab Engineering College, Chandigarh': 'gfti-pec-chandigarh',
  'Sant Longowal Institute of Engineering and Technology': 'gfti-sliet',
  'School of Engineering, Tezpur University, Napaam, Tezpur': 'gfti-tezpur-university',
  'School of Planning & Architecture, Bhopal': 'gfti-spa-bhopal',
  'School of Planning & Architecture, New Delhi': 'gfti-spa-delhi',
  'School of Planning & Architecture: Vijayawada': 'gfti-spa-vijayawada',
  'School of Studies of Engineering and Technology, Guru Ghasidas Vishwavidyalaya, Bilaspur': 'gfti-ggv-bilaspur',
  'Shri Mata Vaishno Devi University, Katra, Jammu & Kashmir': 'gfti-smvdu-katra',
  'University of Hyderabad': 'gfti-uoh',

  // ── GFTIs first appearing / missed in 2025 data ────────────────────────────
  // CSV names copied verbatim from scripts/college-predictor/data/josaa_2025.csv.
  // Do NOT normalise punctuation here — ingest_josaa_csv.js matches by exact
  // string, and the JoSAA CSV is the canonical source.
  'Islamic University of Science and Technology Kashmir': 'gfti-iust-kashmir',
  'National Institute of Electronics and Information Technology, Ajmer (Rajasthan)': 'gfti-nielit-ajmer',
  'National Institute of Electronics and Information Technology, Gorakhpur (UP)': 'gfti-nielit-gorakhpur',
  'National Institute of Electronics and Information Technology, Patna (Bihar)': 'gfti-nielit-patna',
  'National Institute of Electronics and Information Technology, Ropar (Punjab)': 'gfti-nielit-ropar',
  'Rajiv Gandhi National Aviation University, Fursatganj, Amethi (UP)': 'gfti-rgnau-amethi',
  'Shri G. S. Institute of Technology and Science Indore': 'gfti-sgsits-indore',
};

module.exports = { INSTITUTE_NAME_TO_SLUG };
