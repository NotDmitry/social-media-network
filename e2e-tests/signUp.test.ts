import { expect, test } from '@playwright/test';
import authenticationTranslations from '../src/app/config/locales/en/authentication.json' with { type: 'json' };
import commonTranslations from '../src/app/config/locales/en/common.json' with { type: 'json' };

test.describe('Sign Up', () => {
  const signUpNavigationLabel = commonTranslations.navigation.signUp;
  const fullNameInputLabel = authenticationTranslations.signUp.input.fullName.label;
  const emailInputLabel = authenticationTranslations.signUp.input.email.label;
  const passwordInputLabel = authenticationTranslations.signUp.input.password.label;
  const repeatPasswordInputLabel = authenticationTranslations.signUp.input.repeatPassword.label;
  const submitButtonLabel = authenticationTranslations.signUp.button.default;

  const testFullName = 'John Doe';
  const testPassword = '12345678';
  const profileNavigationLinkFragment = new RegExp(testFullName, 'i');

  test('creates new user account and navigates to the Home page for authenticated user', async ({ page }) => {
    // Arrange
    await page.goto('/');
    const testEmail = `test.user.${crypto.randomUUID()}@example.com`;
    const successAlertMessage = authenticationTranslations.signUp.alert.success;
    const signUpNavigationLink = page.getByRole('banner').getByRole('link', { name: signUpNavigationLabel });
    const fullNameInput = page.getByRole('textbox', { name: fullNameInputLabel });
    const emailInput = page.getByRole('textbox', { name: emailInputLabel });
    const passwordInput = page.getByRole('textbox', { name: passwordInputLabel, exact: true });
    const repeatPasswordInput = page.getByRole('textbox', { name: repeatPasswordInputLabel });
    const submitButton = page.getByRole('button', { name: submitButtonLabel });
    const successAlert = page.getByText(successAlertMessage);
    const profileNavigationLink = page.getByRole('banner').getByRole('link', { name: profileNavigationLinkFragment });

    // Act
    await signUpNavigationLink.click();

    // Assert
    await expect(page).toHaveURL(/#\/sign-up$/);

    // Act
    await fullNameInput.fill(testFullName);
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await repeatPasswordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect(page).toHaveURL(/#\/$/);
    await expect(successAlert).toBeVisible();
    await expect(profileNavigationLink).toBeVisible();
  });

  test('shows email-taken error message and stays at Sign Up page', async ({ page }) => {
    // Arrange
    await page.goto('/#/sign-up');
    const testTakenEmail = 'helena.hills@social.com';
    const emailTakenErrorMessage = authenticationTranslations.signUp.input.email.validation.taken;
    const fullNameInput = page.getByRole('textbox', { name: fullNameInputLabel });
    const emailInput = page.getByRole('textbox', { name: emailInputLabel });
    const passwordInput = page.getByRole('textbox', { name: passwordInputLabel, exact: true });
    const repeatPasswordInput = page.getByRole('textbox', { name: repeatPasswordInputLabel });
    const submitButton = page.getByRole('button', { name: submitButtonLabel });
    const visibleEmailTakenErrorMessage = page.getByText(emailTakenErrorMessage);

    // Act
    await fullNameInput.fill(testFullName);
    await emailInput.fill(testTakenEmail);
    await passwordInput.fill(testPassword);
    await repeatPasswordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect(visibleEmailTakenErrorMessage).toBeVisible();
    await expect(fullNameInput).toHaveValue(testFullName);
    await expect(emailInput).toHaveValue(testTakenEmail);
    await expect(passwordInput).toHaveValue(testPassword);
    await expect(repeatPasswordInput).toHaveValue(testPassword);
    await expect(page).toHaveURL(/#\/sign-up$/);
  });

  test('new account session survives page reload', async ({ page }) => {
    // Arrange
    await page.goto('/#/sign-up');
    const testEmail = `reload.user.${crypto.randomUUID()}@example.com`;
    const fullNameInput = page.getByRole('textbox', { name: fullNameInputLabel });
    const emailInput = page.getByRole('textbox', { name: emailInputLabel });
    const passwordInput = page.getByRole('textbox', { name: passwordInputLabel, exact: true });
    const repeatPasswordInput = page.getByRole('textbox', { name: repeatPasswordInputLabel });
    const submitButton = page.getByRole('button', { name: submitButtonLabel });
    const profileNavigationLink = page.getByRole('banner').getByRole('link', { name: profileNavigationLinkFragment });

    // Act
    await fullNameInput.fill(testFullName);
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await repeatPasswordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect(profileNavigationLink).toBeVisible();
    await expect(page).toHaveURL(/#\/$/);

    // Act
    await page.reload();

    // Assert
    await expect(profileNavigationLink).toBeVisible();
    await expect(page).toHaveURL(/#\/$/);
  });
});
