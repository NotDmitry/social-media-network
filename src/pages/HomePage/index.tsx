import { useState } from 'react';
import PostsFeed from '@/widgets/PostsFeed';
import CreatePostModal from '@/features/CreatePostModal';
import { useAuth } from '@/entities/auth/useAuth';
import Button from '@/shared/ui/Button';
import { SUGGESTED_COMMUNITIES_CARDS_DATA, SUGGESTED_USERS_CARDS_DATA } from '@/shared/mocks/CardsListMocks';
import CardsList from './CardsList';
import './style.css';

function HomePage() {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [quickPostContent, setQuickPostContent] = useState('');
  const { currentUser } = useAuth();

  function handleCreatePostModalOpen() {
    setIsCreatePostModalOpen(true);
  }

  function handleCreatePostModalClose() {
    setIsCreatePostModalOpen(false);
  }

  function handleQuickPostContentChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuickPostContent(event.target.value);
  }

  function handleQuickPostSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    handleCreatePostModalOpen();
  }

  return (
    <div className='home-page-container'>
      <h1 className='visually-hidden'>Home page</h1>
      <section className='home-page-content'>
        <h2 className='visually-hidden'>Posts feed</h2>
        {/* Create post input */}
        {currentUser &&
          <div className='create-post-container'>
            <img
              className='avatar create-post-avatar'
              src={currentUser.profileImage ?? undefined}
              alt={`Picture of ${currentUser.displayName}`}
              width={64}
              height={64}
            />
            <form className='create-post-input-section' onSubmit={handleQuickPostSubmit}>
              <input
                className='create-post-input'
                type='text'
                name='post'
                placeholder="What's happening?"
                value={quickPostContent}
                onChange={handleQuickPostContentChange}
              />
              <Button type='submit'>Tell everyone</Button>
            </form>
          </div>
        }

        {currentUser &&
          <CreatePostModal
            isOpen={isCreatePostModalOpen}
            initialDescription={quickPostContent}
            onClose={handleCreatePostModalClose}
          />
        }

        <PostsFeed />
      </section>

      <aside className='home-page-suggested'>
        <h2 className='visually-hidden'>Suggestions</h2>
        <CardsList
          title='Suggested people'
          cardsData={SUGGESTED_USERS_CARDS_DATA}
        />
        <CardsList
          title='Communities you might like'
          cardsData={SUGGESTED_COMMUNITIES_CARDS_DATA}
        />
      </aside>
    </div>

  );
}

export default HomePage;
