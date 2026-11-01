export interface PersonalInfo {
  name: string;
  shortName: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  cgpa: string;
  college: string;
}

export const PERSONAL_INFO: PersonalInfo = {
  name: 'Pranav M.',
  shortName: 'PM',
  title: 'Frontend Developer | AI/ML Practitioner',
  tagline: 'Building interactive web experiences and practical AI/ML projects, combining modern frontend development with problem-solving.',
  bio: 'Computer Science and Technology student at SNS College of Engineering with an active focus on modern frontend engineering, high-performance web applications, and applied AI/ML systems. I engineer intuitive interfaces that connect predictive intelligence with practical real-world utility.',
  email: 'pranav.m.cst.2024@snsce.ac.in',
  github: 'https://github.com/pranav-m2006',
  linkedin: 'https://www.linkedin.com/in/pranav-m-23153a32b/',
  location: 'Coimbatore, Tamil Nadu, India',
  cgpa: '8.00 / 10.0',
  college: 'SNS College of Engineering',
};

export interface TechItem {
  name: string;
  category: string;
  purpose: string;
  color?: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  badge: string;
  overview: string;
  problem: string;
  targetUsers: string;
  solution: string;
  features: string[];
  technologies: TechItem[];
  myContribution: string[];
  workflow: { step: string; title: string; description: string }[];
  githubUrl: string;
  liveDemoUrl?: string; // STRICT: undefined for Disaster Management!
  previewImage: string;
  previewAlt: string;
  accentColor: string;
  stats?: { label: string; value: string }[];
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'ai-skill-twin',
    number: '01',
    title: 'AI Skill Twin',
    category: 'AI-Powered Career Intelligence Platform',
    badge: 'CAREER BENCHMARKING & GAP ANALYSIS',
    overview:
      'A skill-development and career-support platform designed to help students and job seekers understand their current skills, identify industry skill gaps, and plan structured professional growth.',
    problem:
      'Students and early-stage professionals frequently struggle to navigate fragmented coursework and ambiguous job postings, lacking objective, measurable insights into what specific skills they need for their target tech careers.',
    targetUsers:
      'Engineering students, career changers, and tech job seekers seeking structured skill roadmaps grounded in real industry expectations.',
    solution:
      'An intelligent web platform that assesses student competency profiles, evaluates them against real-world engineering benchmarks, and generates milestone-driven learning roadmaps using the Google Gemini API.',
    features: [
      'Interactive radar skill assessment and visual gap identification matrix',
      'Milestone-driven career progression roadmap with checkpoint completion tracking',
      'Gemini AI resume skill extraction and role-readiness matching',
      'Actionable course recommendations and verified learning milestones',
    ],
    technologies: [
      { name: 'React', category: 'Frontend UI', purpose: 'Component Architecture & State' },
      { name: 'TypeScript', category: 'Language', purpose: 'Type Safety & API Contracts' },
      { name: 'Tailwind CSS', category: 'Styling', purpose: 'Design System & Responsiveness' },
      { name: 'Google Gemini API', category: 'AI Engine', purpose: 'Resume Extraction & Gap Analysis' },
      { name: 'Node.js', category: 'Backend', purpose: 'Server Logic & API Dispatch' },
      { name: 'Vercel', category: 'Deployment', purpose: 'Continuous Integration & Edge CDN' },
    ],
    myContribution: [
      'Architected the modern responsive frontend in React & TypeScript with zero layout shift',
      'Designed and coded the interactive skill radar visualization and gap identification panels',
      'Integrated the Google Gemini API for automated resume parsing and intelligent curriculum matching',
      'Configured automated CI/CD deployment pipelines on Vercel',
    ],
    workflow: [
      { step: '01', title: 'Profile Ingestion', description: 'User enters technical skills, completed coursework, and target role.' },
      { step: '02', title: 'AI Gap Analysis', description: 'Gemini AI benchmarks profile against industry job standards to locate deficiencies.' },
      { step: '03', title: 'Roadmap Synthesis', description: 'Synthesizes phased learning milestones ordered by prerequisite urgency.' },
      { step: '04', title: 'Milestone Tracking', description: 'Dashboard tracks milestone completions and updates verified job-readiness.' },
    ],
    githubUrl: 'https://github.com/pranav-m2006/AI-skill-twin',
    liveDemoUrl: 'https://ai-skill-twin.vercel.app/login',
    previewImage: '/images/skill-twin-preview.svg',
    previewAlt: 'AI Skill Twin Career Platform Interface showing Skill Radar and Career Intelligence',
    accentColor: '#00F0FF',
    stats: [
      { label: 'Deployment', value: 'Live on Vercel' },
      { label: 'AI Model', value: 'Gemini 1.5 Pro/Flash' },
      { label: 'Role Tracks', value: 'Fullstack, AI, DevOps' },
    ],
  },
  {
    id: 'disaster-management',
    number: '02',
    title: 'Disaster Management System',
    category: 'AI/ML Weather Prediction & Risk Mitigation',
    badge: 'METEOROLOGICAL INTELLIGENCE & HAZARD MODELING',
    overview:
      'An AI/ML-based disaster management and mitigation platform focused on predictive meteorological modeling and precautionary guidance to help reduce the human and infrastructure impact of severe weather events.',
    problem:
      'Traditional regional disaster alert mechanisms frequently suffer from delayed dissemination and broad generalizations, leaving vulnerable communities without granular, actionable warning before floods and severe storms escalate.',
    targetUsers:
      'Regional disaster response teams, civic municipal operators, and local community leaders who need early weather risk intelligence.',
    solution:
      'An integrated AI/ML weather intelligence application combining historical storm telemetry with predictive classification algorithms to visualize localized hazard zones and deliver rapid precautionary advisories.',
    features: [
      'Predictive machine learning classifiers for rainfall intensity and flood surge probability',
      'Interactive geospatial risk mapping indicating hazard severity tiers and safe zones',
      'Automated, threshold-triggered precautionary guidance protocols for emergency responders',
      'Local meteorological telemetry dashboard with historical weather pattern comparisons',
    ],
    technologies: [
      { name: 'Python', category: 'Core Language', purpose: 'Model Training & Numerical Computing' },
      { name: 'Scikit-learn', category: 'Machine Learning', purpose: 'Predictive Classifier Algorithms' },
      { name: 'Pandas & NumPy', category: 'Data Pipeline', purpose: 'Telemetry Processing & Cleaning' },
      { name: 'React', category: 'Frontend', purpose: 'Hazard Dashboard & Telemetry UI' },
      { name: 'Leaflet / Maps', category: 'Geospatial', purpose: 'Regional Vulnerability Layers' },
      { name: 'FastAPI / Flask', category: 'Backend API', purpose: 'Local Inference API & Dispatch' },
    ],
    myContribution: [
      'Trained and validated predictive classification models on historical meteorological disaster datasets',
      'Designed the real-time geospatial hazard map and severity threshold visualization interface',
      'Built data ingestion pipelines for environmental parameters (rainfall intensity, atmospheric pressure)',
      'Engineered rule-based advisory generators for automated disaster precautionary guidance',
    ],
    workflow: [
      { step: '01', title: 'Data Ingestion', description: 'Streams atmospheric sensor inputs (precipitation, pressure, wind velocity).' },
      { step: '02', title: 'ML Hazard Inference', description: 'Trained Scikit-learn models evaluate probability of extreme flood/cyclone events.' },
      { step: '03', title: 'Geospatial Mapping', description: 'Projects predicted threat levels onto interactive regional map layers.' },
      { step: '04', title: 'Actionable Guidance', description: 'Dispatches targeted evacuation advisories and precautionary checklists to responders.' },
    ],
    githubUrl: 'https://github.com/pranav-m2006/Disaster-management',
    liveDemoUrl: undefined, // CRITICAL: strictly undefined - hosted locally per requirements!
    previewImage: '/images/disaster-screen.jpg',
    previewAlt: 'Disaster Management System Weather Intelligence and Flood Risk Dashboard',
    accentColor: '#38BDF8',
    stats: [
      { label: 'Environment', value: 'Local Runtime' },
      { label: 'Inference', value: 'Scikit-learn ML' },
      { label: 'Risk Coverage', value: 'Flood & Severe Weather' },
    ],
  },
];

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  responsibilities: string[];
  techPills: string[];
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    company: 'Thrivels',
    role: 'Frontend Developer Intern',
    period: 'Current / Present',
    location: 'Remote',
    isCurrent: true,
    responsibilities: [
      'Architecting responsive, high-fidelity user interface components using React and TypeScript',
      'Implementing modular UI design patterns and maintaining consistent design tokens across views',
      'Collaborating on frontend performance tuning, smooth transitions, and cross-device responsiveness',
      'Translating UX specifications into production-ready, clean, maintainable code',
    ],
    techPills: ['React', 'TypeScript', 'CSS3', 'Component Systems', 'Git'],
  },
  {
    company: 'CodSoft',
    role: 'Web Development Intern',
    period: 'Completed Internship',
    location: 'Remote',
    responsibilities: [
      'Developed multiple web project deliverables adhering to modern responsive web standards',
      'Implemented interactive UI logic, client-side data validation, and clean semantic layouts',
      'Practiced collaborative Git workflows, code reviews, and structured project milestones',
    ],
    techPills: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Git', 'Responsive Design'],
  },
  {
    company: 'InternPe',
    role: 'Web Development Intern',
    period: 'Completed Internship',
    location: 'Remote',
    responsibilities: [
      'Constructed foundational web applications focusing on layout responsiveness and clean styling',
      'Gained structured hands-on experience in frontend debugging and browser cross-compatibility',
      'Delivered sprint tasks on schedule while exploring modern frontend development best practices',
    ],
    techPills: ['HTML5', 'CSS3', 'JavaScript', 'Web Standards'],
  },
];

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  score: string;
  scoreLabel: string;
  highlights: string[];
}

