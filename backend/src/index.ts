import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma';

import authRoutes from './routes/authRoutes';
import companyRoutes from './routes/companyRoutes';
import teamRoutes from './routes/teamRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import siteRoutes from './routes/siteRoutes';
import { authenticateJWT, AuthRequest } from './middleware/authMiddleware';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
import customFieldRoutes from './routes/customFieldRoutes';
import uploadRoutes from './routes/uploadRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/companies/:companyId/sites', siteRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/custom-fields', customFieldRoutes);
app.use('/api/upload', uploadRoutes);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});

export { app, prisma };
