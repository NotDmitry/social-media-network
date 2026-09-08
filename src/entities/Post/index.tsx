import { useState } from 'react';

import CreateCommentForm from '@/features/CreateCommentForm';

import { useAuth } from '@/entities/auth/useAuth';
import Comment from '@/entities/Comment';
import type { CommentModel } from '@/entities/Comment/types';
import type { UserModel } from '@/entities/User/types';

import { HeartIcon, CommentIcon, ChevronDownIcon } from '@/shared/icons';
import { getRelativeTimePresentationString } from '@/shared/utilities/time';

import type { PostModel } from './types';

import './style.css';

interface PostProps {
  post: PostModel;
  comments: CommentModel[];
  author: UserModel;
}

function Post({ post, comments, author }: PostProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { currentUser, isUserAuthenticated } = useAuth();

  const commentsButtonLabel = `${String(comments.length)} ${comments.length === 1 ? 'comment' : 'comments'}`;

  function handleLikeClick() {
    setIsLiked((isLiked) => !isLiked);
  }

  function handleCommentsSectionClick() {
    setIsCommentsOpen((isOpen) => !isOpen);
  }

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
            disabled={!isUserAuthenticated}
            aria-label='Like the post'
            onClick={handleLikeClick}
          >
            <HeartIcon className={`post-menu-like-icon ${isLiked ? 'post-menu-like-icon_active' : ''}`} />
            <span className='post-menu-label'>{21 + Number(isLiked)} likes</span>
          </button>
        </li>
        <li>
          <button
            className='post-menu-button'
            disabled={!isUserAuthenticated}
            aria-label='Open / close comments section'
            onClick={handleCommentsSectionClick}
          >
            <CommentIcon className='post-menu-comment-icon' />
            <span className='post-menu-label'>
              {isUserAuthenticated ? commentsButtonLabel : 'You have to login to see the comments'}
            </span>
            {isUserAuthenticated &&
              <ChevronDownIcon className={`chevron-icon ${isCommentsOpen ? 'chevron-icon_open' : ''}`} />
            }
          </button>
        </li>
      </menu>

      {isCommentsOpen && comments.length > 0 &&
        <ol className='post-comments-list'>
          {comments.map((comment) => (
            <li key={comment.id}>
              <Comment
                text={comment.content}
                canDelete={comment.authorId === currentUser?.id}
              />
            </li>
          ))}
        </ol>
      }

      {isUserAuthenticated && <CreateCommentForm />}
    </article>
  );
}

export default Post;
