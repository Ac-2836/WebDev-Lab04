import { randomUUID } from 'node:crypto';
import cors from 'cors';
import express from 'express';
import { createStore } from './db.js';

const isFilled = (value) => typeof value === 'string' && value.trim() !== '';

export function createApp({ clientOrigin, store = createStore() }) {
  const app = express();
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json());

  app.get('/api/messages/:forum', async (req, res) => {
    const messages = await store.getMessagesByForum(req.params.forum);
    if (!messages) return res.status(404).json({ error: 'Unknown forum' });
    return res.status(200).json(messages);
  });

  app.post('/api/messages/:forum', async (req, res) => {
    const { forum } = req.params;
    if (!(await store.hasForum(forum))) {
      return res.status(404).json({ error: 'Unknown forum' });
    }
    const { author, text } = req.body ?? {};
    if (!isFilled(author) || !isFilled(text)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Whitelist fields instead of spreading req.body into the record.
    const message = {
      id: randomUUID(),
      author: author.trim(),
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    await store.addMessage(forum, message);
    return res.status(201).json(message);
  });

  // Malformed JSON and unexpected errors still answer with JSON.
  app.use((err, req, res, next) => {
    const status = err.status ?? 500;
    res.status(status).json({
      error: status === 500 ? 'Internal server error' : err.message,
    });
  });

  return app;
}
