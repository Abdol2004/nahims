if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const connectDB = require('../config/db');
const { Site, Executive, Event, News, Chapter, Material, VideoLecture, Sports, Admin } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  await connectDB();
  console.log('Seeding database...');

  // Clear all collections
  await Promise.all([
    Site.deleteMany({}), Executive.deleteMany({}), Event.deleteMany({}),
    News.deleteMany({}), Chapter.deleteMany({}), Material.deleteMany({}),
    VideoLecture.deleteMany({}), Sports.deleteMany({}), Admin.deleteMany({})
  ]);

  // ── Site ──────────────────────────────────────────
  await Site.create({
    name: 'NAHIMS SW',
    fullName: 'National Association of Health Information Management Students',
    zone: 'Southwest Zone (Zone D)',
    email: 'nahimssw@gmail.com',
    phone: '+234 7048594341',
    twitter: '@nahimssw',
    instagram: '@nahimssw',
    facebook: 'NAHIMS SW',
    tiktok: '@nahimssw',
    whatsapp: '',
    youtubeTV: '',
    stats: { chapters: '24', members: '3,000+', states: '7', years: '12' },
    popup: {
      enabled: true,
      whatsappUrl: '',
      xUrl: 'https://x.com/nahimssw',
      facebookUrl: '',
      tiktokUrl: '',
      youtubeTVUrl: ''
    },
    announcements: [
      'NAHIMS SW Annual Games 2026 – Registration Open Now!',
      'New study materials uploaded for HIM 301 – Check Academic Page',
      'Annual Due payment deadline: April 31, 2027',
      'NAHIMS SW Convention 2026 – Akure, June 3–7',
      'Chapter reports for Q3 due end of month'
    ]
  });

  // ── Admin ──────────────────────────────────────────
  const hashedPw = await bcrypt.hash('admin123', 10);
  await Admin.create({ username: 'admin', password: hashedPw, name: 'NAHIMS SW Admin' });

  // ── Executives ──────────────────────────────────────
  await Executive.insertMany([
    { name: 'Olamide Adesanya',     position: 'Zonal President',           school: 'University of Ibadan',        initials: 'OA', color: '#EF9F27', type: 'main', order: 1 },
    { name: 'Toluwalope Fashola',   position: 'Vice President',            school: 'LAUTECH, Ogbomoso',           initials: 'TF', color: '#0B6E4F', type: 'main', order: 2 },
    { name: 'Abdulfatah Abdullahi', position: 'Zonal General Secretary',   school: 'OSCOHEALTH, Ilesa',           initials: 'AA', color: '#0B6E4F', type: 'main', order: 3 },
    { name: 'Kehinde Ogunleye',     position: 'Financial Secretary',       school: 'OAU, Ile-Ife',                initials: 'KO', color: '#0B6E4F', type: 'main', order: 4 },
    { name: 'Fatima Ibrahim',       position: 'Public Relations Officer',  school: 'UNIBEN, Benin City',          initials: 'FI', color: '#0B6E4F', type: 'main', order: 5 },
    { name: 'Babajide Dada',        position: 'Sports Director',           school: 'Olabisi Onabanjo University', initials: 'BD', color: '#0B6E4F', type: 'main', order: 6 },
    { name: 'Aisha Yusuf',          position: 'Director of Tech & Innovation', school: 'UI, Ibadan',              initials: 'AY', color: '#0B6E4F', type: 'appointee', order: 1 },
    { name: 'Samuel Okonkwo',       position: 'Director of Welfare',       school: 'FUNAAB, Abeokuta',           initials: 'SO', color: '#0B6E4F', type: 'appointee', order: 2 }
  ]);

  // ── Events ──────────────────────────────────────────
  await Event.insertMany([
    {
      title: 'Pad A Girl Initiative', slug: 'pad-a-girl-2024', category: 'Social', eventType: 'general',
      organizer: 'Comrade Waheed Aliyat Olajumoke', organizerRole: 'Welfare Director',
      date: '2024-10-15', location: 'University of Ibadan',
      description: 'The Pad A Girl Initiative is a menstrual hygiene outreach programme that provides free sanitary products and reproductive health education to underprivileged female students across the Southwest Zone.',
      fullContent: "The Pad A Girl Initiative stands as one of NAHIMS SW's most impactful social responsibility programmes. Under the passionate leadership of Comrade Waheed Aliyat Olajumoke, the initiative distributed free sanitary pads and educated young women on menstrual hygiene management.\n\nThe 2024 edition reached 6 chapters across the Southwest, impacting over 500 girls.",
      image: '/images/events/1781429958429.jpeg', featured: true, published: true
    },
    {
      title: 'Onboard3 Web3 Meetup OSCOHEALTH', slug: 'him-tech-summit-2024', category: 'Technology', eventType: 'general',
      organizer: 'Comrade Abdulfatah Abdullahi', organizerRole: 'Zonal General Secretary',
      date: '2026-03-27', location: 'OSCOHEALTH, Ilesa',
      description: 'A groundbreaking technology event exploring the intersection of digital innovation. Hosted by Comrade Abdulfatah Abdullahi, the summit featured live demos of web3, blockchain workshops, and presentations by industry professionals.',
      fullContent: "The Onboard3 Web3 Meetup OSCOHEALTH 2026 marked a new era for NAHIMS SW's engagement with technology.",
      image: '/images/events/1781430132583.jpg', featured: true, published: true
    },
    {
      title: 'Onboard3 Web3 Meetup UITH', slug: 'digital-health-workshop-2024', category: 'Technology', eventType: 'general',
      organizer: 'Comrade Abdulfatah Abdullahi', organizerRole: 'Zonal General Secretary',
      date: '2026-03-14', location: 'University of Ilorin Teaching Hospital',
      description: 'A hands-on workshop on web3, mobile health applications, and money making in web3.',
      fullContent: 'Following the massive success of the HIM Tech Summit, Comrade Abdulfatah Abdullahi returned with an even more practical offering.',
      image: '/images/events/1781430285530.jpg', featured: true, published: true
    },
    {
      title: 'NAHIMS SW Annual Convention 2026', slug: 'convention-2026', category: 'Convention', eventType: 'general',
      organizer: 'Past President Comrade Ajayi Abiodun Greatness', organizerRole: 'Past Zonal President',
      date: '2026-06-03', location: 'CHTA, Akure',
      description: 'The landmark annual convention hosted under the administration of Past President Comrade Ajayi Abiodun Greatness. A five-day event that brought together all 15 chapters.',
      fullContent: "Under the visionary leadership of Past President Comrade Ajayi Abiodun Greatness, the 2026 NAHIMS SW Annual Convention became the most impactful in the association's history.",
      image: '/images/events/1781430742651.jpg', featured: true, published: true
    },
    {
      title: 'HIM Career Fair & Mentorship Day', slug: 'him-career-fair-2024', category: 'Academic', eventType: 'academic',
      organizer: 'NAHIMS SW Academic Committee', organizerRole: 'Academic Director',
      date: '2024-10-20', location: 'OAU, Ile-Ife',
      description: 'HIM professionals from hospitals and government agencies mentored over 150 students on career opportunities in health information management.',
      fullContent: 'The HIM Career Fair & Mentorship Day brought together leading professionals in health information management to guide students on career paths, industry trends, and skill requirements.',
      image: '', featured: false, published: true
    },
    {
      title: 'EHR & Digital Health Workshop', slug: 'ehr-workshop-2024', category: 'Academic', eventType: 'academic',
      organizer: 'NAHIMS SW Academic Committee', organizerRole: 'Academic Director',
      date: '2024-08-15', location: 'LAUTECH, Ogbomoso',
      description: 'Hands-on workshop on electronic health record systems and hospital information management.',
      fullContent: 'The EHR & Digital Health Workshop provided students with practical experience in modern health information systems.',
      image: '', featured: false, published: true
    }
  ]);

  // ── News ──────────────────────────────────────────
  await News.insertMany([
    {
      title: 'NAHIMS SW Annual Due 2026/2027 – Registration Open', slug: 'due-registration-2026',
      category: 'Official', date: '2025-01-05', author: 'Admin',
      excerpt: 'The 2026/2027 annual due registration is open and all chapters are advised to start making payment.',
      content: 'The 2026/2027 annual dues registration is now open. All chapters are advised to begin payment processing and complete their registrations within the stipulated period.',
      image: '', published: true
    },
    {
      title: '2025 Annual Due Payment Notice', slug: 'due-notice-2025',
      category: 'Finance', date: '2026-06-24', author: 'Financial Secretary',
      excerpt: 'All chapters are reminded to pay their 2025 annual dues before April 31, 2027.',
      content: 'All NAHIMS SW chapters are hereby notified to complete payment of their 2027 annual dues on or before April 31, 2027.',
      image: '', published: true
    }
  ]);

  // ── Chapters (all new — president left empty) ──────
  await Chapter.insertMany([
    // Lagos (3)
    { school: 'Lagos University Teaching Hospital (LUTH)',            state: 'Lagos',  president: '', phone: '', due: 'Pending' },
    { school: 'Lagos State College of Health Technology (LASCOHET), Yaba', state: 'Lagos', president: '', phone: '', due: 'Pending' },
    { school: 'Trinity University, Yaba',                            state: 'Lagos',  president: '', phone: '', due: 'Pending' },
    // Oyo (2)
    { school: 'School of Health Information Management (SHIM), UCH, Ibadan', state: 'Oyo', president: '', phone: '', due: 'Pending' },
    { school: 'Oyo State College of Health Science and Technology (OYSCOHEST), Eleyele, Ibadan', state: 'Oyo', president: '', phone: '', due: 'Pending' },
    // Ogun (2)
    { school: 'Ogun State College of Health Technology, Ilese',      state: 'Ogun',   president: '', phone: '', due: 'Pending' },
    { school: 'Ogun State Polytechnic of Health and Allied Sciences (OSPOHAS)', state: 'Ogun', president: '', phone: '', due: 'Pending' },
    // Osun (7)
    { school: 'Obafemi Awolowo University Teaching Hospital Complex (OAUTHC), Ile-Ife', state: 'Osun', president: '', phone: '', due: 'Pending' },
    { school: 'Osun State College of Health Technology, Ilesa',      state: 'Osun',   president: '', phone: '', due: 'Pending' },
    { school: 'Adeleke University',                                   state: 'Osun',   president: '', phone: '', due: 'Pending' },
    { school: 'Ikirun College of Health Technology, Ikirun',         state: 'Osun',   president: '', phone: '', due: 'Pending' },
    { school: 'University of Osun (UNIOSUN)',                        state: 'Osun',   president: '', phone: '', due: 'Pending' },
    { school: 'University of Ilesa (UNIILESA)',                      state: 'Osun',   president: '', phone: '', due: 'Pending' },
    { school: 'Oluwabunmi College of Health Science and Technology, Alaasan', state: 'Osun', president: '', phone: '', due: 'Pending' },
    // Ekiti (2)
    { school: 'Ekiti State College of Health Sciences and Technology (ESCOHST), Ijero-Ekiti', state: 'Ekiti', president: '', phone: '', due: 'Pending' },
    { school: 'FABOTAS College of Health Sciences and Technology, Ado-Ekiti', state: 'Ekiti', president: '', phone: '', due: 'Pending' },
    // Ondo (6)
    { school: 'College of Health Technology, Akure (CHTA)',          state: 'Ondo',   president: '', phone: '', due: 'Pending' },
    { school: 'University of Medical Sciences (UNIMED), Ondo City',  state: 'Ondo',   president: '', phone: '', due: 'Pending' },
    { school: 'Millennium College of Health Technology',             state: 'Ondo',   president: '', phone: '', due: 'Pending' },
    { school: 'Wesley University',                                   state: 'Ondo',   president: '', phone: '', due: 'Pending' },
    { school: 'Achievers University',                                state: 'Ondo',   president: '', phone: '', due: 'Pending' },
    { school: 'Margaret Mosunmola College of Health Sciences and Technology', state: 'Ondo', president: '', phone: '', due: 'Pending' },
    // Kwara (1)
    { school: 'College of Health Technology, Offa',                  state: 'Kwara',  president: '', phone: '', due: 'Pending' },
    // Lead City (Oyo)
    { school: 'Lead City University, Ibadan',                        state: 'Oyo',    president: '', phone: '', due: 'Pending' }
  ]);

  // ── Materials ─────────────────────────────────────
  await Material.insertMany([
    { title: 'HIM 301 – Health Record Management',   description: 'Lecture notes + past questions (2020–2024)', category: '300 Level', icon: 'file-text',  file: '' },
    { title: 'HIM 401 – Health Information Systems', description: 'Full course notes and assignments',          category: '400 Level', icon: 'database',   file: '' },
    { title: 'HIM 201 – Medical Terminology',        description: 'Terminologies handbook + quiz sheets',       category: '200 Level', icon: 'book-open',  file: '' },
    { title: 'HIM 502 – Health Informatics',         description: 'Introduction to EHR and clinical data systems', category: '500 Level', icon: 'monitor', file: '' },
    { title: 'ICD-10 Coding Guide',                  description: 'Simplified ICD-10 coding reference for students', category: 'Reference', icon: 'clipboard', file: '' },
    { title: 'Research Methods in HIM',              description: 'Research methodology notes – 300 level',    category: '300 Level', icon: 'search',     file: '' }
  ]);

  // ── Video Lectures ────────────────────────────────
  await VideoLecture.insertMany([
    { title: 'Introduction to Electronic Health Records',   lecturer: 'Dr. Adeyemi Oluwole',      duration: '45 mins',    youtubeUrl: '', icon: 'monitor',     order: 1 },
    { title: 'Health Data Quality Management',             lecturer: 'Prof. Folake Balogun',      duration: '52 mins',    youtubeUrl: '', icon: 'bar-chart-2', order: 2 },
    { title: 'Medical Coding – ICD-10 Basics',            lecturer: 'Mr. Tunde Akinola',         duration: '38 mins',    youtubeUrl: '', icon: 'clipboard',   order: 3 },
    { title: 'Career Pathways in HIM – Panel Discussion', lecturer: 'NAHIMS SW Career Day 2024', duration: '1hr 20mins', youtubeUrl: '', icon: 'users',       order: 4 }
  ]);

  // ── Sports ────────────────────────────────────────
  await Sports.create({
    schools: [
      'Lagos University Teaching Hospital (LUTH)',
      'Lagos State College of Health Technology (LASCOHET)',
      'School of Health Information Management (SHIM), UCH',
      'Oyo State College of Health Science and Technology (OYSCOHEST)',
      'Ogun State College of Health Technology, Ilese',
      'Osun State College of Health Technology, Ilesa',
      'Ekiti State College of Health Sciences and Technology (ESCOHST)',
      'College of Health Technology, Akure (CHTA)',
      'University of Medical Sciences (UNIMED)',
      'College of Health Technology, Offa'
    ],
    sportLeague: [
      { pos:1, team:'LUTH',         p:8, w:6, d:1, l:1, gf:18, ga:7,  pts:19, form:['W','W','D','W','W'] },
      { pos:2, team:'LASCOHET',     p:8, w:5, d:2, l:1, gf:15, ga:8,  pts:17, form:['W','D','W','W','L'] },
      { pos:3, team:'SHIM UCH',     p:8, w:4, d:2, l:2, gf:14, ga:10, pts:14, form:['W','L','D','W','W'] },
      { pos:4, team:'OYSCOHEST',    p:8, w:4, d:1, l:3, gf:12, ga:11, pts:13, form:['L','W','W','L','W'] },
      { pos:5, team:'CHTA',         p:8, w:3, d:1, l:4, gf:10, ga:14, pts:10, form:['L','L','W','W','L'] },
      { pos:6, team:'UNIMED',       p:8, w:2, d:2, l:4, gf:9,  ga:14, pts:8,  form:['L','W','D','L','L'] },
      { pos:7, team:'ESCOHST',      p:8, w:1, d:2, l:5, gf:6,  ga:16, pts:5,  form:['L','D','L','L','D'] },
      { pos:8, team:'Offa CoHT',    p:8, w:0, d:3, l:5, gf:4,  ga:18, pts:3,  form:['D','L','L','D','L'] }
    ],
    fixtures: [
      { home:'LUTH',     away:'LASCOHET',  date:'2025-02-15', time:'14:00', venue:'LUTH Sports Ground',  matchday:9, status:'upcoming' },
      { home:'SHIM UCH', away:'OYSCOHEST', date:'2025-02-15', time:'16:00', venue:'UCH Sports Complex',   matchday:9, status:'upcoming' },
      { home:'CHTA',     away:'UNIMED',    date:'2025-02-16', time:'12:00', venue:'CHTA Akure',           matchday:9, status:'upcoming' },
      { home:'ESCOHST',  away:'Offa CoHT', date:'2025-02-16', time:'14:00', venue:'ESCOHST Ijero-Ekiti',  matchday:9, status:'upcoming' }
    ],
    results: [
      { home:'LUTH',     away:'ESCOHST',  homeScore:3, awayScore:1, date:'2025-01-25', matchday:8, scorers:"Babatunde 22', 67' | Aminu 41'" },
      { home:'LASCOHET', away:'Offa CoHT',homeScore:2, awayScore:0, date:'2025-01-25', matchday:8, scorers:"Adeleke 35' • Okoye 88'" },
      { home:'OYSCOHEST',away:'SHIM UCH', homeScore:1, awayScore:1, date:'2025-01-26', matchday:8, scorers:"Eze 55' | Salami 70'" }
    ],
    liveMatch: { enabled: false, home: '', away: '', homeScore: 0, awayScore: 0, minute: 0, status: '' }
  });

  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
