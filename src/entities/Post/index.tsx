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

      <menu className='post-menu'>
        <li>
          <button className='post-menu-button'>
            <svg className='post-menu-like-icon' width='24' height='24' viewBox='0 0 24 24' fill='transparent' xmlns='http://www.w3.org/2000/svg'>
              <path d='M20.8401 4.60999C20.3294 4.099 19.7229 3.69364 19.0555 3.41708C18.388 3.14052 17.6726 2.99817 16.9501 2.99817C16.2276 2.99817 15.5122 3.14052 14.8448 3.41708C14.1773 3.69364 13.5709 4.099 13.0601 4.60999L12.0001 5.66999L10.9401 4.60999C9.90843 3.5783 8.50915 2.9987 7.05012 2.9987C5.59109 2.9987 4.19181 3.5783 3.16012 4.60999C2.12843 5.64169 1.54883 7.04096 1.54883 8.49999C1.54883 9.95903 2.12843 11.3583 3.16012 12.39L4.22012 13.45L12.0001 21.23L19.7801 13.45L20.8401 12.39C21.3511 11.8792 21.7565 11.2728 22.033 10.6053C22.3096 9.93789 22.4519 9.22248 22.4519 8.49999C22.4519 7.77751 22.3096 7.0621 22.033 6.39464C21.7565 5.72718 21.3511 5.12075 20.8401 4.60999Z' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            <span className='post-menu-label'>21 likes</span>
          </button>
        </li>
        <li>
          <button className='post-menu-button'>
            <svg className='post-menu-comment-icon' width='24' height='24' viewBox='0 0 24 24' fill='transparent' xmlns='http://www.w3.org/2000/svg'>
              <path d='M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            <span className='post-menu-label'>You have to login to see the comments</span>
          </button>
        </li>
      </menu>
    </article>
  );
}

export default Post;
