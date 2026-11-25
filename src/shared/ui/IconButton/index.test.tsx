import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { CloseIcon } from '@/shared/icons';
import IconButton from './index';

describe('IconButton', () => {
  const label = 'Close';

  test('has an accessible name', async () => {
    // Arrange
    const screen = await render(
      <IconButton aria-label={label}>
        <CloseIcon />
      </IconButton>
    );
    const iconButton = screen.getByRole('button');

    // Assert
    await expect.element(iconButton).toHaveAccessibleName(label);
  });

  test('handles click', async () => {
    // Arrange
    const mockOnClick = vi.fn();
    const screen = await render(
      <IconButton aria-label={label} onClick={mockOnClick}>
        <CloseIcon />
      </IconButton>
    );
    const iconButton = screen.getByRole('button', { name: label });

    // Act
    await iconButton.click();

    // Assert
    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});
