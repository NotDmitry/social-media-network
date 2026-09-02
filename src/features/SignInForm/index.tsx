import { useState } from 'react';
import TextField from '@shared/ui/input/TextField';
import PasswordField from '@shared/ui/input/PasswordField';
import Button from '@shared/ui/Button';
import { EnvelopeIcon, EyeIcon } from '@shared/icons';

const INITIAL_FORM_FIELDS = {
  email: '',
  password: '',
}

type SignInFormFields = typeof INITIAL_FORM_FIELDS;

function SignInForm() {
  const [formFields, setFormFields] = useState(INITIAL_FORM_FIELDS);

  function submitForm(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormFields(INITIAL_FORM_FIELDS);
  }

  function changeFieldValue(name: keyof SignInFormFields, event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;

    setFormFields((currentFields) => ({
      ...currentFields,
      [name]: value,
    }));
  }

  return (
    <form className='auth-form' onSubmit={submitForm}>
      <fieldset className='auth-form-fieldset'>
        <TextField
          label='Email'
          labelIcon={<EnvelopeIcon />}
          name='email'
          onChange={(event) => { changeFieldValue('email', event) }}
          placeholder='Enter email'
          status='default'
          value={formFields.email}
        />
        <PasswordField
          label='Password'
          labelIcon={<EyeIcon />}
          name='password'
          onChange={(event) => { changeFieldValue('password', event) }}
          placeholder='Enter password'
          status='default'
          value={formFields.password}
        />
      </fieldset>
      <Button type='submit'>Sign In</Button>
    </form>
  );
}

export default SignInForm;