export const EDUCATION: EducationItem[] = [
  {
    institution: 'SNS College of Engineering',
    degree: 'B.E. in Computer Science and Technology',
    period: '2023 – 2027',
    location: 'Coimbatore, Tamil Nadu, India',
    score: '8.00 / 10.0',
    scoreLabel: 'Cumulative CGPA',
    highlights: [
      'Core coursework in Data Structures, Algorithms, and Object-Oriented Systems',
      'Specialized focus in Applied AI/ML algorithms and modern Web Technologies',
      'Active participant in competitive hackathons, technical symposiums, and innovation initiatives',
    ],
  },
  {
    institution: 'Presentation Convent MHSS',
    degree: 'Higher Secondary Certificate (HSC) — Class XII',
    period: '2021 – 2023',
    location: 'Tamil Nadu, India',
    score: '92.0%',
    scoreLabel: 'Academic Score',
    highlights: [
      'Rigorous foundation in Mathematics, Computer Science, Physics, and Chemistry',
      'Built early programming foundations in algorithmic problem solving and logic',
      'Graduated with academic distinction and high scholastic honors',
    ],
  },
];

export interface SkillCategory {
  title: string;
  categoryKey: string;
  description: string;
  items: {
    name: string;
    description: string;
    tag: string;
  }[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Programming Languages',
    categoryKey: 'languages',
    description: 'Foundational languages used for systems engineering, algorithmic problem solving, and application logic.',
    items: [
      { name: 'Java', description: 'Object-oriented programming, data structures, and backend logic foundations.', tag: 'Core OOP' },
      { name: 'JavaScript', description: 'Modern ES6+ syntax, asynchronous operations, event-driven DOM scripting.', tag: 'Fullstack' },
      { name: 'C', description: 'Low-level memory management, pointers, and foundational computer science concepts.', tag: 'Systems' },
      { name: 'C++', description: 'High-performance computing, standard template library (STL), and competitive programming.', tag: 'Algorithms' },
    ],
  },
  {
    title: 'Frontend Development',
    categoryKey: 'frontend',
    description: 'Building high-fidelity, accessible, and responsive user interfaces with modern web standards.',
    items: [
      { name: 'HTML5', description: 'Semantic document structure, accessible ARIA landmarks, SEO best practices.', tag: 'Markup' },
      { name: 'CSS3', description: 'Modern layouts with Flexbox, CSS Grid, container queries, and custom properties.', tag: 'Styling' },
      { name: 'React.js', description: 'Declarative component architecture, custom hooks, virtual DOM optimization.', tag: 'Framework' },
    ],
  },
  {
    title: 'Backend Development',
    categoryKey: 'backend',
    description: 'Server runtime environments, API endpoints, and client-server communication.',
    items: [
      { name: 'Node.js', description: 'Event-driven server runtime, RESTful API design, and asynchronous stream handling.', tag: 'Server Runtime' },
    ],
  },
  {
    title: 'AI / Machine Learning',
    categoryKey: 'aiml',
    description: 'Practical machine learning implementations grounded in real project workflows and API orchestration.',
    items: [
      { name: 'AI/ML Fundamentals', description: 'Supervised learning workflows, training/validation pipelines, evaluation metrics.', tag: 'Core AI' },
      { name: 'Predictive Modeling', description: 'Classification algorithms, weather risk inference models as used in Disaster Management.', tag: 'Applied ML' },
      { name: 'LLM Orchestration', description: 'Gemini API integration, structured prompts, resume parsing for AI Skill Twin.', tag: 'GenAI & APIs' },
    ],
  },
  {
    title: 'Tools & Technologies',
    categoryKey: 'tools',
    description: 'Development environment tooling, version control workflows, and rapid interface builders.',
    items: [
      { name: 'Git', description: 'Distributed version control, branching strategies, and commit hygiene.', tag: 'Version Control' },
      { name: 'GitHub', description: 'Remote repositories, collaborative reviews, CI/CD actions, and project releases.', tag: 'Collaboration' },
      { name: 'FlutterFlow', description: 'Rapid low-code mobile interface prototyping and responsive UI modeling.', tag: 'Rapid Prototyping' },
    ],
  },
];

