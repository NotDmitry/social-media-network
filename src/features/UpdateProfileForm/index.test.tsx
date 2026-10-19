import { beforeEach, describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import i18next from 'i18next';
import { useAuth } from '@/entities/auth/useAuth';
import type { UpdateEmailPayload } from '@/entities/auth/types';
import type { UpdateProfilePayload } from '@/entities/User/types';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import { uploadImage } from '@/shared/api/uploadImage';
import AlertStack from '@/shared/ui/Alert/AlertStack';
import { currentUser } from '@/test/currentUserFixture';
import UpdateProfileForm from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

vi.mock(import('@/shared/api/uploadImage'), () => ({
  uploadImage: vi.fn(),
}));

describe('UpdateProfileForm', () => {
  const avatarInputLabel = i18next.t(($) => $.update.input.avatar.label, { ns: 'profile' });
  const usernameInputLabel = i18next.t(($) => $.update.input.username.label, { ns: 'profile' });
  const emailInputLabel = i18next.t(($) => $.update.input.email.label, { ns: 'profile' });
  const descriptionInputLabel = i18next.t(($) => $.update.input.description.label, { ns: 'profile' });
  const saveButtonLabel = i18next.t(($) => $.update.button.default, { ns: 'profile' });
  const closeConfirmationButtonLabel = i18next.t(($) => $.update.confirmation.close, { ns: 'profile' });
  const passwordInputLabel = i18next.t(($) => $.update.confirmation.input.password.label, { ns: 'profile' });
  const confirmButtonLabel = i18next.t(($) => $.update.confirmation.button.default, { ns: 'profile' });

  const testUsername = '@test_username';
  const testEmail = 'test_user@example.com';
  const testDescription = 'Some new text description';
  const testCurrentPassword = '12345678';

  const mockOnSubmit = vi.fn();
  const mockUseAuthResult = {
    updateEmail: vi.fn(),
    updateProfile: vi.fn(),
  };

  beforeEach(() => {
    mockOnSubmit.mockReset();
    mockUseAuthResult.updateEmail.mockReset();
    mockUseAuthResult.updateProfile.mockReset();
    vi.mocked(useAuth, { partial: true }).mockReturnValue(mockUseAuthResult);
    vi.mocked(uploadImage).mockReset();
    useAlertStore.setState({ alerts: [] });
  });

  test('preloads current user\'s saved profile fields', async () => {
    // Arrange
    const screen = await render(<UpdateProfileForm user={currentUser} />);
    const usernameInput = screen.getByRole('textbox', { name: usernameInputLabel });
    const emailInput = screen.getByRole('textbox', { name: emailInputLabel });
    const descriptionInput = screen.getByRole('textbox', { name: descriptionInputLabel });

    // Assert
    await expect.element(usernameInput).toHaveValue(currentUser.username);
    await expect.element(emailInput).toHaveValue(currentUser.email);
    await expect.element(descriptionInput).toHaveValue('');
  });

  test('doesn\'t submit unchanged profile fields', async () => {
    // Arrange
    const screen = await render(<UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />);
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });

    // Act
    await saveButton.click();

    // Assert
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateEmail).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateProfile).not.toHaveBeenCalled();
  });

  test('rejects an empty username submission with a visible error', async () => {
    // Arrange
    const usernameRequiredErrorMessage = i18next.t(($) => $.input.username.validation.required);
    const screen = await render(<UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />);
    const visibleUsernameRequiredErrorMessage = screen.getByText(usernameRequiredErrorMessage);
    const usernameInput = screen.getByRole('textbox', { name: usernameInputLabel });
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });

    // Act
    await usernameInput.fill('');
    await saveButton.click();

    // Assert
    await expect.element(visibleUsernameRequiredErrorMessage).toBeVisible();
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateProfile).not.toHaveBeenCalled();
  });

  test('prevents submission of a malformed email address', async () => {
    // Arrange
    const badEmail = 'not-email-at-all';
    const screen = await render(<UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />);
    const emailInput = screen.getByRole('textbox', { name: emailInputLabel });
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });

    // Act
    await emailInput.fill(badEmail);
    await saveButton.click();

    // Assert
    await expect.element(emailInput).toBeInvalid();
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateEmail).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateProfile).not.toHaveBeenCalled();
  });

  test('prevents submission if selected avatar file is of unsupported type', async () => {
    // Arrange
    const unsupportedFile = new File([new Uint8Array(16)], 'notes.midi', { type: 'audio/midi' });
    const avatarErrorMessage = i18next.t(($) => $.update.input.avatar.error, { ns: 'profile' });
    const screen = await render(<UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />);
    const visibleAvatarErrorMessage = screen.getByText(avatarErrorMessage);
    const avatarInput = screen.getByLabelText(avatarInputLabel);
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });

    // Act
    await avatarInput.upload(unsupportedFile);
    await saveButton.click();

    // Assert
    await expect.element(visibleAvatarErrorMessage).toBeVisible();
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateProfile).not.toHaveBeenCalled();
    expect(uploadImage).not.toHaveBeenCalled();
  });

  test('submits only changed public profile fields and shows success alert', async () => {
    // Arrange
    const successAlertMessage = i18next.t(($) => $.update.alert.success, { ns: 'profile' });
    const expectedPayload: UpdateProfilePayload = {
      username: testUsername,
      description: testDescription,
    };
    const screen = await render(
      <>
        <UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />
        <AlertStack />
      </>
    );
    const usernameInput = screen.getByRole('textbox', { name: usernameInputLabel });
    const descriptionInput = screen.getByRole('textbox', { name: descriptionInputLabel });
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Act
    await usernameInput.fill(testUsername);
    await descriptionInput.fill(testDescription);
    await saveButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockUseAuthResult.updateEmail).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateProfile).toHaveBeenCalledExactlyOnceWith(expectedPayload);
  });

  test('submits changed public profile fields and email with alert after password confirmation', async () => {
    // Arrange
    const successAlertMessage = i18next.t(($) => $.update.alert.success, { ns: 'profile' });
    const expectedEmailPayload: UpdateEmailPayload = {
      email: testEmail,
      currentPassword: testCurrentPassword,
    };
    const expectedProfilePayload: UpdateProfilePayload = {
      username: testUsername,
    };
    const screen = await render(
      <>
        <UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />
        <AlertStack />
      </>
    );
    const usernameInput = screen.getByRole('textbox', { name: usernameInputLabel });
    const emailInput = screen.getByRole('textbox', { name: emailInputLabel });
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });
    const confirmationModal = screen.getByRole('dialog', { includeHidden: true });
    const passwordInput = confirmationModal.getByRole('textbox', { name: passwordInputLabel });
    const confirmButton = confirmationModal.getByRole('button', { name: confirmButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Act
    await usernameInput.fill(testUsername);
    await emailInput.fill(testEmail);
    await saveButton.click();

    // Assert
    await expect.element(confirmationModal).toBeVisible();
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateEmail).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateProfile).not.toHaveBeenCalled();

    // Act
    await passwordInput.fill(testCurrentPassword);
    await confirmButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    await expect.element(confirmationModal).toBeInTheDocument();
    await expect.element(confirmationModal).not.toBeVisible();
    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockUseAuthResult.updateEmail).toHaveBeenCalledExactlyOnceWith(expectedEmailPayload);
    expect(mockUseAuthResult.updateProfile).toHaveBeenCalledExactlyOnceWith(expectedProfilePayload);
  });

  test('closes password confirmation when the close button is clicked', async () => {
    // Arrange
    const screen = await render(<UpdateProfileForm user={currentUser} />);
    const emailInput = screen.getByRole('textbox', { name: emailInputLabel });
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });
    const confirmationModal = screen.getByRole('dialog', { includeHidden: true });
    const closeConfirmationButton = screen.getByRole('button', { name: closeConfirmationButtonLabel });

    // Act
    await emailInput.fill(testEmail);
    await saveButton.click();

    // Assert
    await expect.element(confirmationModal).toBeVisible();

    // Act
    await closeConfirmationButton.click();

    // Assert
    await expect.element(confirmationModal).toBeInTheDocument();
    await expect.element(confirmationModal).not.toBeVisible();
  });

  test('closes password confirmation when Escape key is pressed', async () => {
    // Arrange
    const screen = await render(<UpdateProfileForm user={currentUser} />);
    const emailInput = screen.getByRole('textbox', { name: emailInputLabel });
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });
    const confirmationModal = screen.getByRole('dialog', { includeHidden: true });

    // Act
    await emailInput.fill(testEmail);
    await saveButton.click();

    // Assert
    await expect.element(confirmationModal).toBeVisible();

    // Act
    await userEvent.keyboard('{Escape}');

    // Assert
    await expect.element(confirmationModal).toBeInTheDocument();
    await expect.element(confirmationModal).not.toBeVisible();
  });

  test('shows email-taken error and closes confirmation without field reset', async () => {
    // Arrange
    mockUseAuthResult.updateEmail.mockRejectedValue(new BackendResponseError({
      message: 'Email is already in use',
      status: 409,
      code: 'EMAIL_TAKEN',
    }));
    const emailTakenErrorMessage = i18next.t(($) => $.update.input.email.validation.taken, { ns: 'profile' });
    const screen = await render(<UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />);
    const visibleEmailTakenErrorMessage = screen.getByText(emailTakenErrorMessage);
    const emailInput = screen.getByRole('textbox', { name: emailInputLabel });
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });
    const confirmationModal = screen.getByRole('dialog', { includeHidden: true });
    const passwordInput = confirmationModal.getByRole('textbox', { name: passwordInputLabel });
    const confirmButton = confirmationModal.getByRole('button', { name: confirmButtonLabel });

    // Act
    await emailInput.fill(testEmail);
    await saveButton.click();

    // Assert
    await expect.element(confirmationModal).toBeVisible();

    // Act
    await passwordInput.fill(testCurrentPassword);
    await confirmButton.click();

    // Assert
    await expect.element(visibleEmailTakenErrorMessage).toBeVisible();
    await expect.element(emailInput).toHaveValue(testEmail);
    await expect.element(confirmationModal).toBeInTheDocument();
    await expect.element(confirmationModal).not.toBeVisible();
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateEmail).toHaveBeenCalledOnce();
    expect(mockUseAuthResult.updateProfile).not.toHaveBeenCalled();
  });

  test('disables profile fields during a pending update request', async () => {
    // Arrange
    let resolvePendingUpdate!: () => void;

    mockUseAuthResult.updateProfile.mockReturnValue(new Promise<void>((resolve) => {
      resolvePendingUpdate = resolve;
    }));

    const pendingSaveButtonLabel = i18next.t(($) => $.update.button.pending, { ns: 'profile' });
    const screen = await render(<UpdateProfileForm user={currentUser} />);
    const avatarInput = screen.getByLabelText(avatarInputLabel);
    const usernameInput = screen.getByRole('textbox', { name: usernameInputLabel });
    const emailInput = screen.getByRole('textbox', { name: emailInputLabel });
    const descriptionInput = screen.getByRole('textbox', { name: descriptionInputLabel });
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });
    const pendingSaveButton = screen.getByRole('button', { name: pendingSaveButtonLabel });

    // Act
    await usernameInput.fill(testUsername);
    await saveButton.click();

    // Assert
    await expect.element(avatarInput).toBeDisabled();
    await expect.element(usernameInput).toBeDisabled();
    await expect.element(emailInput).toBeDisabled();
    await expect.element(descriptionInput).toBeDisabled();
    await expect.element(pendingSaveButton).toBeDisabled();

    // Act
    resolvePendingUpdate();

    // Assert
    await expect.element(avatarInput).toBeEnabled();
    await expect.element(usernameInput).toBeEnabled();
    await expect.element(emailInput).toBeEnabled();
    await expect.element(descriptionInput).toBeEnabled();
    await expect.element(saveButton).toBeEnabled();
  });

  test('shows error alert on failed image upload request', async () => {
    // Arrange
    const errorAlertMessage = i18next.t(($) => $.update.alert.error, { ns: 'profile' });
    const avatarFile = new File([new Uint8Array(16)], 'avatar.png', { type: 'image/png' });
    vi.mocked(uploadImage).mockRejectedValue(new Error('Network connection lost'));
    const screen = await render(
      <>
        <UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />
        <AlertStack />
      </>
    );
    const avatarInput = screen.getByLabelText(avatarInputLabel);
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });
    const errorAlert = screen.getByText(errorAlertMessage);

    // Act
    await avatarInput.upload(avatarFile);
    await saveButton.click();

    // Assert
    await expect.element(errorAlert).toBeVisible();
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateProfile).not.toHaveBeenCalled();
  });

  test('uploads selected avatar and saves the returned URL', async () => {
    // Arrange
    const avatarFile = new File([new Uint8Array(16)], 'avatar.png', { type: 'image/png' });
    const uploadedAvatarUrl = '/images/avatar.png';
    const expectedPayload: UpdateProfilePayload = {
      profileImage: uploadedAvatarUrl
    };
    const successAlertMessage = i18next.t(($) => $.update.alert.success, { ns: 'profile' });
    vi.mocked(uploadImage).mockResolvedValue({ url: uploadedAvatarUrl });
    const screen = await render(
      <>
        <UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />
        <AlertStack />
      </>
    );
    const avatarInput = screen.getByLabelText(avatarInputLabel);
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Act
    await avatarInput.upload(avatarFile);
    await saveButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockUseAuthResult.updateProfile).toHaveBeenCalledExactlyOnceWith(expectedPayload);
    expect(uploadImage).toHaveBeenCalledExactlyOnceWith(avatarFile);
  });

  test('accepts a description of exactly 200 characters', async () => {
    // Arrange
    const testDescription = '1'.repeat(200);
    const successAlertMessage = i18next.t(($) => $.update.alert.success, { ns: 'profile' });
    const expectedPayload: UpdateProfilePayload = {
      description: testDescription
    };
    const screen = await render(
      <>
        <UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />
        <AlertStack />
      </>
    );
    const descriptionInput = screen.getByRole('textbox', { name: descriptionInputLabel });
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Act
    await descriptionInput.fill(testDescription);
    await saveButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockUseAuthResult.updateProfile).toHaveBeenCalledExactlyOnceWith(expectedPayload);
  });

  test('rejects a description of 201 characters with visible error', async () => {
    // Arrange
    const testDescription = '1'.repeat(201);
    const descriptionMaxLengthErrorMessage = i18next.t(
      ($) => $.update.input.description.validation.maxLength, { ns: 'profile' }
    );
    const screen = await render(<UpdateProfileForm user={currentUser} onSubmit={mockOnSubmit} />);
    const visibleDescriptionMaxLengthErrorMessage = screen.getByText(descriptionMaxLengthErrorMessage);
    const descriptionInput = screen.getByRole('textbox', { name: descriptionInputLabel });
    const saveButton = screen.getByRole('button', { name: saveButtonLabel });

    // Act
    await descriptionInput.fill(testDescription);
    await saveButton.click();

    // Assert
    await expect.element(visibleDescriptionMaxLengthErrorMessage).toBeVisible();
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockUseAuthResult.updateProfile).not.toHaveBeenCalled();
  });
});
