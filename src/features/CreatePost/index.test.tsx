import { beforeEach, describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import i18next from 'i18next';
import { createPost } from '@/entities/Post/api/createPost';
import type { PostCreationPayload, PostModel } from '@/entities/Post/types';
import { currentUser } from '@/test/currentUserFixture';
import { testPost } from '@/test/postFixture';
import { renderWithQueryClient } from '@/test/renderWithQueryClient';
import CreatePost from './index';

vi.mock(import('@/entities/Post/api/createPost'), () => ({
  createPost: vi.fn(),
}));

describe('CreatePost', () => {
  const quickPostSubmitButtonLabel = i18next.t(($) => $.quickPost.button.default, { ns: 'homePage' });
  const postTitleInputLabel = i18next.t(($) => $.createPost.input.title.label, { ns: 'posts' });
  const postDescriptionInputLabel = i18next.t(($) => $.createPost.input.description.label, { ns: 'posts' });
  const closeModalButtonLabel = i18next.t(($) => $.createPost.close, { ns: 'posts' });
  const createPostButtonLabel = i18next.t(($) => $.createPost.button.default, { ns: 'posts' });

  beforeEach(() => {
    vi.mocked(createPost).mockReset();
  });

  test('opens post creation modal with initial description from quick post form', async () => {
    // Arrange
    const postDescription = 'Some post description';
    const screen = await renderWithQueryClient(<CreatePost currentUser={currentUser} />);
    const quickPostInput = screen.getByRole('textbox');
    const quickPostSubmitButton = screen.getByRole('button', { name: quickPostSubmitButtonLabel });
    const createPostModal = screen.getByRole('dialog', { includeHidden: true });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    await expect.element(createPostModal).not.toBeVisible();

    // Act
    await quickPostInput.fill(postDescription);
    await quickPostSubmitButton.click();

    // Assert
    await expect.element(createPostModal).toBeVisible();
    await expect.element(postDescriptionInput).toHaveValue(postDescription);
  });

  test('closes post creation modal when close button is clicked', async () => {
    // Arrange
    const screen = await renderWithQueryClient(<CreatePost currentUser={currentUser} />);
    const quickPostSubmitButton = screen.getByRole('button', { name: quickPostSubmitButtonLabel });
    const createPostModal = screen.getByRole('dialog', { includeHidden: true });
    const closeModalButton = screen.getByRole('button', { name: closeModalButtonLabel });

    // Act
    await quickPostSubmitButton.click();

    // Assert
    await expect.element(createPostModal).toBeVisible();

    // Act
    await closeModalButton.click();

    // Assert
    await expect.element(createPostModal).not.toBeVisible();
  });

  test('closes post creation modal when Escape key is pressed', async () => {
    // Arrange
    const screen = await renderWithQueryClient(<CreatePost currentUser={currentUser} />);
    const quickPostSubmitButton = screen.getByRole('button', { name: quickPostSubmitButtonLabel });
    const createPostModal = screen.getByRole('dialog', { includeHidden: true });

    // Act
    await quickPostSubmitButton.click();

    // Assert
    await expect.element(createPostModal).toBeVisible();

    // Act
    await userEvent.keyboard('{Escape}');

    // Assert
    await expect.element(createPostModal).not.toBeVisible();
  });

  test('doesn\'t close modal on Escape key press during pending request', async () => {
    // Arrange
    let resolvePendingPostCreation!: (post: PostModel) => void;

    vi.mocked(createPost).mockReturnValue(new Promise<PostModel>((resolve) => {
      resolvePendingPostCreation = resolve;
    }));

    const pendingCreatePostButtonLabel = i18next.t(($) => $.createPost.button.pending, { ns: 'posts' });
    const screen = await renderWithQueryClient(<CreatePost currentUser={currentUser} />);
    const quickPostSubmitButton = screen.getByRole('button', { name: quickPostSubmitButtonLabel });
    const createPostModal = screen.getByRole('dialog', { includeHidden: true });
    const postTitleInput = screen.getByRole('textbox', { name: postTitleInputLabel });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    const createPostButton = screen.getByRole('button', { name: createPostButtonLabel });
    const pendingCreatePostButton = screen.getByRole('button', { name: pendingCreatePostButtonLabel });

    // Act
    await quickPostSubmitButton.click();

    // Assert
    await expect.element(createPostModal).toBeVisible();

    // Act
    await postTitleInput.fill(testPost.title);
    await postDescriptionInput.fill(testPost.content);
    await createPostButton.click();

    // Assert
    await expect.element(pendingCreatePostButton).toBeDisabled();

    // Act
    await userEvent.keyboard('{Escape}');

    // Assert
    await expect.element(createPostModal).toBeVisible();

    // Act
    resolvePendingPostCreation(testPost);

    // Assert
    await expect.element(createPostModal).not.toBeVisible();
    expect(createPost).toHaveBeenCalledOnce();
  });

  test('closes post creation modal after a successful submission', async () => {
    // Arrange
    const expectedPayload: PostCreationPayload = {
      title: testPost.title,
      content: testPost.content,
    };
    vi.mocked(createPost).mockResolvedValue({ ...testPost, authorId: currentUser.id });
    const screen = await renderWithQueryClient(<CreatePost currentUser={currentUser} />);
    const quickPostSubmitButton = screen.getByRole('button', { name: quickPostSubmitButtonLabel });
    const createPostModal = screen.getByRole('dialog', { includeHidden: true });
    const postTitleInput = screen.getByRole('textbox', { name: postTitleInputLabel });
    const postDescriptionInput = screen.getByRole('textbox', { name: postDescriptionInputLabel });
    const createPostButton = screen.getByRole('button', { name: createPostButtonLabel });

    // Act
    await quickPostSubmitButton.click();

    // Assert
    await expect.element(createPostModal).toBeVisible();

    // Act
    await postTitleInput.fill(testPost.title);
    await postDescriptionInput.fill(testPost.content);
    await createPostButton.click();

    // Assert
    await expect.element(createPostModal).not.toBeVisible();
    expect(createPost).toHaveBeenCalledExactlyOnceWith(expectedPayload);
  });
});
