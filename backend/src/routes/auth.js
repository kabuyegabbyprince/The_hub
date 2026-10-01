import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Registration route
router.post('/register', async (req, res) => {
  const { email, password, fullName, avatarUrl } = req.body;
  
  try {
    // 1. Create user via Admin API to bypass email verification
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        avatar_url: avatarUrl
      }
    });

    if (authError) throw authError;

    const user = authData.user;

    if (user) {
      // 2. Insert into profiles table
      const role = email === 'princegabby4@gmail.com' ? 'super_admin' : 'learner';
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            full_name: fullName,
            username: email.split('@')[0],
            avatar_url: avatarUrl,
            role,
            location: 'Kigali, Rwanda'
          }
        ]);

      if (profileError) {
        console.error('Profile creation notice:', profileError.message);
      }
    }

    return res.json({
      success: true,
      message: 'Account created successfully. You can now sign in.',
      user: {
        id: user.id,
        email: user.email,
        fullName: fullName,
        username: email.split('@')[0],
        avatarUrl: avatarUrl,
        role: email === 'princegabby4@gmail.com' ? 'super_admin' : 'learner'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Bootstrap Admin route (One-time use to create specific admin)
router.post('/bootstrap-admin', async (req, res) => {
  const targetEmail = 'princegabby4@gmail.com';
  
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: targetEmail,
      password: targetEmail,
      email_confirm: true,
      user_metadata: {
        full_name: 'Super Admin',
        avatar_url: ''
      }
    });

    if (authError && authError.message !== 'User already exists') throw authError;

    // Even if user exists, ensure profile is admin
    const userId = authData?.user?.id;
    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        full_name: 'Super Admin',
        username: 'admin',
        role: 'super_admin',
        location: 'Kigali, Rwanda'
      });
    }

    return res.json({ success: true, message: 'Admin account provisioned.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // 2. Fetch or Create profile data
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const isTargetAdmin = data.user.email === 'princegabby4@gmail.com';
    const role = isTargetAdmin ? 'super_admin' : (profile?.role || 'learner');

    // If it's the target admin but the role in DB is wrong, fix it
    if (isTargetAdmin && profile && profile.role !== 'super_admin') {
      await supabase.from('profiles').update({ role: 'super_admin' }).eq('id', data.user.id);
    }

    // Fetch enrollments
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', data.user.id);

    return res.json({
      success: true,
      message: 'Login successful',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: role,
        fullName: profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
        username: profile?.username || email.split('@')[0],
        avatarUrl: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
        location: profile?.location || 'Kigali, Rwanda',
        learningStreak: profile?.learning_streak || 1,
        enrolledCourses: enrollments ? enrollments.map(e => e.course_id) : []
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/me', async (req, res) => {
  // In a real app, verify the JWT from header
  return res.json({
    success: true,
    message: 'Session valid'
  });
});

export default router;
