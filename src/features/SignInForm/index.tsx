import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/entities/auth/useAuth';
import type { SignInPayload } from '@/entities/auth/types';
import Button from '@/shared/ui/Button';
import PasswordField, { type PasswordFieldStatus } from '@/shared/ui/input/PasswordField';
import TextField, { type TextFieldStatus } from '@/shared/ui/input/TextField';
import { EnvelopeIcon, EyeIcon } from '@/shared/icons';
import { signInFormSchema } from './schema';

const INITIAL_FORM_FIELDS: SignInPayload = {
  email: '',
  password: '',
}

interface SignInFormProps {
  onSubmit?: () => void;
}

function SignInForm({ onSubmit }: SignInFormProps) {
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitted,
    },
  } = useForm<SignInPayload>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: INITIAL_FORM_FIELDS,
  });

  let emailStatus: TextFieldStatus = 'default';
  let passwordStatus: PasswordFieldStatus = 'default';

  if (isSubmitted) {
    emailStatus = errors.email ? 'invalid' : 'valid';
    passwordStatus = errors.password ? 'invalid' : 'valid';
  }

  function handleFormSubmit(signInPayload: SignInPayload) {
    signIn(signInPayload);
    onSubmit?.();
  }

  return (
    <form className='auth-form' onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}>
      <fieldset className='auth-form-fieldset'>
        <TextField
          {...register('email')}
          label='Email'
          labelIcon={<EnvelopeIcon />}
          autoComplete='email'
          placeholder='Enter email'
          status={emailStatus}
          errorMessage={errors.email?.message}
          type='email'
        />
        <PasswordField
          {...register('password')}
          label='Password'
          labelIcon={<EyeIcon />}
          autoComplete='current-password'
          placeholder='Enter password'
          status={passwordStatus}
          errorMessage={errors.password?.message}
          showVisibilityToggle={true}
        />
      </fieldset>
      <Button type='submit'>Sign In</Button>
    </form>
  );
}

export default SignInForm;
