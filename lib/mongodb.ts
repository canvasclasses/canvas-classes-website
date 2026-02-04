/**
 * MongoDB Connection Utility
 * 
 * The Crucible's "Brain" - handles all question, taxonomy, and activity data
 * 
 * SETUP:
 * 1. Create a MongoDB Atlas cluster at https://cloud.mongodb.com
 * 2. Add your connection string to .env.local as MONGODB_URI
 * 3. Whitelist your IP address in Atlas Network Access
 */

import mongoose, { Mongoose } from 'mongoose';

// TypeScript declaration for global mongoose cache
interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Use a different global key to avoid conflicts with mongoose import
declare global {
    var _mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI not defined. MongoDB features will be unavailable.');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing during API Route usage.
 */
let cached = global._mongooseCache;

if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<Mongoose | null> {
    if (!MONGODB_URI) {
        console.warn('MongoDB: No connection string provided');
        return null;
    }

    if (cached!.conn) {
        return cached!.conn;
    }

    if (!cached!.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
        };

        cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            console.log('✅ MongoDB connected successfully');
            return mongooseInstance;
        });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (e) {
        cached!.promise = null;
        console.error('❌ MongoDB connection failed:', e);
        throw e;
    }

    return cached!.conn;
}

export default connectToDatabase;

// Export for checking connection status
export function isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
}

// Export mongoose for model registration
export { mongoose };
