import PostsFeed from '@widgets/PostsFeed';
import CardsList from './CardsList';
import Button from '@shared/ui/Button';
import { getAuthUserMock } from '@entities/User/mocks';
import { SUGGESTED_USERS_CARDS_DATA, SUGGESTED_COMMUNITIES_CARDS_DATA } from './CardsList/mocks';
import './style.css';

function HomePage() {
  const authenticatedUser = getAuthUserMock();

  return (
    <div className='home-page-container'>
      <section className='home-page-content'>
        {/* Create post input */}
        <div className='create-post-container'>
          <img
            className='avatar create-post-avatar'
            src={authenticatedUser.avatarUrl}
            alt={`Picture of ${authenticatedUser.fullName}`}
            width={64}
            height={64}
          />
          <div className='create-post-input-section'>
            <input
              className='create-post-input'
              type="text"
              name="post"
              placeholder={'What\'s happening?'}
            />
            <Button type='button'>Tell everyone</Button>
          </div>
        </div>

        <PostsFeed />
      </section>

      <aside className='home-page-suggested'>
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
