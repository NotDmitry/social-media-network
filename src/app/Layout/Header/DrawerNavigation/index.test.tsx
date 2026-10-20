import { beforeEach, describe, expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import i18next from 'i18next';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/entities/auth/useAuth';
import { currentUser } from '@/test/userFixtures';
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
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser });
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(
      <DrawerNavigation variant='guest' isOpen={true} {...callbacks} />
    );
    const signInLink = screen.getByRole('link', { name: signInNavigationLabel });
    const signUpLink = screen.getByRole('link', { name: signUpNavigationLabel });
    const profileInfoLink = screen.getByRole('link', { name: profileInfoNavigationLabel, includeHidden: true });
    const profileStatisticsLink = screen.getByRole('link', {
      name: profileStatisticsNavigationLabel,
      includeHidden: true
    });

    // Assert
    await expect.element(signInLink).toBeVisible();
    await expect.element(signInLink).toHaveAttribute('href', ROUTES.signIn);
    await expect.element(signUpLink).toBeVisible();
    await expect.element(signUpLink).toHaveAttribute('href', ROUTES.signUp);
    await expect.element(profileInfoLink).not.toBeInTheDocument();
    await expect.element(profileStatisticsLink).not.toBeInTheDocument();
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
    const signInLink = screen.getByRole('link', { name: signInNavigationLabel, includeHidden: true });
    const signUpLink = screen.getByRole('link', { name: signUpNavigationLabel, includeHidden: true });

    // Assert
    await expect.element(profileInfoLink).toBeVisible();
    await expect.element(profileInfoLink).toHaveAttribute('href', ROUTES.profile);
    await expect.element(profileStatisticsLink).toBeVisible();
    await expect.element(profileStatisticsLink).toHaveAttribute('href', ROUTES.statistics);
    await expect.element(signInLink).not.toBeInTheDocument()
    await expect.element(signUpLink).not.toBeInTheDocument()
  });

  test('is hidden in closed state', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(
      <DrawerNavigation variant='guest' isOpen={false} {...callbacks} />
    );
    const drawer = screen.getByRole('dialog', { includeHidden: true });

    // Assert
    await expect.element(drawer).toBeInTheDocument();
    await expect.element(drawer).not.toBeVisible();
  });

  test('shows the current user avatar in user mode', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser });
    const avatarAccessibleName = i18next.t(($) => $.a11y.profilePicture, { name: currentUser.displayName });
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(
      <DrawerNavigation variant='user' isOpen={true} {...callbacks} />
    );
    const avatar = screen.getByRole('img', { name: avatarAccessibleName });

    // Assert
    await expect.element(avatar).toBeVisible();
  });

  test('doesn\'t show the current user avatar in guest mode', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser });
    const avatarAccessibleName = i18next.t(($) => $.a11y.profilePicture, { name: currentUser.displayName });
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(
      <DrawerNavigation variant='guest' isOpen={true} {...callbacks} />
    );
    const avatar = screen.getByRole('img', { name: avatarAccessibleName, includeHidden: true });

    // Assert
    await expect.element(avatar).not.toBeInTheDocument();
  });

  test('doesn\'t render profile-related components in user mode when current user is null', async () => {
    // Arrange
    const avatarAccessibleName = new RegExp(i18next.t(($) => $.a11y.profilePicture, { name: '' }).trim());
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(
      <DrawerNavigation variant='user' isOpen={true} {...callbacks} />
    );
    const avatar = screen.getByRole('img', { name: avatarAccessibleName, includeHidden: true });
    const profileInfoLink = screen.getByRole('link', { name: profileInfoNavigationLabel, includeHidden: true });
    const profileStatisticsLink = screen.getByRole('link', {
      name: profileStatisticsNavigationLabel,
      includeHidden: true,
    });
    const homeLink = screen.getByRole('link', { name: homeNavigationLabel });

    // Assert
    await expect.element(homeLink).toBeVisible();
    await expect.element(avatar).not.toBeInTheDocument();
    await expect.element(profileInfoLink).not.toBeInTheDocument();
    await expect.element(profileStatisticsLink).not.toBeInTheDocument();
  });
});
