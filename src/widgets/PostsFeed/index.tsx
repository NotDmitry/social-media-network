import { useEffect, useRef } from 'react';
import { useInfiniteQuery, useQueries } from '@tanstack/react-query';
import Post from '@/entities/Post';
import { getPosts } from '@/entities/Post/api/getPosts';
import { getUserById } from '@/entities/User/api/getUserById';
import { toUserView } from '@/entities/User/utilities';
import type { UserView } from '@/entities/User/types';
import { MOCK_COMMENTS } from '@/shared/mocks/CommentMocks';
import './style.css';

const POSTS_PAGE_SIZE = 10;

function PostsFeed() {
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

  const isInitialPending = isPostsQueryPending || (isAuthorsQueryPending && data?.pages.length === 1);
  const hasFetchedPostsWithAuthors = posts.some((post) => authorsMap.has(post.authorId));
  const isGlobalFetchError = (isPostsQueryError && posts.length === 0) ||
    (isAuthorsQueryError && posts.length > 0 && !hasFetchedPostsWithAuthors);

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
      {isInitialPending &&
        <p className='posts-feed-message'>Loading posts...</p>
      }

      {!isInitialPending && isGlobalFetchError &&
        <p className='posts-feed-message'>Unable to fetch posts</p>
      }

      {!isInitialPending && !isGlobalFetchError && posts.length === 0 &&
        <p className='posts-feed-message'>No posts yet</p>
      }

      {!isInitialPending && !isGlobalFetchError &&
        posts.map((post) => {
          const author = authorsMap.get(post.authorId);
          const comments = MOCK_COMMENTS.filter((comment) => comment.postId === post.id);

          if (!author) {
            return null;
          }

          return (
            <Post
              key={post.id}
              post={post}
              comments={comments}
              author={author}
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
