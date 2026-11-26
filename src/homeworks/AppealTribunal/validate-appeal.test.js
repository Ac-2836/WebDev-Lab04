import { describe, expect, it } from 'vitest';
import { validateAppeal } from './validate-appeal.js';

const VALID = {
  email: 'tanvuu@team.vn',
  outcome: 'review',
  grounds: 'The chat message was sent by a teammate on a shared account.',
};
const fields = (values) => Object.keys(validateAppeal(values)).sort();

describe('validateAppeal', () => {
  it('accepts a complete appeal', () => {
    expect(validateAppeal(VALID)).toEqual({});
  });

  it('flags every field of an empty appeal', () => {
    expect(fields({})).toEqual(['email', 'grounds', 'outcome']);
  });

  it('checks the email format and the outcome list', () => {
    expect(fields({ ...VALID, email: 'tanvuu@team' })).toEqual(['email']);
    expect(fields({ ...VALID, outcome: 'ban-the-referee' })).toEqual([
      'outcome',
    ]);
    expect(fields({ ...VALID, outcome: 'toString' })).toEqual(['outcome']);
  });

  it('needs 30-1000 characters of grounds after trimming', () => {
    expect(fields({ ...VALID, grounds: `  ${'a'.repeat(29)}  ` })).toEqual([
      'grounds',
    ]);
    expect(fields({ ...VALID, grounds: 'a'.repeat(30) })).toEqual([]);
    expect(fields({ ...VALID, grounds: 'a'.repeat(1001) })).toEqual([
      'grounds',
    ]);
  });

  it('treats non-string input as missing (server bodies are untrusted)', () => {
    expect(fields({ email: 42, outcome: null, grounds: ['x'] })).toEqual([
      'email',
      'grounds',
      'outcome',
    ]);
  });
});
