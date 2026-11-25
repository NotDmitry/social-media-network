import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { use } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import i18next from 'i18next';
import { useAuth } from '@/entities/auth/useAuth';
import Layout from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

describe('Layout', () => {
  beforeEach(() => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser: null });
  });

  test('renders layout with contents', async () => {
    // Arrange
    const buttonLabel = 'Test';
    const screen = await render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout headerVariant='default' />}>
            <Route index element={<button>{buttonLabel}</button>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const header = screen.getByRole('banner');
    const main = screen.getByRole('main');
    const button = main.getByRole('button', { name: buttonLabel });
    const footer = screen.getByRole('contentinfo');

    // Assert
    await expect.element(header).toBeVisible();
    await expect.element(main).toBeVisible();
    await expect.element(button).toBeVisible();
    await expect.element(footer).toBeVisible();
  });

  test('shows loading page indicator', async () => {
    // Arrange
    const buttonLabel = 'Test';
    const spinnerLabelMessage = i18next.t(($) => $.data.loading);

    let resolvePendingPromise!: () => void;
    const pagePendingPromise = new Promise<void>((resolve) => {
      resolvePendingPromise = resolve;
    });

    function SuspendedComponent() {
      use(pagePendingPromise);

      return (
        <button>{buttonLabel}</button>
      );
    }

    const screen = await render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout headerVariant='default' />}>
            <Route index element={<SuspendedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const main = screen.getByRole('main');
    const button = main.getByRole('button', { name: buttonLabel });
    const spinner = main.getByRole('progressbar');
    const spinnerLabel = main.getByText(spinnerLabelMessage);

    // Assert
    await expect.element(main).toBeVisible();
    await expect.element(button).not.toBeInTheDocument();
    await expect.element(spinner).toBeVisible();
    await expect.element(spinnerLabel).toBeVisible();

    // Act
    resolvePendingPromise();

    // Assert
    await expect.element(main).toBeVisible();
    await expect.element(button).toBeVisible();
    await expect.element(spinner).not.toBeInTheDocument();
    await expect.element(spinnerLabel).not.toBeInTheDocument();
  });
});
