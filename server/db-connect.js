import mongoose from 'mongoose';

// Mongoose 8: no useNewUrlParser / useUnifiedTopology flags, no callbacks.
export async function connectMongo(uri, options = {}) {
  if (!uri) throw new Error('MONGODB_URI missing');
  await mongoose.connect(uri, options);
  return mongoose.connection;
}
