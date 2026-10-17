import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import i18next from 'i18next';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import AlertStack from '@/shared/ui/Alert/AlertStack';
import PasswordConfirmationModal from './index';

describe('PasswordConfirmationModal', () => {
  const passwordInputLabel = i18next.t(($) => $.update.confirmation.input.password.label, { ns: 'profile' });
  const closeButtonLabel = i18next.t(($) => $.update.confirmation.close, { ns: 'profile' });
  const submitButtonLabel = i18next.t(($) => $.update.confirmation.button.default, { ns: 'profile' });
  const currentPassword = '12345678';

  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnClose.mockReset();
    mockOnSubmit.mockReset();
    useAlertStore.setState({ alerts: [] });
  });

  test('calls onClose when the close button is clicked', async () => {
    // Arrange
    const screen = await render(
      <PasswordConfirmationModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    const closeButton = screen.getByRole('button', { name: closeButtonLabel });

    // Act
    await closeButton.click();

    // Assert
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  test('is hidden in closed state', async () => {
    // Arrange
    const screen = await render(
      <PasswordConfirmationModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    const confirmationModal = screen.getByRole('dialog', { includeHidden: true });

    // Assert
    await expect.element(confirmationModal).toBeInTheDocument();
    await expect.element(confirmationModal).not.toBeVisible();
  });

  test('rejects an empty password with a visible error', async () => {
    // Arrange
    const screen = await render(
      <PasswordConfirmationModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const passwordRequiredErrorMessage = i18next.t(
      ($) => $.update.confirmation.input.password.validation.required, { ns: 'profile' }
    );
    const visiblePasswordRequiredErrorMessage = screen.getByText(passwordRequiredErrorMessage);

    // Act
    await submitButton.click();

    // Assert
    await expect.element(visiblePasswordRequiredErrorMessage).toBeVisible();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits with the valid current password', async () => {
    // Arrange
    const screen = await render(
      <PasswordConfirmationModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    const passwordInput = screen.getByRole('textbox', { name: passwordInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });

    // Act
    await passwordInput.fill(currentPassword);
    await submitButton.click();

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledExactlyOnceWith(currentPassword);
  });

  test('disables the form during pending confirmation submission', async () => {
    // Arrange
    let resolvePendingConfirmation!: () => void;

    mockOnSubmit.mockReturnValue(new Promise<void>((resolve) => {
      resolvePendingConfirmation = resolve;
    }));

    const pendingSubmitButtonLabel = i18next.t(($) => $.update.confirmation.button.pending, { ns: 'profile' });
    const screen = await render(
      <PasswordConfirmationModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    const passwordInput = screen.getByRole('textbox', { name: passwordInputLabel });
    const closeButton = screen.getByRole('button', { name: closeButtonLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const pendingSubmitButton = screen.getByRole('button', { name: pendingSubmitButtonLabel });

    // Act
    await passwordInput.fill(currentPassword);
    await submitButton.click();

    // Assert
    await expect.element(passwordInput).toBeDisabled();
    await expect.element(closeButton).toBeDisabled();
    await expect.element(pendingSubmitButton).toBeDisabled();
    expect(mockOnSubmit).toHaveBeenCalledOnce();

    // Act
    resolvePendingConfirmation();

    // Assert
    await expect.element(passwordInput).toBeEnabled();
    await expect.element(closeButton).toBeEnabled();
    await expect.element(submitButton).toBeEnabled();
  });

  test('doesn\'t close and shows general error alert on failed submission', async () => {
    // Arrange
    mockOnSubmit.mockRejectedValue(new Error('Unexpected network error'));
    const expectedAlertMessage = i18next.t(($) => $.update.alert.error, { ns: 'profile' });
    const screen = await render(
      <>
        <PasswordConfirmationModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        <AlertStack />
      </>
    );
    const confirmationModal = screen.getByRole('dialog', { includeHidden: true });
    const passwordInput = screen.getByRole('textbox', { name: passwordInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const alert = screen.getByText(expectedAlertMessage);

    // Act
    await passwordInput.fill(currentPassword);
    await submitButton.click();

    // Assert
    await expect.element(alert).toBeVisible();
    await expect.element(confirmationModal).toBeVisible();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('shows current password invalidation error without field reset', async () => {
    // Arrange
    mockOnSubmit.mockRejectedValue(new BackendResponseError({
      message: 'Invalid current password',
      status: 403,
      code: 'INVALID_CURRENT_PASSWORD',
    }));
    const screen = await render(
      <PasswordConfirmationModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    const passwordInvalidErrorMessage = i18next.t(
      ($) => $.update.confirmation.input.password.validation.invalid, { ns: 'profile' }
    );
    const visiblePasswordInvalidErrorMessage = screen.getByText(passwordInvalidErrorMessage);
    const confirmationModal = screen.getByRole('dialog', { includeHidden: true });
    const passwordInput = screen.getByRole('textbox', { name: passwordInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });

    // Act
    await passwordInput.fill(currentPassword);
    await submitButton.click();

    // Assert
    await expect.element(visiblePasswordInvalidErrorMessage).toBeVisible();
    await expect.element(confirmationModal).toBeVisible();
    await expect.element(passwordInput).toHaveValue(currentPassword);
    expect(mockOnSubmit).toHaveBeenCalledExactlyOnceWith(currentPassword);
  });
});
