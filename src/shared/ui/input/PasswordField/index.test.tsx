import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import PasswordField from './index';

describe('PasswordField', () => {
  const label = 'Password';

  test('assigns accessible input label', async () => {
    // Arrange
    const screen = await render(<PasswordField label={label} />);
    const passwordInput = screen.getByRole('textbox');

    // Assert
    await expect.element(passwordInput).toHaveAccessibleName(label);
  });

  test('renders provided error message on invalid input', async () => {
    // Arrange
    const errorMessage = 'Password is required';
    const screen = await render(<PasswordField label={label} status='invalid' errorMessage={errorMessage} />);
    const errorMessageElement = screen.getByText(errorMessage);

    // Assert
    await expect.element(errorMessageElement).toBeVisible();
  });

  test('renders provided validation message on valid input', async () => {
    // Arrange
    const infoMessage = 'Password is strong';
    const screen = await render(<PasswordField label={label} status='valid' infoMessage={infoMessage} />);
    const infoMessageElement = screen.getByText(infoMessage);

    // Assert
    await expect.element(infoMessageElement).toBeVisible();
  });

  test('doesn\'t render provided error message on valid input', async () => {
    // Arrange
    const errorMessage = 'Password is required';
    const screen = await render(<PasswordField label={label} status='valid' errorMessage={errorMessage} />);
    const errorMessageElement = screen.getByText(errorMessage);

    // Assert
    await expect.element(errorMessageElement).not.toBeInTheDocument();
  });

  test('masks password input by default', async () => {
    // Arrange
    const screen = await render(<PasswordField label={label} />);
    const passwordInput = screen.getByRole('textbox', { name: label });

    // Assert
    await expect.element(passwordInput).toHaveAttribute('type', 'password');
  });

  test('assigns accessible name for password visibility button', async () => {
    // Arrange
    const screen = await render(<PasswordField label={label} showVisibilityToggle={true} />);
    const visibilityButton = screen.getByRole('button');

    // Assert
    await expect.element(visibilityButton).toHaveAccessibleName();
  });

  test('toggles password visibility', async () => {
    // Arrange
    const password = '12345678';
    const screen = await render(<PasswordField label={label} showVisibilityToggle={true} />);
    const passwordInput = screen.getByRole('textbox', { name: label });
    const togglePasswordVisibilityButton = screen.getByRole('button');

    // Act
    await passwordInput.fill(password);
    await togglePasswordVisibilityButton.click();

    // Assert
    await expect.element(passwordInput).toHaveAttribute('type', 'text')
    await expect.element(passwordInput).toHaveValue(password);

    // Act
    await togglePasswordVisibilityButton.click();

    // Assert
    await expect.element(passwordInput).toHaveAttribute('type', 'password');
    await expect.element(passwordInput).toHaveValue(password);
  });
});
