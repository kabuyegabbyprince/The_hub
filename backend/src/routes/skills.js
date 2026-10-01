import { Router } from 'express';

const router = Router();

const skillsList = [
  { id: 'sk-excel', name: 'Excel & Spreadsheets', category: 'Data', level: 'Intermediate', assessmentCount: 1420 },
  { id: 'sk-sql', name: 'SQL Database Querying', category: 'Data', level: 'Intermediate', assessmentCount: 980 },
  { id: 'sk-python', name: 'Python Programming', category: 'Technology', level: 'Beginner', assessmentCount: 2150 },
  { id: 'sk-webdev', name: 'HTML & CSS Web Development', category: 'Technology', level: 'Beginner', assessmentCount: 1840 },
  { id: 'sk-english', name: 'Professional English Communication', category: 'Languages', level: 'Intermediate', assessmentCount: 3120 },
  { id: 'sk-agri', name: 'Agribusiness & Value Chains', category: 'Agriculture', level: 'Beginner', assessmentCount: 890 },
  { id: 'sk-tourism', name: 'Customer Experience & Hospitality', category: 'Tourism', level: 'Beginner', assessmentCount: 740 },
  { id: 'sk-finlit', name: 'Financial Literacy & Small Business', category: 'Business', level: 'Beginner', assessmentCount: 1210 }
];

router.get('/', (_req, res) => {
  return res.json({ success: true, count: skillsList.length, skills: skillsList });
});

router.get('/:id', (req, res) => {
  const skill = skillsList.find(s => s.id === req.params.id);
  if (!skill) {
    return res.status(404).json({ success: false, error: { code: 'SKILL_NOT_FOUND', message: 'Skill not found' } });
  }
  return res.json({ success: true, skill });
});

export default router;
