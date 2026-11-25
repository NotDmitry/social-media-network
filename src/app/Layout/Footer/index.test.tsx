import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import Footer from './index';

describe('Footer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders current year in footer link', async () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2028, 9));

    const screen = await render(<Footer />);
    const footerLink = screen.getByRole('link', { name: /2028/ });

    // Assert
    await expect.element(footerLink).toBeVisible();
  });

  test('links to company\'s page', async () => {
    // Arrange
    const companyLink = 'https://sidekick-software.com/';
    const screen = await render(<Footer />);
    const footerLink = screen.getByRole('link');

    // Assert
    await expect.element(footerLink).toHaveAttribute('href', companyLink);
  });
});
