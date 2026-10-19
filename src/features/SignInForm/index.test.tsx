import i18next from 'i18next';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { useAuth } from '@/entities/auth/useAuth';
import type { SignInPayload } from '@/entities/auth/types';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import AlertStack from '@/shared/ui/Alert/AlertStack';
import SignInForm from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

describe('SignInForm', () => {
  const emailLabel = i18next.t(($) => $.signIn.input.email.label, { ns: 'authentication' });
  const passwordLabel = i18next.t(($) => $.signIn.input.password.label, { ns: 'authentication' });
  const submitButtonLabel = i18next.t(($) => $.signIn.button.default, { ns: 'authentication' });
  const testEmail = 'test_user@example.com';
  const testPassword = '12345678';

  const mockOnSubmit = vi.fn();
  const mockUseAuthResult = { signIn: vi.fn() };

  beforeEach(() => {
    mockOnSubmit.mockReset();
    mockUseAuthResult.signIn.mockReset();
    vi.mocked(useAuth, { partial: true }).mockReturnValue(mockUseAuthResult);
    useAlertStore.setState({ alerts: [] });
  });

  test('accepts valid fields and calls onSubmit when signing in', async () => {
    // Arrange
    const expectedPayload: SignInPayload = {
      email: testEmail,
      password: testPassword,
    };
    const screen = await render(<SignInForm onSubmit={mockOnSubmit} />);
    const emailInput = screen.getByRole('textbox', { name: emailLabel });
    const passwordInput = screen.getByRole('textbox', { name: passwordLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });

    // Act
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockUseAuthResult.signIn).toHaveBeenCalledExactlyOnceWith(expectedPayload);
  });

  test('rejects an empty submission with visible errors', async () => {
    // Arrange
    const screen = await render(<SignInForm onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const emailErrorMessage = i18next.t(($) => $.input.email.validation.invalid);
    const passwordErrorMessage = i18next.t(
      ($) => $.signIn.input.password.validation.required, { ns: 'authentication' }
    );
    const visibleEmailErrorMessage = screen.getByText(emailErrorMessage);
    const visiblePasswordErrorMessage = screen.getByText(passwordErrorMessage);

    // Act
    await submitButton.click();

    // Assert
    await expect.element(visibleEmailErrorMessage).toBeVisible();
    await expect.element(visiblePasswordErrorMessage).toBeVisible();
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockUseAuthResult.signIn).not.toHaveBeenCalled();
  });

  test('shows invalid-credentials alert without fields reset', async () => {
    // Arrange
    const expectedAlertMessage = i18next.t(($) => $.signIn.alert.invalidCredentials, { ns: 'authentication' });
    mockUseAuthResult.signIn.mockRejectedValue(new BackendResponseError({
      message: 'Invalid credentials',
      status: 401,
      code: 'INVALID_CREDENTIALS',
    }));
    const screen = await render(
      <>
        <SignInForm onSubmit={mockOnSubmit} />
        <AlertStack />
      </>
    );
    const emailInput = screen.getByRole('textbox', { name: emailLabel });
    const passwordInput = screen.getByRole('textbox', { name: passwordLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const alert = screen.getByText(expectedAlertMessage);

    // Act
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect.element(alert).toBeVisible();
    await expect.element(emailInput).toHaveValue(testEmail);
    await expect.element(passwordInput).toHaveValue(testPassword);
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockUseAuthResult.signIn).toHaveBeenCalled();
  });

  test('shows general sign in error alert', async () => {
    // Arrange
    const expectedAlertMessage = i18next.t(($) => $.signIn.alert.error, { ns: 'authentication' });
    mockUseAuthResult.signIn.mockRejectedValue(new Error('Network connection lost'));
    const screen = await render(
      <>
        <SignInForm onSubmit={mockOnSubmit} />
        <AlertStack />
      </>
    );
    const emailInput = screen.getByRole('textbox', { name: emailLabel });
    const passwordInput = screen.getByRole('textbox', { name: passwordLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const alert = screen.getByText(expectedAlertMessage);

    // Act
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect.element(alert).toBeVisible();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('disables the form during pending sign in request', async () => {
    // Arrange
    let resolvePendingPromise!: () => void;

    mockUseAuthResult.signIn.mockReturnValue(new Promise<void>((resolve) => {
      resolvePendingPromise = resolve;
    }));

    const submitButtonPendingLabel = i18next.t(($) => $.signIn.button.pending, { ns: 'authentication' });
    const screen = await render(<SignInForm />);
    const emailInput = screen.getByRole('textbox', { name: emailLabel });
    const passwordInput = screen.getByRole('textbox', { name: passwordLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const submitButtonPending = screen.getByRole('button', { name: submitButtonPendingLabel });

    // Act
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect.element(emailInput).toBeDisabled();
    await expect.element(passwordInput).toBeDisabled();
    await expect.element(submitButtonPending).toBeDisabled();
    expect(mockUseAuthResult.signIn).toHaveBeenCalledOnce();

    // Act
    resolvePendingPromise();

    // Assert
    await expect.element(emailInput).toBeEnabled();
    await expect.element(passwordInput).toBeEnabled();
    await expect.element(submitButton).toBeEnabled();
  });
});
