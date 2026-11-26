import { Dossier } from './models.js';

const HOUR = 60 * 60 * 1000;

// Fictional training case for Lab 04; not a real ruling about any player.
const DOSSIERS = [
  {
    _id: 'himass',
    playerName: 'Himass',
    team: 'Team A (fictional)',
    role: 'IGL',
    summary:
      'Flagged by the anti-cheat review for an on-screen overlay during the ' +
      'group stage; the player says it was the approved tournament HUD.',
    charges: [
      {
        code: 'C1',
        offence: 'Unapproved screen overlay (alleged)',
        severity: 3,
        banDays: 30,
        precedentDays: 14,
      },
      {
        code: 'C2',
        offence: 'Late lobby check-in',
        severity: 1,
        banDays: 3,
        precedentDays: 3,
      },
    ],
    hoursLeft: 72,
  },
  {
    _id: 'tanvuu',
    playerName: 'TanVuu',
    team: 'Team B (fictional)',
    role: 'Fragger',
    summary:
      'Reported for an unsporting message in all-chat after a final ' +
      'circle; the account is shared with a teammate.',
    charges: [
      {
        code: 'C1',
        offence: 'Unsporting all-chat message',
        severity: 2,
        banDays: 21,
        precedentDays: 7,
      },
      {
        code: 'C2',
        offence: 'Account sharing',
        severity: 2,
        banDays: 7,
        precedentDays: 7,
      },
    ],
    hoursLeft: 6,
  },
];

// Deadlines are set when a dossier is first created and kept across server
// restarts; resetDeadlines starts the appeal windows again (tests, demos).
export async function seedDossiers({ resetDeadlines = false } = {}) {
  const now = Date.now();
  await Dossier.bulkWrite(
    DOSSIERS.map(({ hoursLeft, ...dossier }) => {
      const deadline = { appealDeadline: new Date(now + hoursLeft * HOUR) };
      return {
        updateOne: {
          filter: { _id: dossier._id },
          update: resetDeadlines
            ? { $set: { ...dossier, ...deadline } }
            : { $set: dossier, $setOnInsert: deadline },
          upsert: true,
        },
      };
    })
  );
  return DOSSIERS.length;
}
