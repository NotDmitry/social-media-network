import { beforeEach, describe, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { Route, Routes } from 'react-router';
import i18next from 'i18next';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/entities/auth/useAuth';
import { currentUser } from '@/test/userFixtures';
import { renderWithRouterAndMuiStyles } from '@/test/renderWithRouterAndMuiStyles';
import Header from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

describe('Header', () => {
  const mobileViewportSize = { width: 320, height: 480 };
  const desktopViewportSize = { width: 1024, height: 768 };

  const burgerMenuButtonLabel = i18next.t(($) => $.a11y.openMobileNavigation);
  const signInNavigationLabel = i18next.t(($) => $.navigation.signIn);
  const signUpNavigationLabel = i18next.t(($) => $.navigation.signUp);

  beforeEach(() => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser: null });
  });

  test('switches layout from desktop to mobile variant in guest mode', async () => {
    // Arrange
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='guest' />);
    const header = screen.getByRole('banner');
    const desktopSignInLink = header.getByRole('link', { name: signInNavigationLabel, includeHidden: true });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel, includeHidden: true });
    await expect.element(desktopSignInLink).toBeVisible();
    await expect.element(burgerMenuButton).toBeInTheDocument();
    await expect.element(burgerMenuButton).not.toBeVisible();

    // Act
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);

    // Assert
    await expect.element(desktopSignInLink).toBeInTheDocument();
    await expect.element(desktopSignInLink).not.toBeVisible();
    await expect.element(burgerMenuButton).toBeVisible();
  });

  test('switches layout from mobile to desktop variant in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='guest' />);
    const header = screen.getByRole('banner');
    const desktopSignInLink = header.getByRole('link', { name: signInNavigationLabel, includeHidden: true });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel, includeHidden: true });
    await expect.element(desktopSignInLink).toBeInTheDocument();
    await expect.element(desktopSignInLink).not.toBeVisible();
    await expect.element(burgerMenuButton).toBeVisible();

    // Act
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);

    // Assert
    await expect.element(desktopSignInLink).toBeVisible();
    await expect.element(burgerMenuButton).toBeInTheDocument();
    await expect.element(burgerMenuButton).not.toBeVisible();
  });

  test('renders only the Home link on desktop in default mode', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser });
    const homeLinkLogoAccessibleName = 'Sidekick';
    const desktopProfileInfoLinkAccessibleName = new RegExp(currentUser.displayName);
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='default' />);
    const header = screen.getByRole('banner');
    const homeLink = header.getByRole('link', { name: homeLinkLogoAccessibleName });
    const desktopSignInLink = header.getByRole('link', { name: signInNavigationLabel, includeHidden: true });
    const desktopSignUpLink = header.getByRole('link', { name: signUpNavigationLabel, includeHidden: true });
    const desktopProfileInfoLink = header.getByRole('link', {
      name: desktopProfileInfoLinkAccessibleName,
      includeHidden: true
    });

    // Assert
    await expect.element(homeLink).toBeVisible();
    await expect.element(homeLink).toHaveAttribute('href', ROUTES.home);
    await expect.element(desktopSignInLink).not.toBeInTheDocument();
    await expect.element(desktopSignUpLink).not.toBeInTheDocument();
    await expect.element(desktopProfileInfoLink).not.toBeInTheDocument();
  });

  test('doesn\'t render burger menu button in default mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='default' />);
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel, includeHidden: true });

    // Assert
    await expect.element(burgerMenuButton).not.toBeInTheDocument();
  });

  test('renders auth navigation links on desktop in guest mode', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser });
    const desktopProfileInfoLinkAccessibleName = new RegExp(currentUser.displayName);
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='guest' />);
    const header = screen.getByRole('banner');
    const desktopSignInLink = header.getByRole('link', { name: signInNavigationLabel });
    const desktopSignUpLink = header.getByRole('link', { name: signUpNavigationLabel });
    const desktopProfileInfoLink = header.getByRole('link', {
      name: desktopProfileInfoLinkAccessibleName,
      includeHidden: true
    });

    // Assert
    await expect.element(desktopSignInLink).toBeVisible();
    await expect.element(desktopSignInLink).toHaveAttribute('href', ROUTES.signIn);
    await expect.element(desktopSignUpLink).toBeVisible();
    await expect.element(desktopSignUpLink).toHaveAttribute('href', ROUTES.signUp);
    await expect.element(desktopProfileInfoLink).not.toBeInTheDocument();
  });

  test('renders Profile Info navigation link on desktop in user mode', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser });
    const desktopProfileInfoLinkAccessibleName = new RegExp(currentUser.displayName);
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='user' />);
    const header = screen.getByRole('banner');
    const desktopProfileInfoLink = header.getByRole('link', { name: desktopProfileInfoLinkAccessibleName });
    const desktopSignInLink = header.getByRole('link', { name: signInNavigationLabel, includeHidden: true });
    const desktopSignUpLink = header.getByRole('link', { name: signUpNavigationLabel, includeHidden: true });

    // Assert
    await expect.element(desktopProfileInfoLink).toBeVisible();
    await expect.element(desktopProfileInfoLink).toHaveAttribute('href', ROUTES.profile);
    await expect.element(desktopSignInLink).not.toBeInTheDocument();
    await expect.element(desktopSignUpLink).not.toBeInTheDocument();
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
    const drawer = screen.getByRole('dialog', { includeHidden: true });
    const mobileSignInLink = drawer.getByRole('link', { name: signInNavigationLabel });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });
    const testPageHeading = screen.getByRole('heading', { name: testPageHeadingText });
    await expect.element(testPageHeading).not.toBeInTheDocument();

    // Act
    await burgerMenuButton.click();

    // Assert
    await expect.element(mobileSignInLink).toBeVisible();
    await expect.element(drawer).toBeVisible();

    // Act
    await mobileSignInLink.click();

    // Assert
    await expect.element(testPageHeading).toBeVisible();
    await expect.element(drawer).toBeInTheDocument();
    await expect.element(drawer).not.toBeVisible();
  });

  test('closes mobile drawer when Escape is pressed in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='guest' />);
    const drawer = screen.getByRole('dialog', { includeHidden: true });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });

    // Act
    await burgerMenuButton.click();

    // Assert
    await expect.element(drawer).toBeVisible();

    // Act
    await userEvent.keyboard('{Escape}');

    // Assert
    await expect.element(drawer).toBeInTheDocument();
    await expect.element(drawer).not.toBeVisible();
  });

  test('closes mobile drawer on resizing from mobile to desktop in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='guest' />);
    const drawer = screen.getByRole('dialog', { includeHidden: true });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });

    // Act
    await burgerMenuButton.click();

    // Assert
    await expect.element(drawer).toBeVisible();

    // Act
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);

    // Assert
    await expect.element(drawer).toBeInTheDocument();
    await expect.element(drawer).not.toBeVisible();

    // Act
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);

    // Assert
    await expect.element(drawer).toBeInTheDocument();
    await expect.element(drawer).not.toBeVisible();
  });

  test('doesn\'t render desktop profile link in user mode when current user is null', async () => {
    // Arrange
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithRouterAndMuiStyles(<Header variant='user' />);
    const header = screen.getByRole('banner');
    const desktopProfileInfoLink = header.getByRole('navigation').getByRole('link', { includeHidden: true })

    // Assert
    await expect.element(header).toBeVisible();
    await expect.element(desktopProfileInfoLink).not.toBeInTheDocument();
  });
});
