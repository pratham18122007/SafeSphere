"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// GET /institution/dashboard
router.get('/dashboard', (req, res) => {
    const incidents = db_1.default.institutionalIncidents;
    const totalJourneys = 1240 + db_1.default.journeys.length;
    const avgSafeScore = 68;
    // Incidents by severity
    const bySeverity = {
        low: incidents.filter(i => i.severity === 'low').length,
        medium: incidents.filter(i => i.severity === 'medium').length,
        high: incidents.filter(i => i.severity === 'high').length,
        critical: incidents.filter(i => i.severity === 'critical').length,
    };
    const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating').length;
    return res.json({
        overview: {
            totalJourneys,
            totalIncidents: incidents.length,
            openIncidents,
            highRiskZones: 3,
            activeAlerts: 2,
            avgSafeScore,
            trend: '+2.3 SafeScore vs last month',
        },
        bySeverity,
        recentAlerts: [
            { id: 'alert-1', message: 'High-risk incident reported near campus periphery', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), severity: 'high' },
            { id: 'alert-2', message: 'Hostel road SafeScore dropped below threshold (42)', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), severity: 'medium' },
            { id: 'alert-3', message: 'Weekly safety digest ready', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), severity: 'low' },
        ],
    });
});
// GET /institution/incidents
router.get('/incidents', (req, res) => {
    const { severity, status, limit } = req.query;
    let incidents = [...db_1.default.institutionalIncidents];
    if (severity)
        incidents = incidents.filter(i => i.severity === severity);
    if (status)
        incidents = incidents.filter(i => i.status === status);
    incidents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (limit)
        incidents = incidents.slice(0, parseInt(limit));
    return res.json(incidents);
});
// GET /institution/analytics
router.get('/analytics', (req, res) => {
    // Monthly incident trend (last 6 months)
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const incidentsByMonth = [4, 3, 6, 5, 7, 8];
    const safeScoreByMonth = [72, 70, 68, 69, 66, 65];
    const journeysByMonth = [180, 210, 240, 195, 220, 195];
    // Top high-risk locations
    const locationRisk = [
        { name: 'Hostel Road', zone: 'Campus Periphery', incidents: 3, avgSafeScore: 38 },
        { name: 'Rohini Sec-7 Bus Stop', zone: 'North Delhi', incidents: 2, avgSafeScore: 42 },
        { name: 'Adjacent Park (North Gate)', zone: 'Campus', incidents: 2, avgSafeScore: 45 },
        { name: 'Night Market Area', zone: 'Rohini', incidents: 2, avgSafeScore: 30 },
        { name: 'Main Road (Outside Campus)', zone: 'Rohini', incidents: 1, avgSafeScore: 55 },
    ];
    return res.json({
        incidentTrend: months.map((m, i) => ({ month: m, incidents: incidentsByMonth[i], safeScore: safeScoreByMonth[i], journeys: journeysByMonth[i] })),
        topRiskLocations: locationRisk,
        summary: {
            totalIncidents: db_1.default.institutionalIncidents.length,
            resolvedRate: Math.round(db_1.default.institutionalIncidents.filter(i => i.status === 'resolved').length / db_1.default.institutionalIncidents.length * 100),
            avgResponseTime: '2h 15m',
            mostCommonType: 'Harassment',
        },
    });
});
// GET /institution/alerts
router.get('/alerts', (req, res) => {
    return res.json([
        { id: 'alert-1', message: 'High severity incident reported: Bag snatching on hostel access road', location: 'Hostel Road', severity: 'high', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), status: 'open' },
        { id: 'alert-2', message: 'Hostel road area SafeScore dropped to 38 — below threshold', location: 'Campus Periphery', severity: 'medium', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), status: 'open' },
        { id: 'alert-3', message: 'Night Market incident escalated to critical severity', location: 'Night Market Area', severity: 'critical', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), status: 'investigating' },
        { id: 'alert-4', message: 'Pattern detected: 3 incidents in 2 weeks near campus periphery', location: 'Campus Periphery', severity: 'medium', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), status: 'acknowledged' },
        { id: 'alert-5', message: 'Weekly safety digest: April incidents up 14% vs March', location: 'All Zones', severity: 'low', timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), status: 'acknowledged' },
    ]);
});
exports.default = router;
