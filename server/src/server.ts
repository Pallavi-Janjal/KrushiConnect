import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import notificationRoutes from './routes/notificationRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import usageRoutes from './routes/usageRoutes';
import planningRoutes from './routes/planningRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import receiptRoutes from './routes/receiptRoutes';
import smartMatchRoutes from './routes/smartMatchRoutes';
import mandiRoutes from './routes/mandiRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

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

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    // Allow any localhost origin during development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    // Allow whitelisted production origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In production, reject unknown origins; in dev, allow all
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error(`CORS: origin '${origin}' not allowed`), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded equipment images (support root uploads or server/uploads)
const candidateUploadDirs = [
  path.join(process.cwd(), 'uploads'),
  path.join(process.cwd(), 'server', 'uploads'),
  path.join(__dirname, '../uploads'),
  path.join(__dirname, '../../uploads')
];
for (const dir of candidateUploadDirs) {
  if (fs.existsSync(dir)) {
    app.use('/uploads', express.static(dir));
  }
}
// Ensure default uploads directory exists
const defaultUploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(defaultUploadDir)) {
  try { fs.mkdirSync(defaultUploadDir, { recursive: true }); } catch {}
}
app.use('/uploads', express.static(defaultUploadDir));

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
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/smart-match', smartMatchRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/upload', uploadRoutes);

// Serve compiled frontend in production if present
const candidateDists = [
  path.join(__dirname, '../../dist'),
  path.join(process.cwd(), 'dist'),
  path.join(process.cwd(), '../dist')
];

let frontendDist = candidateDists.find(dir => fs.existsSync(dir) && fs.existsSync(path.join(dir, 'index.html')));

if (frontendDist) {
  console.log(`📦 Serving frontend static assets from: ${frontendDist}`);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist!, 'index.html'));
  });
} else {
  console.warn('⚠️ Frontend dist folder not found. API routes are active.');
}

// Global Error Handler
app.use(errorHandler);

const listenPort = Number(PORT) || 5000;
app.listen(listenPort, '0.0.0.0', () => {
  console.log(`🚀 Krushi Connect Express Server running on port ${listenPort}`);
  console.log(`📡 API Base URL: http://0.0.0.0:${listenPort}/api`);
});
