import { User } from '../types';

export const fallbackConfig = {
  apiKey: "AIzaSyBG-E6BiZURXhJWYkEPz1VdhyWh7d_5Lqo",
  authDomain: "mla-office-tanur.firebaseapp.com",
  projectId: "mla-office-tanur",
  storageBucket: "mla-office-tanur.firebasestorage.app",
  messagingSenderId: "281012204033",
  appId: "1:281012204033:web:c50d355795431123728600"
};

export const DEFAULT_CATEGORIES = [
  'CMDRF',
  'NORKA Santhwana',
  'tgrantz',
  'Invitation',
  'Road Complaint',
  'Help Request',
  'Personal Complaint',
  'Confidential Info'
];

export const DEFAULT_DESIGNATIONS = [
  'Citizen',
  'Panchayath President',
  'Panchayath Secretary',
  'Ward Member',
  'Asha Worker',
  'Political Leader',
  'Others'
];

export const INPUT_TYPES = [
  'Letter',
  'Phone Call',
  'Direct Visit',
  'WhatsApp Message',
  'Email',
  'Others'
];

export const LOCAL_BODIES = [
  'Tanur Municipality',
  'Tanalur Panchayath',
  'Ozhur Panchayath',
  'Cheriyamundam Panchayath',
  'Ponmundam Panchayath',
  'Niramaruthur Panchayath',
  'Other'
];

export const EXT_LINKS: Record<string, string> = {
  'CMDRF': 'https://donation.cmdrf.kerala.gov.in/',
  'NORKA Santhwana': 'https://sso.norkaroots.kerala.gov.in/login?ref=main&client_id=99dd0c83-dad4-4cb7-90e4-19e9f1ffe7e5',
  'tgrantz': 'https://tgrantz.kerala.gov.in/'
};

export const DEFAULT_USERS: User[] = [
  { id: 'admin', name: 'PK Navas (MLA)', role: 'admin', pass: 'Navas@2026', enabled: true, canInput: true, canSeeReports: true, canSeeGlobal: true, phone: '', whatsapp: '' },
  { id: 'off1', name: 'Abdul Shukoor NK', role: 'officer', pass: 'Input@2026', enabled: true, canInput: true, canSeeReports: false, canSeeGlobal: false, phone: '', whatsapp: '' },
  { id: 'off2', name: 'P Musthafa', role: 'officer', pass: 'Off2@2026', enabled: true, canInput: false, canSeeReports: false, canSeeGlobal: false, phone: '', whatsapp: '' },
  { id: 'off3', name: 'Sadiq', role: 'officer', pass: 'Off3@2026', enabled: true, canInput: false, canSeeReports: false, canSeeGlobal: false, phone: '', whatsapp: '' },
  { id: 'off4', name: 'Falah', role: 'officer', pass: 'Off4@2026', enabled: true, canInput: false, canSeeReports: false, canSeeGlobal: false, phone: '', whatsapp: '' },
  { id: 'off5', name: 'Abhilash', role: 'officer', pass: 'Off5@2026', enabled: true, canInput: false, canSeeReports: false, canSeeGlobal: false, phone: '', whatsapp: '' },
];

export const ISLAMIC_QUOTES = [
  {
    arabic: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُمْ بَيْنَ النَّاسِ أَنْ تَحْكُمُوا بِالْعَدْلِ ۚ",
    malayalam: "തീർച്ചയായും അമാനത്തുകൾ (ബാധ്യതകൾ) അതിൻ്റെ അവകാശികൾക്ക് കൊടുത്തു വീട്ടണമെന്നും, ജനങ്ങൾക്കിടയിൽ തീർപ്പുകൽപ്പിക്കുകയാണെങ്കിൽ നീതിയോടെ വേണം തീർപ്പുകൽപ്പിക്കാനെന്നും അല്ലാഹു നിങ്ങളോട് കൽപ്പിക്കുന്നു. (ഖുർആൻ 4:58)"
  },
  {
    arabic: "اعْدِلُوا هُوَ أَقْرَبُ لِلتَّقْوَىٰ ۖ",
    malayalam: "നിങ്ങൾ നീതി പാലിക്കുക; അതാണ് ഭക്തിയോട് ഏറ്റവും അടുത്തത്. (ഖുർആൻ 5:8)"
  },
  {
    arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    malayalam: "ജനങ്ങളിൽ ഏറ്റവും ഉത്തമൻ ജനങ്ങൾക്ക് ഏറ്റവും ഉപകാരം ചെയ്യുന്നവനാണ്. (ഹദീസ്)"
  }
];
