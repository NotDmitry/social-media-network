import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CreateCommentForm from '@/features/CreateCommentForm';
import { useAuth } from '@/entities/auth/useAuth';
import Comment from '@/entities/Comment';
import { getPostComments } from '@/entities/Comment/api/getPostComments';
import type { UserView } from '@/entities/User/types';
import { HeartIcon, CommentIcon, ChevronDownIcon } from '@/shared/icons';
import { getRelativeTimePresentationString } from '@/shared/utilities/time';
import type { PostModel } from './types';
import './style.css';

interface PostProps {
  post: PostModel;
  author: UserView;
}

function Post({ post, author }: PostProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { currentUser, isUserAuthenticated } = useAuth();

  const {
    data: comments,
    isError: isCommentsQueryError,
    isPending: isCommentsQueryPending,
  } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: ({ signal }) => getPostComments(post.id, signal),
    enabled: isUserAuthenticated && isCommentsOpen,
  });

  const commentsButtonLabel = `${String(post.commentsCount)} ${post.commentsCount === 1 ? 'comment' : 'comments'}`;

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
          src={author.profileImage ?? undefined}
          alt={`Profile picture of ${author.displayName}`}
          width={48}
          height={48}
        />
        <span className='post-author'>{author.displayName}</span>
        <time
          className='post-time'
          dateTime={post.creationDate}>{getRelativeTimePresentationString(post.creationDate)}
        </time>
      </header>

      {post.image &&
        <img
          className='post-image'
          src={post.image}
          width={500}
          alt={`Post by ${author.displayName}`}
        />
      }

      <p className='post-description'>{post.content}</p>

      <menu className='post-menu'>
        <li>
          <button
            className='post-menu-button'
            disabled={!isUserAuthenticated}
            aria-label='Like the post'
            onClick={handleLikeClick}
          >
            <HeartIcon className={`post-menu-like-icon ${isLiked ? 'post-menu-like-icon_active' : ''}`} />
            <span className='post-menu-label'>{post.likesCount + Number(isLiked)} likes</span>
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

      {isCommentsOpen && isUserAuthenticated &&
        <>
          {isCommentsQueryPending &&
            <p className='post-comments-message'>Loading comments...</p>
          }

          {isCommentsQueryError && comments === undefined &&
            <p className='post-comments-message'>Unable to load comments</p>
          }

          {comments?.length === 0 &&
            <p className='post-comments-message'>No comments yet</p>
          }

          {comments !== undefined && comments.length > 0 &&
            <ol className='post-comments-list'>
              {comments.map((comment) => (
                <li key={comment.id}>
                  <Comment
                    text={comment.text}
                    canDelete={comment.authorId === currentUser?.id}
                  />
                </li>
              ))}
            </ol>
          }
        </>
      }

      {isUserAuthenticated && <CreateCommentForm />}
    </article>
  );
}

export default Post;
