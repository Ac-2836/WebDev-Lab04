import { useId, useState } from 'react';
import { FormContext, useFormContext } from './FormContext.js';
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
  // Derived in the same render pass as the keystroke: no useEffect waterfall.
  const errors = validateForm(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name } = e.target;
    const value = readValue(e.target);
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <FormContext.Provider value={{ values, errors, isValid, handleChange }}>
      <form
        className={styles.form}
        aria-labelledby='form-heading'
        noValidate
        onSubmit={handleSubmit}
      >
        <h2 id='form-heading'>Profile Form</h2>
        {FORM_FIELDS.map((field) => (
          <FieldControl key={field.name} {...field} />
        ))}
        <FormStatus />
        <button type='submit' className={styles.submit}>
          Submit
        </button>
      </form>
    </FormContext.Provider>
  );
}

function FieldControl({ name, label, type, autoComplete }) {
  const { values, handleChange } = useFormContext();
  const id = useId();
  return (
    <p className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={values[name]}
        onChange={handleChange}
      />
    </p>
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
