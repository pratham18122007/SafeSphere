"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// GET /safety-events
router.get('/', (req, res) => {
    const active = req.query.active === 'true';
    const events = active ? db_1.default.safetyEvents.filter(e => e.active) : db_1.default.safetyEvents;
    return res.json(events);
});
exports.default = router;
