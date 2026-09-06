import { useEffect, useState } from 'react';
import type { UserModel } from '@entities/User/types';
import Button from '@shared/ui/Button';
import './style.css';

interface EditProfileFormProps {
  user: UserModel;
}

function EditProfileForm({ user }: EditProfileFormProps) {
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null);

  function submitForm(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file?.type.startsWith('image')) {
      return;
    }

    const newAvatarUrl = URL.createObjectURL(file);
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
    <form className='profile-update-form' onSubmit={submitForm}>
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
        </div>
      </div>

      <p>Username input placeholder</p>
      <p>Email input placeholder</p>
      <p>Description textarea placeholder</p>
      <Button type='submit'>Save Profile Changes</Button>
    </form>
  );
}

export default EditProfileForm;
