import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import Button from '@/shared/ui/Button';
import { CloseIcon } from '@/shared/icons';
import PasswordField, { type PasswordFieldStatus } from '@/shared/ui/input/PasswordField';
import { passwordConfirmationFormSchema, type PasswordConfirmationFormFields } from './schema';
import './style.css';

interface PasswordConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string) => Promise<void>;
}

function PasswordConfirmationModal({ isOpen, onClose, onSubmit }: PasswordConfirmationModalProps) {
  const { t } = useTranslation('profile');
  const dialogElementRef = useRef<HTMLDialogElement | null>(null);
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: {
      errors,
      isSubmitted,
      isSubmitting,
    },
  } = useForm<PasswordConfirmationFormFields>({
    resolver: zodResolver(passwordConfirmationFormSchema),
    defaultValues: {
      currentPassword: '',
    },
  });

  function handleModalClose() {
    if (!isSubmitting) {
      onClose();
    }
  }

  function handleModalCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    if (isSubmitting) {
      event.preventDefault();
    }
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      handleModalClose();
    }
  }

  async function handleFormSubmit({ currentPassword }: PasswordConfirmationFormFields) {
    try {
      await onSubmit(currentPassword);
    } catch (error) {
      if (error instanceof BackendResponseError && error.code === 'INVALID_CURRENT_PASSWORD') {
        setError('currentPassword', {
          message: t(($) => $.update.confirmation.input.password.validation.invalid),
        });

        return;
      }

      showAlert(t(($) => $.update.alert.error), 'error');
      console.error(error);
    }
  }

  function getPasswordFieldStatus(hasError: boolean): PasswordFieldStatus {
    if (!isSubmitted) {
      return 'default';
    }

    return hasError ? 'invalid' : 'valid';
  }

  useEffect(() => {
    if (isOpen) {
      reset();
      dialogElementRef.current?.showModal();
    } else {
      dialogElementRef.current?.close();
    }
  }, [isOpen, reset]);

  return (
    <dialog
      className='password-confirmation-modal'
      ref={dialogElementRef}
      onClose={handleModalClose}
      onClick={handleBackdropClick}
      onCancel={handleModalCancel}
    >
      <div className='password-confirmation-modal-content'>
        <header className='password-confirmation-modal-header'>
          <p className='password-confirmation-modal-title'>
            {t(($) => $.update.confirmation.title)}
          </p>
          <button
            aria-label={t(($) => $.update.confirmation.close)}
            className='password-confirmation-modal-close-button'
            type='button'
            onClick={handleModalClose}
            disabled={isSubmitting}
          >
            <CloseIcon className='password-confirmation-modal-close-icon' />
          </button>
        </header>
        <form
          className='password-confirmation-form'
          onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
        >
          <PasswordField
            {...register('currentPassword')}
            label={t(($) => $.update.confirmation.input.password.label)}
            autoComplete='current-password'
            placeholder={t(($) => $.update.confirmation.input.password.placeholder)}
            status={getPasswordFieldStatus(Boolean(errors.currentPassword))}
            errorMessage={errors.currentPassword?.message}
            showVisibilityToggle={true}
            disabled={isSubmitting}
          />
          <div className='password-confirmation-form-actions'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? t(($) => $.update.confirmation.button.pending)
                : t(($) => $.update.confirmation.button.default)
              }
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default PasswordConfirmationModal;
