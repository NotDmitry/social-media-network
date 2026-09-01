import { useState } from 'react';
import Post from '@entities/Post';
import './style.css';
import { MOCK_POSTS } from '@entities/Post/mocks';
import { MOCK_COMMENTS } from '@entities/Comment/mocks';
import { getAuthUserMock, MOCK_USERS } from '@entities/User/mocks';

function PostsFeed() {
  const [posts] = useState(MOCK_POSTS);
  const [comments] = useState(MOCK_COMMENTS);

  const authenticatedUser = getAuthUserMock();

  return (
    <div className='posts-feed'>
      {posts.map((post) => {
        const author = MOCK_USERS.find((user) => user.id === post.authorId);

        if (!author) {
          return null;
        }

        const postComments = comments.filter((comment) => comment.postId === post.id);

        return (
          <Post
            key={post.id}
            post={post}
            comments={postComments}
            author={author}
            authenticatedUserId={authenticatedUser.id}
          />
        );
      })}
    </div>
  );
}

export default PostsFeed;
