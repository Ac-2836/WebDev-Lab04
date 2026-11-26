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
import { Appeal, Dossier } from './models.js';
import { createTribunalRouter } from './routes.js';
import { seedDossiers } from './seed.js';

// Contract: createTribunalRouter() exposes
//   GET  /api/dossiers/:playerId  200 { _id, playerName, team, role, summary,
//                                      charges[], appealDeadline, serverNow }
//                                 404 for an unknown player
//   POST /api/appeals             201 stored appeal; 400 when the rules of
//                                 validateAppeal fail or the player is
//                                 unknown; 409 after the appeal deadline
// Own database, so it never races the HW 2 test file.
const VALID = {
  playerId: 'himass',
  email: 'himass@team.vn',
  outcome: 'reduce',
  grounds: 'The overlay flagged in match 3 is the approved tournament HUD.',
};
let server;
let base;

beforeAll(async () => {
  await connectMongo(process.env.MONGODB_URI, {
    dbName: 'lab4_test_tribunal',
  });
  await seedDossiers();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Appeal.deleteMany({});
  const app = createApp({
    clientOrigin: 'http://localhost:5173',
    routers: [createTribunalRouter()],
  });
  server = app.listen(0);
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}/api`;
});

afterEach(() => new Promise((resolve) => server.close(resolve)));

const postAppeal = (body) =>
  fetch(`${base}/appeals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('GET /api/dossiers/:playerId', () => {
  it('returns each dossier with its deadline and server time', async () => {
    for (const id of ['himass', 'tanvuu']) {
      const before = Date.now();
      const res = await fetch(`${base}/dossiers/${id}`);
      expect(res.status).toBe(200);
      const dossier = await res.json();
      expect(dossier._id).toBe(id);
      expect(dossier.charges.length).toBeGreaterThan(0);
      expect(Number.isNaN(Date.parse(dossier.appealDeadline))).toBe(false);
      expect(dossier.serverNow).toBeGreaterThanOrEqual(before);
    }
  });

  it('returns 404 for an unknown player', async () => {
    const res = await fetch(`${base}/dossiers/nobody`);
    expect(res.status).toBe(404);
    expect(await res.json()).toHaveProperty('error');
  });
});

describe('POST /api/appeals', () => {
  it('stores a valid appeal and drops extra fields', async () => {
    const res = await postAppeal({ ...VALID, status: 'approved' });
    expect(res.status).toBe(201);
    const appeal = await res.json();
    expect(appeal).toMatchObject(VALID);
    expect(appeal).not.toHaveProperty('status');
    expect(await Appeal.countDocuments({ playerId: 'himass' })).toBe(1);
  });

  it('returns 400 with field errors when the client rules fail', async () => {
    const res = await postAppeal({ ...VALID, email: 'x', grounds: 'short' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(Object.keys(body.errors).sort()).toEqual(['email', 'grounds']);
  });

  it('returns 400 for an unknown player', async () => {
    const res = await postAppeal({ ...VALID, playerId: 'nobody' });
    expect(res.status).toBe(400);
  });

  it('returns 409 once the appeal deadline has passed', async () => {
    await Dossier.updateOne(
      { _id: 'himass' },
      { appealDeadline: new Date(Date.now() - 1000) }
    );
    const res = await postAppeal(VALID);
    expect(res.status).toBe(409);
    expect(await Appeal.countDocuments()).toBe(0);
    await seedDossiers({ resetDeadlines: true });
  });
});
