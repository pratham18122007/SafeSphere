import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { authenticate } from '../auth';
import { routeCache } from './routes';
import { SAFESCORE_CONFIG } from '../safescore';

const router = Router();

// POST /journeys/start
router.post('/start', authenticate, (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { routeId } = req.body;

    const route = routeCache.get(routeId);
    if (!route) return res.status(404).json({ error: 'Route not found' });

    const journey = {
      id: `journey-${uuidv4()}`,
      userId,
      routeId,
      status: 'active' as const,
      startedAt: new Date().toISOString(),
      currentSafeScore: route.safeScore,
      events: [],
    };

    db.journeys.push(journey);
    return res.status(201).json({ journey, route });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to start journey' });
  }
});

// GET /journeys/:id
router.get('/:id', authenticate, (req: Request, res: Response) => {
  const journey = db.journeys.find(j => j.id === req.params.id);
  if (!journey) return res.status(404).json({ error: 'Journey not found' });

  const route = routeCache.get(journey.routeId);
  return res.json({ journey, route: route || null });
});

// POST /journeys/:id/events — trigger a simulated safety event
router.post('/:id/events', authenticate, (req: Request, res: Response) => {
  try {
    const journey = db.journeys.find(j => j.id === req.params.id);
    if (!journey) return res.status(404).json({ error: 'Journey not found' });

    const { type, severity } = req.body;
    const validTypes = ['incident', 'risk_increase', 'deviation', 'low_activity', 'emergency'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    const eventDescriptions: Record<string, string> = {
      incident: 'A new safety incident has been reported ahead on your current route.',
      risk_increase: 'Risk level in the area has increased due to reduced activity after hours.',
      deviation: 'You appear to have deviated from the recommended route.',
      low_activity: 'You are entering an area with very low pedestrian activity.',
      emergency: 'Emergency SOS triggered by user.',
    };

    const eventAddresses: Record<string, string> = {
      incident: 'Near current route, 200m ahead',
      risk_increase: 'Current zone',
      deviation: 'Off-route area',
      low_activity: 'Isolated stretch ahead',
      emergency: 'Current location',
    };

    const newEvent = {
      id: `evt-${uuidv4()}`,
      type: type as any,
      severity: severity || 'medium',
      location: {
        lat: 28.65 + (Math.random() - 0.5) * 0.05,
        lng: 77.19 + (Math.random() - 0.5) * 0.05,
        address: eventAddresses[type],
      },
      timestamp: new Date().toISOString(),
      description: eventDescriptions[type],
      active: true,
    };

    journey.events.push(newEvent);
    db.safetyEvents.push(newEvent);

    // Apply penalty to journey's safe score
    const penalty = SAFESCORE_CONFIG.eventPenalties[type as keyof typeof SAFESCORE_CONFIG.eventPenalties] || 15;
    journey.currentSafeScore = Math.max(0, journey.currentSafeScore - penalty);

    return res.json({ event: newEvent, newSafeScore: journey.currentSafeScore, journey });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to trigger event' });
  }
});

// POST /journeys/:id/reroute
router.post('/:id/reroute', authenticate, (req: Request, res: Response) => {
  try {
    const journey = db.journeys.find(j => j.id === req.params.id);
    if (!journey) return res.status(404).json({ error: 'Journey not found' });

    const currentRoute = routeCache.get(journey.routeId);
    if (!currentRoute) return res.status(404).json({ error: 'Current route not found' });

    // Generate a new safer route (simulate rerouting)
    const { v4: uuid } = require('uuid');
    const newRouteId = `route-${uuidv4()}`;
    const safetGain = 15 + Math.round(Math.random() * 10);
    const etaPenalty = 4 + Math.round(Math.random() * 6);

    const newRoute = {
      ...currentRoute,
      id: newRouteId,
      routeType: 'safest',
      safeScore: Math.min(100, currentRoute.safeScore + safetGain),
      eta: currentRoute.eta + etaPenalty,
      explanation: `Safer route found — avoids affected area. +${etaPenalty} min, +${safetGain} SafeScore.`,
      warnings: ['Longer route, but avoids the reported incident area'],
    };

    routeCache.set(newRouteId, newRoute);
    journey.routeId = newRouteId;
    journey.currentSafeScore = newRoute.safeScore;

    return res.json({
      newRoute,
      originalRoute: currentRoute,
      improvement: { etaIncrease: etaPenalty, safeScoreGain: safetGain },
      reason: `Rerouted to avoid ${journey.events[journey.events.length - 1]?.description || 'safety event'}. ${safetGain} SafeScore improvement.`,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Rerouting failed' });
  }
});

// POST /journeys/:id/sos
router.post('/:id/sos', authenticate, (req: Request, res: Response) => {
  try {
    const journey = db.journeys.find(j => j.id === req.params.id);
    if (!journey) return res.status(404).json({ error: 'Journey not found' });

    journey.status = 'emergency';

    const sosIncident = {
      id: `sos-${uuidv4()}`,
      journeyId: journey.id,
      userId: journey.userId,
      timestamp: new Date().toISOString(),
      location: { lat: 28.65, lng: 77.19, address: 'Current journey location' },
      status: 'active' as const,
    };

    db.sosIncidents.push(sosIncident);

    // Simulate trusted contact notifications
    const contacts = db.trustedContacts.filter(c => c.userId === journey.userId && c.enabled);
    const notifications = contacts.map(c => ({
      contact: c,
      status: 'notified',
      timestamp: new Date().toISOString(),
      message: `Safety alert from ${c.name}'s SafeSphere app — location shared (simulated for demo)`,
    }));

    return res.json({
      incident: sosIncident,
      notifications,
      nearbyResources: db.safeZones.slice(0, 3),
      message: 'Emergency mode activated. Trusted contacts notified (simulated for demo).',
    });
  } catch (err) {
    return res.status(500).json({ error: 'SOS failed' });
  }
});

// POST /journeys/:id/complete
router.post('/:id/complete', authenticate, (req: Request, res: Response) => {
  try {
    const journey = db.journeys.find(j => j.id === req.params.id);
    if (!journey) return res.status(404).json({ error: 'Journey not found' });

    journey.status = 'completed';
    journey.completedAt = new Date().toISOString();

    return res.json({ journey, message: 'Journey completed safely.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to complete journey' });
  }
});

export default router;
