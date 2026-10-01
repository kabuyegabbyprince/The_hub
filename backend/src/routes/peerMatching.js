import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// GET /api/peer-matching/peers
router.get('/peers', async (req, res) => {
  const { userId } = req.query;

  try {
    // 1. Fetch real profiles from Supabase
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', userId || '')
      .limit(20);

    if (error) throw error;

    // 2. Map to peer structure and calculate mock match scores
    const peers = profiles.map(p => ({
      id: p.id,
      fullName: p.full_name,
      location: p.location,
      avatarUrl: p.avatar_url,
      teachingSkills: ['General Skills', 'Kinyarwanda'],
      learningSkills: ['Professional English', 'Digital Literacy'],
      fluentLanguages: ['Kinyarwanda'],
      learningLanguages: ['English'],
      level: 'Learner',
      matchScore: 70 + Math.floor(Math.random() * 25),
      bio: p.bio || 'Hub learner focused on career growth.'
    })).sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      total: peers.length,
      peers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

const studyGroups = [
  {
    id: 'grp-eng-speaking',
    title: 'English Speaking Practice Circle',
    category: 'Languages',
    focusSkill: 'Spoken English & Workplace Presentation',
    membersCount: 46,
    activeRooms: 3,
    schedule: 'Tuesdays & Thursdays at 6:00 PM CAT',
    nextSession: 'Tomorrow, 6:00 PM (GMT+2)',
    agenda: '40 mins: 20 mins guided topic dialogue, 20 mins open peer conversation',
    leader: 'Sandrine Uwase',
    level: 'All Levels'
  },
  {
    id: 'grp-python-beginners',
    title: 'Python for Rwanda Data Hackathon',
    category: 'Data Science',
    focusSkill: 'Python, Pandas, & NISR Data Processing',
    membersCount: 38,
    activeRooms: 2,
    schedule: 'Mondays & Wednesdays at 7:00 PM CAT',
    nextSession: 'Today, 7:00 PM (GMT+2)',
    agenda: 'Hands-on live coding: Loading and cleaning NISR tables',
    leader: 'Patrick Nshimiyimana',
    level: 'Beginner to Intermediate'
  }
];

// GET /api/peer-matching/study-groups
router.get('/study-groups', (_req, res) => {
  res.json({
    success: true,
    groups: studyGroups
  });
});

// POST /api/peer-matching/match
router.post('/match', (req, res) => {
  const { user, targetPeerId, learningTopic } = req.body;
  const targetPeer = mockPeers.find(p => p.id === targetPeerId) || mockPeers[0];

  // Mathematical formula: Skill Compat (30) + Goal (25) + Level (20) + Lang (15) + Availability (10)
  const calculation = {
    skillCompatibility: 28,
    goalAlignment: 24,
    levelCompatibility: 18,
    languageFit: 15,
    availabilityScore: 9,
    totalMatchPercentage: 94
  };

  res.json({
    success: true,
    matchedWith: targetPeer,
    topic: learningTopic || 'Language & Skills Exchange',
    formula: calculation,
    suggestedAgenda: [
      { minute: '00-05', action: 'Introductions & session objective setting' },
      { minute: '05-22', action: 'Part 1: Primary practice topic (e.g. English conversation or Code debug)' },
      { minute: '22-25', action: 'Midpoint feedback & transition' },
      { minute: '25-42', action: 'Part 2: Reciprocal skill exchange (e.g. Kinyarwanda practice or Excel help)' },
      { minute: '42-45', action: 'Session wrap-up & peer verification endorsement logged to Skill Passport' }
    ],
    confirmedMeetingId: `meet-${Date.now()}`
  });
});

export default router;
