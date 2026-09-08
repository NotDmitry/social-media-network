import { useState } from 'react';

import { useAuth } from '@/entities/auth/useAuth';
import type { SignUpPayload } from '@/entities/auth/types';

import Button from '@/shared/ui/Button';
import PasswordField from '@/shared/ui/input/PasswordField';
import TextField from '@/shared/ui/input/TextField';
import { EnvelopeIcon, EyeIcon, InfoIcon } from '@/shared/icons';

const INITIAL_FORM_FIELDS: SignUpPayload = {
  fullName: '',
  email: '',
  password: '',
  repeatPassword: '',
}

interface SignUpFormProps {
  onSubmit?: () => void;
}

function SignUpForm({ onSubmit }: SignUpFormProps) {
  const [formFields, setFormFields] = useState(INITIAL_FORM_FIELDS);

  const { signUp } = useAuth();

  function handleFormSubmission(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    signUp(formFields);
    onSubmit?.();
  }

  function changeFieldValue(name: keyof SignUpPayload, event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;

    setFormFields((currentFields) => ({
      ...currentFields,
      [name]: value,
    }));
  }

  return (
    <form className='auth-form' onSubmit={handleFormSubmission}>
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
