import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /safe-zones
router.get('/', (req: Request, res: Response) => {
  return res.json(db.safeZones);
});

export default router;
