import './style.css';
import userAvatar from '@assets/images/test_user_1.jpg';

function Post() {
  return (
    <article className='post-card'>
      <header className='post-header'>
        <img
          className='avatar post-avatar'
          src={userAvatar}
          alt={'Post\'s author profile image'}
          width={48}
          height={48}
        />
        <span className='post-author'>Walter White</span>
        <time className='post-time' dateTime='PT3M'>3 min ago</time>
      </header>

      <img />

      <p className='post-description'>
        Body text for a post. Since it's a social app, sometimes it's an observation,
        and sometimes it's seeking recommendations.
      </p>

      <menu>
        <li></li>
        <li></li>
      </menu>
    </article>
  );
}

export default Post;
