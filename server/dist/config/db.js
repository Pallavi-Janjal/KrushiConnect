"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let retryCount = 0;
const MAX_RETRIES = 10;
const connectDB = async () => {
    const connString = process.env.MONGODB_URI;
    if (!connString) {
        console.error('❌ MONGODB_URI is not set in environment variables.');
        console.error('   → On Render/Railway: add MONGODB_URI in the "Environment" tab.');
        console.error('   → On local: make sure server/.env exists with MONGODB_URI=...');
        // Retry in case env vars load late (some platforms have a brief delay)
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.error(`   Retrying in 5s... (attempt ${retryCount}/${MAX_RETRIES})`);
            setTimeout(exports.connectDB, 5000);
        }
        else {
            console.error('   ❌ Max retries reached. Server is running without a DB connection.');
        }
        return;
    }
    try {
        const conn = await mongoose_1.default.connect(connString, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000
        });
        retryCount = 0; // Reset on successful connection
        console.log(`✅ Connected to MongoDB Atlas: "${conn.connection.name}" at ${conn.connection.host}`);
    }
    catch (error) {
        console.error('❌ Failed to connect to MongoDB Atlas:', error?.message || error);
        // Common causes hint
        if (error?.message?.includes('ECONNREFUSED') || error?.message?.includes('querySrv') || error?.message?.includes('getaddrinfo')) {
            console.error('   → Check: MongoDB Atlas Network Access → IP Whitelist must include 0.0.0.0/0');
        }
        if (error?.message?.includes('Authentication failed') || error?.message?.includes('bad auth')) {
            console.error('   → Check: MongoDB Atlas username/password in MONGODB_URI is correct');
        }
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.error(`   Retrying in 5s... (attempt ${retryCount}/${MAX_RETRIES})`);
            setTimeout(exports.connectDB, 5000);
        }
        else {
            console.error('   ❌ Max retries reached. Check your MONGODB_URI and Atlas Network Access settings.');
        }
    }
};
exports.connectDB = connectDB;
