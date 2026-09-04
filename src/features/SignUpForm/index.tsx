import { useState } from 'react';
import TextField from '@shared/ui/input/TextField';
import PasswordField from '@shared/ui/input/PasswordField';
import Button from '@shared/ui/Button';
import { EnvelopeIcon, EyeIcon, InfoIcon } from '@shared/icons';

const INITIAL_FORM_FIELDS = {
  fullName: '',
  email: '',
  password: '',
  repeatPassword: '',
}

type SignUpFormFields = typeof INITIAL_FORM_FIELDS;

function SignUpForm() {
  const [formFields, setFormFields] = useState(INITIAL_FORM_FIELDS);

  function submitForm(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormFields(INITIAL_FORM_FIELDS);
  }

  function changeFieldValue(name: keyof SignUpFormFields, event: React.ChangeEvent<HTMLInputElement>) {
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
          label='Full name'
          labelIcon={<InfoIcon />}
          name='fullName'
          onChange={(event) => { changeFieldValue('fullName', event) }}
          placeholder='Enter your full name'
          status='default'
          type='text'
          value={formFields.fullName}
        />
        <TextField
          label='Email'
          labelIcon={<EnvelopeIcon />}
          name='email'
          onChange={(event) => { changeFieldValue('email', event) }}
          placeholder='Enter email'
          status='default'
          type='email'
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
          showVisibilityToggle={formFields.password.length > 0}
        />
        <PasswordField
          label='Repeat password'
          labelIcon={<EyeIcon />}
          name='repeatPassword'
          onChange={(event) => { changeFieldValue('repeatPassword', event) }}
          placeholder='Enter password again'
          status='default'
          value={formFields.repeatPassword}
          showVisibilityToggle={formFields.repeatPassword.length > 0}
        />
      </fieldset>
      <Button type='submit'>Sign Up</Button>
    </form>
  );
}

export default SignUpForm;
