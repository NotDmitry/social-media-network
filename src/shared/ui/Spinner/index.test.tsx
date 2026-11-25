import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import Spinner from './index';

describe('Spinner', () => {
  test('renders spinning indicator with label', async () => {
    // Arrange
    const label = 'Loading...';
    const screen = await render(<Spinner label={label} />);
    const spinner = screen.getByRole('progressbar');
    const spinnerLabel = screen.getByText(label);

    // Assert
    await expect.element(spinner).toBeVisible();
    await expect.element(spinnerLabel).toBeVisible();
  });
});
