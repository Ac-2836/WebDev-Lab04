// Shared by the appeal form and the Express route (client/server parity).
export const OUTCOMES = {
  overturn: 'Overturn the ruling',
  reduce: 'Reduce the penalty',
  review: 'Independent review',
};
export const GROUNDS_MIN = 30;
export const GROUNDS_MAX = 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (value) => (typeof value === 'string' ? value.trim() : '');

export function validateAppeal({ email, outcome, grounds }) {
  const errors = {};

  if (!text(email)) errors.email = 'Contact email is required.';
  else if (!EMAIL_PATTERN.test(text(email))) {
    errors.email = 'Enter a valid email address.';
  }

  if (!Object.hasOwn(OUTCOMES, outcome ?? '')) {
    errors.outcome = 'Choose the outcome you are asking for.';
  }

  const length = text(grounds).length;
  if (length === 0) errors.grounds = 'Grounds for appeal are required.';
  else if (length < GROUNDS_MIN) {
    errors.grounds =
      `Explain the grounds in at least ${GROUNDS_MIN} characters.`;
  } else if (length > GROUNDS_MAX) {
    errors.grounds = `Keep the grounds under ${GROUNDS_MAX} characters.`;
  }

  return errors;
}
