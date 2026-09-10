import PostsFeed from '@/widgets/PostsFeed';
import { useAuth } from '@/entities/auth/useAuth';
import Button from '@/shared/ui/Button';
import { SUGGESTED_COMMUNITIES_CARDS_DATA, SUGGESTED_USERS_CARDS_DATA } from '@/shared/mocks/CardsListMocks';
import CardsList from './CardsList';
import './style.css';

function HomePage() {
  const { currentUser } = useAuth();

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
              src={currentUser.avatarUrl}
              alt={`Picture of ${currentUser.fullName}`}
              width={64}
              height={64}
            />
            <div className='create-post-input-section'>
              <input
                className='create-post-input'
                type='text'
                name='post'
                placeholder={'What\'s happening?'}
              />
              <Button type='button'>Tell everyone</Button>
            </div>
          </div>
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
