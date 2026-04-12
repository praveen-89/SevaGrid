import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Route Imports
import caseRoutes from './routes/case.routes';
import orchestrationRoutes from './routes/orchestration.routes';
import analyticsRoutes from './routes/analytics.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Security and parse logic
app.use(helmet());
app.use(cors());
app.use(express.json());

// Application Domains Boundary Wiring
app.use('/api/cases', caseRoutes);
app.use('/api/orchestration', orchestrationRoutes); // /dispatch endpoints and /volunteers endpoints
app.use('/api/analytics', analyticsRoutes);

// Health Interceptor for cloud load balancers/docker verifications
app.get('/health', (req, res) => {
   res.status(200).json({ status: 'UP', message: 'SevaGrid API Gateway is online.' });
});

// Universal Error Pipeline sink catching Unhandled Promise Rejections & Zod validation busts cleanly
app.use(errorHandler);

export default app;
