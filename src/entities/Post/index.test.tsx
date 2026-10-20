import { beforeEach, describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { useAuth } from '@/entities/auth/useAuth';
import { createComment } from '@/entities/Comment/api/createComment';
import { deleteComment } from '@/entities/Comment/api/deleteComment';
import { getPostComments } from '@/entities/Comment/api/getPostComments';
import { getUserById } from '@/entities/User/api/getUserById';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import AlertStack from '@/shared/ui/Alert/AlertStack';
import { testComment, testOtherComment } from '@/test/commentFixtures';
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
    const screen = await renderWithQueryClient(
      <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
    );
    const commentsToggleButton = screen.getByRole('button', { name: commentsToggleButtonLabel });
    const commentText = screen.getByText(testComment.text);

    // Assert
    await expect.element(commentText).not.toBeInTheDocument();
    expect(getPostComments).not.toHaveBeenCalled();

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(commentText).toBeVisible();
    expect(getPostComments).toHaveBeenCalledOnce();
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

  test('creates a new comment and opens the comments section with success alert', async () => {
    // Arrange
    vi.mocked(createComment).mockResolvedValue(testComment);
    const successAlertMessage = i18next.t(($) => $.comment.create.alert.success, { ns: 'posts' });
    const screen = await renderWithQueryClient(
      <>
        <Post post={testPost} author={currentUser} isLiked={false} isLikeDisabled={false} />
        <AlertStack />
      </>
    );
    const commentText = screen.getByText(testComment.text);
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel });
    const commentSubmitButton = screen.getByRole('button', { name: commentSubmitButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Assert
    await expect.element(commentText).not.toBeInTheDocument();

    // Act
    await commentInput.fill(testComment.text);
    await commentSubmitButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    await expect.element(commentText).toBeVisible();
    await expect.element(commentInput).toHaveValue('');
    expect(createComment).toHaveBeenCalledOnce();
  });

  test('deletes current user\'s comment with success alert without clearing the comments section', async () => {
    // Arrange
    vi.mocked(getPostComments).mockResolvedValue([testComment, testOtherComment]);
    vi.mocked(getUserById)
      .mockResolvedValueOnce(testCurrentPublicUser)
      .mockResolvedValueOnce(testOtherPublicUser);
    const successAlertMessage = i18next.t(($) => $.comment.delete.alert.success, { ns: 'posts' });
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

    // Act
    await commentsToggleButton.click();

    // Assert
    await expect.element(currentUserCommentText).toBeVisible();
    await expect.element(otherUserCommentText).toBeVisible();
    expect(getUserById).toHaveBeenCalledTimes(2);

    // Act
    await deleteCommentButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    await expect.element(currentUserCommentText).not.toBeInTheDocument();
    await expect.element(otherUserCommentText).toBeVisible();
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
});
