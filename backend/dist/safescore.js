"use strict";
// SafeScore Configuration — all weights are tunable here
// Final score = sum(component * weight) - penalties, clamped to [0, 100]
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAFESCORE_CONFIG = void 0;
exports.getRiskCategory = getRiskCategory;
exports.calculateSafeScore = calculateSafeScore;
exports.SAFESCORE_CONFIG = {
    weights: {
        historicalSafety: 0.20,
        lightingQuality: 0.20,
        crowdActivity: 0.15,
        routeAccessibility: 0.10,
        proximityToSafeZones: 0.10,
        incidentRisk: -0.15, // negative = penalty
        isolationRisk: -0.10, // negative = penalty
    },
    eventPenalties: {
        incident: 20,
        risk_increase: 15,
        deviation: 10,
        low_activity: 12,
        emergency: 30,
    },
    riskCategories: [
        { min: 80, max: 100, label: 'Very Safe', color: '#16a34a', badgeClass: 'badge-safe' },
        { min: 65, max: 79, label: 'Relatively Safe', color: '#65a30d', badgeClass: 'badge-good' },
        { min: 50, max: 64, label: 'Moderate', color: '#d97706', badgeClass: 'badge-moderate' },
        { min: 30, max: 49, label: 'Elevated Risk', color: '#ea580c', badgeClass: 'badge-elevated' },
        { min: 0, max: 29, label: 'High Risk', color: '#dc2626', badgeClass: 'badge-high' },
    ],
};
function getRiskCategory(score) {
    return exports.SAFESCORE_CONFIG.riskCategories.find(c => score >= c.min && score <= c.max)
        || exports.SAFESCORE_CONFIG.riskCategories[exports.SAFESCORE_CONFIG.riskCategories.length - 1];
}
function calculateSafeScore(components) {
    const w = exports.SAFESCORE_CONFIG.weights;
    const score = components.historicalSafety * w.historicalSafety +
        components.lightingQuality * w.lightingQuality +
        components.crowdActivity * w.crowdActivity +
        components.routeAccessibility * w.routeAccessibility +
        components.proximityToSafeZones * w.proximityToSafeZones -
        components.incidentRisk * Math.abs(w.incidentRisk) -
        components.isolationRisk * Math.abs(w.isolationRisk) -
        (components.activeEventPenalty || 0);
    return Math.max(0, Math.min(100, Math.round(score)));
}
