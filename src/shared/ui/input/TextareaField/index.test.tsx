import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import TextareaField from './index';

describe('TextareaField', () => {
  const label = 'Description';

  test('assigns accessible textarea label', async () => {
    // Arrange
    const screen = await render(<TextareaField label={label} />);
    const textareaInput = screen.getByRole('textbox');

    // Assert
    await expect.element(textareaInput).toHaveAccessibleName(label);
  });

  test('renders provided error message on invalid input', async () => {
    // Arrange
    const errorMessage = 'Reached max characters limit';
    const screen = await render(<TextareaField label={label} status='invalid' errorMessage={errorMessage} />);
    const errorMessageElement = screen.getByText(errorMessage);

    // Assert
    await expect.element(errorMessageElement).toBeVisible();
  });

  test('renders provided hint message', async () => {
    // Arrange
    const hintMessage = 'Max 200 characters';
    const screen = await render(<TextareaField label={label} hintMessage={hintMessage} />);
    const hintMessageElement = screen.getByText(hintMessage);

    // Assert
    await expect.element(hintMessageElement).toBeVisible();
  });

  test('doesn\'t show the hint on invalid input', async () => {
    // Arrange
    const hintMessage = 'Max 200 characters';
    const errorMessage = 'Reached max characters limit';
    const screen = await render(
      <TextareaField label={label} status='invalid' hintMessage={hintMessage} errorMessage={errorMessage} />
    );
    const hintMessageElement = screen.getByText(hintMessage);

    // Assert
    await expect.element(hintMessageElement).not.toBeInTheDocument();
  });

  test('preserves multiline text input', async () => {
    // Arrange
    const description = 'Hi,\nMy name is,\nMy name is';
    const mockOnChange = vi.fn();
    const screen = await render(<TextareaField label={label} onChange={mockOnChange} />);
    const textareaInput = screen.getByRole('textbox', { name: label });

    // Act
    await textareaInput.fill(description);

    // Assert
    expect(mockOnChange).toHaveBeenCalled();
    await expect.element(textareaInput).toHaveValue(description);
  });
});
