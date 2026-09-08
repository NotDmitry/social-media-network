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

  function handleFormSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    signUp(formFields);
    onSubmit?.();
  }

  function setFieldValue(name: keyof SignUpPayload, value: string) {
    setFormFields((currentFields) => ({
      ...currentFields,
      [name]: value,
    }));
  }

  function handleFullNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue('fullName', event.currentTarget.value);
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue('email', event.currentTarget.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue('password', event.currentTarget.value);
  }

  function handleRepeatPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue('repeatPassword', event.currentTarget.value);
  }

  return (
    <form className='auth-form' onSubmit={handleFormSubmit}>
      <fieldset className='auth-form-fieldset'>
        <TextField
          label='Full name'
          labelIcon={<InfoIcon />}
          name='fullName'
          onChange={handleFullNameChange}
          placeholder='Enter your full name'
          status='default'
          type='text'
          value={formFields.fullName}
        />
        <TextField
          label='Email'
          labelIcon={<EnvelopeIcon />}
          name='email'
          onChange={handleEmailChange}
          placeholder='Enter email'
          status='default'
          type='email'
          value={formFields.email}
        />
        <PasswordField
          label='Password'
          labelIcon={<EyeIcon />}
          name='password'
          onChange={handlePasswordChange}
          placeholder='Enter password'
          status='default'
          value={formFields.password}
          showVisibilityToggle={formFields.password.length > 0}
        />
        <PasswordField
          label='Repeat password'
          labelIcon={<EyeIcon />}
          name='repeatPassword'
          onChange={handleRepeatPasswordChange}
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
