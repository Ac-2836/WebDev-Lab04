import { useState } from 'react';
import { FormContext, useFormContext } from './FormContext.js';
import { InputField } from './InputField.jsx';
import { validateForm } from './validate-form.js';
import styles from './SimpleForm.module.css';

const INITIAL_VALUES = { fullName: '', email: '', age: '' };

export const FORM_FIELDS = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'age', label: 'Age', type: 'number', autoComplete: 'off' },
];

function readValue(input) {
  if (input.type !== 'number') return input.value;
  return Number.isNaN(input.valueAsNumber) ? '' : input.valueAsNumber;
}

export function SimpleForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  // Derived in the same render pass as the keystroke: no useEffect waterfall.
  const errors = validateForm(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name } = e.target;
    const value = readValue(e.target);
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const [firstInvalid] = Object.keys(errors);
    if (firstInvalid) e.currentTarget.elements.namedItem(firstInvalid).focus();
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

  return (
    <FormContext.Provider value={ctx}>
      <form
        className={styles.form}
        aria-labelledby='form-heading'
        noValidate
        onSubmit={handleSubmit}
      >
        <h2 id='form-heading'>Profile Form</h2>
        {FORM_FIELDS.map((field) => (
          <InputField key={field.name} {...field} />
        ))}
        <FormStatus />
        <button type='submit' className={styles.submit}>
          Submit
        </button>
      </form>
    </FormContext.Provider>
  );
}

function FormStatus() {
  const { errors, isValid } = useFormContext();
  const count = Object.keys(errors).length;
  return (
    <output className={styles.status} aria-live='polite'>
      {isValid ? 'All fields are valid.' : `${count} field(s) need attention.`}
    </output>
  );
}
