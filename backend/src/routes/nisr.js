import { Router } from 'express';
import { NisrService } from '../services/nisrService.js';

const router = Router();

// Regional and Youth indicators disaggregated by province and district
const regionalYouthData = [
  {
    province: 'Kigali City',
    districts: ['Gasabo', 'Kicukiro', 'Nyarugenge'],
    youthPopulationPercentage: '38.4%',
    youthLabourParticipation: '58.2%',
    dominantEconomicSectors: ['Services & Financial (46%)', 'Digital & ICT (28%)', 'Commerce & Retail (26%)'],
    prioritySkillGaps: ['Full-Stack Web Development', 'Financial Modeling', 'Professional English'],
    genderParticipation: { male: '61.4%', female: '55.1%' },
    digitalConnectivityRate: '68.5%'
  },
  {
    province: 'Northern Province',
    districts: ['Musanze', 'Burera', 'Gakenke', 'Gicumbi', 'Rulindo'],
    youthPopulationPercentage: '32.1%',
    youthLabourParticipation: '51.8%',
    dominantEconomicSectors: ['Tourism & Hospitality (34%)', 'Specialized Agriculture (42%)', 'Small Manufacturing (24%)'],
    prioritySkillGaps: ['Ecotourism Operations', 'Agribusiness Financial Records', 'English & French Conversation'],
    genderParticipation: { male: '54.2%', female: '49.6%' },
    digitalConnectivityRate: '29.4%'
  },
  {
    province: 'Southern Province',
    districts: ['Huye', 'Gisagara', 'Nyanza', 'Ruhango', 'Muhanga', 'Kamonyi', 'Nyamagabe', 'Nyaruguru'],
    youthPopulationPercentage: '34.6%',
    youthLabourParticipation: '50.4%',
    dominantEconomicSectors: ['Agro-Processing & Farming (48%)', 'Education & Services (27%)', 'Artisanal Mining (25%)'],
    prioritySkillGaps: ['Data Analytics for Agro-Yields', 'Digital Marketing for Crafts', 'Business Bookkeeping'],
    genderParticipation: { male: '52.7%', female: '48.2%' },
    digitalConnectivityRate: '26.8%'
  },
  {
    province: 'Eastern Province',
    districts: ['Rwamagana', 'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare'],
    youthPopulationPercentage: '35.8%',
    youthLabourParticipation: '53.6%',
    dominantEconomicSectors: ['Commercial Agriculture & Livestock (56%)', 'Logistics & Trade (25%)', 'Processing (19%)'],
    prioritySkillGaps: ['Inventory Management', 'Spreadsheet Modeling', 'English for Cross-Border Trade'],
    genderParticipation: { male: '56.1%', female: '51.3%' },
    digitalConnectivityRate: '31.2%'
  },
  {
    province: 'Western Province',
    districts: ['Rubavu', 'Karongi', 'Rusizi', 'Rutsiro', 'Nyamasheke', 'Ngororero', 'Nyabihu'],
    youthPopulationPercentage: '33.9%',
    youthLabourParticipation: '52.1%',
    dominantEconomicSectors: ['Cross-Border Commerce (38%)', 'Fisheries & Agriculture (39%)', 'Hospitality (23%)'],
    prioritySkillGaps: ['Bilingual Commerce (FR/EN)', 'Customer Relations', 'Digital Bookkeeping'],
    genderParticipation: { male: '53.8%', female: '50.5%' },
    digitalConnectivityRate: '28.1%'
  }
];

// NISR Data-to-Feature Traceability Table (Hackathon submission requirement)
const traceabilityMatrix = [
  {
    feature: 'Macro Labour Context Strip',
    nisrDataset: 'Labour Force Survey (LFS)',
    indicatorsUsed: 'Employment by Industry Sector (38.6% services, 44.8% agriculture)',
    transformation: 'Aggregated sector proportions normalized into regional contextual cards',
    appOutput: 'Dashboard macro context cards & sector course categorization'
  },
  {
    feature: 'Youth Skills Opportunity View',
    nisrDataset: 'LFS & Education Statistics',
    indicatorsUsed: 'Youth Labour Force Participation (52.4%) & Educational Attainment',
    transformation: 'Disaggregation by province, district, and gender cohorts',
    appOutput: 'Interactive regional youth career explorer with local economic alignment'
  },
  {
    feature: 'Digital Inclusion & Low-Bandwidth Mode',
    nisrDataset: 'ICT Household Survey / EICV',
    indicatorsUsed: 'Household Internet Penetration (34.2%) & Device Ownership',
    transformation: 'Applied as UX constraint: switches to text-first rendering & offline caching',
    appOutput: 'Text-first mode toggle and offline downloadable cheat-sheets'
  },
  {
    feature: 'Deterministic Skill Gap Pathways',
    nisrDataset: 'Labour Force Survey & EICV',
    indicatorsUsed: 'Formal/Informal Sector distribution & Occupational Skill Demands',
    transformation: 'Weighted mathematical gap calculation against target roles',
    appOutput: 'Explainable learning pathways with prioritized skill bridging sequences'
  },
  {
    feature: 'Verified Skill Passport',
    nisrDataset: 'National Qualification Framework (NQF) & TVET benchmarks',
    indicatorsUsed: 'Assessment competence thresholds and practical evidence validation',
    transformation: '3-part assessment rubric: 30% Theory, 40% Practical, 30% Capstone',
    appOutput: 'Verifiable digital credentials and portfolio artifact records'
  }
];

// GET /api/nisr/indicators
router.get('/indicators', async (_req, res) => {
  const indicators = await NisrService.getAllIndicators();
  return res.json({
    success: true,
    source: 'National Institute of Statistics of Rwanda (NISR)',
    count: indicators.length,
    indicators
  });
});

// GET /api/nisr/youth
router.get('/youth', (req, res) => {
  const { province } = req.query;
  let data = regionalYouthData;
  if (province && province !== 'All') {
    data = regionalYouthData.filter(d => d.province.toLowerCase() === province.toLowerCase());
  }

  return res.json({
    success: true,
    source: 'NISR Labour Force Survey (LFS) & EICV Reports',
    provinces: data
  });
});

// GET /api/nisr/traceability
router.get('/traceability', (_req, res) => {
  return res.json({
    success: true,
    source: 'NISR Big Data Hackathon 2026 - Data Traceability',
    matrix: traceabilityMatrix
  });
});

// GET /api/nisr/employment
router.get('/employment', async (_req, res) => {
  const indicators = await NisrService.getEmploymentIndicators();
  return res.json({
    success: true,
    indicators
  });
});

export default router;
