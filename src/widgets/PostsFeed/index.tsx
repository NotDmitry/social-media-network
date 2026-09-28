import { useState } from 'react';
import Post from '@/entities/Post';
import { toUserView } from '@/entities/User/types';
import { MOCK_COMMENTS } from '@/shared/mocks/CommentMocks';
import { MOCK_POSTS } from '@/shared/mocks/PostMocks';
import { MOCK_USERS } from '@/shared/mocks/UserMocks';
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
        const authorView = toUserView(author);

        return (
          <Post
            key={post.id}
            post={post}
            comments={postComments}
            author={authorView}
          />
        );
      })}
    </div>
  );
}

export default PostsFeed;
