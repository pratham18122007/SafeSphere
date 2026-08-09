"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../auth");
const router = (0, express_1.Router)();
// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        // Check institution first
        const institution = db_1.default.institutions.find(i => i.email === email.toLowerCase());
        if (institution) {
            const valid = await bcryptjs_1.default.compare(password, institution.passwordHash);
            if (!valid)
                return res.status(401).json({ error: 'Invalid credentials' });
            const token = (0, auth_1.generateToken)(institution.id, 'institution');
            return res.json({
                token,
                user: { id: institution.id, name: institution.name, email: institution.email, role: 'institution' },
            });
        }
        const user = db_1.default.users.find(u => u.email === email.toLowerCase());
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials' });
        const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!valid)
            return res.status(401).json({ error: 'Invalid credentials' });
        const token = (0, auth_1.generateToken)(user.id, user.role);
        return res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Login failed' });
    }
});
// POST /auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password required' });
        }
        if (db_1.default.users.find(u => u.email === email.toLowerCase())) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const newUser = {
            id: `user-${(0, uuid_1.v4)()}`,
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: 'user',
            createdAt: new Date().toISOString(),
        };
        db_1.default.users.push(newUser);
        // Add default trusted contacts for new users
        db_1.default.trustedContacts.push({
            id: `tc-${(0, uuid_1.v4)()}`,
            userId: newUser.id,
            name: 'Mom',
            relationship: 'Mother',
            contact: '+91 98765 43210',
            enabled: true,
        });
        const token = (0, auth_1.generateToken)(newUser.id, newUser.role);
        return res.status(201).json({
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Registration failed' });
    }
});
// POST /auth/demo - instant demo login
router.post('/demo', async (req, res) => {
    try {
        const user = db_1.default.users.find(u => u.email === 'demo@safesphere.ai');
        const token = (0, auth_1.generateToken)(user.id, user.role);
        return res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Demo login failed' });
    }
});
exports.default = router;
