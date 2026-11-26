// @vitest-environment node
import { once } from 'node:events';
import mongoose from 'mongoose';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';
import { createApp } from '../../app.js';
import { connectMongo } from '../../db-connect.js';
import { Swipe } from './models.js';
import { createSwipeRouter } from './routes.js';
import { seedProfiles } from './seed.js';

// Contract: createSwipeRouter() exposes
//   GET    /api/profiles     200 [{ _id, name, age, bio, order }]
//   POST   /api/swipe        201 { _id, profileId, direction, createdAt }
//                            400 bad direction / missing or unknown profile
//   DELETE /api/swipe/:id    204, or 404 when there is no such swipe
// Tests use their own database next to the app database.
let server;
let base;

beforeAll(async () => {
  await connectMongo(process.env.MONGODB_URI, { dbName: 'lab4_test' });
  await seedProfiles();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Swipe.deleteMany({});
  const app = createApp({
    clientOrigin: 'http://localhost:5173',
    routers: [createSwipeRouter()],
  });
  server = app.listen(0);
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}/api`;
});

afterEach(() => new Promise((resolve) => server.close(resolve)));

const post = (body) =>
  fetch(`${base}/swipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('GET /api/profiles', () => {
  it('returns the seeded profiles in deck order', async () => {
    const res = await fetch(`${base}/profiles`);
    expect(res.status).toBe(200);
    const profiles = await res.json();
    expect(profiles.length).toBe(8);
    expect(Object.keys(profiles[0]).sort()).toEqual(
      ['_id', 'age', 'bio', 'name', 'order']
    );
    expect(profiles.map((p) => p.order)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });
});

describe('POST /api/swipe', () => {
  it('stores a valid swipe and drops extra fields', async () => {
    const res = await post({
      profileId: 'p-an',
      direction: 'right',
      score: 99,
    });
    expect(res.status).toBe(201);
    const swipe = await res.json();
    expect(swipe).toMatchObject({ profileId: 'p-an', direction: 'right' });
    expect(swipe).not.toHaveProperty('score');
    expect(Number.isNaN(Date.parse(swipe.createdAt))).toBe(false);

    const stored = await Swipe.findById(swipe._id).lean();
    expect(stored.direction).toBe('right');
    expect(stored).not.toHaveProperty('score');
  });

  it('accepts all three slide directions', async () => {
    for (const direction of ['left', 'right', 'up']) {
      expect((await post({ profileId: 'p-binh', direction })).status).toBe(
        201
      );
    }
  });

  it('returns 400 for a bad direction or missing/unknown profile', async () => {
    const bodies = [
      { profileId: 'p-an', direction: 'down' },
      { direction: 'left' },
      { profileId: 'p-nobody', direction: 'left' },
      {},
    ];
    for (const body of bodies) {
      const res = await post(body);
      expect(res.status).toBe(400);
      expect(await res.json()).toHaveProperty('error');
    }
    expect(await Swipe.countDocuments()).toBe(0);
  });
});

describe('DELETE /api/swipe/:id', () => {
  it('removes the swipe (LIFO undo) and 404s afterwards', async () => {
    const swipe = await (await post({ profileId: 'p-chi', direction: 'up' }))
      .json();

    const res = await fetch(`${base}/swipe/${swipe._id}`, { method: 'DELETE' });
    expect(res.status).toBe(204);
    expect(await Swipe.countDocuments()).toBe(0);

    const again = await fetch(`${base}/swipe/${swipe._id}`, {
      method: 'DELETE',
    });
    expect(again.status).toBe(404);
  });

  it('returns 404 for an id that is not an ObjectId', async () => {
    const res = await fetch(`${base}/swipe/not-an-id`, { method: 'DELETE' });
    expect(res.status).toBe(404);
  });
});
