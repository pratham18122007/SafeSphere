"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../auth");
const router = (0, express_1.Router)();
// GET /user/profile
router.get('/profile', auth_1.authenticate, (req, res) => {
    const userId = req.user.userId;
    const user = db_1.default.users.find(u => u.id === userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
});
// GET /user/contacts
router.get('/contacts', auth_1.authenticate, (req, res) => {
    const userId = req.user.userId;
    const contacts = db_1.default.trustedContacts.filter(c => c.userId === userId);
    return res.json(contacts);
});
// POST /user/contacts
router.post('/contacts', auth_1.authenticate, (req, res) => {
    const userId = req.user.userId;
    const { name, relationship, contact, enabled } = req.body;
    if (!name || !contact)
        return res.status(400).json({ error: 'Name and contact required' });
    const newContact = {
        id: `tc-${(0, uuid_1.v4)()}`,
        userId,
        name,
        relationship: relationship || 'Contact',
        contact,
        enabled: enabled !== false,
    };
    db_1.default.trustedContacts.push(newContact);
    return res.status(201).json(newContact);
});
// PUT /user/contacts/:id
router.put('/contacts/:id', auth_1.authenticate, (req, res) => {
    const userId = req.user.userId;
    const idx = db_1.default.trustedContacts.findIndex(c => c.id === req.params.id && c.userId === userId);
    if (idx === -1)
        return res.status(404).json({ error: 'Contact not found' });
    db_1.default.trustedContacts[idx] = { ...db_1.default.trustedContacts[idx], ...req.body };
    return res.json(db_1.default.trustedContacts[idx]);
});
// DELETE /user/contacts/:id
router.delete('/contacts/:id', auth_1.authenticate, (req, res) => {
    const userId = req.user.userId;
    const idx = db_1.default.trustedContacts.findIndex(c => c.id === req.params.id && c.userId === userId);
    if (idx === -1)
        return res.status(404).json({ error: 'Contact not found' });
    db_1.default.trustedContacts.splice(idx, 1);
    return res.status(204).send();
});
exports.default = router;
