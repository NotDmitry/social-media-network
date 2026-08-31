import './style.css';
import { useAuthMock } from '@shared/mocks/useAuthMock';
import CreateCommentForm from '@features/CreateCommentForm';
import Comment from '@entities/Comment';
import { useState } from 'react';
import type { PostModel } from './types';
import type { CommentModel } from '@entities/Comment/types';
import type { UserModel } from '@entities/User/types';
import { getRelativeTimePresentationString } from '@shared/utilities/time';

interface PostProps {
  post: PostModel;
  comments: CommentModel[];
  author: UserModel;
  authenticatedUserId: string;
}

function Post({ post, comments, author, authenticatedUserId }: PostProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const isAuthenticated = useAuthMock();

  const commentsButtonLabel = `${String(comments.length)} ${comments.length === 1 ? 'comment' : 'comments'}`;

  return (
    <article className='post-card'>
      <header className='post-header'>
        <img
          className='avatar post-avatar'
          src={author.avatarUrl}
          alt={`Profile picture of ${author.fullName}`}
          width={48}
          height={48}
        />
        <span className='post-author'>{author.fullName}</span>
        <time
          className='post-time'
          dateTime={post.createdAt}>{getRelativeTimePresentationString(post.createdAt)}
        </time>
      </header>

      {post.imageUrl &&
        <img
          className='post-image'
          src={post.imageUrl}
          width={500}
          alt={`Post by ${author.fullName}`}
        />
      }

      <p className='post-description'>{post.description}</p>

      <menu className='post-menu'>
        <li>
          <button
            className='post-menu-button'
            aria-label='Like the post'
            onClick={() => { setIsLiked((isLiked) => !isLiked) }}
          >
            <svg className={`post-menu-like-icon ${isLiked ? 'post-menu-like-icon_active' : ''}`} width='24' height='24' viewBox='0 0 24 24' fill='transparent' xmlns='http://www.w3.org/2000/svg'>
              <path d='M20.8401 4.60999C20.3294 4.099 19.7229 3.69364 19.0555 3.41708C18.388 3.14052 17.6726 2.99817 16.9501 2.99817C16.2276 2.99817 15.5122 3.14052 14.8448 3.41708C14.1773 3.69364 13.5709 4.099 13.0601 4.60999L12.0001 5.66999L10.9401 4.60999C9.90843 3.5783 8.50915 2.9987 7.05012 2.9987C5.59109 2.9987 4.19181 3.5783 3.16012 4.60999C2.12843 5.64169 1.54883 7.04096 1.54883 8.49999C1.54883 9.95903 2.12843 11.3583 3.16012 12.39L4.22012 13.45L12.0001 21.23L19.7801 13.45L20.8401 12.39C21.3511 11.8792 21.7565 11.2728 22.033 10.6053C22.3096 9.93789 22.4519 9.22248 22.4519 8.49999C22.4519 7.77751 22.3096 7.0621 22.033 6.39464C21.7565 5.72718 21.3511 5.12075 20.8401 4.60999Z' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            <span className='post-menu-label'>21 likes</span>
          </button>
        </li>
        <li>
          <button
            className='post-menu-button'
            disabled={!isAuthenticated}
            aria-label='Open / close comments section'
            onClick={() => { setIsCommentsOpen((isOpen) => !isOpen) }}
          >
            <svg className='post-menu-comment-icon' width='24' height='24' viewBox='0 0 24 24' fill='transparent' xmlns='http://www.w3.org/2000/svg'>
              <path d='M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            <span className='post-menu-label'>
              {isAuthenticated ? commentsButtonLabel : 'You have to login to see the comments'}
            </span>
            {isAuthenticated &&
              <svg className={`chevron-icon ${isCommentsOpen ? 'chevron-icon_open' : ''}`} width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M19.0611 7.85374C18.9218 7.71435 18.7564 7.60378 18.5744 7.52834C18.3923 7.45289 18.1972 7.41406 18.0001 7.41406C17.8031 7.41406 17.6079 7.45289 17.4259 7.52834C17.2438 7.60378 17.0784 7.71435 16.9391 7.85374L12.3531 12.4387C12.2594 12.5325 12.1322 12.5851 11.9996 12.5851C11.867 12.5851 11.7399 12.5325 11.6461 12.4387L7.06113 7.85374C6.77986 7.57235 6.39834 7.41421 6.00048 7.41411C5.60262 7.41402 5.22102 7.57198 4.93963 7.85324C4.65823 8.1345 4.50009 8.51603 4.5 8.91389C4.49991 9.31175 4.65786 9.69335 4.93913 9.97474L9.52513 14.5607C9.85014 14.8858 10.236 15.1436 10.6607 15.3195C11.0853 15.4955 11.5405 15.586 12.0001 15.586C12.4598 15.586 12.9149 15.4955 13.3396 15.3195C13.7643 15.1436 14.1501 14.8858 14.4751 14.5607L19.0611 9.97474C19.3423 9.69345 19.5003 9.31199 19.5003 8.91424C19.5003 8.5165 19.3423 8.13503 19.0611 7.85374Z' stroke='none' />
              </svg>
            }
          </button>
        </li>
      </menu>

      {isCommentsOpen &&
        <ol className='post-comments-list'>
          {comments.map((comment) => (
            <li key={comment.id}>
              <Comment
                text={comment.content}
                canDelete={comment.authorId === authenticatedUserId}
              />
            </li>
          ))}
        </ol>
      }

      {isAuthenticated && <CreateCommentForm />}
    </article>
  );
}

export default Post;
