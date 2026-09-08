import { useState } from 'react';

import Post from '@/entities/Post';
import { MOCK_COMMENTS } from '@/entities/Comment/mocks';
import { MOCK_POSTS } from '@/entities/Post/mocks';
import { MOCK_USERS } from '@/entities/User/mocks';

import './style.css';

function PostsFeed() {
  const [posts] = useState(MOCK_POSTS);
  const [comments] = useState(MOCK_COMMENTS);

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
          />
        );
      })}
    </div>
  );
}

export default PostsFeed;
