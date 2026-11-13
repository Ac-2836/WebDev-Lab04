const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Pure: called during render, never from an effect.
export function validateForm({ fullName, email, age }) {
  const errors = {};

  const name = fullName.trim();
  if (!name) {
    errors.fullName = 'Full name is required.';
  } else if (name.length < 2) {
    errors.fullName = 'Full name needs at least 2 characters.';
  }

  const mail = email.trim();
  if (!mail) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(mail)) {
    errors.email = 'Enter a valid email address, e.g. name@example.com.';
  }

  if (age === '') {
    errors.age = 'Age is required.';
  } else if (!Number.isInteger(age) || age < 1 || age > 120) {
    errors.age = 'Age must be a whole number from 1 to 120.';
  }

  return errors;
}
