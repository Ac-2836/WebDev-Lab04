import mongoose from 'mongoose';

export const DIRECTIONS = ['left', 'right', 'up'];

const profileSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18 },
    bio: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
  },
  { versionKey: false }
);

const swipeSchema = new mongoose.Schema(
  {
    profileId: { type: String, ref: 'Profile', required: true },
    direction: { type: String, enum: DIRECTIONS, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

export const Profile =
  mongoose.models.Profile ?? mongoose.model('Profile', profileSchema);
export const Swipe =
  mongoose.models.Swipe ?? mongoose.model('Swipe', swipeSchema);
