import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProfileImageFallbackUrl } from '@/entities/User/utilities';
import type { CurrentUserView } from '@/entities/User/types';
import Button from '@/shared/ui/Button';
import './style.css';

interface QuickPostFormProps {
  currentUser: CurrentUserView;
  onSubmit: (description: string) => void;
}

function QuickPostForm({ currentUser, onSubmit }: QuickPostFormProps) {
  const { t } = useTranslation(['homePage', 'common']);
  const [quickPostContent, setQuickPostContent] = useState('');

  function handleQuickPostContentChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuickPostContent(event.target.value);
  }

  function handleQuickPostSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(quickPostContent);
  }

  return (
    <div className='create-post-container'>
      <img
        className='avatar create-post-avatar'
        src={getProfileImageFallbackUrl(true, currentUser.profileImage)}
        alt={t(($) => $.a11y.picture, { ns: 'common', name: currentUser.displayName })}
        width={64}
        height={64}
      />
      <form className='create-post-input-section' onSubmit={handleQuickPostSubmit}>
        <input
          className='create-post-input'
          type='text'
          name='post'
          placeholder={t(($) => $.quickPost.input.post.placeholder)}
          value={quickPostContent}
          onChange={handleQuickPostContentChange}
        />
        <Button type='submit'>{t(($) => $.quickPost.button.default)}</Button>
      </form>
    </div>
  );
}

export default QuickPostForm;
