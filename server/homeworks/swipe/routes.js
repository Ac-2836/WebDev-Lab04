import express from 'express';
import mongoose from 'mongoose';
import { Profile, Swipe } from './models.js';

export function createSwipeRouter() {
  const router = express.Router();

  router.get('/api/profiles', async (req, res) => {
    const profiles = await Profile.find().sort({ order: 1 }).lean();
    res.status(200).json(profiles);
  });

  router.post('/api/swipe', async (req, res) => {
    // Whitelist instead of Swipe.create(req.body) from the slide.
    const { profileId, direction } = req.body ?? {};
    const known =
      typeof profileId === 'string' &&
      (await Profile.exists({ _id: profileId }));
    if (!known) {
      return res.status(400).json({ error: 'Unknown profile' });
    }
    try {
      const swipe = await Swipe.create({ profileId, direction });
      return res.status(201).json(swipe);
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ error: err.message });
      }
      throw err;
    }
  });

  router.delete('/api/swipe/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = mongoose.isValidObjectId(id)
      ? await Swipe.findByIdAndDelete(id).lean()
      : null;
    if (!deleted) return res.status(404).json({ error: 'Swipe not found' });
    return res.status(204).end();
  });

  return router;
}
