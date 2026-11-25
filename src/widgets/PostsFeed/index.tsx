import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery, useQueries, useQuery, type UseQueryResult } from '@tanstack/react-query';
import Post from '@/entities/Post';
import { useAuth } from '@/entities/auth/useAuth';
import { getCurrentUserLikes } from '@/entities/Like/api/getCurrentUserLikes';
import { getPosts } from '@/entities/Post/api/getPosts';
import { getUserById } from '@/entities/User/api/getUserById';
import { toUserView } from '@/entities/User/utilities';
import type { PublicUserModel, UserView } from '@/entities/User/types';
import FloatingActionButton from '@/shared/ui/FloatingActionButton';
import Spinner from '@/shared/ui/Spinner';
import { ChevronDownIcon } from '@/shared/icons';
import './style.css';

const POSTS_PAGE_SIZE = 10;

type AuthorQueryResult = Pick<UseQueryResult<UserView>, 'data' | 'isError' | 'isPending'>;

function getLikedPostIdsSet(likedPostIds: number[]) {
  return new Set(likedPostIds);
}

function selectUserView(user: PublicUserModel) {
  return toUserView(user);
}

function combineAuthorsQueries(authorsQueries: AuthorQueryResult[]) {
  const authors = new Map<number, UserView>();

  authorsQueries.forEach((authorQuery) => {
    if (authorQuery.data) {
      authors.set(authorQuery.data.id, authorQuery.data);
    }
  });

  return {
    data: authors,
    isError: authorsQueries.some((authorQuery) => authorQuery.isError),
    isPending: authorsQueries.some((authorQuery) => authorQuery.isPending),
  };
}

function PostsFeed() {
  const { t } = useTranslation('posts');
  const { currentUser, isUserAuthenticated } = useAuth();
  const [isFeedScrolled, setIsFeedScrolled] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLParagraphElement>(null);
  const postsFeedRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError: isPostsQueryError,
    isFetchNextPageError,
    isFetching: isPostsQueryFetching,
    isFetchingNextPage,
    isPending: isPostsQueryPending,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam, signal }) => getPosts(POSTS_PAGE_SIZE, pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.items.length === 0) {
        return undefined;
      }

      const nextPageOffset = lastPage.offset + lastPage.items.length;

      return nextPageOffset < lastPage.total ? nextPageOffset : undefined;
    },
  });

  const {
    data: likedByCurrentUserPostIds,
    isError: isCurrentUserLikesQueryError,
    isPending: isCurrentUserLikesQueryPending,
  } = useQuery({
    queryKey: ['currentUserLikes', currentUser?.id],
    queryFn: async ({ signal }) => {
      const likes = await getCurrentUserLikes(signal);

      return likes.map((like) => like.postId);
    },
    select: getLikedPostIdsSet,
    enabled: currentUser !== null,
  });

  const posts = (data?.pages ?? []).flatMap((page) => page.items);

  const uniqueAuthorIds = [...new Set(posts.map((post) => post.authorId))];
  const {
    data: authorsMap,
    isError: isAuthorsQueryError,
    isPending: isAuthorsQueryPending,
  } = useQueries({
    queries: uniqueAuthorIds.map((authorId) => {
      return {
        queryKey: ['author', authorId],
        queryFn: ({ signal }) => getUserById(authorId, signal),
        select: selectUserView,
      };
    }),
    combine: combineAuthorsQueries,
  });

  const isInitialPending = (
    isPostsQueryPending ||
    (isAuthorsQueryPending && data?.pages.length === 1) ||
    (isUserAuthenticated && isCurrentUserLikesQueryPending)
  );

  const hasFetchedPostsWithAuthors = posts.some((post) => authorsMap.has(post.authorId));

  const isGlobalFetchError = (
    (isPostsQueryError && posts.length === 0) ||
    (isAuthorsQueryError && posts.length > 0 && !hasFetchedPostsWithAuthors)
  );

  const isCurrentUserLikesUnavailable = (
    isUserAuthenticated &&
    isCurrentUserLikesQueryError &&
    likedByCurrentUserPostIds === undefined
  );

  let postsFeedStatusMessage: string | null = null;

  if (isGlobalFetchError) {
    postsFeedStatusMessage = t(($) => $.feed.error);
  } else if (posts.length === 0) {
    postsFeedStatusMessage = t(($) => $.feed.empty);
  } else if (isCurrentUserLikesUnavailable) {
    postsFeedStatusMessage = t(($) => $.feed.likes.error);
  }

  function handleScrollToPostsFeedStart() {
    postsFeedRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const handlePostsFeedScroll = () => {
      if (postsFeedRef.current === null) {
        return;
      }

      setIsFeedScrolled(postsFeedRef.current.getBoundingClientRect().top < 0);
    }

    window.addEventListener('scroll', handlePostsFeedScroll);

    return () => {
      window.removeEventListener('scroll', handlePostsFeedScroll);
    };
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (
      sentinel === null ||
      !hasNextPage ||
      isPostsQueryFetching ||
      isGlobalFetchError
    ) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void fetchNextPage();
      }
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isPostsQueryFetching, isGlobalFetchError]);

  return (
    <div className='posts-feed' ref={postsFeedRef}>
      {isInitialPending ? (
        <Spinner label={t(($) => $.feed.loading)} />
      ) : (postsFeedStatusMessage &&
        <p className='posts-feed-message'>{postsFeedStatusMessage}</p>
      )}

      {!isInitialPending && !isGlobalFetchError &&
        posts.map((post) => {
          const author = authorsMap.get(post.authorId);

          if (!author) {
            return null;
          }

          return (
            <Post
              key={post.id}
              post={post}
              author={author}
              isLiked={likedByCurrentUserPostIds?.has(post.id) ?? false}
              isLikeDisabled={isCurrentUserLikesUnavailable}
            />
          );
        })
      }

      <p
        className='posts-feed-message'
        ref={sentinelRef}
        hidden={!hasNextPage || isAuthorsQueryPending || isFetchNextPageError || isGlobalFetchError}
      >
        {isFetchingNextPage && <Spinner label={t(($) => $.feed.pagination.loading)} />}
      </p>

      {isFeedScrolled &&
        <FloatingActionButton
          className='posts-feed-scroll-button'
          size='small'
          aria-label={t(($) => $.feed.scrollToStart)}
          onClick={handleScrollToPostsFeedStart}
        >
          <ChevronDownIcon className='posts-feed-scroll-icon' />
        </FloatingActionButton>
      }
    </div>
  );
}

export default PostsFeed;
