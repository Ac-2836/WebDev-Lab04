import { createContext, useContext } from 'react';

export const FormContext = createContext(null);

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used inside SimpleForm');
  return ctx;
}
