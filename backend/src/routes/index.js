import { Router } from 'express';
import healthRoute from './health.js';
import coursesRoute from './courses.js';
import skillsRoute from './skills.js';
import nisrRoute from './nisr.js';
import recommendationsRoute from './recommendations.js';
import assessmentsRoute from './assessments.js';
import authRoute from './auth.js';
import peerMatchingRoute from './peerMatching.js';
import challengesRoute from './challenges.js';

const api = Router();

api.use('/health', healthRoute);
api.use('/courses', coursesRoute);
api.use('/skills', skillsRoute);
api.use('/nisr', nisrRoute);
api.use('/recommendations', recommendationsRoute);
api.use('/assessments', assessmentsRoute);
api.use('/auth', authRoute);
api.use('/peer-matching', peerMatchingRoute);
api.use('/challenges', challengesRoute);

export default api;
