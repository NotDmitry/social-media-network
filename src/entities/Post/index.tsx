import './style.css';
import userAvatar from '@assets/images/test_user_1.jpg';

function Post() {
  return (
    <article>
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

      <p></p>

      <menu>
        <li></li>
        <li></li>
      </menu>
    </article>
  );
}

export default Post;
