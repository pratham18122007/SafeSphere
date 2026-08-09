import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import routeRoutes from './routes/routes';
import journeyRoutes from './routes/journeys';
import safeZoneRoutes from './routes/safeZones';
import institutionRoutes from './routes/institution';
import safetyEventsRoutes from './routes/safetyEvents';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/routes', routeRoutes);
app.use('/journeys', journeyRoutes);
app.use('/safe-zones', safeZoneRoutes);
app.use('/institution', institutionRoutes);
app.use('/safety-events', safetyEventsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`SafeSphere API running on http://localhost:${PORT}`);
});

export default app;
