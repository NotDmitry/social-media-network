import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/entities/auth/useAuth';
import type { UpdateProfilePayload } from '@/entities/auth/types';
import type { UserView } from '@/entities/User/types';
import Button from '@/shared/ui/Button';
import TextareaField, { type TextareaFieldStatus } from '@/shared/ui/input/TextareaField';
import TextField, { type TextFieldStatus } from '@/shared/ui/input/TextField';
import { EnvelopeIcon, PencilIcon, PersonIcon } from '@/shared/icons';
import { updateProfileFormSchema, type UpdateProfileFormFields } from './schema';
import './style.css';

interface UpdateProfileFormProps {
  user: UserView;
  onSubmit?: () => void;
}

function UpdateProfileForm({ user, onSubmit }: UpdateProfileFormProps) {
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null);
  const [selectedAvatarErrorMessage, setSelectedAvatarErrorMessage] = useState<string | null>(null);

  const { updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitted,
    },
  } = useForm<UpdateProfileFormFields>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      username: user.username,
      email: user.email ?? '',
      description: user.description ?? '',
    },
  });

  function handleFormSubmit(updateProfileFields: UpdateProfileFormFields) {
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

    if (updatedFieldsCount > 0) {
      updateProfile(changedFields);
    }

    onSubmit?.();
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileInput = event.currentTarget;
    const file = fileInput.files?.[0];

    if (!file) {
      setSelectedAvatarUrl(null);
      setSelectedAvatarErrorMessage(null);

      return;
    }

    if (!file.type.startsWith('image/')) {
      fileInput.value = '';
      setSelectedAvatarUrl(null);
      setSelectedAvatarErrorMessage('Non-image file detected');

      return;
    }

    const newAvatarUrl = URL.createObjectURL(file);
    setSelectedAvatarErrorMessage(null);
    setSelectedAvatarUrl(newAvatarUrl);
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
    if (selectedAvatarUrl === null) {
      return;
    }

    return () => {
      URL.revokeObjectURL(selectedAvatarUrl);
    }
  }, [selectedAvatarUrl]);

  return (
    <form className='profile-update-form' onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}>
      {/* TODO: Replace this and Post's header with UserCard */}
      <div className='change-avatar-container'>
        <img
          className='avatar change-avatar-photo'
          src={selectedAvatarUrl ?? user.profileImage ?? undefined}
          alt={`Profile picture of ${user.displayName}`}
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
            />
            Change profile photo
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
        label='Username'
        labelIcon={<PersonIcon />}
        autoComplete='username'
        placeholder='@username123'
        status={getTextFieldStatus(Boolean(errors.username))}
        errorMessage={errors.username?.message}
        type='text'
      />
      <TextField
        {...register('email')}
        label='Email'
        labelIcon={<EnvelopeIcon />}
        autoComplete='email'
        placeholder='email@domain.com'
        status={getTextFieldStatus(Boolean(errors.email))}
        errorMessage={errors.email?.message}
        type='email'
      />
      <TextareaField
        {...register('description')}
        label='Description'
        labelIcon={<PencilIcon />}
        placeholder='Write description here...'
        status={getTextareaFieldStatus(Boolean(errors.description))}
        errorMessage={errors.description?.message}
        hintMessage='Max 200 characters'
        maxLength={201}
        rows={1}
      />
      <Button type='submit'>Save Profile Changes</Button>
    </form>
  );
}

export default UpdateProfileForm;
