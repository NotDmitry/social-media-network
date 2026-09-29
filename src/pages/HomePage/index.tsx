import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import PostsFeed from '@/widgets/PostsFeed';
import CreatePostModal from '@/features/CreatePostModal';
import { useAuth } from '@/entities/auth/useAuth';
import { getGroups } from '@/entities/Group/api/getGroups';
import { getSuggestedUsers } from '@/entities/User/api/getSuggestedUsers';
import { getUserDisplayName } from '@/entities/User/utilities';
import type { GroupModel } from '@/entities/Group/types';
import type { SuggestedUserModel } from '@/entities/User/types';
import CardsList from './CardsList';
import type { CardData } from './CardsList';
import QuickPostForm from './QuickPostForm';
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
  const { t } = useTranslation(['homePage', 'common']);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [initialPostDescription, setInitialPostDescription] = useState('');
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

  function handleQuickPostSubmit(description: string) {
    setInitialPostDescription(description);
    setIsCreatePostModalOpen(true);
  }

  function handleCreatePostModalClose() {
    setIsCreatePostModalOpen(false);
  }

  return (
    <div className='home-page-container'>
      <h1 className='visually-hidden'>{t(($) => $.title)}</h1>
      <section className='home-page-content'>
        <h2 className='visually-hidden'>{t(($) => $.postsFeedTitle)}</h2>
        {currentUser &&
          <QuickPostForm currentUser={currentUser} onSubmit={handleQuickPostSubmit} />
        }

        {currentUser &&
          <CreatePostModal
            isOpen={isCreatePostModalOpen}
            initialDescription={initialPostDescription}
            maxFileSize={MAX_POST_FILE_SIZE}
            acceptedFileTypes={ACCEPTED_POST_FILE_TYPES}
            onClose={handleCreatePostModalClose}
          />
        }

        <PostsFeed />
      </section>

      {currentUser &&
        <aside className='home-page-suggested'>
          <h2 className='visually-hidden'>{t(($) => $.suggestions.title)}</h2>
          <CardsList
            title={t(($) => $.suggestions.people.title)}
            cardsData={suggestedUsers}
            isDataFetchPending={isSuggestedUsersQueryPending}
            isDataFetchError={isSuggestedUsersQueryError}
            loadingMessage={t(($) => $.suggestions.people.loading)}
            errorMessage={t(($) => $.suggestions.people.error)}
            emptyListMessage={t(($) => $.suggestions.people.empty)}
          />
          <CardsList
            title={t(($) => $.suggestions.groups.title)}
            cardsData={suggestedGroups}
            isDataFetchPending={isGroupsQueryPending}
            isDataFetchError={isGroupsQueryError}
            loadingMessage={t(($) => $.suggestions.groups.loading)}
            errorMessage={t(($) => $.suggestions.groups.error)}
            emptyListMessage={t(($) => $.suggestions.groups.empty)}
          />
        </aside>
      }
    </div>

  );
}

export default HomePage;
