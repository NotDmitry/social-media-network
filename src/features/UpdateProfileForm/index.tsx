import { useEffect, useState } from 'react';
import { useAuth } from '@entities/auth/useAuth';
import type { UserModel } from '@entities/User/types';
import type { UpdateProfilePayload } from '@entities/auth/types';
import Button from '@shared/ui/Button';
import TextField from '@shared/ui/input/TextField';
import TextareaField from '@shared/ui/input/TextareaField';
import { PersonIcon } from '@shared/icons/PersonIcon';
import { EnvelopeIcon, PencilIcon } from '@shared/icons';
import './style.css';

interface UpdateProfileFormProps {
  user: UserModel;
  onSubmit?: () => void;
}

type ProfileFormFields = Required<UpdateProfilePayload>;
type ProfileTextInputFieldName = Exclude<keyof ProfileFormFields, 'avatarUrl'>;

function UpdateProfileForm({ user, onSubmit }: UpdateProfileFormProps) {
  const [formFields, setFormFields] = useState<ProfileFormFields>({
    avatarUrl: user.avatarUrl,
    username: user.username,
    email: user.email,
    description: user.description ?? '',
  });
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null);
  const [selectedAvatarErrorMessage, setSelectedAvatarErrorMessage] = useState<string | null>(null);

  const { updateProfile } = useAuth();

  function handleFormSubmission(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formFieldsNames = Object.keys(formFields) as (keyof ProfileFormFields)[];

    const changedFields = formFieldsNames.reduce<UpdateProfilePayload>((changes, fieldName) => {
      const savedValue = user[fieldName] ?? '';
      const currentValue = formFields[fieldName];

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

  function changeFieldValue(
    name: ProfileTextInputFieldName,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value = event.currentTarget.value;

    setFormFields((currentFields) => ({
      ...currentFields,
      [name]: value,
    }));
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

  useEffect(() => {
    if (selectedAvatarUrl === null) {
      return;
    }

    return () => {
      URL.revokeObjectURL(selectedAvatarUrl);
    }
  }, [selectedAvatarUrl]);

  return (
    <form className='profile-update-form' onSubmit={handleFormSubmission}>
      {/* TODO: Replace this and Post's header with UserCard */}
      <div className='change-avatar-container'>
        <img
          className='avatar change-avatar-photo'
          src={selectedAvatarUrl ?? user.avatarUrl}
          alt={`Profile picture of ${user.fullName}`}
          width={64}
          height={64}
        />
        <div className='change-avatar-text-wrapper'>
          <p className='change-avatar-user'>{user.fullName}</p>
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
        label='Username'
        labelIcon={<PersonIcon />}
        name='username'
        onChange={(event) => { changeFieldValue('username', event) }}
        placeholder='@username123'
        status='default'
        type='text'
        value={formFields.username}
      />
      <TextField
        label='Email'
        labelIcon={<EnvelopeIcon />}
        name='email'
        onChange={(event) => { changeFieldValue('email', event) }}
        placeholder='email@domain.com'
        status='default'
        type='email'
        value={formFields.email}
      />
      <TextareaField
        label='Description'
        labelIcon={<PencilIcon />}
        name='description'
        onChange={(event) => { changeFieldValue('description', event) }}
        placeholder='Write description here...'
        status='default'
        hintMessage='Max 200 chars'
        maxLength={200}
        rows={1}
        value={formFields.description}
      />
      <Button type='submit'>Save Profile Changes</Button>
    </form>
  );
}

export default UpdateProfileForm;
