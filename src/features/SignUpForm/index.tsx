import { useState } from 'react';
import { useAuth } from '@/entities/auth/useAuth';
import Button from '@/shared/ui/Button';
import PasswordField from '@/shared/ui/input/PasswordField';
import TextField from '@/shared/ui/input/TextField';
import { EnvelopeIcon, EyeIcon, InfoIcon } from '@/shared/icons';
import type { SignUpFormFields } from './schema';

const INITIAL_FORM_FIELDS: SignUpFormFields = {
  firstName: '',
  secondName: '',
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

  function setFieldValue(name: keyof SignUpFormFields, value: string) {
    setFormFields((currentFields) => ({
      ...currentFields,
      [name]: value,
    }));
  }

  function handleFirstNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue('firstName', event.currentTarget.value);
  }

  function handleSecondNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue('secondName', event.currentTarget.value);
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
          label='First name'
          labelIcon={<InfoIcon />}
          name='firstName'
          autoComplete='given-name'
          onChange={handleFirstNameChange}
          placeholder='Enter your first name'
          status='default'
          type='text'
          value={formFields.firstName}
        />
        <TextField
          label='Second name'
          labelIcon={<InfoIcon />}
          name='secondName'
          autoComplete='family-name'
          onChange={handleSecondNameChange}
          placeholder='Enter your second name'
          status='default'
          type='text'
          value={formFields.secondName}
        />
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
          autoComplete='new-password'
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
          autoComplete='new-password'
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
