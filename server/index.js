import { createApp } from './app.js';

const { PORT, CLIENT_ORIGIN } = process.env;
if (!PORT || !CLIENT_ORIGIN) {
  throw new Error('PORT and CLIENT_ORIGIN must be set (see .env.example)');
}

createApp({ clientOrigin: CLIENT_ORIGIN }).listen(Number(PORT), () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
