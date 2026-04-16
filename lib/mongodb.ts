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

const MAX_CONNECT_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 500; // doubles each attempt: 500, 1000, 2000

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
            maxPoolSize: 25,                 // Handle concurrent serverless invocations
            minPoolSize: 2,                  // Keep warm connections ready
            serverSelectionTimeoutMS: 5000,  // Fail fast if Atlas is unreachable
            socketTimeoutMS: 45000,          // Prevent zombie connections
            connectTimeoutMS: 10000,         // Timeout on initial connect
            heartbeatFrequencyMS: 15000,     // Detect stale connections sooner
        };

        mongoose.set('strictQuery', false);
        cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            console.log('✅ MongoDB connected successfully');
            return mongooseInstance;
        });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (e) {
        cached!.promise = null;

        // Exponential backoff retry for transient network failures
        for (let attempt = 1; attempt <= MAX_CONNECT_RETRIES; attempt++) {
            const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
            console.warn(`⏳ MongoDB retry ${attempt}/${MAX_CONNECT_RETRIES} in ${delay}ms…`);
            await new Promise(r => setTimeout(r, delay));

            try {
                cached!.promise = mongoose.connect(MONGODB_URI, {
                    bufferCommands: false,
                    maxPoolSize: 25,
                    minPoolSize: 2,
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000,
                    connectTimeoutMS: 10000,
                    heartbeatFrequencyMS: 15000,
                });
                cached!.conn = await cached!.promise;
                console.log('✅ MongoDB connected on retry', attempt);
                return cached!.conn;
            } catch (retryErr) {
                cached!.promise = null;
                if (attempt === MAX_CONNECT_RETRIES) {
                    console.error('❌ MongoDB connection failed after retries:', retryErr);
                    throw retryErr;
                }
            }
        }

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
