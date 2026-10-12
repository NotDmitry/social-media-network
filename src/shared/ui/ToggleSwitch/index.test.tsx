import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import ToggleSwitch from './index';

describe('ToggleSwitch', () => {
  const label = 'Dark theme';
  const mockOnToggle = vi.fn();

  afterEach(() => {
    mockOnToggle.mockClear();
  });

  test('assigns accessible checkbox label', async () => {
    // Arrange
    const screen = await render(<ToggleSwitch label={label} isToggled={false} onToggle={mockOnToggle} />);
    const checkbox = screen.getByRole('checkbox');

    // Assert
    await expect.element(checkbox).toHaveAccessibleName(label);
  });

  test('renders unchecked when isn\'t toggled', async () => {
    // Arrange
    const screen = await render(<ToggleSwitch label={label} isToggled={false} onToggle={mockOnToggle} />);
    const checkbox = screen.getByRole('checkbox', { name: label });

    // Assert
    await expect.element(checkbox).not.toBeChecked();
  });

  test('renders checked when toggled', async () => {
    // Arrange
    const screen = await render(<ToggleSwitch label={label} isToggled={true} onToggle={mockOnToggle} />);
    const checkbox = screen.getByRole('checkbox', { name: label });

    // Assert
    await expect.element(checkbox).toBeChecked();
  });

  test('calls onToggle callback with \'true\' when toggled', async () => {
    // Arrange
    const screen = await render(<ToggleSwitch label={label} isToggled={false} onToggle={mockOnToggle} />);
    const checkboxLabel = screen.getByText(label);

    // Act
    await checkboxLabel.click();

    // Assert
    expect(mockOnToggle).toHaveBeenCalledExactlyOnceWith(true);
  });

  test('calls onToggle callback with \'false\' when deactivated', async () => {
    // Arrange
    const screen = await render(<ToggleSwitch label={label} isToggled={true} onToggle={mockOnToggle} />);
    const checkboxLabel = screen.getByText(label);

    // Act
    await checkboxLabel.click();

    // Assert
    expect(mockOnToggle).toHaveBeenCalledExactlyOnceWith(false);
  });
});
