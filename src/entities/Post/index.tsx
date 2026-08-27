import './style.css';
import userAvatar from '@assets/images/test_user_1.jpg';
import postImage from '@assets/images/test_post_1.jpg';

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

      <img className='post-image' src={postImage} width={500} alt={'Post\'s attached image'} />

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
