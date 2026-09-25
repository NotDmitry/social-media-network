import { useEffect, useRef } from 'react';
import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';
import Post from '@/entities/Post';
import { useAuth } from '@/entities/auth/useAuth';
import { getCurrentUserLikes } from '@/entities/Like/api/getCurrentUserLikes';
import { getPosts } from '@/entities/Post/api/getPosts';
import { getUserById } from '@/entities/User/api/getUserById';
import { toUserView } from '@/entities/User/utilities';
import type { UserView } from '@/entities/User/types';
import './style.css';

const POSTS_PAGE_SIZE = 10;

function PostsFeed() {
  const { currentUser, isUserAuthenticated } = useAuth();

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
    queryFn: ({ signal }) => getCurrentUserLikes(signal),
    select: (likes) => new Set(likes.map((like) => like.postId)),
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
        isError: authorsQueries.some((authorQuery) => authorQuery.isError),
        isPending: authorsQueries.some((authorQuery) => authorQuery.isPending),
      };
    },
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

  if (isInitialPending) {
    postsFeedStatusMessage = 'Loading...';
  } else if (isGlobalFetchError) {
    postsFeedStatusMessage = 'Unable to fetch posts';
  } else if (posts.length === 0) {
    postsFeedStatusMessage = 'No posts yet';
  } else if (isCurrentUserLikesUnavailable) {
    postsFeedStatusMessage = 'Unable to fetch your likes';
  }

  const sentinelRef = useRef<HTMLParagraphElement>(null);

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
    <div className='posts-feed'>
      {postsFeedStatusMessage &&
        <p className='posts-feed-message'>{postsFeedStatusMessage}</p>
      }

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
        {isFetchingNextPage && 'Loading more posts...'}
      </p>
    </div>
  );
}

export default PostsFeed;
