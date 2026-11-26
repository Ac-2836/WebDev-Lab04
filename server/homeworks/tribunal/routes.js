import express from 'express';
// One rule set for the form and the API (client/server parity).
import {
  validateAppeal,
} from '../../../src/homeworks/AppealTribunal/validate-appeal.js';
import { Appeal, Dossier } from './models.js';

export function createTribunalRouter() {
  const router = express.Router();

  router.get('/api/dossiers/:playerId', async (req, res) => {
    const dossier = await Dossier.findById(req.params.playerId).lean();
    if (!dossier) return res.status(404).json({ error: 'Unknown player' });
    // serverNow lets the client measure its clock offset for the SLA timer.
    return res.status(200).json({ ...dossier, serverNow: Date.now() });
  });

  router.post('/api/appeals', async (req, res) => {
    const { playerId, email, outcome, grounds } = req.body ?? {};
    const errors = validateAppeal({ email, outcome, grounds });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Invalid appeal', errors });
    }
    const dossier =
      typeof playerId === 'string'
        ? await Dossier.findById(playerId, { appealDeadline: 1 }).lean()
        : null;
    if (!dossier) return res.status(400).json({ error: 'Unknown player' });
    if (dossier.appealDeadline.getTime() <= Date.now()) {
      return res.status(409).json({ error: 'The appeal window has closed' });
    }
    const appeal = await Appeal.create({ playerId, email, outcome, grounds });
    return res.status(201).json(appeal);
  });

  return router;
}
