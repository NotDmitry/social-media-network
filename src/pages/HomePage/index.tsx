import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PostsFeed from '@/widgets/PostsFeed';
import CreatePostModal from '@/features/CreatePostModal';
import { useAuth } from '@/entities/auth/useAuth';
import Button from '@/shared/ui/Button';
import { getGroups } from '@/entities/Group/api/getGroups';
import { getSuggestedUsers } from '@/entities/User/api/getSuggestedUsers';
import { getUserDisplayName } from '@/entities/User/utilities';
import type { GroupModel } from '@/entities/Group/types';
import type { SuggestedUserModel } from '@/entities/User/types';
import CardsList from './CardsList';
import type { CardData } from './CardsList';
import './style.css';

const MAX_POST_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_POST_FILE_TYPES = ['image/png', 'image/jpeg'];
const MAX_SUGGESTED_USERS_COUNT = 5;
const MAX_SUGGESTED_GROUPS_COUNT = 3;

const numberFormatter = new Intl.NumberFormat('en-GB', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

function suggestedUserToCardDataView(user: SuggestedUserModel): CardData {
  return {
    id: user.id,
    pictureUrl: user.photo,
    title: getUserDisplayName(user),
    subtitle: user.username.startsWith('@') ? user.username : `@${user.username}`,
  };
}

function groupToCardDataView(group: GroupModel): CardData {
  let membersCountView;

  if (group.membersCount === 1) {
    membersCountView = '1 member';
  } else {
    membersCountView = `${numberFormatter.format(group.membersCount).toLowerCase()} members`;
  }

  return {
    id: group.id,
    pictureUrl: group.photo,
    title: group.title,
    subtitle: membersCountView,
  }
}

function HomePage() {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [quickPostContent, setQuickPostContent] = useState('');
  const { currentUser } = useAuth();

  const {
    data: suggestedUsers,
    isError: isSuggestedUsersQueryError,
    isPending: isSuggestedUsersQueryPending,
  } = useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: ({ signal }) => getSuggestedUsers(signal),
    select: (users) => users.slice(0, MAX_SUGGESTED_USERS_COUNT).map(suggestedUserToCardDataView),
    enabled: currentUser !== null,
  });

  const {
    data: suggestedGroups,
    isError: isGroupsQueryError,
    isPending: isGroupsQueryPending,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: ({ signal }) => getGroups(signal),
    select: (groups) => groups.slice(0, MAX_SUGGESTED_GROUPS_COUNT).map(groupToCardDataView),
    enabled: currentUser !== null,
  });

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
            maxFileSize={MAX_POST_FILE_SIZE}
            acceptedFileTypes={ACCEPTED_POST_FILE_TYPES}
            onClose={handleCreatePostModalClose}
          />
        }

        <PostsFeed />
      </section>

      {currentUser &&
        <aside className='home-page-suggested'>
          <h2 className='visually-hidden'>Suggestions</h2>
          <CardsList
            title='Suggested people'
            cardsData={suggestedUsers}
            isDataFetchPending={isSuggestedUsersQueryPending}
            isDataFetchError={isSuggestedUsersQueryError}
            errorMessage='Cannot load suggested people'
            emptyListMessage='No suggested people'
          />
          <CardsList
            title='Communities you might like'
            cardsData={suggestedGroups}
            isDataFetchPending={isGroupsQueryPending}
            isDataFetchError={isGroupsQueryError}
            errorMessage='Cannot load suggested groups'
            emptyListMessage='No suggested groups'
          />
        </aside>
      }
    </div>

  );
}

export default HomePage;
