import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import PostsFeed from '@/widgets/PostsFeed';
import CreatePost from '@/features/CreatePost';
import { useAuth } from '@/entities/auth/useAuth';
import { getGroups } from '@/entities/Group/api/getGroups';
import { getSuggestedUsers } from '@/entities/User/api/getSuggestedUsers';
import { getUserDisplayName } from '@/entities/User/utilities';
import type { GroupModel } from '@/entities/Group/types';
import type { SuggestedUserModel } from '@/entities/User/types';
import CardsList from './CardsList';
import type { CardData } from './CardsList';
import './style.css';

const MAX_SUGGESTED_USERS_COUNT = 5;
const MAX_SUGGESTED_GROUPS_COUNT = 3;

function suggestedUserToCardDataView(user: SuggestedUserModel): CardData {
  return {
    id: user.id,
    pictureUrl: user.photo,
    title: getUserDisplayName(user),
    subtitle: user.username.startsWith('@') ? user.username : `@${user.username}`,
  };
}

function selectSuggestedUsers(users: SuggestedUserModel[]) {
  return users.slice(0, MAX_SUGGESTED_USERS_COUNT).map(suggestedUserToCardDataView);
}

function groupToCardDataView(group: GroupModel, membersCountView: string): CardData {
  return {
    id: group.id,
    pictureUrl: group.photo,
    title: group.title,
    subtitle: membersCountView,
  }
}

function HomePage() {
  const { t } = useTranslation(['homePage', 'common']);
  const { currentUser } = useAuth();

  const selectSuggestedGroups = useCallback((groups: GroupModel[]) => {
    return groups.slice(0, MAX_SUGGESTED_GROUPS_COUNT)
      .map((group) => groupToCardDataView(
        group,
        t(($) => $.suggestions.groups.members, { count: group.membersCount })
      ));
  }, [t]);

  const {
    data: suggestedUsers,
    isError: isSuggestedUsersQueryError,
    isPending: isSuggestedUsersQueryPending,
  } = useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: ({ signal }) => getSuggestedUsers(signal),
    select: selectSuggestedUsers,
    enabled: currentUser !== null,
  });

  const {
    data: suggestedGroups,
    isError: isGroupsQueryError,
    isPending: isGroupsQueryPending,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: ({ signal }) => getGroups(signal),
    select: selectSuggestedGroups,
    enabled: currentUser !== null,
  });

  return (
    <div className='home-page-container'>
      <h1 className='visually-hidden'>{t(($) => $.title)}</h1>
      <section className='home-page-content'>
        <h2 className='visually-hidden'>{t(($) => $.postsFeedTitle)}</h2>
        {currentUser &&
          <CreatePost currentUser={currentUser} />
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
