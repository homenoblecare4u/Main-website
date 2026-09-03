import mongoose from 'mongoose';

// Ensure all models are registered with Mongoose before any queries
import '@/server/models';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connects to MongoDB with Mongoose singleton caching across serverless invocations.
 * Never logs credentials, database URIs, or passwords.
 */
async function connectToDatabase(): Promise<typeof mongoose> {
  let uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // Handle accidental wrapping in angle brackets or quotes
  if (uri.startsWith('<') && uri.endsWith('>')) {
    uri = uri.slice(1, -1).trim();
  }
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim();
  }

  if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
}

export default connectToDatabase;
