import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { authenticate } from '../auth';

const router = Router();

// GET /user/profile
router.get('/profile', authenticate, (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
});

// GET /user/contacts
router.get('/contacts', authenticate, (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const contacts = db.trustedContacts.filter(c => c.userId === userId);
  return res.json(contacts);
});

// POST /user/contacts
router.post('/contacts', authenticate, (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { name, relationship, contact, enabled } = req.body;
  if (!name || !contact) return res.status(400).json({ error: 'Name and contact required' });
  const newContact = {
    id: `tc-${uuidv4()}`,
    userId,
    name,
    relationship: relationship || 'Contact',
    contact,
    enabled: enabled !== false,
  };
  db.trustedContacts.push(newContact);
  return res.status(201).json(newContact);
});

// PUT /user/contacts/:id
router.put('/contacts/:id', authenticate, (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const idx = db.trustedContacts.findIndex(c => c.id === req.params.id && c.userId === userId);
  if (idx === -1) return res.status(404).json({ error: 'Contact not found' });
  db.trustedContacts[idx] = { ...db.trustedContacts[idx], ...req.body };
  return res.json(db.trustedContacts[idx]);
});

// DELETE /user/contacts/:id
router.delete('/contacts/:id', authenticate, (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const idx = db.trustedContacts.findIndex(c => c.id === req.params.id && c.userId === userId);
  if (idx === -1) return res.status(404).json({ error: 'Contact not found' });
  db.trustedContacts.splice(idx, 1);
  return res.status(204).send();
});

export default router;
