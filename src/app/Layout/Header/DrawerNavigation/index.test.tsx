import { beforeEach, describe, expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import i18next from 'i18next';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/entities/auth/useAuth';
import { currentUser } from '@/test/currentUserFixture';
import { renderWithRouterAndMuiStyles } from '@/test/renderWithRouterAndMuiStyles';
import DrawerNavigation from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

describe('DrawerNavigation', () => {
  const mobileViewportSize = { width: 320, height: 480 };

  const callbacks = {
    onOpen: vi.fn(),
    onClose: vi.fn(),
  };

  const homeNavigationLabel = i18next.t(($) => $.navigation.home);
  const signInNavigationLabel = i18next.t(($) => $.navigation.signIn);
  const signUpNavigationLabel = i18next.t(($) => $.navigation.signUp);
  const profileInfoNavigationLabel = i18next.t(($) => $.navigation.profileInfo);
  const profileStatisticsNavigationLabel = i18next.t(($) => $.navigation.statistics);

  beforeEach(() => {
    callbacks.onOpen.mockReset();
    callbacks.onClose.mockReset();
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser: null });
  });

  test('renders link to the Home page in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(
      <DrawerNavigation variant='guest' isOpen={true} {...callbacks} />
    );
    const homeLink = screen.getByRole('link', { name: homeNavigationLabel });

    // Assert
    await expect.element(homeLink).toBeVisible();
    await expect.element(homeLink).toHaveAttribute('href', ROUTES.home);
  });

  test('renders auth navigation links in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(
      <DrawerNavigation variant='guest' isOpen={true} {...callbacks} />
    );
    const signInLink = screen.getByRole('link', { name: signInNavigationLabel });
    const signUpLink = screen.getByRole('link', { name: signUpNavigationLabel });

    // Assert
    await expect.element(signInLink).toBeVisible();
    await expect.element(signInLink).toHaveAttribute('href', ROUTES.signIn);
    await expect.element(signUpLink).toBeVisible();
    await expect.element(signUpLink).toHaveAttribute('href', ROUTES.signUp);
  });

  test('renders profile links in user mode', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser });
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(
      <DrawerNavigation variant='user' isOpen={true} {...callbacks} />
    );
    const profileInfoLink = screen.getByRole('link', { name: profileInfoNavigationLabel });
    const profileStatisticsLink = screen.getByRole('link', { name: profileStatisticsNavigationLabel });

    // Assert
    await expect.element(profileInfoLink).toBeVisible();
    await expect.element(profileInfoLink).toHaveAttribute('href', ROUTES.profile);
    await expect.element(profileStatisticsLink).toBeVisible();
    await expect.element(profileStatisticsLink).toHaveAttribute('href', ROUTES.statistics);
  });

  test('doesn\'t render navigation links in closed state', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(
      <DrawerNavigation variant='guest' isOpen={false} {...callbacks} />
    );
    const link = screen.getByRole('link');

    // Assert
    await expect.element(link).not.toBeInTheDocument();
  });

  test('shows the current user avatar in user mode', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser });
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(
      <DrawerNavigation variant='user' isOpen={true} {...callbacks} />
    );
    const avatar = screen.getByRole('img', { name: new RegExp(currentUser.displayName) });

    // Assert
    await expect.element(avatar).toBeVisible();
  });
});
