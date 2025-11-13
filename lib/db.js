import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let cached = global._mongooseCachedConnection;

if (!cached) {
  cached = global._mongooseCachedConnection = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(async (mongooseInstance) => {
        console.log("✅ Connected to MongoDB Atlas");
        
        // Clean up old indexes on connection
        try {
          const db = mongooseInstance.connection.db;
          const collections = await db.listCollections({ name: 'users' }).toArray();
          
          if (collections.length > 0) {
            const indexes = await db.collection('users').indexes();
            const usernameIndex = indexes.find(i => i.name === 'username_1' || (i.key && i.key.username));
            
            if (usernameIndex) {
              console.log("⚠️  Found old username index, dropping it...");
              await db.collection('users').dropIndex(usernameIndex.name);
              console.log("✅ Dropped old username index");
            }
          }
        } catch (indexError) {
          // Non-critical error, just log it
          console.warn("⚠️  Could not clean up indexes:", indexError.message);
        }
        
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        cached.promise = null; // Reset promise on error so we can retry
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset promise on error
    throw error;
  }
}

