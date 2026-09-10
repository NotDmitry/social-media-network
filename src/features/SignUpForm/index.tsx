import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/entities/auth/useAuth';
import type { SignUpPayload } from '@/entities/auth/types';
import Button from '@/shared/ui/Button';
import PasswordField from '@/shared/ui/input/PasswordField';
import TextField, { type TextFieldStatus } from '@/shared/ui/input/TextField';
import { EnvelopeIcon, EyeIcon, PersonIcon } from '@/shared/icons';
import { signUpFormSchema } from './schema';
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
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitted,
    },
  } = useForm<SignUpFormFields>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: INITIAL_FORM_FIELDS,
  });

  function handleFormSubmit(signUpFields: SignUpFormFields) {
    const signUpPayload: SignUpPayload = {
      email: signUpFields.email,
      firstName: signUpFields.firstName,
      secondName: signUpFields.secondName,
      password: signUpFields.password,
    }

    signUp(signUpPayload);
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
          {...register('firstName')}
          label='First name'
          labelIcon={<PersonIcon />}
          autoComplete='given-name'
          placeholder='Enter your first name'
          status={getFieldStatus(Boolean(errors.firstName))}
          errorMessage={errors.firstName?.message}
          type='text'
        />
        <TextField
          {...register('secondName')}
          label='Second name'
          labelIcon={<PersonIcon />}
          autoComplete='family-name'
          placeholder='Enter your second name'
          status={getFieldStatus(Boolean(errors.secondName))}
          errorMessage={errors.secondName?.message}
          type='text'
        />
        <TextField
          {...register('email')}
          label='Email'
          labelIcon={<EnvelopeIcon />}
          autoComplete='email'
          placeholder='Enter email'
          status={getFieldStatus(Boolean(errors.email))}
          errorMessage={errors.email?.message}
          type='email'
        />
        <PasswordField
          {...register('password')}
          label='Password'
          labelIcon={<EyeIcon />}
          autoComplete='new-password'
          placeholder='Enter password'
          status={getFieldStatus(Boolean(errors.password))}
          errorMessage={errors.password?.message}
          infoMessage='Your password is correct'
          showVisibilityToggle={true}
        />
        <PasswordField
          {...register('repeatPassword')}
          label='Repeat password'
          labelIcon={<EyeIcon />}
          autoComplete='new-password'
          placeholder='Enter password again'
          status={getFieldStatus(Boolean(errors.repeatPassword))}
          errorMessage={errors.repeatPassword?.message}
          infoMessage='Passwords match'
          showVisibilityToggle={true}
        />
      </fieldset>
      <Button type='submit'>Sign Up</Button>
    </form>
  );
}

export default SignUpForm;
