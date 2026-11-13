import { useId } from 'react';
import { useFormContext } from './FormContext.js';
import styles from './InputField.module.css';

export function InputField({ name, label, type = 'text', autoComplete }) {
  const { values, errors, touched, submitAttempted, handleChange, handleBlur } =
    useFormContext();
  const id = useId();
  const errorId = `${id}-error`;
  // Derived: the error exists every render, it is only revealed after
  // the user has left the field or tried to submit.
  const error = touched[name] || submitAttempted ? errors[name] : undefined;

  return (
    <p className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={values[name]}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {error && (
        <span id={errorId} className={styles.error} role='alert'>
          {error}
        </span>
      )}
    </p>
  );
}
