import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// GET /api/assessments/:id (Fetch assessment details)
router.get('/:id', async (req, res) => {
  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select('content')
      .eq('id', req.params.id)
      .single();

    if (error || !course) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Stripping answers for the frontend to prevent cheating
    const safeContent = JSON.parse(JSON.stringify(course.content));
    if (safeContent.topics) {
      safeContent.topics.forEach(topic => {
        if (topic.assessment) {
          topic.assessment.forEach(q => {
            delete q.correctIndex;
            delete q.correctAnswer;
          });
        }
      });
    }
    if (safeContent.finalAssessment) {
      safeContent.finalAssessment.forEach(q => {
        delete q.correctIndex;
        delete q.correctAnswer;
      });
    }

    return res.json({ success: true, assessment: safeContent });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/assessments/:courseId/submit
router.post('/:courseId/submit', async (req, res) => {
  const { userId, topicId, answers } = req.body;
  const courseId = req.params.courseId;

  try {
    // 1. Fetch full course content (with answers) from DB
    const { data: course, error } = await supabase
      .from('courses')
      .select('content')
      .eq('id', courseId)
      .single();

    if (error || !course) throw new Error('Course not found');

    const content = course.content;
    let questions = [];

    if (topicId) {
      const topic = content.topics.find(t => t.id === topicId);
      questions = topic.assessment || topic.questions;
    } else {
      questions = content.finalAssessment;
    }

    // 2. Grade server-side
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const userAns = answers[idx];
      if (q.type === 'mcq') {
        if (userAns === q.correctIndex) correctCount++;
      } else if (q.type === 'tf') {
        if (userAns === q.correctAnswer) correctCount++;
      } else if (q.type === 'matching') {
        let matchingCorrect = true;
        q.pairs.forEach((_, pIdx) => {
          if (userAns?.[pIdx] !== pIdx) matchingCorrect = false;
        });
        if (matchingCorrect) correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= 80;

    // 3. Persist result
    const { error: resultError } = await supabase.from('assessment_results').insert([{
      id: `res_${userId}_${courseId}_${topicId || 'final'}_${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      topic_id: topicId,
      score: scorePercentage,
      passed,
      answers: JSON.stringify(answers)
    }]);

    if (resultError) throw resultError;

    // 4. Update progress if passed
    if (passed) {
      const { data: progress } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      const completedTopics = progress?.completed_topics || [];
      if (topicId && !completedTopics.includes(topicId)) {
        completedTopics.push(topicId);
      }

      await supabase.from('course_progress').upsert({
        id: `prog_${userId}_${courseId}`,
        user_id: userId,
        course_id: courseId,
        completed_topics: completedTopics,
        exam_passed: !topicId ? true : (progress?.exam_passed || false),
        exam_score: !topicId ? scorePercentage : progress?.exam_score
      });
    }

    return res.json({
      success: true,
      score: scorePercentage,
      passed,
      correctCount,
      totalQuestions: questions.length
    });
  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

