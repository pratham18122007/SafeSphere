import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /safety-events
router.get('/', (req: Request, res: Response) => {
  const active = req.query.active === 'true';
  const events = active ? db.safetyEvents.filter(e => e.active) : db.safetyEvents;
  return res.json(events);
});

export default router;
