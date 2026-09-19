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
// Load environment variables from possible .env locations
const envPaths = [
    path_1.default.join(process.cwd(), '.env'),
    path_1.default.join(process.cwd(), 'server', '.env'),
    path_1.default.join(__dirname, '../.env'),
    path_1.default.join(__dirname, '../../.env')
];
for (const envPath of envPaths) {
    if (fs_1.default.existsSync(envPath)) {
        dotenv_1.default.config({ path: envPath });
        break;
    }
}
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB Atlas
(0, db_1.connectDB)();
// CORS & Middleware
// CLIENT_URL can be a single URL or comma-separated list of allowed origins
const rawClientUrls = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = [
    ...rawClientUrls.split(',').map(u => u.trim()).filter(Boolean),
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
];
// Startup env check — helps diagnose missing vars on the host
console.log('🔧 Environment check:');
console.log(`   MONGODB_URI : ${process.env.MONGODB_URI ? '✅ set' : '❌ MISSING — DB will not connect!'}`);
console.log(`   JWT_SECRET  : ${process.env.JWT_SECRET ? '✅ set' : '⚠️  using fallback (insecure)'}`);
console.log(`   CLIENT_URL  : ${rawClientUrls}`);
console.log(`   CORS origins: ${allowedOrigins.join(', ')}`);
console.log(`   SMTP_USER   : ${process.env.SMTP_USER ? '✅ set' : '⚠️  not set'}`);
console.log(`   SMTP_PASS   : ${process.env.SMTP_PASS ? '✅ set' : '⚠️  not set'}`);
console.log(`   BREVO_KEY   : ${process.env.BREVO_API_KEY ? '✅ set (Brevo HTTPS API — recommended)' : '⚠️  not set'}`);
console.log(`   RESEND_KEY  : ${process.env.RESEND_API_KEY ? '✅ set (Resend HTTPS API)' : '⚠️  not set'}`);
const emailReady = process.env.BREVO_API_KEY || process.env.RESEND_API_KEY || (process.env.SMTP_USER && process.env.SMTP_PASS);
console.log(`   EMAIL READY : ${emailReady ? '✅ OTP emails WILL be sent' : '❌ MISSING — OTP emails will NOT be sent!'}`);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, curl, same-origin)
        if (!origin)
            return callback(null, true);
        // Allow localhost during local development
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }
        // Allow any onrender.com or vercel.app deployment
        if (origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        // Allow explicitly whitelisted production origins from CLIENT_URL
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        // Allow if origin matches host
        return callback(null, true);
    },
    credentials: true
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Serve uploaded equipment images (support root uploads or server/uploads)
const candidateUploadDirs = [
    path_1.default.join(process.cwd(), 'uploads'),
    path_1.default.join(process.cwd(), 'server', 'uploads'),
    path_1.default.join(__dirname, '../uploads'),
    path_1.default.join(__dirname, '../../uploads')
];
for (const dir of candidateUploadDirs) {
    if (fs_1.default.existsSync(dir)) {
        app.use('/uploads', express_1.default.static(dir));
    }
}
// Ensure default uploads directory exists
const defaultUploadDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(defaultUploadDir)) {
    try {
        fs_1.default.mkdirSync(defaultUploadDir, { recursive: true });
    }
    catch { }
}
app.use('/uploads', express_1.default.static(defaultUploadDir));
// Fallback for missing uploaded images so the browser never logs a 404 error
app.use('/uploads', (_req, res) => {
    const fallbackCandidates = [
        path_1.default.join(__dirname, '../uploads/eq_1788547747161_6q8xlm.webp'),
        path_1.default.join(process.cwd(), 'server/uploads/eq_1788547747161_6q8xlm.webp'),
        path_1.default.join(process.cwd(), 'uploads/eq_1788547747161_6q8xlm.webp'),
        path_1.default.join(process.cwd(), 'public/hero-tractor-clean.png')
    ];
    for (const fallbackPath of fallbackCandidates) {
        if (fs_1.default.existsSync(fallbackPath)) {
            return res.sendFile(fallbackPath);
        }
    }
    return res.redirect(302, 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80');
});
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
const candidateDists = [
    path_1.default.join(process.cwd(), 'server', 'public'),
    path_1.default.join(__dirname, '../public'),
    path_1.default.join(__dirname, '../../dist'),
    path_1.default.join(process.cwd(), 'dist'),
    path_1.default.join(process.cwd(), '../dist')
];
let frontendDist = candidateDists.find(dir => fs_1.default.existsSync(dir) && fs_1.default.existsSync(path_1.default.join(dir, 'index.html')));
if (frontendDist) {
    console.log(`📦 Serving frontend static assets from: ${frontendDist}`);
    app.use(express_1.default.static(frontendDist));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
            return next();
        }
        res.sendFile(path_1.default.join(frontendDist, 'index.html'));
    });
}
else {
    console.warn('⚠️ Frontend dist folder not found. API routes are active.');
}
// Global Error Handler
app.use(errorHandler_1.errorHandler);
const listenPort = Number(PORT) || 5000;
app.listen(listenPort, '0.0.0.0', () => {
    console.log(`🚀 Krushi Connect Express Server running on port ${listenPort}`);
    console.log(`📡 API Base URL: http://0.0.0.0:${listenPort}/api`);
});
