import { describe, expect, it } from 'vitest';
import { validateForm } from './validate-form.js';

// Contract: values = { fullName: string, email: string, age: number | '' }
// (age comes from valueAsNumber; an empty input is stored as '').
// Returns { [field]: message } with one non-empty message per invalid field.
const VALID = Object.freeze({
  fullName: 'Grace Hopper',
  email: 'grace@navy.mil',
  age: 85,
});

const invalidFields = (values) => Object.keys(validateForm(values)).sort();

describe('validateForm', () => {
  it('returns no errors for a valid form', () => {
    expect(validateForm(VALID)).toEqual({});
  });

  it('flags every required field when the form is empty', () => {
    const errors = validateForm({ fullName: '', email: '', age: '' });

    expect(Object.keys(errors).sort()).toEqual(['age', 'email', 'fullName']);
    Object.values(errors).forEach((message) => {
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });

  it('requires fullName to have at least 2 characters after trimming', () => {
    expect(invalidFields({ ...VALID, fullName: '   ' })).toEqual(['fullName']);
    expect(invalidFields({ ...VALID, fullName: ' A ' })).toEqual(['fullName']);
    expect(invalidFields({ ...VALID, fullName: 'Al' })).toEqual([]);
  });

  it('requires a valid email format', () => {
    ['grace', 'grace@', '@navy.mil', 'grace@navy', 'gr ace@navy.mil'].forEach(
      (email) => expect(invalidFields({ ...VALID, email })).toEqual(['email'])
    );
    expect(invalidFields({ ...VALID, email: 'a.b@c.io' })).toEqual([]);
  });

  it('requires age to be an integer from 1 to 120', () => {
    [0, -5, 121, 30.5, Number.NaN].forEach((age) =>
      expect(invalidFields({ ...VALID, age })).toEqual(['age'])
    );
    [1, 120].forEach((age) =>
      expect(invalidFields({ ...VALID, age })).toEqual([])
    );
  });

  it('is pure: same input gives the same output and nothing is mutated', () => {
    const values = Object.freeze({ fullName: '', email: 'x', age: 0 });

    expect(validateForm(values)).toEqual(validateForm(values));
    expect(values).toEqual({ fullName: '', email: 'x', age: 0 });
  });
});
