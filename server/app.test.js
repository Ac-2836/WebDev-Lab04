// @vitest-environment node
import { once } from 'node:events';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from './app.js';

// Contract: createApp({ clientOrigin }) returns an Express app with its own
// in-memory store for the forums 'nasa', 'esports-tribunal' and 'notNasa'.
const CLIENT_ORIGIN = 'http://localhost:5173';
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

let server;
let baseUrl;

beforeEach(async () => {
  server = createApp({ clientOrigin: CLIENT_ORIGIN }).listen(0);
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}/api/messages`;
});

afterEach(() => new Promise((resolve) => server.close(resolve)));

const post = (forum, body) =>
  fetch(`${baseUrl}/${forum}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('GET /api/messages/:forum', () => {
  it('returns 200 with a message array for every known forum', async () => {
    for (const forum of ['nasa', 'esports-tribunal', 'notNasa']) {
      const res = await fetch(`${baseUrl}/${forum}`);
      expect(res.status).toBe(200);
      const messages = await res.json();
      expect(Array.isArray(messages)).toBe(true);
      messages.forEach((m) =>
        expect(Object.keys(m).sort()).toEqual(
          ['author', 'id', 'text', 'timestamp']
        )
      );
    }
  });

  it('returns 404 with an error for an unknown forum', async () => {
    const res = await fetch(`${baseUrl}/mars`);
    expect(res.status).toBe(404);
    expect(await res.json()).toHaveProperty('error');
  });

  it('allows CORS only for the configured client origin', async () => {
    const res = await fetch(`${baseUrl}/nasa`, {
      headers: { Origin: CLIENT_ORIGIN },
    });
    expect(res.headers.get('access-control-allow-origin')).toBe(CLIENT_ORIGIN);

    const other = await fetch(`${baseUrl}/nasa`, {
      headers: { Origin: 'http://evil.example' },
    });
    expect(other.headers.get('access-control-allow-origin')).not.toBe(
      'http://evil.example'
    );
  });
});

describe('POST /api/messages/:forum', () => {
  it('returns 201 with a new message and stores it in that forum', async () => {
    const res = await post('nasa', { author: 'Katherine', text: 'Go for TLI' });
    expect(res.status).toBe(201);
    const created = await res.json();
    expect(created).toMatchObject({ author: 'Katherine', text: 'Go for TLI' });
    expect(created.id).toMatch(UUID);
    expect(Number.isNaN(Date.parse(created.timestamp))).toBe(false);

    const list = await (await fetch(`${baseUrl}/nasa`)).json();
    expect(list).toContainEqual(created);
    const other = await (await fetch(`${baseUrl}/notNasa`)).json();
    expect(other).not.toContainEqual(created);
  });

  it('returns 400 when author or text is missing or blank', async () => {
    const bodies = [
      { text: 'no author' },
      { author: 'no text' },
      { author: '   ', text: 'blank author' },
      { author: 'Ada', text: '   ' },
      {},
    ];
    for (const body of bodies) {
      const res = await post('nasa', body);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'Missing required fields' });
    }
  });

  it('returns 404 when posting to an unknown forum', async () => {
    const res = await post('mars', { author: 'Ada', text: 'hello' });
    expect(res.status).toBe(404);
  });
});
