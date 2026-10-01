/**
 * The Hub — Deterministic Recommendation Engine
 * 
 * Computes deterministic skill gap scores between target career roles
 * and user assessed skills, augmented with NISR socioeconomic context.
 */

export const roleBenchmarks = {
  'data-analyst': {
    roleName: 'Data Analyst',
    requiredSkills: [
      { skill: 'Excel & Spreadsheets', code: 'sk-excel', targetScore: 80, weight: 1.0, recommendedCourse: 'crs-excel-data' },
      { skill: 'SQL Database Querying', code: 'sk-sql', targetScore: 75, weight: 1.2, recommendedCourse: 'crs-sql-mastery' },
      { skill: 'Python Programming', code: 'sk-python', targetScore: 65, weight: 1.1, recommendedCourse: 'crs-python-prog' },
      { skill: 'Professional English Communication', code: 'sk-english', targetScore: 60, weight: 0.8, recommendedCourse: 'crs-english-work' }
    ],
    nisrContext: 'Digital services and financial institutions in Rwanda have expanded requirement for data validation, spreadsheet modeling, and SQL reporting (NISR LFS Report).'
  },
  'web-developer': {
    roleName: 'Web Developer',
    requiredSkills: [
      { skill: 'HTML & CSS Web Development', code: 'sk-webdev', targetScore: 85, weight: 1.2, recommendedCourse: 'crs-web-fund' },
      { skill: 'Python Programming', code: 'sk-python', targetScore: 70, weight: 1.0, recommendedCourse: 'crs-python-prog' },
      { skill: 'SQL Database Querying', code: 'sk-sql', targetScore: 65, weight: 0.9, recommendedCourse: 'crs-sql-mastery' },
      { skill: 'Professional English Communication', code: 'sk-english', targetScore: 60, weight: 0.8, recommendedCourse: 'crs-english-work' }
    ],
    nisrContext: 'Rwanda ICT initiatives and digital government platforms prioritize local software development, web interfaces, and modern technical skills.'
  },
  'agri-entrepreneur': {
    roleName: 'Agribusiness Entrepreneur',
    requiredSkills: [
      { skill: 'Agribusiness & Market Linkages', code: 'sk-agri', targetScore: 85, weight: 1.3, recommendedCourse: 'crs-agri-bus' },
      { skill: 'Financial Literacy & Small Business', code: 'sk-finlit', targetScore: 75, weight: 1.1, recommendedCourse: 'crs-biz-model' },
      { skill: 'Excel & Spreadsheets', code: 'sk-excel', targetScore: 60, weight: 0.9, recommendedCourse: 'crs-excel-data' },
      { skill: 'Professional English Communication', code: 'sk-english', targetScore: 60, weight: 0.8, recommendedCourse: 'crs-english-work' }
    ],
    nisrContext: 'Agriculture remains a bedrock sector employing 44.8% of Rwanda workforce (NISR). Market linkages, post-harvest efficiency, and cooperative accounting yield high economic returns.'
  }
};

export class RecommendationEngine {
  static analyzeSkillGaps(roleKey, userScores = {}) {
    const benchmark = roleBenchmarks[roleKey] || roleBenchmarks['data-analyst'];
    
    const gaps = benchmark.requiredSkills.map(req => {
      const currentScore = userScores[req.code] || 0;
      const gap = Math.max(0, req.targetScore - currentScore);
      
      let priority = 'Low';
      if (gap >= 40) priority = 'High';
      else if (gap >= 20) priority = 'Medium';

      let reason = '';
      if (currentScore === 0) {
        reason = `You have not yet recorded an assessment for ${req.skill}. Establishing baseline competency is high priority.`;
      } else if (gap > 0) {
        reason = `Your assessed score (${currentScore}/100) indicates a ${gap}-point gap against the target benchmark (${req.targetScore}/100).`;
      } else {
        reason = `Your proficiency (${currentScore}/100) meets or exceeds the required target (${req.targetScore}/100).`;
      }

      return {
        skill: req.skill,
        skillCode: req.code,
        currentScore,
        targetScore: req.targetScore,
        gapScore: gap,
        priority,
        reason,
        recommendedCourseId: req.recommendedCourse
      };
    });

    // Sort by largest gap and priority
    gaps.sort((a, b) => b.gapScore - a.gapScore);

    return {
      targetRole: benchmark.roleName,
      labourMarketContext: benchmark.nisrContext,
      overallReadinessPercentage: Math.round(
        (gaps.reduce((acc, g) => acc + (g.currentScore / g.targetScore), 0) / gaps.length) * 100
      ),
      skillGaps: gaps,
      disclaimer: 'Recommendations represent informed pathways based on skill benchmarks and NISR labour-market indicators. They do not constitute an employment guarantee.'
    };
  }
}
