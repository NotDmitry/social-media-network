import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { animated, easings, useTransition } from '@react-spring/web';
import { useMutation, useQueries, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import CreateCommentForm from '@/features/CreateCommentForm';
import { useAuth } from '@/entities/auth/useAuth';
import Comment from '@/entities/Comment';
import { getPostComments } from '@/entities/Comment/api/getPostComments';
import { likePost } from '@/entities/Like/api/likePost';
import { dislikePost } from '@/entities/Like/api/dislikePost';
import { getUserById } from '@/entities/User/api/getUserById';
import { toUserView } from '@/entities/User/utilities';
import type { UserView } from '@/entities/User/types';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import Spinner from '@/shared/ui/Spinner';
import { HeartIcon, CommentIcon, ChevronDownIcon } from '@/shared/icons';
import { getRelativeTimePresentationString } from '@/shared/utilities/time';
import type { PostModel, PostsPage } from './types';
import './style.css';

interface PostProps {
  post: PostModel;
  author: UserView;
  isLiked: boolean;
  isLikeDisabled: boolean;
}

function Post({ post, author, isLiked, isLikeDisabled }: PostProps) {
  const { t, i18n } = useTranslation(['posts', 'common']);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { currentUser, isUserAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const {
    data: comments,
    isError: isCommentsQueryError,
    isPending: isCommentsQueryPending,
  } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: ({ signal }) => getPostComments(post.id, signal),
    enabled: isUserAuthenticated && isCommentsOpen,
  });

  const {
    mutate: toggleLike,
    isPending: isLikeTogglePending,
    variables: willBeLiked,
  } = useMutation({
    mutationFn: (willBeLiked: boolean) => willBeLiked ? likePost(post.id) : dislikePost(post.id),
    onSuccess: ({ newLikesCount }, willBeLiked) => {
      // Manual post cache invalidation
      queryClient.setQueryData<InfiniteData<PostsPage>>(['posts'], (postsQueryCachedData) => {
        if (postsQueryCachedData === undefined) {
          return postsQueryCachedData;
        }

        return {
          ...postsQueryCachedData,
          pages: postsQueryCachedData.pages.map((page) => ({
            ...page,
            items: page.items.map((cachedPost) => cachedPost.id === post.id ?
              { ...cachedPost, likesCount: newLikesCount } : cachedPost),
          })),
        };
      });

      // Manual liked posts cache invalidation
      queryClient.setQueryData<number[]>(['currentUserLikes', currentUser?.id], (cachedLikedPostIds) => {
        if (cachedLikedPostIds === undefined) {
          return cachedLikedPostIds;
        }

        if (willBeLiked) {
          return [...cachedLikedPostIds, post.id];
        }

        return cachedLikedPostIds.filter((postId) => postId !== post.id);
      });
    },
    onError: (error) => {
      showAlert(t(($) => $.post.like.alert.error), 'error');
      console.error(error);
    },
  });

  const uniqueCommentAuthorIds = [...new Set((comments ?? []).map((comment) => comment.authorId))];
  const {
    data: commentAuthorsMap,
    isPending: isCommentAuthorsQueryPending,
  } = useQueries({
    queries: uniqueCommentAuthorIds.map((authorId) => {
      return {
        queryKey: ['author', authorId],
        queryFn: ({ signal }) => getUserById(authorId, signal),
        enabled: isUserAuthenticated && isCommentsOpen,
      };
    }),
    combine: (authorsQueries) => {
      const authors = new Map<number, UserView>();

      authorsQueries.forEach((authorQuery) => {
        if (authorQuery.data) {
          authors.set(authorQuery.data.id, toUserView(authorQuery.data));
        }
      });

      return {
        data: authors,
        isPending: authorsQueries.some((authorQuery) => authorQuery.isPending),
      };
    },
  });

  const displayedCommentsCount = comments?.length ?? post.commentsCount;
  const commentsButtonLabel = t(($) => $.post.comments.count, { count: displayedCommentsCount });
  const isCommentsSectionPending = isCommentsQueryPending || isCommentAuthorsQueryPending;

  const isLikedOptimistic = isLikeTogglePending ? willBeLiked : isLiked;
  const likesCountOptimistic = isLikeTogglePending ? post.likesCount + (isLiked ? -1 : 1) : post.likesCount;

  const isCommentsSectionVisible = isCommentsOpen && isUserAuthenticated;
  const commentsSectionTransition = useTransition(isCommentsSectionVisible, {
    from: {
      opacity: 0,
      gridTemplateRows: '0fr',
    },
    enter: {
      opacity: 1,
      gridTemplateRows: '1fr',
    },
    leave: {
      opacity: 0,
      gridTemplateRows: '0fr',
    },
    config: {
      duration: 250,
      easing: easings.linear,
    },
  })

  function handleLikeClick() {
    toggleLike(!isLiked);
  }

  function handleCommentsSectionClick() {
    setIsCommentsOpen((isOpen) => !isOpen);
  }

  function handleCommentCreated() {
    setIsCommentsOpen(true);
  }

  return (
    <article className='post-card'>
      <header className='post-header'>
        <img
          className='avatar post-avatar'
          src={author.profileImage ?? undefined}
          alt={t(($) => $.a11y.profilePicture, { ns: 'common', name: author.displayName })}
          width={48}
          height={48}
        />
        <span className='post-author'>{author.displayName}</span>
        <time
          className='post-time'
          dateTime={post.creationDate}
        >
          {getRelativeTimePresentationString(post.creationDate, i18n.resolvedLanguage ?? i18n.language)}
        </time>
      </header>

      {post.image &&
        <img
          className='post-image'
          src={post.image}
          width={500}
          alt={t(($) => $.post.imageAlt, { name: author.displayName })}
        />
      }

      <p className='post-description'>{post.content}</p>

      <menu className='post-menu'>
        <li>
          <button
            className='post-menu-button'
            disabled={!isUserAuthenticated || isLikeDisabled || isLikeTogglePending}
            aria-label={t(($) => $.post.like.action)}
            onClick={handleLikeClick}
          >
            <HeartIcon className={`post-menu-like-icon ${isLikedOptimistic ? 'post-menu-like-icon_active' : ''}`} />
            <span className='post-menu-label'>
              {t(($) => $.post.like.count, { count: likesCountOptimistic })}
            </span>
          </button>
        </li>
        <li>
          <button
            className='post-menu-button'
            disabled={!isUserAuthenticated}
            aria-label={t(($) => $.post.comments.toggle)}
            onClick={handleCommentsSectionClick}
          >
            <CommentIcon className='post-menu-comment-icon' />
            <span className='post-menu-label'>
              {isUserAuthenticated ? commentsButtonLabel : t(($) => $.post.comments.authenticationRequired)}
            </span>
            {isUserAuthenticated &&
              <ChevronDownIcon className={`chevron-icon ${isCommentsOpen ? 'chevron-icon_open' : ''}`} />
            }
          </button>
        </li>
      </menu>

      {commentsSectionTransition((style, isVisible) => isVisible && (
        <animated.div className='post-comments-section' style={style}>
          <div className='post-comments-section-content'>
            {isCommentsSectionPending &&
              <Spinner label={t(($) => $.post.comments.loading)} />
            }

            {!isCommentsSectionPending && isCommentsQueryError && comments === undefined &&
              <p className='post-comments-message'>{t(($) => $.post.comments.error)}</p>
            }

            {!isCommentsSectionPending && comments?.length === 0 &&
              <p className='post-comments-message'>{t(($) => $.post.comments.empty)}</p>
            }

            {!isCommentsSectionPending && comments !== undefined && comments.length > 0 &&
              <ol className='post-comments-list'>
                {comments.map((comment) => {
                  const commentAuthor = commentAuthorsMap.get(comment.authorId) ?? null;

                  return (
                    <li key={comment.id}>
                      <Comment
                        author={commentAuthor}
                        comment={comment}
                        canDelete={comment.authorId === currentUser?.id}
                      />
                    </li>
                  );
                })}
              </ol>
            }
          </div>
        </animated.div>
      ))}

      {isUserAuthenticated &&
        <CreateCommentForm postId={post.id} onCommentCreated={handleCommentCreated} />
      }
    </article>
  );
}

export default Post;
