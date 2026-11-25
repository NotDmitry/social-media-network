import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { currentUser } from '@/test/currentUserFixture';
import QuickPostForm from './index';

describe('QuickPostForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockReset();
  });

  test('submits empty message by default', async () => {
    // Arrange
    const screen = await render(<QuickPostForm currentUser={currentUser} onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByRole('button');

    // Act
    await submitButton.click();

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledExactlyOnceWith('');
  });

  test('submits non-empty message', async () => {
    // Arrange
    const message = 'Hello, world!';
    const screen = await render(<QuickPostForm currentUser={currentUser} onSubmit={mockOnSubmit} />);
    const quickPostInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');

    // Act
    await quickPostInput.fill(message);
    await submitButton.click();

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledExactlyOnceWith(message);
  });
});
