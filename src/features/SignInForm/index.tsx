import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/entities/auth/useAuth';
import type { SignInPayload } from '@/entities/auth/types';
import Button from '@/shared/ui/Button';
import PasswordField from '@/shared/ui/input/PasswordField';
import TextField, { type TextFieldStatus } from '@/shared/ui/input/TextField';
import { EnvelopeIcon, EyeIcon } from '@/shared/icons';
import { signInFormSchema } from './schema';

const INITIAL_FORM_FIELDS: SignInPayload = {
  email: '',
  password: '',
};

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
      isSubmitting,
    },
  } = useForm<SignInPayload>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: INITIAL_FORM_FIELDS,
  });

  async function handleFormSubmit(signInPayload: SignInPayload) {
    try {
      await signIn(signInPayload);
    } catch (error) {
      console.error(error);
      return;
    }

    onSubmit?.();
  }

  function getFieldStatus(hasError: boolean): TextFieldStatus {
    if (!isSubmitted) {
      return 'default';
    }

    return hasError ? 'invalid' : 'valid';
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
          status={getFieldStatus(Boolean(errors.email))}
          errorMessage={errors.email?.message}
          type='email'
          disabled={isSubmitting}
        />
        <PasswordField
          {...register('password')}
          label='Password'
          labelIcon={<EyeIcon />}
          autoComplete='current-password'
          placeholder='Enter password'
          status={getFieldStatus(Boolean(errors.password))}
          errorMessage={errors.password?.message}
          showVisibilityToggle={true}
          disabled={isSubmitting}
        />
      </fieldset>
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'In progress...' : 'Sign In'}
      </Button>
    </form>
  );
}

export default SignInForm;
