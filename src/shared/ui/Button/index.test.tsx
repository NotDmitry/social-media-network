import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Button from './index';

describe('Button', () => {
  const label = 'Login';

  test('has an accessible name', async () => {
    // Arrange
    const screen = await render(<Button>{label}</Button>);
    const button = screen.getByRole('button');

    // Assert
    await expect.element(button).toHaveAccessibleName(label);
  });

  test('handles click', async () => {
    // Arrange
    const mockOnClick = vi.fn();
    const screen = await render(<Button onClick={mockOnClick}>{label}</Button>);
    const button = screen.getByRole('button', { name: label });

    // Act
    await button.click();

    // Assert
    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});
