import mongoose from 'mongoose';
import {
  OUTCOMES,
} from '../../../src/homeworks/AppealTribunal/validate-appeal.js';

const chargeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    offence: { type: String, required: true },
    severity: { type: Number, required: true, min: 1, max: 5 },
    banDays: { type: Number, required: true, min: 0 },
    precedentDays: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const dossierSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    playerName: { type: String, required: true },
    team: { type: String, required: true },
    role: { type: String, required: true },
    summary: { type: String, required: true },
    charges: { type: [chargeSchema], required: true },
    appealDeadline: { type: Date, required: true },
  },
  { versionKey: false }
);

const appealSchema = new mongoose.Schema(
  {
    playerId: { type: String, ref: 'Dossier', required: true },
    email: { type: String, required: true, trim: true },
    outcome: { type: String, enum: Object.keys(OUTCOMES), required: true },
    grounds: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

export const Dossier =
  mongoose.models.Dossier ?? mongoose.model('Dossier', dossierSchema);
export const Appeal =
  mongoose.models.Appeal ?? mongoose.model('Appeal', appealSchema);
