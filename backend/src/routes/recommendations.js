import { Router } from 'express';
import { RecommendationEngine } from '../services/recommendationEngine.js';

const router = Router();

// POST /api/recommendations/analyze
router.post('/analyze', (req, res) => {
  const { targetRole = 'data-analyst', userScores = {} } = req.body;
  const analysis = RecommendationEngine.analyzeSkillGaps(targetRole, userScores);
  return res.json({
    success: true,
    data: analysis
  });
});

export default router;
