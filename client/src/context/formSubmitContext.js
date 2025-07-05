import { createContext, useContext, useState } from 'react';

const FormSubmitContext = createContext();

export const FormSubmitProvider = ({ children }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <FormSubmitContext.Provider value={{ isSubmitted, setIsSubmitted }}>
      {children}
    </FormSubmitContext.Provider>
  );
};

export const useFormSubmit = () => useContext(FormSubmitContext);
