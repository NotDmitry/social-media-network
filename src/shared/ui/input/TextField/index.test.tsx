import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import TextField from './index';

describe('TextField', () => {
  const label = 'Username';

  test('assigns accessible input label', async () => {
    // Arrange
    const screen = await render(<TextField label={label} />);
    const textInput = screen.getByRole('textbox');

    // Assert
    await expect.element(textInput).toHaveAccessibleName(label);
  });

  test('renders provided error message on invalid input', async () => {
    // Arrange
    const errorMessage = 'Username can\'t be empty';
    const screen = await render(<TextField label={label} status='invalid' errorMessage={errorMessage} />);
    const errorMessageElement = screen.getByText(errorMessage);

    // Assert
    await expect.element(errorMessageElement).toBeVisible();
  });

  test('doesn\'t render provided error message on valid input', async () => {
    // Arrange
    const errorMessage = 'Username can\'t be empty';
    const screen = await render(<TextField label={label} status='valid' errorMessage={errorMessage} />);
    const errorMessageElement = screen.getByText(errorMessage);

    // Assert
    await expect.element(errorMessageElement).not.toBeInTheDocument();
  });

  test('correctly passes onChange to the input element', async () => {
    // Arrange
    const username = '@walter_junior';
    const mockOnChange = vi.fn();
    const screen = await render(<TextField label={label} onChange={mockOnChange} />);
    const textInput = screen.getByRole('textbox', { name: label });

    // Act
    await textInput.fill(username);

    // Assert
    expect(mockOnChange).toHaveBeenCalled();
    await expect.element(textInput).toHaveValue(username);
  });

  test('invalidates incorrect email input', async () => {
    // Arrange
    const label = 'Email';
    const invalidEmail = 'invalid-email';
    const screen = await render(<TextField label={label} type='email' />);
    const textInput = screen.getByRole('textbox', { name: label });

    // Act
    await textInput.fill(invalidEmail);

    // Assert
    await expect.element(textInput).toHaveValue(invalidEmail);
    await expect.element(textInput).toBeInvalid();
  });

  test('shows tooltip message on error state', async () => {
    // Arrange
    const tooltipMessage = 'Username can be considered your nickname';
    const errorMessage = 'Username can\'t be empty';
    const screen = await render(
      <TextField label={label} status='invalid' errorMessage={errorMessage} tooltipMessage={tooltipMessage} />
    );
    const tooltipFocusableSlot = screen.getByRole('button', { name: tooltipMessage });

    // Act
    await tooltipFocusableSlot.hover();
    const tooltip = screen.getByRole('tooltip');

    // Assert
    await expect.element(tooltip).toHaveTextContent(tooltipMessage);
  });
});
