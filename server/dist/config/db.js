"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dns_1 = __importDefault(require("dns"));
const connectDB = async () => {
    try {
        // Configure public DNS servers to prevent Windows querySrv ECONNREFUSED issues
        try {
            dns_1.default.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
        }
        catch (dnsErr) {
            console.warn('DNS server override notice:', dnsErr);
        }
        const connString = process.env.MONGODB_URI;
        if (!connString) {
            throw new Error('MONGODB_URI is missing in environment variables');
        }
        const conn = await mongoose_1.default.connect(connString, {
            serverSelectionTimeoutMS: 10000
        });
        console.log(`✅ Connected to MongoDB Atlas database: "${conn.connection.name}" at ${conn.connection.host}`);
    }
    catch (error) {
        console.error('❌ Failed to connect to MongoDB Atlas:', error);
        // Retry connection after 5 seconds instead of crashing server
        setTimeout(exports.connectDB, 5000);
    }
};
exports.connectDB = connectDB;
