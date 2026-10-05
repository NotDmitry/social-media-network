import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/entities/auth/useAuth';
import { getProfileImageFallbackUrl } from '@/entities/User/utilities';
import type { UpdateEmailPayload } from '@/entities/auth/types';
import type { CurrentUserView, UpdateProfilePayload } from '@/entities/User/types';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import Button from '@/shared/ui/Button';
import { uploadImage } from '@/shared/api/uploadImage';
import TextareaField, { type TextareaFieldStatus } from '@/shared/ui/input/TextareaField';
import TextField, { type TextFieldStatus } from '@/shared/ui/input/TextField';
import { EnvelopeIcon, PencilIcon, PersonIcon } from '@/shared/icons';
import PasswordConfirmationModal from './PasswordConfirmationModal';
import { updateProfileFormSchema, type UpdateProfileFormFields } from './schema';
import './style.css';

interface UpdateProfileFormProps {
  user: CurrentUserView;
  onSubmit?: () => void;
}

interface SelectedAvatar {
  url: string;
  file: File;
}

interface EmailUpdateFields {
  email: string;
  profileFields: UpdateProfilePayload;
}

function UpdateProfileForm({ user, onSubmit }: UpdateProfileFormProps) {
  const { t } = useTranslation(['profile', 'common']);
  const [selectedAvatar, setSelectedAvatar] = useState<SelectedAvatar | null>(null);
  const [selectedAvatarErrorMessage, setSelectedAvatarErrorMessage] = useState<string | null>(null);
  const [emailUpdateFields, setEmailUpdateFields] = useState<EmailUpdateFields | null>(null);

  const { updateEmail, updateProfile } = useAuth();
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
  } = useForm<UpdateProfileFormFields>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      username: user.username,
      email: user.email ?? '',
      description: user.description ?? '',
    },
  });

  async function submitProfileUpdate(profileFieldsUpdate: UpdateProfilePayload, emailUpdate?: UpdateEmailPayload) {
    try {
      if (emailUpdate !== undefined) {
        await updateEmail(emailUpdate);
      }

      const changedProfileFields = { ...profileFieldsUpdate };

      if (selectedAvatar !== null) {
        const { url: avatarUrl } = await uploadImage(selectedAvatar.file);
        changedProfileFields.profileImage = avatarUrl;
      }

      if (Object.keys(changedProfileFields).length > 0) {
        await updateProfile(changedProfileFields);
      }
    } catch (error) {
      if (error instanceof BackendResponseError && error.code === 'INVALID_CURRENT_PASSWORD') {
        throw error;
      }

      if (error instanceof BackendResponseError && error.code === 'EMAIL_TAKEN') {
        setError('email', {
          message: t(($) => $.update.input.email.validation.taken),
        });

        handlePasswordConfirmationClose();

        return;
      }

      showAlert(t(($) => $.update.alert.error), 'error');
      console.error(error);

      return;
    }

    setSelectedAvatar(null);

    if (emailUpdate !== undefined) {
      handlePasswordConfirmationClose();
    }

    showAlert(t(($) => $.update.alert.success), 'success');
    onSubmit?.();
  }

  async function handleFormSubmit(updateProfileFields: UpdateProfileFormFields) {
    const { email, ...profileFields } = updateProfileFields;
    const profileFieldsNames = Object.keys(profileFields) as (keyof typeof profileFields)[];

    const changedProfileFields = profileFieldsNames.reduce<UpdateProfilePayload>((changes, fieldName) => {
      const savedValue = user[fieldName] ?? '';
      const currentValue = profileFields[fieldName];

      if (currentValue !== savedValue) {
        changes[fieldName] = currentValue;
      }

      return changes;
    }, {});

    const isEmailUpdated = email !== (user.email ?? '');
    const updatedFieldsCount = Object.keys(changedProfileFields).length + Number(isEmailUpdated);

    if (updatedFieldsCount === 0 && selectedAvatar === null) {
      return;
    }

    if (isEmailUpdated) {
      setEmailUpdateFields({
        email,
        profileFields: changedProfileFields,
      });
    } else {
      await submitProfileUpdate(changedProfileFields);
    }
  }

  async function handlePasswordConfirmation(currentPassword: string) {
    if (emailUpdateFields === null) {
      return;
    }

    await submitProfileUpdate(
      emailUpdateFields.profileFields,
      {
        currentPassword,
        email: emailUpdateFields.email,
      }
    );
  }

  function handlePasswordConfirmationClose() {
    setEmailUpdateFields(null);
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileInput = event.currentTarget;
    const file = fileInput.files?.[0];

    if (!file) {
      setSelectedAvatar(null);
      setSelectedAvatarErrorMessage(null);

      return;
    }

    if (!file.type.startsWith('image/')) {
      fileInput.value = '';
      setSelectedAvatar(null);
      setSelectedAvatarErrorMessage(t(($) => $.update.input.avatar.error));

      return;
    }

    const newAvatarUrl = URL.createObjectURL(file);
    fileInput.value = '';
    setSelectedAvatar({
      url: newAvatarUrl,
      file,
    });
    setSelectedAvatarErrorMessage(null);
  }

  function getTextFieldStatus(hasError: boolean): TextFieldStatus {
    if (!isSubmitted) {
      return 'default';
    }

    return hasError ? 'invalid' : 'valid';
  }

  function getTextareaFieldStatus(hasError: boolean): TextareaFieldStatus {
    return isSubmitted && hasError ? 'invalid' : 'default';
  }

  useEffect(() => {
    if (selectedAvatar === null) {
      return;
    }

    return () => {
      URL.revokeObjectURL(selectedAvatar.url);
    }
  }, [selectedAvatar]);

  return (
    <>
      <form className='profile-update-form' onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}>
        {/* TODO: Replace this and Post's header with UserCard */}
        <div className='change-avatar-container'>
          <img
            className='avatar change-avatar-photo'
            src={selectedAvatar?.url ?? getProfileImageFallbackUrl(true, user.profileImage)}
            alt={t(($) => $.a11y.profilePicture, { ns: 'common', name: user.displayName })}
            width={64}
            height={64}
          />
          <div className='change-avatar-text-wrapper'>
            <p className='change-avatar-user'>{user.displayName}</p>
            <label className='change-avatar-label'>
              <input
                accept='image/*'
                className='visually-hidden'
                type='file'
                name='avatar'
                onChange={handleAvatarChange}
                disabled={isSubmitting}
              />
              {t(($) => $.update.input.avatar.label)}
            </label>
            {selectedAvatarErrorMessage &&
              <p className='change-avatar-error'>
                {selectedAvatarErrorMessage}
              </p>
            }
          </div>
        </div>
        <TextField
          {...register('username')}
          label={t(($) => $.update.input.username.label)}
          labelIcon={<PersonIcon />}
          autoComplete='username'
          placeholder={t(($) => $.update.input.username.placeholder)}
          status={getTextFieldStatus(Boolean(errors.username))}
          errorMessage={errors.username?.message}
          tooltipMessage={t(($) => $.update.input.username.tooltip)}
          type='text'
          disabled={isSubmitting}
        />
        <TextField
          {...register('email')}
          label={t(($) => $.update.input.email.label)}
          labelIcon={<EnvelopeIcon />}
          autoComplete='email'
          placeholder={t(($) => $.update.input.email.placeholder)}
          status={getTextFieldStatus(Boolean(errors.email))}
          errorMessage={errors.email?.message}
          tooltipMessage={t(($) => $.update.input.email.tooltip)}
          type='email'
          disabled={isSubmitting}
        />
        <TextareaField
          {...register('description')}
          label={t(($) => $.update.input.description.label)}
          labelIcon={<PencilIcon />}
          placeholder={t(($) => $.update.input.description.placeholder)}
          status={getTextareaFieldStatus(Boolean(errors.description))}
          errorMessage={errors.description?.message}
          hintMessage={t(($) => $.update.input.description.hint)}
          maxLength={201}
          rows={1}
          disabled={isSubmitting}
        />
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? t(($) => $.update.button.pending)
            : t(($) => $.update.button.default)}
        </Button>
      </form>
      <PasswordConfirmationModal
        isOpen={emailUpdateFields !== null}
        onClose={handlePasswordConfirmationClose}
        onSubmit={handlePasswordConfirmation}
      />
    </>
  );
}

export default UpdateProfileForm;
