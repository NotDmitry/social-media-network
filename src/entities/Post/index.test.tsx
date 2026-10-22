import { beforeEach, describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { useAuth } from '@/entities/auth/useAuth';
import { createComment } from '@/entities/Comment/api/createComment';
import { deleteComment } from '@/entities/Comment/api/deleteComment';
import { getPostComments } from '@/entities/Comment/api/getPostComments';
import { getUserById } from '@/entities/User/api/getUserById';
import type { CommentModel } from '@/entities/Comment/types';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import AlertStack from '@/shared/ui/Alert/AlertStack';
import { testComment, testNewComment, testOtherComment } from '@/test/commentFixtures';
import { currentUser, testCurrentPublicUser, testOtherPublicUser } from '@/test/userFixtures';
import { testPost } from '@/test/postFixtures';
import { renderWithQueryClient } from '@/test/renderWithQueryClient';
import Post from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

vi.mock(import('@/entities/Comment/api/createComment'), () => ({
  createComment: vi.fn(),
}));

vi.mock(import('@/entities/Comment/api/deleteComment'), () => ({
  deleteComment: vi.fn(),
}));

vi.mock(import('@/entities/Comment/api/getPostComments'), () => ({
  getPostComments: vi.fn(),
}));

vi.mock(import('@/entities/User/api/getUserById'), () => ({
  getUserById: vi.fn(),
}));

describe('Post comments', () => {
  const commentsToggleButtonLabel = i18next.t(($) => $.post.comments.toggle, { ns: 'posts' });
  const deleteCommentButtonLabel = i18next.t(($) => $.comment.delete.action, { ns: 'posts' });
  const commentInputLabel = i18next.t(($) => $.comment.create.input.comment.label, { ns: 'posts' });
  const commentSubmitButtonLabel = i18next.t(($) => $.comment.create.button.default, { ns: 'posts' });

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useAuth, { partial: true }).mockReturnValue({
      currentUser,
      isUserAuthenticated: true,
    });
    vi.mocked(getPostComments).mockResolvedValue([testComment]);
    vi.mocked(getUserById).mockResolvedValue(testCurrentPublicUser);
    useAlertStore.setState({ alerts: [] });
  });

  test('opens the comments section and loads comments', async () => {
    // Arrange
    const loadedCommentsCountLabel = i18next.t(($) => $.post.comments.count, { ns: 'posts', count: 1 });
    const screen = await renderWithQueryClient(
      <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const commentText = screen.getByText(testComment.text);
    const loadedCommentsCount = screen.getByText(loadedCommentsCountLabel);

    // Assert
    await expect.element(commentText).not.toBeInTheDocument();
    expect(getPostComments).not.toHaveBeenCalled();

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(commentText).toBeVisible();
    await expect.element(loadedCommentsCount).toBeVisible();
    expect(getPostComments).toHaveBeenCalledOnce();
  });

  test('updates displayed comments count on opening', async () => {
    // Arrange
    const testPostWithCommentsCount = { ...testPost, commentsCount: 2 };
    const initialCommentsCountLabel = i18next.t(($) => $.post.comments.count, { ns: 'posts', count: 2 });
    const loadedCommentsCountLabel = i18next.t(($) => $.post.comments.count, { ns: 'posts', count: 1 });
    const screen = await renderWithQueryClient(
      <Post post={testPostWithCommentsCount} author={currentUser} isLiked={false} isLikeDisabled={false} />
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const initialCommentsCount = screen.getByText(initialCommentsCountLabel);
    const loadedCommentsCount = screen.getByText(loadedCommentsCountLabel);

    // Assert
    await expect.element(initialCommentsCount).toBeVisible();
    await expect.element(loadedCommentsCount).not.toBeInTheDocument();

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(initialCommentsCount).not.toBeInTheDocument();
    await expect.element(loadedCommentsCount).toBeVisible();
  });

  test('shows fallback message for post without comments', async () => {
    // Arrange
    vi.mocked(getPostComments).mockResolvedValue([]);
    const emptyCommentsMessage = i18next.t(($) => $.post.comments.empty, { ns: 'posts' });
    const screen = await renderWithQueryClient(
      <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const visibleEmptyCommentsMessage = screen.getByText(emptyCommentsMessage);

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(visibleEmptyCommentsMessage).toBeVisible();
    expect(getPostComments).toHaveBeenCalledOnce();
  });

  test('shows error message on failed comments loading request', async () => {
    // Arrange
    vi.mocked(getPostComments).mockRejectedValue(new Error('Network connection lost'));
    const commentsLoadingErrorMessage = i18next.t(($) => $.post.comments.error, { ns: 'posts' });
    const screen = await renderWithQueryClient(
      <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const visibleCommentsLoadingErrorMessage = screen.getByText(commentsLoadingErrorMessage);

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(visibleCommentsLoadingErrorMessage).toBeVisible();
    expect(getPostComments).toHaveBeenCalledOnce();
  });

  test('auto-opens the comments section after creating a comment', async () => {
    // Arrange
    vi.mocked(createComment).mockResolvedValue(testComment);
    const screen = await renderWithQueryClient(
      <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
    );
    const commentText = screen.getByText(testComment.text);
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel });
    const commentSubmitButton = screen.getByRole('button', { name: commentSubmitButtonLabel });

    // Assert
    await expect.element(commentText).not.toBeInTheDocument();
    expect(getPostComments).not.toHaveBeenCalled();

    // Act
    await commentInput.fill(testComment.text);
    await commentSubmitButton.click();

    // Assert
    await expect.element(commentText).toBeVisible();
    expect(createComment).toHaveBeenCalledOnce();
    expect(getPostComments).toHaveBeenCalledOnce();
  });

  test('creates a new comment in an open comments section with success alert', async () => {
    // Arrange
    vi.mocked(createComment).mockResolvedValue(testNewComment);
    const successAlertMessage = i18next.t(($) => $.comment.create.alert.success, { ns: 'posts' });
    const newCommentsCountLabel = i18next.t(($) => $.post.comments.count, { ns: 'posts', count: 2 });
    const screen = await renderWithQueryClient(
      <>
        <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
        <AlertStack />
      </>
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const commentText = screen.getByText(testComment.text);
    const newCommentText = screen.getByText(testNewComment.text);
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel });
    const commentSubmitButton = screen.getByRole('button', { name: commentSubmitButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);
    const newCommentsCount = screen.getByText(newCommentsCountLabel);

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(commentText).toBeVisible();
    await expect.element(newCommentText).not.toBeInTheDocument();

    // Act
    await commentInput.fill(testNewComment.text);
    await commentSubmitButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    await expect.element(commentText).toBeVisible();
    await expect.element(newCommentText).toBeVisible();
    await expect.element(commentInput).toHaveValue('');
    await expect.element(newCommentsCount).toBeVisible();
    expect(createComment).toHaveBeenCalledOnce();
  });

  test('deletes current user\'s comment with success alert without clearing the comments section', async () => {
    // Arrange
    vi.mocked(getPostComments).mockResolvedValue([testComment, testOtherComment]);
    vi.mocked(getUserById)
      .mockResolvedValueOnce(testCurrentPublicUser)
      .mockResolvedValueOnce(testOtherPublicUser);
    const successAlertMessage = i18next.t(($) => $.comment.delete.alert.success, { ns: 'posts' });
    const loadedCommentsCountLabel = i18next.t(($) => $.post.comments.count, { ns: 'posts', count: 2 });
    const newCommentsCountLabel = i18next.t(($) => $.post.comments.count, { ns: 'posts', count: 1 });
    const screen = await renderWithQueryClient(
      <>
        <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
        <AlertStack />
      </>
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const currentUserCommentText = screen.getByText(testComment.text);
    const deleteCommentButton = screen.getByRole('button', { name: deleteCommentButtonLabel });
    const otherUserCommentText = screen.getByText(testOtherComment.text);
    const successAlert = screen.getByText(successAlertMessage);
    const loadedCommentsCount = screen.getByText(loadedCommentsCountLabel);
    const newCommentsCount = screen.getByText(newCommentsCountLabel);

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(currentUserCommentText).toBeVisible();
    await expect.element(otherUserCommentText).toBeVisible();
    await expect.element(loadedCommentsCount).toBeVisible();
    expect(getUserById).toHaveBeenCalledTimes(2);

    // Act
    await deleteCommentButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    await expect.element(currentUserCommentText).not.toBeInTheDocument();
    await expect.element(otherUserCommentText).toBeVisible();
    await expect.element(newCommentsCount).toBeVisible();
    expect(deleteComment).toHaveBeenCalledExactlyOnceWith(testComment.id);
  });

  test('doesn\'t remove comments on failed deletion request and shows error alert', async () => {
    // Arrange
    vi.mocked(deleteComment).mockRejectedValue(new Error('Network connection lost'));
    const errorAlertMessage = i18next.t(($) => $.comment.delete.alert.error, { ns: 'posts' });
    const screen = await renderWithQueryClient(
      <>
        <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
        <AlertStack />
      </>
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const commentText = screen.getByText(testComment.text);
    const deleteCommentButton = screen.getByRole('button', { name: deleteCommentButtonLabel });
    const errorAlert = screen.getByText(errorAlertMessage);

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(commentText).toBeVisible();

    // Act
    await deleteCommentButton.click();

    // Assert
    await expect.element(errorAlert).toBeVisible();
    await expect.element(commentText).toBeVisible();
    expect(deleteComment).toHaveBeenCalledOnce();
  });

  test('shows unknown author on failed comment author loading request', async () => {
    // Arrange
    vi.mocked(getUserById).mockRejectedValue(new Error('Cannot get the author'));
    const unknownAuthorName = i18next.t(($) => $.comment.unknownAuthor, { ns: 'posts' });
    const screen = await renderWithQueryClient(
      <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const unknownAuthor = screen.getByText(unknownAuthorName);
    const commentText = screen.getByText(testComment.text);

    // Assert
    await expect.element(unknownAuthor).not.toBeInTheDocument();

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(unknownAuthor).toBeVisible();
    await expect.element(commentText).toBeVisible();
  });

  test('shows a sign-in prompt instead of comments section for guests', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({
      currentUser: null,
      isUserAuthenticated: false,
    });
    const testPostWithCommentsCount = { ...testPost, commentsCount: 2 };
    const signInPromptMessage = i18next.t(($) => $.post.comments.authenticationRequired, { ns: 'posts' });
    const initialCommentsCountLabel = i18next.t(($) => $.post.comments.count, { ns: 'posts', count: 2 });
    const screen = await renderWithQueryClient(
      <Post post={testPostWithCommentsCount} author={currentUser} isLiked={false} isLikeDisabled={false} />
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const signInPrompt = screen.getByText(signInPromptMessage);
    const initialCommentsCount = screen.getByText(initialCommentsCountLabel);
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel, includeHidden: true });

    // Assert
    await expect.element(commentsToggleButton).toBeDisabled();
    await expect.element(signInPrompt).toBeVisible();
    await expect.element(initialCommentsCount).not.toBeInTheDocument();
    await expect.element(commentInput).not.toBeInTheDocument();
    expect(getPostComments).not.toHaveBeenCalled();
  });

  test('shows spinner on pending comments loading request', async () => {
    // Arrange
    let resolveCommentsLoading!: (comments: CommentModel[]) => void;

    vi.mocked(getPostComments).mockReturnValue(new Promise<CommentModel[]>((resolve) => {
      resolveCommentsLoading = resolve;
    }));

    const commentsLoadingLabelText = i18next.t(($) => $.post.comments.loading, { ns: 'posts' });
    const screen = await renderWithQueryClient(
      <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const loadingSpinner = screen.getByRole('progressbar');
    const commentsLoadingLabel = screen.getByText(commentsLoadingLabelText);
    const commentText = screen.getByText(testComment.text);

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(loadingSpinner).toBeVisible();
    await expect.element(commentsLoadingLabel).toBeVisible();
    await expect.element(commentText).not.toBeInTheDocument();

    // Act
    resolveCommentsLoading([testComment]);

    // Assert
    await expect.element(loadingSpinner).not.toBeInTheDocument();
    await expect.element(commentsLoadingLabel).not.toBeInTheDocument();
    await expect.element(commentText).toBeVisible();
  });
});
