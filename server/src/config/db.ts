import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async (): Promise<void> => {
  try {
    // Configure public DNS servers to prevent Windows querySrv ECONNREFUSED issues
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
    } catch (dnsErr) {
      console.warn('DNS server override notice:', dnsErr);
    }

    const connString = process.env.MONGODB_URI;
    if (!connString) {
      throw new Error('MONGODB_URI is missing in environment variables');
    }
    
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`✅ Connected to MongoDB Atlas database: "${conn.connection.name}" at ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error);
    // Retry connection after 5 seconds instead of crashing server
    setTimeout(connectDB, 5000);
  }
};
