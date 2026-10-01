import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[API ${req.method}] ${req.url}`);
  next();
});

// Main API Prefix
app.use('/api', apiRoutes);

// Root fallback
app.get('/', (_req, res) => {
  res.json({
    name: 'The Hub API',
    description: 'Data-informed skills and learning platform backend',
    status: 'online',
    endpoints: {
      health: '/api/health',
      courses: '/api/courses',
      skills: '/api/skills',
      nisr: '/api/nisr/indicators',
      recommendations: '/api/recommendations/analyze',
      assessments: '/api/assessments'
    }
  });
});

// Standard Error Handler
app.use((err, _req, res, _next) => {
  console.error('[API Error]:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected server error occurred'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================');
  console.log(`The Hub Express Backend running on http://0.0.0.0:${PORT}`);
  console.log(`Health check ready at http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});
