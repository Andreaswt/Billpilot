import { FormErrorMessage } from '@chakra-ui/react';
import { Field, getIn } from 'formik';
 
const ErrorMessage = ({ name }: any) => (
  <Field
    name={name}
    render={({ form }: any) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return (touch && error ? <FormErrorMessage>{error}</FormErrorMessage> : null);
    }}
  />
);

export default ErrorMessage;