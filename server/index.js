import { createApp } from './app.js';
import { connectMongo } from './db-connect.js';
import { seedProfiles } from './homeworks/swipe/seed.js';

const { PORT, CLIENT_ORIGIN, MONGODB_URI } = process.env;
if (!PORT || !CLIENT_ORIGIN) {
  throw new Error('PORT and CLIENT_ORIGIN must be set (see .env.example)');
}
if (!MONGODB_URI) throw new Error('MONGODB_URI missing');

await connectMongo(MONGODB_URI);
await seedProfiles();

createApp({ clientOrigin: CLIENT_ORIGIN }).listen(Number(PORT), () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
