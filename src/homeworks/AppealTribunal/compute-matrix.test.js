import { describe, expect, it } from 'vitest';
import { computeMatrix, verdictFor } from './compute-matrix.js';

const dossier = {
  charges: [
    { code: 'C1', offence: 'A', severity: 3, banDays: 30, precedentDays: 14 },
    { code: 'C2', offence: 'B', severity: 1, banDays: 3, precedentDays: 3 },
  ],
};

describe('verdictFor (ban / precedent ratio)', () => {
  it('uses the 1.25 and 2.0 boundaries', () => {
    expect(verdictFor(1)).toBe('Proportionate');
    expect(verdictFor(1.25)).toBe('Proportionate');
    expect(verdictFor(1.26)).toBe('Elevated');
    expect(verdictFor(2)).toBe('Elevated');
    expect(verdictFor(2.01)).toBe('Disproportionate');
  });
});

describe('computeMatrix', () => {
  it('derives one row per charge with ratio and verdict', () => {
    const { rows } = computeMatrix(dossier);
    expect(rows).toEqual([
      expect.objectContaining({
        code: 'C1',
        ratio: 2.14,
        verdict: 'Disproportionate',
      }),
      expect.objectContaining({
        code: 'C2',
        ratio: 1,
        verdict: 'Proportionate',
      }),
    ]);
  });

  it('totals the bans and rates the whole case', () => {
    expect(computeMatrix(dossier).total).toEqual({
      banDays: 33,
      precedentDays: 17,
      ratio: 1.94,
      verdict: 'Elevated',
    });
  });

  it('does not mutate the dossier', () => {
    const frozen = Object.freeze({
      charges: dossier.charges.map((c) => Object.freeze({ ...c })),
    });
    expect(() => computeMatrix(frozen)).not.toThrow();
  });
});
