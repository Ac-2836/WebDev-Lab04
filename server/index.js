import { createApp } from './app.js';
import { connectMongo } from './db-connect.js';
import { createSwipeRouter } from './homeworks/swipe/routes.js';
import { seedProfiles } from './homeworks/swipe/seed.js';

const { PORT, CLIENT_ORIGIN, MONGODB_URI } = process.env;
if (!PORT || !CLIENT_ORIGIN) {
  throw new Error('PORT and CLIENT_ORIGIN must be set (see .env.example)');
}
if (!MONGODB_URI) throw new Error('MONGODB_URI missing');

await connectMongo(MONGODB_URI);
await seedProfiles();

const app = createApp({
  clientOrigin: CLIENT_ORIGIN,
  routers: [createSwipeRouter()],
});
app.listen(Number(PORT), () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
