import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import InputFieldTooltip from './index';

describe('InputFieldTooltip', () => {
  const tooltipMessage = 'The popup hint message';

  test('shows tooltip message on hover', async () => {
    // Arrange
    const screen = await render(
      <InputFieldTooltip title={tooltipMessage} />
    );
    const tooltipFocusableSlot = screen.getByRole('button', { name: tooltipMessage });

    // Act
    await tooltipFocusableSlot.hover();
    const tooltip = screen.getByRole('tooltip');

    // Assert
    await expect.element(tooltip).toBeVisible();
    await expect.element(tooltip).toHaveTextContent(tooltipMessage);
  });

  test('supports activation through keyboard focus', async () => {
    // Arrange
    const screen = await render(
      <InputFieldTooltip title={tooltipMessage} />
    );
    const tooltipFocusableSlot = screen.getByRole('button', { name: tooltipMessage });

    // Act
    await userEvent.tab();
    const tooltip = screen.getByRole('tooltip');

    // Assert
    await expect.element(tooltipFocusableSlot).toHaveFocus();
    await expect.element(tooltip).toBeVisible();
  });
});
