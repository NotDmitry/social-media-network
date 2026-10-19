import { beforeEach, describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { createPost } from '@/entities/Post/api/createPost';
import type { PostCreationPayload, PostModel } from '@/entities/Post/types';
import AlertStack from '@/shared/ui/Alert/AlertStack';
import { uploadImage } from '@/shared/api/uploadImage';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import { testPost } from '@/test/postFixture';
import { renderWithQueryClient } from '@/test/renderWithQueryClient';
import CreatePostModal from './index';
import type { CreatePostModalProps } from './index';

vi.mock(import('@/entities/Post/api/createPost'), () => ({
  createPost: vi.fn(),
}));

vi.mock(import('@/shared/api/uploadImage'), () => ({
  uploadImage: vi.fn(),
}));

describe('CreatePostModal', () => {
  const ACCEPTED_POST_FILE_TYPES = ['image/png', 'image/jpeg'];
  const MAX_POST_FILE_SIZE = 10 * 1024 * 1024;

  const postTitleInputLabel = i18next.t(($) => $.createPost.input.title.label, { ns: 'posts' });
  const postDescriptionInputLabel = i18next.t(($) => $.createPost.input.description.label, { ns: 'posts' });
  const closeButtonLabel = i18next.t(($) => $.createPost.close, { ns: 'posts' });
  const fileInputSelectLabel = i18next.t(($) => $.createPost.input.file.select, { ns: 'posts' });
  const submitButtonLabel = i18next.t(($) => $.createPost.button.default, { ns: 'posts' });

  const mockOnClose = vi.fn();

  const defaultProps: CreatePostModalProps = {
    isOpen: true,
    initialDescription: '',
    maxFileSize: MAX_POST_FILE_SIZE,
    acceptedFileTypes: ACCEPTED_POST_FILE_TYPES,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    mockOnClose.mockReset();
    vi.mocked(createPost).mockReset();
    vi.mocked(uploadImage).mockReset();
    useAlertStore.setState({ alerts: [] });
  });

  test('calls onClose when the close button is clicked', async () => {
    // Arrange
    const screen = await renderWithQueryClient(
      <CreatePostModal {...defaultProps} />
    );
    const closeButton = screen.getByRole('button', { name: closeButtonLabel });

    // Act
    await closeButton.click();

    // Assert
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  test('is hidden in closed state', async () => {
    // Arrange
    const screen = await renderWithQueryClient(
      <CreatePostModal {...defaultProps} isOpen={false} />
    );
    const createPostModal = screen.getByRole('dialog', { includeHidden: true });

    // Assert
    await expect.element(createPostModal).toBeInTheDocument();
    await expect.element(createPostModal).not.toBeVisible();
  });

  test('opens with the provided initial description', async () => {
    // Arrange
    const screen = await renderWithQueryClient(
      <CreatePostModal {...defaultProps} initialDescription={testPost.content} />
    );
    const createPostModal = screen.getByRole('dialog', { includeHidden: true });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });

    // Assert
    await expect.element(createPostModal).toBeVisible();
    await expect.element(postDescriptionInput).toHaveValue(testPost.content);
  });

  test('rejects an empty submission with visible errors', async () => {
    // Arrange
    const screen = await renderWithQueryClient(
      <CreatePostModal {...defaultProps} />
    );
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const postTitleErrorMessage = i18next.t(
      ($) => $.createPost.input.title.validation.required, { ns: 'posts' }
    );
    const postDescriptionErrorMessage = i18next.t(
      ($) => $.createPost.input.description.validation.required, { ns: 'posts' }
    );
    const visiblePostTitleErrorMessage = screen.getByText(postTitleErrorMessage);
    const visiblePostDescriptionErrorMessage = screen.getByText(postDescriptionErrorMessage);

    // Act
    await submitButton.click();

    // Assert
    await expect.element(visiblePostTitleErrorMessage).toBeVisible();
    await expect.element(visiblePostDescriptionErrorMessage).toBeVisible();
    expect(createPost).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('prevents submission if selected file is of unsupported type', async () => {
    // Arrange
    const screen = await renderWithQueryClient(
      <CreatePostModal {...defaultProps} />
    );
    const unsupportedFile = new File([new Uint8Array(16)], 'notes.midi', { type: 'audio/midi' });
    const fileUnsupportedErrorMessage = i18next.t(($) => $.createPost.input.file.unsupported, { ns: 'posts' });
    const visibleFileUnsupportedErrorMessage = screen.getByText(fileUnsupportedErrorMessage);
    const fileInput = screen.getByLabelText(new RegExp(fileInputSelectLabel));
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });

    // Act
    await fileInput.upload(unsupportedFile);

    // Assert
    await expect.element(visibleFileUnsupportedErrorMessage).toBeVisible();
    await expect.element(submitButton).toBeDisabled();
  });

  test('prevents submission if selected file is too large', async () => {
    // Arrange
    const screen = await renderWithQueryClient(
      <CreatePostModal {...defaultProps} maxFileSize={4} />
    );
    const oversizedFile = new File([new Uint8Array(16)], 'supported.png', { type: 'image/png' });
    const fileTooLargeErrorMessage = i18next.t(($) => $.createPost.input.file.tooLarge, { ns: 'posts' });
    const visibleFileTooLargeErrorMessage = screen.getByText(fileTooLargeErrorMessage);
    const fileInput = screen.getByLabelText(new RegExp(fileInputSelectLabel));
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });

    // Act
    await fileInput.upload(oversizedFile);

    // Assert
    await expect.element(visibleFileTooLargeErrorMessage).toBeVisible();
    await expect.element(submitButton).toBeDisabled();
  });

  test('creates a post without image and shows alert on success', async () => {
    // Arrange
    const expectedAlertMessage = i18next.t(($) => $.createPost.alert.success, { ns: 'posts' });
    const expectedPayload: PostCreationPayload = {
      title: testPost.title,
      content: testPost.content,
    };
    vi.mocked(createPost).mockResolvedValue(testPost);
    const screen = await renderWithQueryClient(
      <>
        <CreatePostModal {...defaultProps} />
        <AlertStack />
      </>
    );
    const postTitleInput = screen.getByRole('textbox', { name: postTitleInputLabel });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const alert = screen.getByText(expectedAlertMessage);

    // Act
    await postTitleInput.fill(testPost.title);
    await postDescriptionInput.fill(testPost.content);
    await submitButton.click();

    // Assert
    await expect.element(alert).toBeVisible();
    expect(createPost).toHaveBeenCalledExactlyOnceWith(expectedPayload);
    expect(uploadImage).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  test('creates a post with image and shows alert on success', async () => {
    // Arrange
    const expectedAlertMessage = i18next.t(($) => $.createPost.alert.success, { ns: 'posts' });
    const imageFile = new File([new Uint8Array(16)], 'test_post.png', { type: 'image/png' });
    const imageFileUrl = 'images/post.png';
    const expectedPayload: PostCreationPayload = {
      title: testPost.title,
      content: testPost.content,
      image: imageFileUrl,
    };
    vi.mocked(createPost).mockResolvedValue({ ...testPost, image: imageFileUrl });
    vi.mocked(uploadImage).mockResolvedValue({ url: imageFileUrl });
    const screen = await renderWithQueryClient(
      <>
        <CreatePostModal {...defaultProps} />
        <AlertStack />
      </>
    );
    const postTitleInput = screen.getByRole('textbox', { name: postTitleInputLabel });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    const fileInput = screen.getByLabelText(new RegExp(fileInputSelectLabel));
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const alert = screen.getByText(expectedAlertMessage);
    const visibleFileName = screen.getByText(imageFile.name);

    // Act
    await postTitleInput.fill(testPost.title);
    await postDescriptionInput.fill(testPost.content);
    await fileInput.upload(imageFile);
    await expect.element(visibleFileName).toBeVisible();
    await submitButton.click();

    // Assert
    await expect.element(alert).toBeVisible();
    expect(uploadImage).toHaveBeenCalledExactlyOnceWith(imageFile);
    expect(createPost).toHaveBeenCalledExactlyOnceWith(expectedPayload);
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  test('disables the form during pending post creation request', async () => {
    // Arrange
    let resolvePendingPostCreation!: (post: PostModel) => void;

    vi.mocked(createPost).mockReturnValue(new Promise<PostModel>((resolve) => {
      resolvePendingPostCreation = resolve;
    }));

    const submitButtonPendingLabel = i18next.t(($) => $.createPost.button.pending, { ns: 'posts' });
    const screen = await renderWithQueryClient(
      <CreatePostModal {...defaultProps} />
    );
    const postTitleInput = screen.getByRole('textbox', { name: postTitleInputLabel });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    const closeButton = screen.getByRole('button', { name: closeButtonLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const submitButtonPending = screen.getByRole('button', { name: submitButtonPendingLabel });

    // Act
    await postTitleInput.fill(testPost.title);
    await postDescriptionInput.fill(testPost.content);
    await submitButton.click();

    // Assert
    await expect.element(postTitleInput).toBeDisabled();
    await expect.element(postDescriptionInput).toBeDisabled();
    await expect.element(closeButton).toBeDisabled();
    await expect.element(submitButtonPending).toBeDisabled();
    expect(createPost).toHaveBeenCalledOnce();

    // Act
    resolvePendingPostCreation(testPost);

    // Assert
    await expect.element(postTitleInput).toBeEnabled();
    await expect.element(postDescriptionInput).toBeEnabled();
    await expect.element(closeButton).toBeEnabled();
    await expect.element(submitButton).toBeEnabled();
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  test('doesn\'t close and shows general error alert on failed submission', async () => {
    // Arrange
    const expectedAlertMessage = i18next.t(($) => $.createPost.alert.error, { ns: 'posts' });
    vi.mocked(createPost).mockRejectedValue(new Error('Network connection lost'));
    const screen = await renderWithQueryClient(
      <>
        <CreatePostModal {...defaultProps} />
        <AlertStack />
      </>
    );
    const createPostModal = screen.getByRole('dialog', { includeHidden: true });
    const postTitleInput = screen.getByRole('textbox', { name: postTitleInputLabel });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const alert = screen.getByText(expectedAlertMessage);

    // Act
    await postTitleInput.fill(testPost.title);
    await postDescriptionInput.fill(testPost.content);
    await submitButton.click();

    // Assert
    await expect.element(alert).toBeVisible();
    await expect.element(createPostModal).toBeVisible();
    await expect.element(postTitleInput).toHaveValue(testPost.title);
    await expect.element(postDescriptionInput).toHaveValue(testPost.content);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('accepts a title of exactly 80 characters', async () => {
    // Arrange
    const testPostTitle = '1'.repeat(80);
    const successAlertMessage = i18next.t(($) => $.createPost.alert.success, { ns: 'posts' });
    const expectedPayload: PostCreationPayload = {
      title: testPostTitle,
      content: testPost.content,
    };
    vi.mocked(createPost).mockResolvedValue(testPost);
    const screen = await renderWithQueryClient(
      <>
        <CreatePostModal {...defaultProps} />
        <AlertStack />
      </>
    );
    const postTitleInput = screen.getByRole('textbox', { name: postTitleInputLabel });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Act
    await postTitleInput.fill(testPostTitle);
    await postDescriptionInput.fill(testPost.content);
    await submitButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    expect(createPost).toHaveBeenCalledExactlyOnceWith(expectedPayload);
  });

  test('rejects a title of 81 characters with visible error', async () => {
    // Arrange
    const testPostTitle = '1'.repeat(81);
    const postTitleMaxLengthErrorMessage = i18next.t(
      ($) => $.createPost.input.title.validation.maxLength, { ns: 'posts' }
    );
    const screen = await renderWithQueryClient(
      <CreatePostModal {...defaultProps} />
    );
    const postTitleInput = screen.getByRole('textbox', { name: postTitleInputLabel });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const visiblePostTitleMaxLengthErrorMessage = screen.getByText(postTitleMaxLengthErrorMessage);

    // Act
    await postTitleInput.fill(testPostTitle);
    await postDescriptionInput.fill(testPost.content);
    await submitButton.click();

    // Assert
    await expect.element(visiblePostTitleMaxLengthErrorMessage).toBeVisible();
    expect(createPost).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('accepts a description of exactly 500 characters', async () => {
    // Arrange
    const testPostDescription = '1'.repeat(500);
    const successAlertMessage = i18next.t(($) => $.createPost.alert.success, { ns: 'posts' });
    const expectedPayload: PostCreationPayload = {
      title: testPost.title,
      content: testPostDescription,
    };
    vi.mocked(createPost).mockResolvedValue(testPost);
    const screen = await renderWithQueryClient(
      <>
        <CreatePostModal {...defaultProps} />
        <AlertStack />
      </>
    );
    const postTitleInput = screen.getByRole('textbox', { name: postTitleInputLabel });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Act
    await postTitleInput.fill(testPost.title);
    await postDescriptionInput.fill(testPostDescription);
    await submitButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    expect(createPost).toHaveBeenCalledExactlyOnceWith(expectedPayload);
  });

  test('rejects a description of 501 characters with visible error', async () => {
    // Arrange
    const testPostDescription = '1'.repeat(501);
    const postDescriptionMaxLengthErrorMessage = i18next.t(
      ($) => $.createPost.input.description.validation.maxLength, { ns: 'posts' }
    );
    const screen = await renderWithQueryClient(
      <CreatePostModal {...defaultProps} />
    );
    const postTitleInput = screen.getByRole('textbox', { name: postTitleInputLabel });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const visiblePostDescriptionMaxLengthErrorMessage = screen.getByText(postDescriptionMaxLengthErrorMessage);

    // Act
    await postTitleInput.fill(testPost.title);
    await postDescriptionInput.fill(testPostDescription);
    await submitButton.click();

    // Assert
    await expect.element(visiblePostDescriptionMaxLengthErrorMessage).toBeVisible();
    expect(createPost).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
