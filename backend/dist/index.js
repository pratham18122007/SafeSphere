"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const routes_1 = __importDefault(require("./routes/routes"));
const journeys_1 = __importDefault(require("./routes/journeys"));
const safeZones_1 = __importDefault(require("./routes/safeZones"));
const institution_1 = __importDefault(require("./routes/institution"));
const safetyEvents_1 = __importDefault(require("./routes/safetyEvents"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/auth', auth_1.default);
app.use('/user', user_1.default);
app.use('/routes', routes_1.default);
app.use('/journeys', journeys_1.default);
app.use('/safe-zones', safeZones_1.default);
app.use('/institution', institution_1.default);
app.use('/safety-events', safetyEvents_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`SafeSphere API running on http://localhost:${PORT}`);
});
exports.default = app;
