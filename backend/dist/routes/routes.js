"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeCache = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const safescore_1 = require("../safescore");
const router = (0, express_1.Router)();
// Delhi/NCR destination database
const DESTINATIONS = [
    { id: 'loc-1', address: 'Connaught Place, New Delhi', latitude: 28.6338, longitude: 77.2195, zone: 'Central Delhi' },
    { id: 'loc-2', address: 'India Gate, New Delhi', latitude: 28.6129, longitude: 77.2295, zone: 'Central Delhi' },
    { id: 'loc-3', address: 'Rajouri Garden, New Delhi', latitude: 28.6469, longitude: 77.0892, zone: 'West Delhi' },
    { id: 'loc-4', address: 'Gurugram Cyber City', latitude: 28.4951, longitude: 77.0878, zone: 'Gurugram' },
    { id: 'loc-5', address: 'New Delhi Railway Station', latitude: 28.6424, longitude: 77.2195, zone: 'Central Delhi' },
    { id: 'loc-6', address: 'GTBIT Campus, Rohini Sec-7', latitude: 28.6890, longitude: 77.1540, zone: 'North Delhi' },
    { id: 'loc-7', address: 'Hauz Khas Village', latitude: 28.5434, longitude: 77.2066, zone: 'South Delhi' },
    { id: 'loc-8', address: 'Lajpat Nagar Market', latitude: 28.5673, longitude: 77.2429, zone: 'South Delhi' },
    { id: 'loc-9', address: 'Saket Select CityWalk', latitude: 28.5270, longitude: 77.2190, zone: 'South Delhi' },
    { id: 'loc-10', address: 'Chandni Chowk, Old Delhi', latitude: 28.6505, longitude: 77.2303, zone: 'Old Delhi' },
    { id: 'loc-11', address: 'Karol Bagh Market', latitude: 28.6518, longitude: 77.1900, zone: 'West Delhi' },
    { id: 'loc-12', address: 'Dwarka Sec-10 Metro', latitude: 28.5840, longitude: 77.0512, zone: 'West Delhi' },
    { id: 'loc-13', address: 'Noida Sector 18', latitude: 28.5706, longitude: 77.3219, zone: 'Noida' },
    { id: 'loc-14', address: 'IGI Airport Terminal 3', latitude: 28.5562, longitude: 77.1000, zone: 'Delhi Airport' },
    { id: 'loc-15', address: 'Paharganj Main Bazar', latitude: 28.6445, longitude: 77.2105, zone: 'Central Delhi' },
    { id: 'loc-16', address: 'Lodi Garden', latitude: 28.5931, longitude: 77.2200, zone: 'South Central Delhi' },
    { id: 'loc-17', address: 'Mayur Vihar Phase 1', latitude: 28.5665, longitude: 77.3211, zone: 'East Delhi' },
    { id: 'loc-18', address: 'Rohini Sector 11', latitude: 28.7050, longitude: 77.1400, zone: 'North Delhi' },
];
// User's simulated current location
const CURRENT_LOCATION = {
    id: 'loc-current',
    address: 'GTBIT Campus, Rohini Sec-7, New Delhi',
    latitude: 28.6890,
    longitude: 77.1540,
    zone: 'North Delhi',
};
// Route segment templates for different areas
function generateRouteSegments(routeType, originZone, destZone) {
    const segments = [];
    const segmentCount = 3;
    const profiles = {
        fastest: {
            names: ['Main Arterial Road', 'Under-construction Bypass', 'Industrial Area Shortcut'],
            lighting: [75, 40, 35],
            crowd: [65, 30, 25],
            incident: [25, 55, 60],
            isolation: [20, 65, 70],
        },
        safest: {
            names: ['Market Road (Well-lit)', 'Metro Feeder Road', 'Main Market Stretch'],
            lighting: [90, 85, 88],
            crowd: [85, 80, 82],
            incident: [10, 15, 12],
            isolation: [10, 12, 10],
        },
        balanced: {
            names: ['Inner Road (Moderate)', 'Residential Street', 'Market Approach'],
            lighting: [80, 72, 78],
            crowd: [72, 65, 70],
            incident: [18, 28, 20],
            isolation: [18, 30, 22],
        },
    };
    const profile = profiles[routeType] || profiles.balanced;
    for (let i = 0; i < segmentCount; i++) {
        const historical = routeType === 'safest' ? 85 : routeType === 'fastest' ? 55 : 75;
        const lighting = profile.lighting[i];
        const crowd = profile.crowd[i];
        const incidentRisk = profile.incident[i];
        const isolationRisk = profile.isolation[i];
        const segScore = (0, safescore_1.calculateSafeScore)({
            historicalSafety: historical,
            lightingQuality: lighting,
            crowdActivity: crowd,
            routeAccessibility: 75,
            proximityToSafeZones: 65,
            incidentRisk,
            isolationRisk,
        });
        segments.push({
            id: `seg-${(0, uuid_1.v4)()}`,
            routeId: '',
            name: profile.names[i],
            distance: Math.round(0.8 + Math.random() * 1.5 * 10) / 10,
            safetyScore: segScore,
            lightingScore: lighting,
            crowdScore: crowd,
            incidentRisk,
            isolationRisk,
        });
    }
    return segments;
}
function generateRoute(origin, destination, routeType) {
    const baseDist = Math.sqrt(Math.pow(destination.latitude - origin.latitude, 2) +
        Math.pow(destination.longitude - origin.longitude, 2)) * 111; // rough km
    const distances = {
        fastest: Math.round(baseDist * 10) / 10,
        safest: Math.round(baseDist * 1.3 * 10) / 10,
        balanced: Math.round(baseDist * 1.15 * 10) / 10,
    };
    const etas = {
        fastest: Math.round(baseDist * 4),
        safest: Math.round(baseDist * 6),
        balanced: Math.round(baseDist * 5),
    };
    const components = {
        fastest: { historical: 55, lighting: 55, crowd: 55, accessibility: 80, proximity: 50, incident: 45, isolation: 40 },
        safest: { historical: 88, lighting: 88, crowd: 82, accessibility: 85, proximity: 85, incident: 8, isolation: 8 },
        balanced: { historical: 75, lighting: 78, crowd: 70, accessibility: 78, proximity: 70, incident: 22, isolation: 20 },
    };
    const c = components[routeType];
    const score = (0, safescore_1.calculateSafeScore)({
        historicalSafety: c.historical,
        lightingQuality: c.lighting,
        crowdActivity: c.crowd,
        routeAccessibility: c.accessibility,
        proximityToSafeZones: c.proximity,
        incidentRisk: c.incident,
        isolationRisk: c.isolation,
    });
    const segments = generateRouteSegments(routeType, origin.zone, destination.zone);
    const routeId = `route-${(0, uuid_1.v4)()}`;
    segments.forEach(s => (s.routeId = routeId));
    const explanations = {
        fastest: 'Quickest route via main roads, but passes some less-lit stretches.',
        safest: `+${etas.safest - etas.fastest} min slower — uses well-lit market roads and avoids isolated areas.`,
        balanced: `+${etas.balanced - etas.fastest} min — good trade-off between speed and safety.`,
    };
    const warningsByType = {
        fastest: ['Passes through poorly-lit stretch near industrial area', 'Lower pedestrian activity after 9 PM', 'Incident history in area'],
        safest: ['Slightly longer route', 'May have more traffic near market hours'],
        balanced: ['One moderately lit stretch — stay alert'],
    };
    const incidentsByType = { fastest: 3, safest: 0, balanced: 1 };
    return {
        id: routeId,
        origin: { id: origin.id, latitude: origin.latitude, longitude: origin.longitude, address: origin.address, zone: origin.zone },
        destination: { id: destination.id, latitude: destination.latitude, longitude: destination.longitude, address: destination.address, zone: destination.zone },
        distance: distances[routeType],
        eta: Math.max(etas[routeType], 5),
        routeType,
        safeScore: score,
        segments,
        incidents: incidentsByType[routeType],
        lightingQuality: c.lighting,
        crowdLevel: c.crowd,
        explanation: explanations[routeType],
        warnings: warningsByType[routeType],
        scoreBreakdown: {
            historicalSafety: c.historical,
            lightingQuality: c.lighting,
            crowdActivity: c.crowd,
            routeAccessibility: c.accessibility,
            proximityToSafeZones: c.proximity,
            incidentRisk: c.incident,
            isolationRisk: c.isolation,
        },
    };
}
// In-memory route cache
const routeCache = new Map();
exports.routeCache = routeCache;
// GET /routes/search?q=query — autocomplete destinations
router.get('/search', (req, res) => {
    const q = (req.query.q || '').toLowerCase();
    const results = DESTINATIONS.filter(d => d.address.toLowerCase().includes(q) || d.zone.toLowerCase().includes(q)).slice(0, 8);
    return res.json(results);
});
// POST /routes/calculate — generate fastest/safest/balanced routes
router.post('/calculate', (req, res) => {
    try {
        const { originId, destinationId, originAddress } = req.body;
        let origin = DESTINATIONS.find(d => d.id === originId) || CURRENT_LOCATION;
        if (originAddress) {
            const found = DESTINATIONS.find(d => d.address.toLowerCase().includes(originAddress.toLowerCase()));
            if (found)
                origin = found;
        }
        const destination = DESTINATIONS.find(d => d.id === destinationId);
        if (!destination)
            return res.status(404).json({ error: 'Destination not found' });
        const routes = [
            generateRoute(origin, destination, 'fastest'),
            generateRoute(origin, destination, 'safest'),
            generateRoute(origin, destination, 'balanced'),
        ];
        // Cache routes for later retrieval
        routes.forEach(r => routeCache.set(r.id, r));
        return res.json({ routes, origin, destination });
    }
    catch (err) {
        return res.status(500).json({ error: 'Route calculation failed' });
    }
});
// GET /routes/:id
router.get('/:id', (req, res) => {
    const route = routeCache.get(req.params.id);
    if (!route)
        return res.status(404).json({ error: 'Route not found' });
    return res.json(route);
});
exports.default = router;
