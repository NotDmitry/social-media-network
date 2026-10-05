import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/entities/auth/useAuth';
import type { SignUpPayload } from '@/entities/auth/types';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import Button from '@/shared/ui/Button';
import PasswordField from '@/shared/ui/input/PasswordField';
import TextField, { type TextFieldStatus } from '@/shared/ui/input/TextField';
import { EnvelopeIcon, EyeIcon, PersonIcon } from '@/shared/icons';
import { signUpFormSchema } from './schema';
import type { SignUpFormFields } from './schema';

const INITIAL_FORM_FIELDS: SignUpFormFields = {
  fullName: '',
  email: '',
  password: '',
  repeatPassword: '',
}

interface SignUpFormProps {
  onSubmit?: () => void;
}

function SignUpForm({ onSubmit }: SignUpFormProps) {
  const { t } = useTranslation('authentication');
  const { signUp } = useAuth();
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitted,
      isSubmitting,
    },
  } = useForm<SignUpFormFields, unknown, SignUpPayload>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: INITIAL_FORM_FIELDS,
  });

  async function handleFormSubmit(signUpPayload: SignUpPayload) {
    try {
      await signUp(signUpPayload);
      showAlert(t(($) => $.signUp.alert.success), 'success');
    } catch (error) {
      if (error instanceof BackendResponseError && error.code === 'EMAIL_TAKEN') {
        setError('email', {
          message: t(($) => $.signUp.input.email.validation.taken),
        });

        return;
      }

      showAlert(t(($) => $.signUp.alert.error), 'error');
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
          {...register('fullName')}
          label={t(($) => $.signUp.input.fullName.label)}
          labelIcon={<PersonIcon />}
          autoComplete='name'
          placeholder={t(($) => $.signUp.input.fullName.placeholder)}
          status={getFieldStatus(Boolean(errors.fullName))}
          errorMessage={errors.fullName?.message}
          tooltipMessage={t(($) => $.signUp.input.fullName.tooltip)}
          type='text'
          disabled={isSubmitting}
        />
        <TextField
          {...register('email')}
          label={t(($) => $.signUp.input.email.label)}
          labelIcon={<EnvelopeIcon />}
          autoComplete='email'
          placeholder={t(($) => $.signUp.input.email.placeholder)}
          status={getFieldStatus(Boolean(errors.email))}
          errorMessage={errors.email?.message}
          tooltipMessage={t(($) => $.signUp.input.email.tooltip)}
          type='email'
          disabled={isSubmitting}
        />
        <PasswordField
          {...register('password', { deps: 'repeatPassword' })}
          label={t(($) => $.signUp.input.password.label)}
          labelIcon={<EyeIcon />}
          autoComplete='new-password'
          placeholder={t(($) => $.signUp.input.password.placeholder)}
          status={getFieldStatus(Boolean(errors.password))}
          errorMessage={errors.password?.message}
          tooltipMessage={t(($) => $.signUp.input.password.tooltip)}
          infoMessage={t(($) => $.signUp.input.password.info)}
          showVisibilityToggle={true}
          disabled={isSubmitting}
        />
        <PasswordField
          {...register('repeatPassword')}
          label={t(($) => $.signUp.input.repeatPassword.label)}
          labelIcon={<EyeIcon />}
          autoComplete='new-password'
          placeholder={t(($) => $.signUp.input.repeatPassword.placeholder)}
          status={getFieldStatus(Boolean(errors.repeatPassword))}
          errorMessage={errors.repeatPassword?.message}
          tooltipMessage={t(($) => $.signUp.input.repeatPassword.tooltip)}
          infoMessage={t(($) => $.signUp.input.repeatPassword.info)}
          showVisibilityToggle={true}
          disabled={isSubmitting}
        />
      </fieldset>
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting
          ? t(($) => $.signUp.button.pending)
          : t(($) => $.signUp.button.default)}
      </Button>
    </form>
  );
}

export default SignUpForm;
