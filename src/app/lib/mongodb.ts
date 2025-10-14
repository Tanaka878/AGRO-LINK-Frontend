import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/agrolink'; // 👈 use 127.0.0.1

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log('✅ Connected to DB:', mongoose.connection.name);
  return cached.conn;
}
