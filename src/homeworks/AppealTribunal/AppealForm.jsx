import { useId, useState } from 'react';
import { FormContext, useFormContext } from '../../form/FormContext.js';
import { InputField } from '../../form/InputField.jsx';
import {
  GROUNDS_MAX,
  OUTCOMES,
  validateAppeal,
} from './validate-appeal.js';
import styles from './AppealTribunal.module.css';

const API_URL = import.meta.env.VITE_API_URL ?? '';
const EMPTY = { email: '', outcome: '', grounds: '' };

// Same engine as Sprint 2: values in state, errors derived in render,
// shared through FormContext; the rules are the ones the server runs.
export function AppealForm({ playerId, closed }) {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [send, setSend] = useState({ status: 'IDLE' });
  const errors = validateAppeal(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const [firstInvalid] = Object.keys(errors);
    if (firstInvalid) {
      e.currentTarget.elements.namedItem(firstInvalid).focus();
      return;
    }
    setSend({ status: 'SENDING' });
    try {
      const res = await fetch(`${API_URL}/api/appeals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, ...values }),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      setSend({ status: 'SENT', id: body._id });
      setValues(EMPTY);
      setTouched({});
      setSubmitAttempted(false);
    } catch (err) {
      setSend({ status: 'ERROR', error: err.message });
    }
  };

  const ctx = {
    values,
    errors,
    isValid,
    touched,
    submitAttempted,
    handleChange,
    handleBlur,
  };
  const sending = send.status === 'SENDING';

  return (
    <FormContext.Provider value={ctx}>
      <form
        className={styles.form}
        aria-label='Submit an appeal'
        noValidate
        onSubmit={handleSubmit}
      >
        <fieldset className={styles.fieldset} disabled={closed || sending}>
          <InputField name='email' label='Contact email' type='email' />
          <OutcomeField />
          <GroundsField />
          <button type='submit' className={styles.submit} aria-busy={sending}>
            {sending ? 'Submitting...' : 'Submit appeal'}
          </button>
        </fieldset>
        {send.status === 'SENT' && (
          <p className={styles.sent} role='status'>
            Appeal received (reference {send.id}).
          </p>
        )}
        {send.status === 'ERROR' && (
          <p className={styles.closedText} role='alert'>
            Appeal not submitted: {send.error}
          </p>
        )}
      </form>
    </FormContext.Provider>
  );
}

function useFieldError(name) {
  const { errors, touched, submitAttempted } = useFormContext();
  return touched[name] || submitAttempted ? errors[name] : undefined;
}

function OutcomeField() {
  const { values, handleChange, handleBlur } = useFormContext();
  const error = useFieldError('outcome');
  const id = useId();
  return (
    <p className={styles.field}>
      <label htmlFor={id}>Requested outcome</label>
      <select
        id={id}
        name='outcome'
        value={values.outcome}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <option value=''>Choose an outcome</option>
        {Object.entries(OUTCOMES).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${id}-error`} className={styles.fieldError} role='alert'>
          {error}
        </span>
      )}
    </p>
  );
}

function GroundsField() {
  const { values, handleChange, handleBlur } = useFormContext();
  const error = useFieldError('grounds');
  const id = useId();
  const describedBy = [`${id}-count`, error && `${id}-error`]
    .filter(Boolean)
    .join(' ');
  return (
    <p className={styles.field}>
      <label htmlFor={id}>Grounds for appeal</label>
      <textarea
        id={id}
        name='grounds'
        rows={5}
        value={values.grounds}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <span id={`${id}-count`} className={styles.hint}>
        {values.grounds.trim().length} / {GROUNDS_MAX} characters, at least 30
      </span>
      {error && (
        <span id={`${id}-error`} className={styles.fieldError} role='alert'>
          {error}
        </span>
      )}
    </p>
  );
}
