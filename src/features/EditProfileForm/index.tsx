import type { UserModel } from '@entities/User/types';
import Button from '@shared/ui/Button';
import './style.css';

interface EditProfileFormProps {
  user: UserModel;
}

function EditProfileForm({ user }: EditProfileFormProps) {
  function submitForm(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className='profile-update-form' onSubmit={submitForm}>
      {/* TODO: Replace this and Post's header with UserCard */}
      <div className='change-avatar-container'>
        <img
          className='avatar change-avatar-photo'
          src={user.avatarUrl}
          alt={`Profile picture of ${user.fullName}`}
          width={64}
          height={64}
        />
        <p className='change-avatar-user'>{user.fullName}</p>
        <label className='change-avatar-label'>
          Change profile photo
          <input
            className='change-avatar-file-input'
            type='file'
            name='avatar'
          />
        </label>
      </div>

      <p>Username input placeholder</p>
      <p>Email input placeholder</p>
      <p>Description textarea placeholder</p>
      <Button type='submit'>Save Profile Changes</Button>
    </form>
  );
}

export default EditProfileForm;
