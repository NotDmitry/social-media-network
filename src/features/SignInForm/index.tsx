import { useState } from 'react';
import { useAuth } from '@/entities/auth/useAuth';
import type { SignInPayload } from '@/entities/auth/types';
import Button from '@/shared/ui/Button';
import PasswordField from '@/shared/ui/input/PasswordField';
import TextField from '@/shared/ui/input/TextField';
import { EnvelopeIcon, EyeIcon } from '@/shared/icons';

const INITIAL_FORM_FIELDS: SignInPayload = {
  email: '',
  password: '',
}

interface SignInFormProps {
  onSubmit?: () => void;
}

function SignInForm({ onSubmit }: SignInFormProps) {
  const [formFields, setFormFields] = useState(INITIAL_FORM_FIELDS);

  const { signIn } = useAuth();

  function handleFormSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    signIn(formFields);
    onSubmit?.();
  }

  function setFieldValue(name: keyof SignInPayload, value: string) {
    setFormFields((currentFields) => ({
      ...currentFields,
      [name]: value,
    }));
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue('email', event.currentTarget.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue('password', event.currentTarget.value);
  }

  return (
    <form className='auth-form' onSubmit={handleFormSubmit}>
      <fieldset className='auth-form-fieldset'>
        <TextField
          label='Email'
          labelIcon={<EnvelopeIcon />}
          name='email'
          autoComplete='email'
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
          autoComplete='current-password'
          onChange={handlePasswordChange}
          placeholder='Enter password'
          status='default'
          value={formFields.password}
          showVisibilityToggle={formFields.password.length > 0}
        />
      </fieldset>
      <Button type='submit'>Sign In</Button>
    </form>
  );
}

export default SignInForm;
