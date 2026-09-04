"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const db_1 = require("./config/db");
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const equipmentRoutes_1 = __importDefault(require("./routes/equipmentRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const maintenanceRoutes_1 = __importDefault(require("./routes/maintenanceRoutes"));
const usageRoutes_1 = __importDefault(require("./routes/usageRoutes"));
const planningRoutes_1 = __importDefault(require("./routes/planningRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const receiptRoutes_1 = __importDefault(require("./routes/receiptRoutes"));
const smartMatchRoutes_1 = __importDefault(require("./routes/smartMatchRoutes"));
const mandiRoutes_1 = __importDefault(require("./routes/mandiRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB Atlas
(0, db_1.connectDB)();
// CORS & Middleware
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
            callback(null, true);
        }
        else {
            callback(null, true); // Permissive for local dev
        }
    },
    credentials: true
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Serve uploaded equipment images
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// API Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        service: 'Krushi Connect API',
        database: 'MongoDB Atlas',
        timestamp: new Date().toISOString()
    });
});
// Register API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/equipment', equipmentRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/maintenance', maintenanceRoutes_1.default);
app.use('/api/usage', usageRoutes_1.default);
app.use('/api/planning', planningRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.use('/api/receipts', receiptRoutes_1.default);
app.use('/api/smart-match', smartMatchRoutes_1.default);
app.use('/api/mandi', mandiRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
// Serve compiled frontend in production if present
const frontendDist = path_1.default.join(__dirname, '../../dist');
if (fs_1.default.existsSync(frontendDist)) {
    app.use(express_1.default.static(frontendDist));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
            return next();
        }
        res.sendFile(path_1.default.join(frontendDist, 'index.html'));
    });
}
// Global Error Handler
app.use(errorHandler_1.errorHandler);
const listenPort = Number(PORT) || 5000;
app.listen(listenPort, '0.0.0.0', () => {
    console.log(`🚀 Krushi Connect Express Server running on port ${listenPort}`);
    console.log(`📡 API Base URL: http://0.0.0.0:${listenPort}/api`);
});
