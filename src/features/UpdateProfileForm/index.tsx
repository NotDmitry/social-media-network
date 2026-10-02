import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/entities/auth/useAuth';
import type { UpdateProfilePayload, UserView } from '@/entities/User/types';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import Button from '@/shared/ui/Button';
import { uploadImage } from '@/shared/api/uploadImage';
import TextareaField, { type TextareaFieldStatus } from '@/shared/ui/input/TextareaField';
import TextField, { type TextFieldStatus } from '@/shared/ui/input/TextField';
import { EnvelopeIcon, PencilIcon, PersonIcon } from '@/shared/icons';
import { updateProfileFormSchema, type UpdateProfileFormFields } from './schema';
import './style.css';

interface UpdateProfileFormProps {
  user: UserView;
  onSubmit?: () => void;
}

interface SelectedAvatar {
  url: string;
  file: File;
}

function UpdateProfileForm({ user, onSubmit }: UpdateProfileFormProps) {
  const { t } = useTranslation(['profile', 'common']);
  const [selectedAvatar, setSelectedAvatar] = useState<SelectedAvatar | null>(null);
  const [selectedAvatarErrorMessage, setSelectedAvatarErrorMessage] = useState<string | null>(null);

  const { updateProfile } = useAuth();
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
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

  async function handleFormSubmit(updateProfileFields: UpdateProfileFormFields) {
    const formFieldsNames = Object.keys(updateProfileFields) as (keyof UpdateProfileFormFields)[];

    const changedFields = formFieldsNames.reduce<UpdateProfilePayload>((changes, fieldName) => {
      const savedValue = user[fieldName] ?? '';
      const currentValue = updateProfileFields[fieldName];

      if (currentValue !== savedValue) {
        changes[fieldName] = currentValue;
      }

      return changes;
    }, {});

    const updatedFieldsCount = Object.keys(changedFields).length;

    if (updatedFieldsCount > 0 || selectedAvatar !== null) {
      try {
        if (selectedAvatar !== null) {
          const { url: avatarUrl } = await uploadImage(selectedAvatar.file);
          changedFields.profileImage = avatarUrl;
        }

        await updateProfile(changedFields);

        setSelectedAvatar(null);
        showAlert(t(($) => $.update.alert.success), 'success');
      } catch (error) {
        showAlert(error instanceof Error ? error.message : t(($) => $.update.alert.error), 'error');
        console.error(error);
        return;
      }

      onSubmit?.();
    }
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
    <form className='profile-update-form' onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}>
      {/* TODO: Replace this and Post's header with UserCard */}
      <div className='change-avatar-container'>
        <img
          className='avatar change-avatar-photo'
          src={selectedAvatar?.url ?? user.profileImage ?? undefined}
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
  );
}

export default UpdateProfileForm;
