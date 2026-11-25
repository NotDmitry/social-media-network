import { beforeEach, describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { useAuth } from '@/entities/auth/useAuth';
import { dislikePost } from '@/entities/Like/api/dislikePost';
import { getCurrentUserLikes } from '@/entities/Like/api/getCurrentUserLikes';
import { getPosts } from '@/entities/Post/api/getPosts';
import { getUserById } from '@/entities/User/api/getUserById';
import { likePost } from '@/entities/Like/api/likePost';
import type { LikeModel, LikeStatus } from '@/entities/Like/types';
import type { PostsPage } from '@/entities/Post/types';
import type { PublicUserModel } from '@/entities/User/types';
import { currentUser, otherUser, testCurrentPublicUser, testOtherPublicUser } from '@/test/userFixtures';
import { testOtherPost, testPost } from '@/test/postFixtures';
import { renderWithQueryClient } from '@/test/renderWithQueryClient';
import PostsFeed from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

vi.mock(import('@/entities/Like/api/dislikePost'), () => ({
  dislikePost: vi.fn(),
}));

vi.mock(import('@/entities/Like/api/getCurrentUserLikes'), () => ({
  getCurrentUserLikes: vi.fn(),
}));

vi.mock(import('@/entities/Post/api/getPosts'), () => ({
  getPosts: vi.fn(),
}));

vi.mock(import('@/entities/User/api/getUserById'), () => ({
  getUserById: vi.fn(),
}));

vi.mock(import('@/entities/Like/api/likePost'), () => ({
  likePost: vi.fn(),
}));

describe('PostsFeed', () => {
  const feedLoadingMessageText = i18next.t(($) => $.feed.loading, { ns: 'posts' });
  const feedLoadingErrorMessage = i18next.t(($) => $.feed.error, { ns: 'posts' });
  const emptyFeedFallbackMessage = i18next.t(($) => $.feed.empty, { ns: 'posts' });
  const likeButtonLabel = i18next.t(($) => $.post.like.action, { ns: 'posts' });

  const testPostsPage = Object.freeze<PostsPage>({
    items: [testPost],
    total: 1,
    limit: 10,
    offset: 0,
  });

  const testTwoPostsPage = Object.freeze<PostsPage>({
    ...testPostsPage,
    items: [testPost, testOtherPost],
    total: 2,
  });

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getCurrentUserLikes).mockResolvedValue([]);
    vi.mocked(getPosts).mockResolvedValue(testPostsPage);
    vi.mocked(getUserById).mockResolvedValue(testCurrentPublicUser);
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser, isUserAuthenticated: true });
  });

  test('shows fallback message when no posts available', async () => {
    // Arrange
    vi.mocked(getPosts).mockResolvedValue({
      ...testPostsPage,
      items: [],
      total: 0,
    });
    const screen = await renderWithQueryClient(<PostsFeed />);
    const emptyFeedFallback = screen.getByText(emptyFeedFallbackMessage);

    // Assert
    await expect.element(emptyFeedFallback).toBeVisible();
    expect(getPosts).toHaveBeenCalledOnce();
    expect(getUserById).not.toHaveBeenCalled();
  });

  test('shows error message on failed initial posts page loading request', async () => {
    // Arrange
    vi.mocked(getPosts).mockRejectedValue(new Error('Network connection lost'));
    const screen = await renderWithQueryClient(<PostsFeed />);
    const feedLoadingError = screen.getByText(feedLoadingErrorMessage);
    const emptyFeedFallback = screen.getByText(emptyFeedFallbackMessage);

    // Assert
    await expect.element(feedLoadingError).toBeVisible();
    await expect.element(emptyFeedFallback).not.toBeInTheDocument();
    expect(getPosts).toHaveBeenCalledOnce();
    expect(getUserById).not.toHaveBeenCalled();
  });

  test('shows error message if all author\'s loading requests failed', async () => {
    // Arrange
    vi.mocked(getPosts).mockResolvedValue(testTwoPostsPage);
    vi.mocked(getUserById).mockRejectedValue(new Error('Network connection lost'));
    const screen = await renderWithQueryClient(<PostsFeed />);
    const postContent = screen.getByText(testPost.content);
    const otherPostContent = screen.getByText(testOtherPost.content);
    const feedLoadingError = screen.getByText(feedLoadingErrorMessage);
    const emptyFeedFallback = screen.getByText(emptyFeedFallbackMessage);

    // Assert
    await expect.element(feedLoadingError).toBeVisible();
    await expect.element(emptyFeedFallback).not.toBeInTheDocument();
    await expect.element(postContent).not.toBeInTheDocument();
    await expect.element(otherPostContent).not.toBeInTheDocument();
    expect(getPosts).toHaveBeenCalledOnce();
    expect(getUserById).toHaveBeenCalledTimes(2);
    expect(getUserById).toHaveBeenCalledWith(testPost.authorId, expect.any(AbortSignal));
    expect(getUserById).toHaveBeenCalledWith(testOtherPost.authorId, expect.any(AbortSignal));
  });

  test('skips posts with failed author\'s loading requests', async () => {
    // Arrange
    vi.mocked(getPosts).mockResolvedValue(testTwoPostsPage);
    vi.mocked(getUserById)
      .mockResolvedValueOnce(testCurrentPublicUser)
      .mockRejectedValueOnce(new Error('Network connection lost'));

    const screen = await renderWithQueryClient(<PostsFeed />);
    const postContent = screen.getByText(testPost.content);
    const otherPostContent = screen.getByText(testOtherPost.content);
    const feedLoadingError = screen.getByText(feedLoadingErrorMessage);

    // Assert
    await expect.element(postContent).toBeVisible();
    await expect.element(otherPostContent).not.toBeInTheDocument();
    await expect.element(feedLoadingError).not.toBeInTheDocument();
    expect(getUserById).toHaveBeenCalledTimes(2);
    expect(getUserById).toHaveBeenCalledWith(testPost.authorId, expect.any(AbortSignal));
    expect(getUserById).toHaveBeenCalledWith(testOtherPost.authorId, expect.any(AbortSignal));
  });

  test('waits for the post\'s pending request fulfillment', async () => {
    // Arrange
    let resolvePendingPosts!: (page: PostsPage) => void;

    vi.mocked(getPosts).mockReturnValue(new Promise<PostsPage>((resolve) => {
      resolvePendingPosts = resolve;
    }));

    const screen = await renderWithQueryClient(<PostsFeed />);
    const spinner = screen.getByRole('progressbar');
    const feedLoadingMessage = screen.getByText(feedLoadingMessageText);
    const emptyFeedFallback = screen.getByText(emptyFeedFallbackMessage);
    const postContent = screen.getByText(testPost.content);

    // Assert
    await expect.element(spinner).toBeVisible();
    await expect.element(feedLoadingMessage).toBeVisible();
    await expect.element(emptyFeedFallback).not.toBeInTheDocument();
    await expect.element(postContent).not.toBeInTheDocument();

    // Act
    resolvePendingPosts(testPostsPage);

    // Assert
    await expect.element(postContent).toBeVisible();
    await expect.element(spinner).not.toBeInTheDocument();
    await expect.element(feedLoadingMessage).not.toBeInTheDocument();
    await expect.element(emptyFeedFallback).not.toBeInTheDocument();
    expect(getPosts).toHaveBeenCalledOnce();
  });

  test('waits for the post\'s author loading request fulfillment to show the post', async () => {
    // Arrange
    vi.mocked(getPosts).mockResolvedValue({ ...testPostsPage, items: [testOtherPost] });
    let resolvePendingAuthor!: (author: PublicUserModel) => void;

    vi.mocked(getUserById).mockReturnValue(new Promise<PublicUserModel>((resolve) => {
      resolvePendingAuthor = resolve;
    }));

    const screen = await renderWithQueryClient(<PostsFeed />);
    const spinner = screen.getByRole('progressbar');
    const feedLoadingMessage = screen.getByText(feedLoadingMessageText);
    const emptyFeedFallback = screen.getByText(emptyFeedFallbackMessage);
    const authorName = screen.getByText(otherUser.displayName);
    const postContent = screen.getByText(testOtherPost.content);

    // Assert
    await expect.element(spinner).toBeVisible();
    await expect.element(feedLoadingMessage).toBeVisible();
    await expect.element(emptyFeedFallback).not.toBeInTheDocument();
    await expect.element(authorName).not.toBeInTheDocument();
    await expect.element(postContent).not.toBeInTheDocument();

    // Act
    resolvePendingAuthor(testOtherPublicUser);

    // Assert
    await expect.element(authorName).toBeVisible();
    await expect.element(postContent).toBeVisible();
    await expect.element(spinner).not.toBeInTheDocument();
    await expect.element(feedLoadingMessage).not.toBeInTheDocument();
    await expect.element(emptyFeedFallback).not.toBeInTheDocument();
    expect(getPosts).toHaveBeenCalledOnce();
    expect(getUserById).toHaveBeenCalledExactlyOnceWith(testOtherPost.authorId, expect.any(AbortSignal));
  });

  test('shows post after a failed current user\'s likes loading request', async () => {
    // Arrange
    vi.mocked(getCurrentUserLikes).mockRejectedValue(new Error('Network connection lost'));
    const likesLoadingErrorMessage = i18next.t(($) => $.feed.likes.error, { ns: 'posts' });
    const screen = await renderWithQueryClient(<PostsFeed />);
    const postContent = screen.getByText(testPost.content);
    const likeButton = screen.getByRole('button', { name: likeButtonLabel });
    const likesLoadingError = screen.getByText(likesLoadingErrorMessage);

    // Assert
    await expect.element(likesLoadingError).toBeVisible();
    await expect.element(postContent).toBeVisible();
    await expect.element(likeButton).toBeDisabled();
    expect(getCurrentUserLikes).toHaveBeenCalledOnce();
  });

  test('doesn\'t request likes for guests', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser: null, isUserAuthenticated: false });
    const screen = await renderWithQueryClient(<PostsFeed />);
    const postContent = screen.getByText(testPost.content);
    const likeButton = screen.getByRole('button', { name: likeButtonLabel });

    // Assert
    await expect.element(postContent).toBeVisible();
    await expect.element(likeButton).toBeDisabled();
    expect(getCurrentUserLikes).not.toHaveBeenCalled();
  });

  test('updates like count after successful like and dislike call', async () => {
    // Arrange
    const newLikeStatus: LikeStatus = {
      status: 'liked',
      postId: testPost.id,
      newLikesCount: 1,
    };

    const newDislikeStatus: LikeStatus = {
      status: 'disliked',
      postId: testPost.id,
      newLikesCount: 0,
    };

    let resolvePendingLike!: (status: LikeStatus) => void;

    vi.mocked(likePost).mockReturnValue(new Promise<LikeStatus>((resolve) => {
      resolvePendingLike = resolve;
    }));

    let resolvePendingDislike!: (status: LikeStatus) => void;

    vi.mocked(dislikePost).mockReturnValue(new Promise<LikeStatus>((resolve) => {
      resolvePendingDislike = resolve;
    }));

    const initialLikesCountLabel = i18next.t(($) => $.post.like.count, { ns: 'posts', count: 0 });
    const updatedLikesCountLabel = i18next.t(($) => $.post.like.count, { ns: 'posts', count: 1 });
    const screen = await renderWithQueryClient(<PostsFeed />);
    const likeButton = screen.getByRole('button', { name: likeButtonLabel });
    const initialLikesCount = screen.getByText(initialLikesCountLabel);
    const updatedLikesCount = screen.getByText(updatedLikesCountLabel);

    // Assert
    await expect.element(initialLikesCount).toBeVisible();

    // Act
    await likeButton.click();

    // Assert
    await expect.element(likeButton).toBeDisabled();
    await expect.element(updatedLikesCount).toBeVisible();
    await expect.element(initialLikesCount).not.toBeInTheDocument();

    // Act
    resolvePendingLike(newLikeStatus);

    // Assert
    await expect.element(likeButton).toBeEnabled();
    await expect.element(updatedLikesCount).toBeVisible();
    await expect.element(initialLikesCount).not.toBeInTheDocument();
    expect(likePost).toHaveBeenCalledExactlyOnceWith(testPost.id);

    // Act
    await likeButton.click();

    // Assert
    await expect.element(likeButton).toBeDisabled();
    await expect.element(initialLikesCount).toBeVisible();
    await expect.element(updatedLikesCount).not.toBeInTheDocument();

    // Act
    resolvePendingDislike(newDislikeStatus);

    // Assert
    await expect.element(likeButton).toBeEnabled();
    await expect.element(initialLikesCount).toBeVisible();
    await expect.element(updatedLikesCount).not.toBeInTheDocument();
    expect(dislikePost).toHaveBeenCalledExactlyOnceWith(testPost.id);
  });

  test('dislikes an on-fetch initially liked by the current user post', async () => {
    // Arrange
    const testLikedPost = { ...testPost, likesCount: 1 };

    const testExistingLike: LikeModel = {
      id: 1010001,
      postId: testLikedPost.id,
      userId: currentUser.id,
      creationDate: testLikedPost.creationDate,
    };

    const newDislikeStatus: LikeStatus = {
      status: 'disliked',
      postId: testLikedPost.id,
      newLikesCount: 0,
    };

    let resolvePendingDislike!: (status: LikeStatus) => void;

    vi.mocked(dislikePost).mockReturnValue(new Promise<LikeStatus>((resolve) => {
      resolvePendingDislike = resolve;
    }));

    vi.mocked(getPosts).mockResolvedValue({ ...testPostsPage, items: [testLikedPost] });
    vi.mocked(getCurrentUserLikes).mockResolvedValue([testExistingLike]);
    const initialLikesCountLabel = i18next.t(($) => $.post.like.count, { ns: 'posts', count: 1 });
    const updatedLikesCountLabel = i18next.t(($) => $.post.like.count, { ns: 'posts', count: 0 });
    const screen = await renderWithQueryClient(<PostsFeed />);
    const likeButton = screen.getByRole('button', { name: likeButtonLabel });
    const initialLikesCount = screen.getByText(initialLikesCountLabel);
    const updatedLikesCount = screen.getByText(updatedLikesCountLabel);

    // Assert
    await expect.element(likeButton).toBeEnabled();
    await expect.element(initialLikesCount).toBeVisible();

    // Act
    await likeButton.click();

    // Assert
    await expect.element(likeButton).toBeDisabled();

    // Act
    resolvePendingDislike(newDislikeStatus);

    // Assert
    await expect.element(likeButton).toBeEnabled();
    await expect.element(updatedLikesCount).toBeVisible();
    await expect.element(initialLikesCount).not.toBeInTheDocument();
    expect(dislikePost).toHaveBeenCalledExactlyOnceWith(testLikedPost.id);
    expect(likePost).not.toHaveBeenCalled();
  });
});