export interface AchievementItem {
  id: string;
  badge: string;
  title: string;
  issuer: string;
  summary: string;
  keyMetric: string;
  accent: 'cyan' | 'violet' | 'emerald' | 'amber';
}

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'hackmatrix',
    badge: 'PODIUM FINISH // CASH PRIZE & TROPHY',
    title: 'HackMatrix Hackathon — 3rd Place Winner',
    issuer: 'National Competitive Hackathon',
    summary:
      'Secured 3rd place overall in an intensive national-level competitive hackathon. Designed, coded, and demonstrated an end-to-end software system under time-constrained sprint conditions, evaluated by industry judges for technical architecture, feasibility, and user impact.',
    keyMetric: '3rd Place',
    accent: 'cyan',
  },
  {
    id: 'sih',
    badge: 'NATIONAL FINALIST',
    title: 'Smart India Hackathon (SIH 2025)',
    issuer: 'Ministry of Education & AICTE, Govt. of India',
    summary:
      'Selected as a National Finalist in India’s premier nationwide student innovation initiative. Collaborated on architecting digital solutions addressing pressing civic and technical problem statements defined by central government bodies.',
    keyMetric: 'Finalist',
    accent: 'violet',
  },
  {
    id: 'patents',
    badge: 'INTELLECTUAL PROPERTY',
    title: '2 Published Product Patents',
    issuer: 'Patent Office of India',
    summary:
      'Authored and formally published 2 product patents detailing technical methodologies in hardware-software integration and automated data collection systems, representing empirical research and documentation rigor.',
    keyMetric: '2 Patents',
    accent: 'emerald',
  },
  {
    id: 'leetcode',
    badge: 'ALGORITHMIC CONSISTENCY',
    title: '100-Day LeetCode Streak',
    issuer: 'LeetCode Platform',
    summary:
      'Demonstrated disciplined continuous problem-solving, tackling data structures and algorithmic challenges across trees, graphs, dynamic programming, and binary search patterns.',
    keyMetric: '100+ Days',
    accent: 'amber',
  },
];

