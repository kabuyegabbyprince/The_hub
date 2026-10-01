import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// GET /api/courses
router.get('/', async (req, res) => {
  const { category, difficulty, search } = req.query;
  
  try {
    let query = supabase.from('courses').select('*').eq('is_published', true);

    if (category && category !== 'All') {
      query = query.ilike('category', category);
    }

    if (difficulty && difficulty !== 'All') {
      query = query.eq('difficulty', difficulty);
    }

    if (search) {
      query = query.or(`title_en.ilike.%${search}%,title_rw.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Map database fields to frontend-friendly names if necessary
    const courses = data.map(c => ({
      ...c,
      title: c.title_en, // Default to English for list view
      slug: c.slug || c.id
    }));

    return res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .or(`id.eq.${req.params.id},slug.eq.${req.params.id}`)
      .single();

    if (error || !course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    return res.json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/courses (Super Admin Only)
router.post('/', async (req, res) => {
  const { userId, courseData } = req.body;
  
  try {
    // 1. Verify user is super_admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (profile?.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // 2. Insert course
    const { data, error } = await supabase.from('courses').insert([courseData]).select();
    if (error) throw error;

    return res.json({ success: true, course: data[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/courses/:id/enroll
router.post('/:id/enroll', async (req, res) => {
  const { userId } = req.body;
  const courseId = req.params.id;

  try {
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .upsert({ 
        id: `enr_${userId}_${courseId}`,
        user_id: userId, 
        course_id: courseId,
        status: 'in_progress',
        last_accessed_at: new Date().toISOString()
      }, { onConflict: 'user_id,course_id' })
      .select();

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Successfully enrolled',
      enrollment: enrollment[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

