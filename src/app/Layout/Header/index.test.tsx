import { beforeEach, describe, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { Route, Routes } from 'react-router';
import i18next from 'i18next';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/entities/auth/useAuth';
import { currentUser } from '@/test/currentUserFixture';
import { renderWithRouterAndMuiStyles } from '@/test/renderWithRouterAndMuiStyles';
import Header from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

describe('Header', () => {
  const mobileViewportSize = { width: 320, height: 480 };
  const desktopViewportSize = { width: 1024, height: 768 };

  const burgerMenuButtonLabel = i18next.t(($) => $.a11y.openMobileNavigation);
  const homeNavigationLabel = i18next.t(($) => $.navigation.home);
  const signInNavigationLabel = i18next.t(($) => $.navigation.signIn);
  const signUpNavigationLabel = i18next.t(($) => $.navigation.signUp);

  beforeEach(() => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser: null });
  });

  test('switches layout from desktop to mobile variant in guest mode', async () => {
    // Arrange
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='guest' />);
    const signInLink = screen.getByRole('link', { name: signInNavigationLabel });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });
    await expect.element(signInLink).toBeVisible();
    await expect.element(burgerMenuButton).not.toBeInTheDocument();

    // Act
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);

    // Assert
    await expect.element(signInLink).not.toBeInTheDocument();
    await expect.element(burgerMenuButton).toBeVisible();
  });

  test('switches layout from mobile to desktop variant in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='guest' />);
    const signInLink = screen.getByRole('link', { name: signInNavigationLabel });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });
    await expect.element(signInLink).not.toBeInTheDocument();
    await expect.element(burgerMenuButton).toBeVisible();

    // Act
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);

    // Assert
    await expect.element(signInLink).toBeVisible();
    await expect.element(burgerMenuButton).not.toBeInTheDocument();
  });

  test('renders only the Home link on desktop in default mode', async () => {
    // Arrange
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='default' />);
    const homeLink = screen.getByRole('link');

    // Assert
    await expect.element(homeLink).toBeVisible();
    await expect.element(homeLink).toHaveAttribute('href', ROUTES.home);
  });

  test('doesn\'t render burger menu button in default mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='default' />);
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });

    // Assert
    await expect.element(burgerMenuButton).not.toBeInTheDocument();
  });

  test('renders auth navigation links on desktop in guest mode', async () => {
    // Arrange
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='guest' />);
    const signInLink = screen.getByRole('link', { name: signInNavigationLabel });
    const signUpLink = screen.getByRole('link', { name: signUpNavigationLabel });

    // Assert
    await expect.element(signInLink).toBeVisible();
    await expect.element(signInLink).toHaveAttribute('href', ROUTES.signIn);
    await expect.element(signUpLink).toBeVisible();
    await expect.element(signUpLink).toHaveAttribute('href', ROUTES.signUp);
  });

  test('renders Profile Info navigation link on desktop in user mode', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser });
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='user' />);
    const profileInfoLink = screen.getByRole('link', { name: new RegExp(currentUser.displayName) });

    // Assert
    await expect.element(profileInfoLink).toBeVisible();
    await expect.element(profileInfoLink).toHaveAttribute('href', ROUTES.profile);
  });

  test('closes mobile drawer after a route change in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const testPageHeadingText = 'Sign In Page';
    const screen = await renderWithRouterAndMuiStyles(
      <>
        <Header variant='guest' />
        <Routes>
          <Route path={ROUTES.signIn} element={<h1>{testPageHeadingText}</h1>} />
        </Routes>
      </>
    );
    const signInLink = screen.getByRole('link', { name: signInNavigationLabel });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });
    const testPageHeading = screen.getByRole('heading', { name: testPageHeadingText });
    await expect.element(testPageHeading).not.toBeInTheDocument();

    // Act
    await burgerMenuButton.click();

    // Assert
    await expect.element(signInLink).toBeVisible();

    // Act
    await signInLink.click();

    // Assert
    await expect.element(testPageHeading).toBeVisible();
    await expect.element(signInLink).not.toBeInTheDocument();
  });

  test('closes mobile drawer when Escape is pressed in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='guest' />);
    const signInLink = screen.getByRole('link', { name: signInNavigationLabel });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });

    // Act
    await burgerMenuButton.click();

    // Assert
    await expect.element(signInLink).toBeVisible();

    // Act
    await userEvent.keyboard('{Escape}');

    // Assert
    await expect.element(signInLink).not.toBeInTheDocument();
  });

  test('closes mobile drawer on resizing from mobile to desktop in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='guest' />);
    const homeLink = screen.getByRole('link', { name: homeNavigationLabel });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });

    // Act
    await burgerMenuButton.click();

    // Assert
    await expect.element(homeLink).toBeVisible();

    // Act
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);

    // Assert
    await expect.element(homeLink).not.toBeInTheDocument();

    // Act
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);

    // Assert
    await expect.element(homeLink).not.toBeInTheDocument();
  });
});
