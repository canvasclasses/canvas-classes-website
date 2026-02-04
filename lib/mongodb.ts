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

import mongoose from 'mongoose';

// TypeScript declaration for global mongoose cache
declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI not defined. MongoDB features will be unavailable.');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<typeof mongoose | null> {
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

        cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('✅ MongoDB connected successfully');
            return mongoose;
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
