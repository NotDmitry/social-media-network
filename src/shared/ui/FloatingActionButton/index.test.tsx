import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { EnvelopeIcon } from '@/shared/icons';
import FloatingActionButton from './index';

describe('FloatingActionButton', () => {
  const label = 'Send email';

  test('has an accessible name', async () => {
    // Arrange
    const screen = await render(
      <FloatingActionButton aria-label={label}>
        <EnvelopeIcon />
      </FloatingActionButton>
    );
    const fab = screen.getByRole('button');

    // Assert
    await expect.element(fab).toHaveAccessibleName(label);
  });

  test('handles click', async () => {
    // Arrange
    const mockOnClick = vi.fn();
    const screen = await render(
      <FloatingActionButton aria-label={label} onClick={mockOnClick}>
        <EnvelopeIcon />
      </FloatingActionButton>
    );
    const fab = screen.getByRole('button', { name: label });

    // Act
    await fab.click();

    // Assert
    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});
