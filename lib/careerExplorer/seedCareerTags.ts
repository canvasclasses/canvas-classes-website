// School-subject and evergreen-sector tags for each career.
// Kept separate from seedCareers.ts so the main seed file stays readable.
//
// School subjects use the Class 9–12 Indian curriculum vocabulary students
// actually recognise (not US-style "Social Studies"). Evergreen sectors
// come from the "We Will Always Need" framing — human needs that never
// disappear, used on the career page as a parent-persuasion reassurance.

export type EvergreenSector =
  | 'Food & Agriculture'
  | 'Clothing & Textiles'
  | 'Shelter & Construction'
  | 'Transportation'
  | 'Safety & Security'
  | 'Education'
  | 'Health Care'
  | 'Computers & Digital'
  | 'Entertainment & Media'
  | 'Energy & Environment'
  | 'Finance & Commerce'
  | 'Governance & Public Service';

export interface CareerTag {
  school_subjects: string[];
  evergreen_sector: EvergreenSector;
}

// Indian school-subject vocabulary (Class 9–12).
// Using the exact labels students see on their marksheets.
export const SCHOOL_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'Hindi / Regional Language',
  'History',
  'Geography',
  'Political Science',
  'Economics',
  'Accountancy',
  'Business Studies',
  'Psychology',
  'Sociology',
  'Fine Arts',
  'Music',
  'Physical Education',
  'Environmental Science',
] as const;

export const CAREER_TAGS: Record<string, CareerTag> = {
  // ── Engineering / tech ─────────────────────────────────────────────────
  'software-engineer': {
    school_subjects: ['Mathematics', 'Computer Science', 'Physics', 'English'],
    evergreen_sector: 'Computers & Digital',
  },
  'mechanical-engineer': {
    school_subjects: ['Mathematics', 'Physics', 'Chemistry'],
    evergreen_sector: 'Transportation',
  },
  'electrical-engineer': {
    school_subjects: ['Mathematics', 'Physics', 'Computer Science'],
    evergreen_sector: 'Energy & Environment',
  },
  'civil-engineer': {
    school_subjects: ['Mathematics', 'Physics', 'Geography'],
    evergreen_sector: 'Shelter & Construction',
  },
  'chemical-engineer': {
    school_subjects: ['Mathematics', 'Chemistry', 'Physics'],
    evergreen_sector: 'Energy & Environment',
  },

  // ── Health care ────────────────────────────────────────────────────────
  'physician': {
    school_subjects: ['Biology', 'Chemistry', 'Physics', 'English'],
    evergreen_sector: 'Health Care',
  },
  'dentist': {
    school_subjects: ['Biology', 'Chemistry', 'Physics'],
    evergreen_sector: 'Health Care',
  },
  'clinical-psychologist': {
    school_subjects: ['Psychology', 'Biology', 'English', 'Sociology'],
    evergreen_sector: 'Health Care',
  },
  'nurse': {
    school_subjects: ['Biology', 'Chemistry', 'English'],
    evergreen_sector: 'Health Care',
  },
  'pharmacist': {
    school_subjects: ['Chemistry', 'Biology', 'Physics'],
    evergreen_sector: 'Health Care',
  },
  'veterinarian': {
    school_subjects: ['Biology', 'Chemistry', 'Physics'],
    evergreen_sector: 'Health Care',
  },

  // ── Data / AI ──────────────────────────────────────────────────────────
  'data-scientist': {
    school_subjects: ['Mathematics', 'Computer Science', 'Economics', 'Physics'],
    evergreen_sector: 'Computers & Digital',
  },
  'ml-engineer': {
    school_subjects: ['Mathematics', 'Computer Science', 'Physics'],
    evergreen_sector: 'Computers & Digital',
  },
  'cybersecurity-analyst': {
    school_subjects: ['Computer Science', 'Mathematics', 'English'],
    evergreen_sector: 'Safety & Security',
  },
  'ai-trainer': {
    school_subjects: ['English', 'Computer Science', 'Psychology', 'Mathematics'],
    evergreen_sector: 'Computers & Digital',
  },

  // ── Design / creative ──────────────────────────────────────────────────
  'ux-designer': {
    school_subjects: ['Fine Arts', 'Computer Science', 'Psychology', 'English'],
    evergreen_sector: 'Computers & Digital',
  },
  'graphic-designer': {
    school_subjects: ['Fine Arts', 'Computer Science', 'English'],
    evergreen_sector: 'Entertainment & Media',
  },
  'architect': {
    school_subjects: ['Mathematics', 'Fine Arts', 'Physics', 'Geography'],
    evergreen_sector: 'Shelter & Construction',
  },

  // ── Business / finance ─────────────────────────────────────────────────
  'product-manager': {
    school_subjects: ['English', 'Mathematics', 'Economics', 'Psychology'],
    evergreen_sector: 'Computers & Digital',
  },
  'chartered-accountant': {
    school_subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'],
    evergreen_sector: 'Finance & Commerce',
  },
  'investment-banker': {
    school_subjects: ['Economics', 'Mathematics', 'Accountancy', 'English'],
    evergreen_sector: 'Finance & Commerce',
  },
  'management-consultant': {
    school_subjects: ['Economics', 'Mathematics', 'English', 'Business Studies'],
    evergreen_sector: 'Finance & Commerce',
  },
  'entrepreneur-founder': {
    school_subjects: ['Business Studies', 'Economics', 'English', 'Mathematics'],
    evergreen_sector: 'Finance & Commerce',
  },

  // ── Law / public service ───────────────────────────────────────────────
  'lawyer': {
    school_subjects: ['English', 'Political Science', 'History', 'Economics'],
    evergreen_sector: 'Safety & Security',
  },
  'civil-services': {
    school_subjects: ['History', 'Political Science', 'Geography', 'English', 'Economics'],
    evergreen_sector: 'Governance & Public Service',
  },
  'urban-planner': {
    school_subjects: ['Geography', 'Mathematics', 'Economics', 'Political Science'],
    evergreen_sector: 'Shelter & Construction',
  },

  // ── Education / media / social ─────────────────────────────────────────
  'teacher': {
    school_subjects: ['English', 'Psychology', 'Hindi / Regional Language'],
    evergreen_sector: 'Education',
  },
  'counsellor': {
    school_subjects: ['Psychology', 'Sociology', 'English', 'Biology'],
    evergreen_sector: 'Health Care',
  },
  'content-creator': {
    school_subjects: ['English', 'Fine Arts', 'Computer Science', 'Psychology'],
    evergreen_sector: 'Entertainment & Media',
  },
  'journalist': {
    school_subjects: ['English', 'Political Science', 'History', 'Sociology'],
    evergreen_sector: 'Entertainment & Media',
  },

  // ── Science / research / climate ───────────────────────────────────────
  'research-scientist': {
    school_subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    evergreen_sector: 'Education',
  },
  'climate-risk-analyst': {
    school_subjects: ['Geography', 'Economics', 'Environmental Science', 'Mathematics'],
    evergreen_sector: 'Energy & Environment',
  },
  'genomics-biotech-researcher': {
    school_subjects: ['Biology', 'Chemistry', 'Mathematics', 'Computer Science'],
    evergreen_sector: 'Health Care',
  },
};
