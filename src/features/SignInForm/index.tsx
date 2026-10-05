import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/entities/auth/useAuth';
import type { SignInPayload } from '@/entities/auth/types';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import { BackendResponseError } from '@/shared/api/backendResponseError';
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
  const { t } = useTranslation('authentication');
  const { signIn } = useAuth();
  const { showAlert } = useAlert();

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
      showAlert(t(($) => $.signIn.alert.success), 'success');
    } catch (error) {
      const errorMessage = error instanceof BackendResponseError && error.code === 'INVALID_CREDENTIALS' ?
        t(($) => $.signIn.alert.invalidCredentials) : t(($) => $.signIn.alert.error);

      showAlert(errorMessage, 'error');
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
          label={t(($) => $.signIn.input.email.label)}
          labelIcon={<EnvelopeIcon />}
          autoComplete='email'
          placeholder={t(($) => $.signIn.input.email.placeholder)}
          status={getFieldStatus(Boolean(errors.email))}
          errorMessage={errors.email?.message}
          tooltipMessage={t(($) => $.signIn.input.email.tooltip)}
          type='email'
          disabled={isSubmitting}
        />
        <PasswordField
          {...register('password')}
          label={t(($) => $.signIn.input.password.label)}
          labelIcon={<EyeIcon />}
          autoComplete='current-password'
          placeholder={t(($) => $.signIn.input.password.placeholder)}
          status={getFieldStatus(Boolean(errors.password))}
          errorMessage={errors.password?.message}
          tooltipMessage={t(($) => $.signIn.input.password.tooltip)}
          showVisibilityToggle={true}
          disabled={isSubmitting}
        />
      </fieldset>
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting
          ? t(($) => $.signIn.button.pending)
          : t(($) => $.signIn.button.default)}
      </Button>
    </form>
  );
}

export default SignInForm;
