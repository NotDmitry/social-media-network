import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Alert from './index';

describe('Alert', () => {
  const alertProps = Object.freeze({
    id: 'test-alert-1',
    message: 'Something happened',
    severity: 'error'
  });
  const mockOnClose = vi.fn();

  afterEach(() => {
    mockOnClose.mockClear();
    vi.useRealTimers();
  });

  test('renders alert with message', async () => {
    // Arrange
    const screen = await render(<Alert {...alertProps} onClose={mockOnClose} />);
    const alert = screen.getByText(alertProps.message);

    // Assert
    await expect.element(alert).toBeVisible();
  });

  test('renders accessible close button', async () => {
    // Arrange
    const screen = await render(<Alert {...alertProps} onClose={mockOnClose} />);
    const closeButton = screen.getByRole('button');

    // Assert
    await expect.element(closeButton).toBeVisible();
    await expect.element(closeButton).toHaveAccessibleName();
  });

  test('calls onClose when button is clicked', async () => {
    // Arrange
    const screen = await render(<Alert {...alertProps} onClose={mockOnClose} />);
    const closeButton = screen.getByRole('button');

    // Act
    await closeButton.click();

    // Assert
    expect(mockOnClose).toHaveBeenCalledExactlyOnceWith(alertProps.id);
  });

  test('calls onClose after the set duration', async () => {
    // Arrange
    vi.useFakeTimers();
    const duration = 5000;
    await render(<Alert {...alertProps} duration={duration} onClose={mockOnClose} />);

    // Act
    vi.advanceTimersByTime(2000);

    // Assert after 2s
    expect(mockOnClose).not.toHaveBeenCalled();

    // Act
    vi.advanceTimersByTime(2999);

    // Assert after 4.9s
    expect(mockOnClose).not.toHaveBeenCalled();

    // Act
    vi.advanceTimersByTime(1);

    // Assert after 5s
    expect(mockOnClose).toHaveBeenCalledExactlyOnceWith(alertProps.id);
  });

  test('doesn\'t close automatically without set duration', async () => {
    // Arrange
    vi.useFakeTimers();
    await render(<Alert {...alertProps} onClose={mockOnClose} />);

    // Act
    vi.runAllTimers();

    // Assert
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
