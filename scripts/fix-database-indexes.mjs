import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  try {
    const envPath = join(__dirname, "../.env.local");
    const envFile = readFileSync(envPath, "utf-8");
    const envVars = {};
    
    envFile.split("\n").forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        envVars[key] = value;
      }
    });
    
    MONGODB_URI = envVars.MONGODB_URI;
  } catch (err) {
    console.error("Could not read .env.local file:", err.message);
  }
}

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in environment variables or .env.local");
  process.exit(1);
}

async function fixIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log("\n📋 Found collections:", collections.map(c => c.name).join(", "));

    // Check and fix indexes in users collection (both test and farm-expense databases)
    const databases = ['test', 'farm-expense'];
    
    for (const dbName of databases) {
      try {
        const dbInstance = mongoose.connection.client.db(dbName);
        const collections = await dbInstance.listCollections().toArray();
        const usersCollection = collections.find(c => c.name === 'users');
        
        if (usersCollection) {
          console.log(`\n🔍 Checking indexes in ${dbName}.users...`);
          const indexes = await dbInstance.collection('users').indexes();
          console.log(`   Current indexes:`, indexes.map(i => i.name).join(", "));
          
          // Drop username index if it exists
          const usernameIndex = indexes.find(i => i.name === 'username_1' || (i.key && i.key.username));
          if (usernameIndex) {
            console.log(`   ⚠️  Found old username index: ${usernameIndex.name}`);
            await dbInstance.collection('users').dropIndex(usernameIndex.name);
            console.log(`   ✅ Dropped index: ${usernameIndex.name}`);
          } else {
            console.log(`   ✅ No username index found`);
          }
        }
      } catch (err) {
        if (err.code === 26) {
          console.log(`   ℹ️  Database ${dbName} does not exist (this is OK)`);
        } else {
          console.error(`   ❌ Error checking ${dbName}:`, err.message);
        }
      }
    }

    // Also check the current database
    try {
      const currentDb = mongoose.connection.db.databaseName;
      console.log(`\n🔍 Checking indexes in current database: ${currentDb}.users...`);
      const indexes = await db.collection('users').indexes();
      console.log(`   Current indexes:`, indexes.map(i => i.name).join(", "));
      
      const usernameIndex = indexes.find(i => i.name === 'username_1' || (i.key && i.key.username));
      if (usernameIndex) {
        console.log(`   ⚠️  Found old username index: ${usernameIndex.name}`);
        await db.collection('users').dropIndex(usernameIndex.name);
        console.log(`   ✅ Dropped index: ${usernameIndex.name}`);
      } else {
        console.log(`   ✅ No username index found`);
      }
    } catch (err) {
      console.error(`   ❌ Error:`, err.message);
    }

    console.log("\n✅ Index cleanup complete!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

fixIndexes();

