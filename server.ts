import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
// @ts-ignore
import apiRoutes from './backend/src/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini SDK if key provided
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ 
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// AI Learning Assistant endpoint (server-side Gemini)
app.post('/api/ai/tutor', async (req, res) => {
  try {
    const { question, contextCourse, learnerLevel } = req.body;
    if (!ai) {
      return res.json({
        success: true,
        answer: `[Demo Mode — Add GEMINI_API_KEY to activate live AI Tutor]\n\nKey Concept Breakdown:\n• Context: ${contextCourse || 'General Skills'}\n• Focus: Master practical fundamentals with verified evidence.\n• Advice: Focus on hands-on exercises and reviewing official NISR indicators to understand local economic demand.`,
        mode: 'fallback'
      });
    }

    const systemInstruction = `You are a supportive, expert AI learning coach for "The Hub — Data-Informed Skills & Learning Platform" in Rwanda. You help learners understand practical concepts, guide them through learning pathways, and connect skills to real workplace requirements. Keep answers clear, constructive, and actionable.`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemInstruction}\n\nLearner Level: ${learnerLevel || 'Beginner'}\nCourse Context: ${contextCourse || 'General'}\nLearner Question: ${question}` }
          ]
        }
      ]
    });

    return res.json({
      success: true,
      answer: response.text || 'Unable to generate response.',
      mode: 'live'
    });
  } catch (error: any) {
    console.error('Error in /api/ai/tutor:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'AI processing error'
    });
  }
});

// Express API routes for The Hub
app.use('/api', apiRoutes);

// Global Supabase/Database error handler fallback
app.use((err: any, req: any, res: any, next: any) => {
  if (err.message?.includes('Supabase') || err.message?.includes('PostgreSQL') || err.code?.startsWith('PGRST')) {
    console.warn('[AI Studio] Database offline or error — returning mock fallback');
    if (req.method === 'GET') {
      const isCollection = req.path.endsWith('s') || req.path.endsWith('s/');
      return res.json({
        success: true,
        [isCollection ? 'courses' : 'data']: isCollection ? [] : {},
        message: 'Operating in offline fallback mode'
      });
    }
    return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
  }
  next(err);
});

// Development: Vite middleware mode
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Production: Serve static assets from dist
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`[The Hub] Full-Stack App running on http://0.0.0.0:${PORT}`);
  console.log(`API Health: http://0.0.0.0:${PORT}/api/health`);
  console.log(`====================================================`);
});

