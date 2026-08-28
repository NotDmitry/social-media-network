import Post from '@entities/Post';
import './style.css';

function PostsFeed() {
  return (
    <div className='posts-feed'>
      <Post />
      <Post />
      <Post />
    </div>
  );
}

export default PostsFeed;
