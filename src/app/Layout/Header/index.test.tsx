import { beforeEach, describe, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import i18next from 'i18next';
import { StyledEngineProvider } from '@mui/material/styles';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/entities/auth/useAuth';
import type { CurrentUserView } from '@/entities/User/types';
import Header from './index';

function Providers({ children }: { children: ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </StyledEngineProvider>
  );
}

function renderWithProviders(ui: ReactNode) {
  return render(ui, { wrapper: Providers });
}

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
  const profileInfoNavigationLabel = i18next.t(($) => $.navigation.profileInfo);
  const profileStatisticsNavigationLabel = i18next.t(($) => $.navigation.statistics);

  const currentUser = Object.freeze<CurrentUserView>({
    id: 1,
    username: '@john_doe',
    firstName: 'John',
    secondName: 'Doe',
    displayName: 'John Doe',
    email: 'john_doe@example.com',
    description: null,
    bio: null,
    profileImage: null,
    creationDate: null,
    lastLogin: null,
    modifiedDate: null,
  });

  beforeEach(() => {
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser: null });
  });

  test('switches layout from desktop to mobile variant in guest mode', async () => {
    // Arrange
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithProviders(<Header variant='guest' />);
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
    const screen = await renderWithProviders(<Header variant='guest' />);
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
    const screen = await renderWithProviders(<Header variant='default' />);
    const homeLink = screen.getByRole('link');

    // Assert
    await expect.element(homeLink).toBeVisible();
    await expect.element(homeLink).toHaveAttribute('href', ROUTES.home);
  });

  test('doesn\'t render burger menu button in default mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithProviders(<Header variant='default' />);
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });

    // Assert
    await expect.element(burgerMenuButton).not.toBeInTheDocument();
  });

  test('renders link to the Home page in mobile drawer in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithProviders(<Header variant='guest' />);
    const homeLink = screen.getByRole('link', { name: homeNavigationLabel });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });
    await expect.element(homeLink).not.toBeInTheDocument();
    await expect.element(burgerMenuButton).toBeVisible();

    // Act
    await burgerMenuButton.click();

    // Assert
    await expect.element(homeLink).toBeVisible();
    await expect.element(homeLink).toHaveAttribute('href', ROUTES.home);
  });

  test('renders auth navigation links on desktop in guest mode', async () => {
    // Arrange
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await renderWithProviders(<Header variant='guest' />);
    const signInLink = screen.getByRole('link', { name: signInNavigationLabel });
    const signUpLink = screen.getByRole('link', { name: signUpNavigationLabel });

    // Assert
    await expect.element(signInLink).toBeVisible();
    await expect.element(signInLink).toHaveAttribute('href', ROUTES.signIn);
    await expect.element(signUpLink).toBeVisible();
    await expect.element(signUpLink).toHaveAttribute('href', ROUTES.signUp);
  });

  test('renders auth navigation links in mobile drawer in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithProviders(<Header variant='guest' />);
    const signInLink = screen.getByRole('link', { name: signInNavigationLabel });
    const signUpLink = screen.getByRole('link', { name: signUpNavigationLabel });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });
    await expect.element(signInLink).not.toBeInTheDocument();
    await expect.element(signUpLink).not.toBeInTheDocument();
    await expect.element(burgerMenuButton).toBeVisible();

    // Act
    await burgerMenuButton.click();

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
    const screen = await renderWithProviders(<Header variant='user' />);
    const profileInfoLink = screen.getByRole('link', { name: new RegExp(currentUser.displayName) });

    // Assert
    await expect.element(profileInfoLink).toBeVisible();
    await expect.element(profileInfoLink).toHaveAttribute('href', ROUTES.profile);
  });

  test('renders profile links in mobile drawer in user mode', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser });
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await renderWithProviders(<Header variant='user' />);
    const profileInfoLink = screen.getByRole('link', { name: profileInfoNavigationLabel });
    const profileStatisticsLink = screen.getByRole('link', { name: profileStatisticsNavigationLabel });
    const burgerMenuButton = screen.getByRole('button', { name: burgerMenuButtonLabel });
    await expect.element(profileInfoLink).not.toBeInTheDocument();
    await expect.element(profileStatisticsLink).not.toBeInTheDocument();
    await expect.element(burgerMenuButton).toBeVisible();

    // Act
    await burgerMenuButton.click();

    // Assert
    await expect.element(profileInfoLink).toBeVisible();
    await expect.element(profileInfoLink).toHaveAttribute('href', ROUTES.profile);
    await expect.element(profileStatisticsLink).toBeVisible();
    await expect.element(profileStatisticsLink).toHaveAttribute('href', ROUTES.statistics);
  });

  test('closes mobile drawer after a route change in guest mode', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const testPageHeadingText = 'Sign In Page';
    const screen = await renderWithProviders(
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
    const screen = await renderWithProviders(<Header variant='guest' />);
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
    const screen = await renderWithProviders(<Header variant='guest' />);
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
