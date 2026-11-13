import { randomUUID } from 'node:crypto';

const SEED = {
  nasa: [
    ['Katherine Johnson', 'Apollo 11 return trajectory checks out.'],
    ['Margaret Hamilton', 'Guidance software handles the 1202 alarm.'],
  ],
  'esports-tribunal': [
    ['Referee', 'Appeal hearing opens at 19:00 ICT.'],
    ['Himass', 'Submitting the match replay as evidence.'],
  ],
  notNasa: [
    ['Ada Lovelace', 'Not a rocket, still an engine.'],
  ],
};

function seedMessage([author, text], index) {
  return {
    id: randomUUID(),
    author,
    text,
    timestamp: new Date(Date.UTC(2026, 10, 13, 9, index)).toISOString(),
  };
}

// In-memory stand-in for a database: async API, one store per app instance.
// shortcut: data is lost on restart, swap for Mongoose 8 in the homework.
export function createStore() {
  const forums = new Map(
    Object.entries(SEED).map(([forum, rows]) => [forum, rows.map(seedMessage)])
  );

  return {
    async getMessagesByForum(forum) {
      const messages = forums.get(forum);
      return messages ? [...messages] : null;
    },
    async hasForum(forum) {
      return forums.has(forum);
    },
    async addMessage(forum, message) {
      forums.set(forum, [...forums.get(forum), message]);
      return message;
    },
  };
}
