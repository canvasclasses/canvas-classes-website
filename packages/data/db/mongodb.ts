import 'server-only';
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

    // Invalidate the cached connection if the underlying socket dropped
    // (common after Next.js dev hot-reloads or Atlas idle disconnects).
    // With bufferCommands: false, a stale readyState would make every
    // subsequent query throw "Cannot call X.find() before initial connection
    // is complete" even though `cached.conn` looks present.
    if (cached!.conn && mongoose.connection.readyState !== 1) {
        cached!.conn = null;
        cached!.promise = null;
    }

    if (cached!.conn) {
        return cached!.conn;
    }

    if (!cached!.promise) {
        // ── Pool sizing ────────────────────────────────────────────────────
        //
        // Lowered 2026-05-27 after Atlas hit 425 / 500 connections in prod.
        // Each Vercel function instance was holding up to 25 connections; with
        // N concurrent warm instances this comfortably saturated an entry-tier
        // cluster. Three structural changes happened simultaneously to make
        // a much smaller pool safe:
        //
        //   1. PredictorDataset is now cached in-process (lib/predictor.ts),
        //      so the /predict-range thundering-herd of 9 parallel dataset
        //      loads collapses to a single cached lookup.
        //   2. /career-guide pages moved from force-dynamic to revalidate=3600,
        //      removing the per-render Mongo round-trip on a 17-URL surface
        //      that Google was crawling actively.
        //   3. /api/v2/career-guide* GET routes already had s-maxage=600 edge
        //      cache headers.
        //
        // After those, observed per-instance need is 1-3 concurrent queries.
        // maxPoolSize: 10 gives 3-5× headroom. minPoolSize: 0 frees idle
        // connections immediately instead of pinning 2 warm per instance
        // (which across 30 warm Vercel instances was 60 wasted slots).
        // maxIdleTimeMS reclaims any idle connection after 30s.
        // waitQueueTimeoutMS prevents queued queries hanging forever if a
        // burst genuinely exceeds the pool; they fail fast at 10s instead.
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,                 // was 25 — see comment above
            minPoolSize: 0,                  // was 2 — free idle conns for the cluster
            maxIdleTimeMS: 30000,            // close idle sockets after 30s
            serverSelectionTimeoutMS: 5000,  // fail fast if Atlas is unreachable
            socketTimeoutMS: 30000,          // was 45000 — release stuck sockets sooner
            connectTimeoutMS: 10000,         // timeout on initial connect
            heartbeatFrequencyMS: 15000,     // detect stale connections sooner
            waitQueueTimeoutMS: 10000,       // fail-fast instead of hanging on a burst
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
                    maxPoolSize: 10,
                    minPoolSize: 0,
                    maxIdleTimeMS: 30000,
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 30000,
                    connectTimeoutMS: 10000,
                    heartbeatFrequencyMS: 15000,
                    waitQueueTimeoutMS: 10000,
                });
                cached!.conn = await cached!.promise;
                console.log('✅ MongoDB connected on retry', attempt);
                break;
            } catch (retryErr) {
                cached!.promise = null;
                if (attempt === MAX_CONNECT_RETRIES) {
                    console.error('❌ MongoDB connection failed after retries:', retryErr);
                    throw retryErr;
                }
            }
        }

        if (!cached!.conn) throw e;
    }

    // Hard guarantee before returning: the default connection's readyState
    // must be 1. Without this, with bufferCommands: false, the very next
    // `Model.find()` can throw "Cannot call X.find() before initial
    // connection is complete" if Mongoose's state machine hasn't finished
    // flipping (happens across Next.js dev HMR boundaries). asPromise()
    // resolves on the next 'open' event, or immediately if already open.
    if (mongoose.connection.readyState !== 1) {
        try {
            await mongoose.connection.asPromise();
        } catch (waitErr) {
            console.error('❌ MongoDB open wait failed:', waitErr);
            throw waitErr;
        }
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
