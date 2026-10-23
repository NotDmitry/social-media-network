import { beforeEach, describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { useAuth } from '@/entities/auth/useAuth';
import { getCurrentUserLikes } from '@/entities/Like/api/getCurrentUserLikes';
import { getPosts } from '@/entities/Post/api/getPosts';
import { getUserById } from '@/entities/User/api/getUserById';
import type { PostsPage } from '@/entities/Post/types';
import type { PublicUserModel } from '@/entities/User/types';
import { currentUser, otherUser, testCurrentPublicUser, testOtherPublicUser } from '@/test/userFixtures';
import { testOtherPost, testPost } from '@/test/postFixtures';
import { renderWithQueryClient } from '@/test/renderWithQueryClient';
import PostsFeed from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
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

describe('PostsFeed', () => {
  const feedLoadingMessageText = i18next.t(($) => $.feed.loading, { ns: 'posts' });
  const feedLoadingErrorMessage = i18next.t(($) => $.feed.error, { ns: 'posts' });
  const emptyFeedFallbackMessage = i18next.t(($) => $.feed.empty, { ns: 'posts' });

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
});
