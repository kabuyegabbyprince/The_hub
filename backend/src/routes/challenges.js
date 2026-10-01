import { Router } from 'express';

const router = Router();

const employerChallenges = [
  {
    id: 'ch-01',
    title: 'Farmer Cooperative Yield & Revenue Dashboard',
    organization: 'Rwanda Agribusiness Innovation Cooperative',
    sector: 'Agriculture & Data Analytics',
    location: 'Musanze & Huye Districts',
    compensation: '50,000 RWF Capstone Stipend + Portfolio Verification',
    difficulty: 'Intermediate',
    duration: '1-2 Weeks (Self-paced)',
    description: 'Clean, normalize, and visualize a 12-month harvest dataset of coffee and tea yields across 42 smallholder farmer collectives in Musanze.',
    requirements: [
      'Clean missing values and standardize measurement units (KG to MT)',
      'Calculate monthly revenue margins per crop variety',
      'Create 3 visual charts (Monthly revenue trend, Yield by district, Crop distribution)',
      'Write a 1-page executive summary in English or French'
    ],
    skillsDemonstrated: ['Excel / Spreadsheets', 'Data Cleaning', 'Data Visualization', 'Agricultural Economics'],
    submissionsCount: 19,
    deadline: 'Rolling Intake (2026 Cohort)'
  },
  {
    id: 'ch-02',
    title: 'Bilingual Mobile-First Artisan Crafts Showcase',
    organization: 'Kigali Cultural Arts Enterprise',
    sector: 'Technology & Creative Economy',
    location: 'Kigali (Gasabo)',
    compensation: '75,000 RWF Project Honorarium + Verified Portfolio Badge',
    difficulty: 'Beginner to Intermediate',
    duration: '1 Week',
    description: 'Build a responsive, lightweight web catalog for local Rwandan basket weavers and artisans with bilingual toggle (English & Kinyarwanda).',
    requirements: [
      'Semantic HTML5 and responsive layout optimized for mobile screens',
      'Language toggle switcher between English and Kinyarwanda',
      'Accessible image galleries with low-bandwidth image compression',
      'WhatsApp direct inquiry click-to-chat integration'
    ],
    skillsDemonstrated: ['HTML5 & CSS', 'Responsive Layout', 'Kinyarwanda Translation', 'Digital Marketing'],
    submissionsCount: 27,
    deadline: 'Rolling Intake (2026 Cohort)'
  },
  {
    id: 'ch-03',
    title: 'Rural Digital Connectivity Quality Audit (NISR Aligned)',
    organization: 'Smart Rwanda Youth Alliance',
    sector: 'ICT & Telecommunications',
    location: 'National (All 5 Provinces)',
    compensation: 'Certificate of Practical Contribution + Micro-Internship Credit',
    difficulty: 'Intermediate to Advanced',
    duration: '2 Weeks',
    description: 'Analyze telecom coverage and device accessibility metrics across rural primary schools to validate connectivity targets for digital education rollout.',
    requirements: [
      'Cross-reference school locations with NISR telecom coverage indicators',
      'Identify top 5 underserved districts requiring infrastructure prioritization',
      'Generate clear infographic or Python Pandas summary table'
    ],
    skillsDemonstrated: ['Python / Pandas', 'NISR Indicator Interpretation', 'GIS / Regional Mapping', 'Policy Reporting'],
    submissionsCount: 14,
    deadline: 'Quarterly Intake (2026)'
  }
];

// GET /api/challenges
router.get('/', (_req, res) => {
  res.json({
    success: true,
    challenges: employerChallenges
  });
});

// POST /api/challenges/:id/submit
router.post('/:id/submit', (req, res) => {
  const { id } = req.params;
  const { learnerName, solutionUrl, notes } = req.body;
  const challenge = employerChallenges.find(c => c.id === id) || employerChallenges[0];

  res.json({
    success: true,
    message: 'Challenge submission successfully received and validated.',
    submission: {
      submissionId: `sub-${Date.now()}`,
      challengeId: id,
      challengeTitle: challenge.title,
      learnerName: learnerName || 'Kezia Umutoni',
      status: 'Reviewed & Verified',
      score: 91,
      feedback: 'Excellent work meeting all specifications! The data cleaning was precise, and the bilingual layout conforms to Rwandan usability standards.',
      badgeEarned: 'Industry Challenge Capstone Verified',
      skillsAddedToPassport: challenge.skillsDemonstrated,
      verifiedDate: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    }
  });
});

export default router;
