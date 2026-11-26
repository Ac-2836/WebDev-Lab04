// Ban length compared with the precedent for the same offence.
export function verdictFor(ratio) {
  if (ratio <= 1.25) return 'Proportionate';
  if (ratio <= 2) return 'Elevated';
  return 'Disproportionate';
}

const round2 = (n) => Math.round(n * 100) / 100;

// Pure and cheap (a handful of charges), so it runs on every render.
export function computeMatrix({ charges }) {
  const rows = charges.map((c) => {
    const ratio = round2(c.banDays / c.precedentDays);
    return { ...c, ratio, verdict: verdictFor(ratio) };
  });
  const banDays = charges.reduce((sum, c) => sum + c.banDays, 0);
  const precedentDays = charges.reduce((sum, c) => sum + c.precedentDays, 0);
  const ratio = round2(banDays / precedentDays);
  return {
    rows,
    total: { banDays, precedentDays, ratio, verdict: verdictFor(ratio) },
  };
}
