import i18next from 'i18next';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { useAuth } from '@/entities/auth/useAuth';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import AlertStack from '@/shared/ui/Alert/AlertStack';
import SignUpForm from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

describe('SignUpForm', () => {
  const fullNameLabel = i18next.t(($) => $.signUp.input.fullName.label, { ns: 'authentication' });
  const emailLabel = i18next.t(($) => $.signUp.input.email.label, { ns: 'authentication' });
  const passwordLabel = i18next.t(($) => $.signUp.input.password.label, { ns: 'authentication' });
  const repeatPasswordLabel = i18next.t(($) => $.signUp.input.repeatPassword.label, { ns: 'authentication' });
  const submitButtonLabel = i18next.t(($) => $.signUp.button.default, { ns: 'authentication' });
  const testFullName = 'John Doe';
  const testEmail = 'test_user@example.com';
  const testPassword = '12345678';

  const mockUseAuthResult = { signUp: vi.fn() };

  beforeEach(() => {
    mockUseAuthResult.signUp.mockReset();
    vi.mocked(useAuth, { partial: true }).mockReturnValue(mockUseAuthResult);
    useAlertStore.setState({ alerts: [] });
  });

  test('accepts valid fields and calls onSubmit when signing up', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    const screen = await render(<SignUpForm onSubmit={mockOnSubmit} />);
    const fullNameInput = screen.getByRole('textbox', { name: fullNameLabel });
    const emailInput = screen.getByRole('textbox', { name: emailLabel });
    const passwordInput = screen.getByRole('textbox', { name: passwordLabel });
    const repeatPasswordInput = screen.getByRole('textbox', { name: repeatPasswordLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });

    // Act
    await fullNameInput.fill(testFullName);
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await repeatPasswordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockUseAuthResult.signUp).toHaveBeenCalledExactlyOnceWith({
      email: testEmail,
      password: testPassword,
      firstName: 'John',
      secondName: 'Doe',
    });
  });

  test('rejects an empty submission with visible errors', async () => {
    // Arrange
    const screen = await render(<SignUpForm />);
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const fullNameErrorMessage = i18next.t(($) => $.input.name.validation.required);
    const emailErrorMessage = i18next.t(($) => $.input.email.validation.invalid);
    const passwordErrorMessage = i18next.t(
      ($) => $.signUp.input.password.validation.required, { ns: 'authentication' }
    );
    const repeatPasswordErrorMessage = i18next.t(
      ($) => $.signUp.input.repeatPassword.validation.required, { ns: 'authentication' }
    );
    const visibleFullNameErrorMessage = screen.getByText(fullNameErrorMessage);
    const visibleEmailErrorMessage = screen.getByText(emailErrorMessage);
    const visiblePasswordErrorMessage = screen.getByText(passwordErrorMessage);
    const visibleRepeatPasswordErrorMessage = screen.getByText(repeatPasswordErrorMessage);

    // Act
    await submitButton.click();

    // Assert
    await expect.element(visibleFullNameErrorMessage).toBeVisible();
    await expect.element(visibleEmailErrorMessage).toBeVisible();
    await expect.element(visiblePasswordErrorMessage).toBeVisible();
    await expect.element(visibleRepeatPasswordErrorMessage).toBeVisible();
    expect(mockUseAuthResult.signUp).not.toHaveBeenCalled();
  });

  test('shows general sign up error alert', async () => {
    // Arrange
    const expectedAlertMessage = i18next.t(($) => $.signUp.alert.error, { ns: 'authentication' });
    mockUseAuthResult.signUp.mockRejectedValue(new Error('Network connection lost'));
    const screen = await render(
      <>
        <SignUpForm />
        <AlertStack />
      </>
    );
    const fullNameInput = screen.getByRole('textbox', { name: fullNameLabel });
    const emailInput = screen.getByRole('textbox', { name: emailLabel });
    const passwordInput = screen.getByRole('textbox', { name: passwordLabel });
    const repeatPasswordInput = screen.getByRole('textbox', { name: repeatPasswordLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const alert = screen.getByText(expectedAlertMessage);

    // Act
    await fullNameInput.fill(testFullName);
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await repeatPasswordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect.element(alert).toBeVisible();
  });

  test('disables the form during pending sign up request', async () => {
    // Arrange
    let resolvePendingPromise!: () => void;

    mockUseAuthResult.signUp.mockReturnValue(new Promise<void>((resolve) => {
      resolvePendingPromise = resolve;
    }));

    const submitButtonPendingLabel = i18next.t(($) => $.signUp.button.pending, { ns: 'authentication' });
    const screen = await render(<SignUpForm />);
    const fullNameInput = screen.getByRole('textbox', { name: fullNameLabel });
    const emailInput = screen.getByRole('textbox', { name: emailLabel });
    const passwordInput = screen.getByRole('textbox', { name: passwordLabel });
    const repeatPasswordInput = screen.getByRole('textbox', { name: repeatPasswordLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const submitButtonPending = screen.getByRole('button', { name: submitButtonPendingLabel });

    // Act
    await fullNameInput.fill(testFullName);
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await repeatPasswordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect.element(fullNameInput).toBeDisabled();
    await expect.element(emailInput).toBeDisabled();
    await expect.element(passwordInput).toBeDisabled();
    await expect.element(repeatPasswordInput).toBeDisabled();
    await expect.element(submitButtonPending).toBeDisabled();
    expect(mockUseAuthResult.signUp).toHaveBeenCalledOnce();

    // Act
    resolvePendingPromise();

    // Assert
    await expect.element(fullNameInput).toBeEnabled();
    await expect.element(emailInput).toBeEnabled();
    await expect.element(passwordInput).toBeEnabled();
    await expect.element(repeatPasswordInput).toBeEnabled();
    await expect.element(submitButton).toBeEnabled();
  });

  test('shows email-taken error message without fields reset', async () => {
    // Arrange
    const emailTakenErrorMessage = i18next.t(($) => $.signUp.input.email.validation.taken, { ns: 'authentication' });
    mockUseAuthResult.signUp.mockRejectedValue(new BackendResponseError({
      message: 'Email is already in use',
      status: 409,
      code: 'EMAIL_TAKEN',
    }));
    const screen = await render(<SignUpForm />);
    const fullNameInput = screen.getByRole('textbox', { name: fullNameLabel });
    const emailInput = screen.getByRole('textbox', { name: emailLabel });
    const passwordInput = screen.getByRole('textbox', { name: passwordLabel });
    const repeatPasswordInput = screen.getByRole('textbox', { name: repeatPasswordLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const visibleEmailTakenErrorMessage = screen.getByText(emailTakenErrorMessage);

    // Act
    await fullNameInput.fill(testFullName);
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await repeatPasswordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    expect(mockUseAuthResult.signUp).toHaveBeenCalled();
    await expect.element(visibleEmailTakenErrorMessage).toBeVisible();
    await expect.element(fullNameInput).toHaveValue(testFullName);
    await expect.element(emailInput).toHaveValue(testEmail);
    await expect.element(passwordInput).toHaveValue(testPassword);
    await expect.element(repeatPasswordInput).toHaveValue(testPassword);
  });

  test('rejects a password shorter than required 8 characters', async () => {
    // Arrange
    const invalidPassword = '1234567';
    const passwordMinLengthMessage = i18next.t(
      ($) => $.signUp.input.password.validation.minLength, { ns: 'authentication' }
    );
    const screen = await render(<SignUpForm />);
    const fullNameInput = screen.getByRole('textbox', { name: fullNameLabel });
    const emailInput = screen.getByRole('textbox', { name: emailLabel });
    const passwordInput = screen.getByRole('textbox', { name: passwordLabel });
    const repeatPasswordInput = screen.getByRole('textbox', { name: repeatPasswordLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const visibleMinLengthErrorMessage = screen.getByText(passwordMinLengthMessage);

    // Act
    await fullNameInput.fill(testFullName);
    await emailInput.fill(testEmail);
    await passwordInput.fill(invalidPassword);
    await repeatPasswordInput.fill(invalidPassword);
    await submitButton.click();

    // Assert
    await expect.element(visibleMinLengthErrorMessage).toBeVisible();
    expect(mockUseAuthResult.signUp).not.toHaveBeenCalled();
  });

  test('rejects on repeat password mismatch', async () => {
    // Arrange
    const repeatPasswordMismatchMessage = i18next.t(
      ($) => $.signUp.input.repeatPassword.validation.mismatch, { ns: 'authentication' }
    );
    const screen = await render(<SignUpForm />);
    const fullNameInput = screen.getByRole('textbox', { name: fullNameLabel });
    const emailInput = screen.getByRole('textbox', { name: emailLabel });
    const passwordInput = screen.getByRole('textbox', { name: passwordLabel });
    const repeatPasswordInput = screen.getByRole('textbox', { name: repeatPasswordLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const visibleRepeatPasswordMismatchErrorMessage = screen.getByText(repeatPasswordMismatchMessage);

    // Act
    await fullNameInput.fill(testFullName);
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await repeatPasswordInput.fill('87654321');
    await submitButton.click();

    // Assert
    await expect.element(visibleRepeatPasswordMismatchErrorMessage).toBeVisible();
    expect(mockUseAuthResult.signUp).not.toHaveBeenCalled();
  });
});
