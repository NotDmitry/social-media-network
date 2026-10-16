import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Globals } from '@react-spring/web';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import AlertStack from './index';

describe('AlertStack', () => {
  const MAX_DESKTOP_ALERT_COUNT = 5;
  const MAX_MOBILE_ALERT_COUNT = 3;
  const mobileViewportSize = { width: 320, height: 480 };
  const desktopViewportSize = { width: 1024, height: 768 };
  const alertMessages = [
    'Alert 1',
    'Alert 2',
    'Alert 3',
    'Alert 4',
    'Alert 5',
    'Alert 6'
  ];
  const originalSkipAnimation = Globals.skipAnimation;

  const showAlert = useAlertStore.getState().showAlert;

  function showTestAlerts(alertsCount: number) {
    alertMessages.slice(0, alertsCount).forEach((message) => {
      showAlert(message, 'success');
    });
  }

  beforeAll(() => {
    Globals.assign({
      skipAnimation: true,
    });
  });

  beforeEach(() => {
    useAlertStore.setState({ alerts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  afterAll(() => {
    Globals.assign({
      skipAnimation: originalSkipAnimation,
    });
  });

  test('renders new alert inside stack', async () => {
    // Arrange
    const screen = await render(<AlertStack />);

    // Act
    showAlert(alertMessages[0], 'success');
    const alert = screen.getByText(alertMessages[0]);

    // Assert
    await expect.element(alert).toBeVisible();
  });

  test('renders 5 simultaneous alerts at most on desktop', async () => {
    // Arrange
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await render(<AlertStack />);

    // Act
    showTestAlerts(MAX_DESKTOP_ALERT_COUNT + 1);

    // Assert
    for (let i = 0; i < MAX_DESKTOP_ALERT_COUNT; i++) {
      const alert = screen.getByText(alertMessages[i]);
      await expect.element(alert).toBeVisible();
    }

    const firstQueuedAlert = screen.getByText(alertMessages[MAX_DESKTOP_ALERT_COUNT]);
    await expect.element(firstQueuedAlert).not.toBeInTheDocument();
  });

  test('renders 3 simultaneous alerts at most on mobile', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await render(<AlertStack />);

    // Act
    showTestAlerts(MAX_MOBILE_ALERT_COUNT + 1);

    // Assert
    for (let i = 0; i < MAX_MOBILE_ALERT_COUNT; i++) {
      const alert = screen.getByText(alertMessages[i]);
      await expect.element(alert).toBeVisible();
    }

    const firstQueuedAlert = screen.getByText(alertMessages[MAX_MOBILE_ALERT_COUNT]);
    await expect.element(firstQueuedAlert).not.toBeInTheDocument();
  });

  test('shows desktop alert count when resizing from mobile to desktop', async () => {
    // Arrange
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await render(<AlertStack />);
    showTestAlerts(MAX_MOBILE_ALERT_COUNT + 1);
    const firstDesktopAlert = screen.getByText(alertMessages[MAX_MOBILE_ALERT_COUNT]);
    await expect.element(firstDesktopAlert).not.toBeInTheDocument();

    // Act
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);

    // Assert
    await expect.element(firstDesktopAlert).toBeVisible();
  });

  test('shows queued alert when closing previous alert', async () => {
    // Arrange
    await page.viewport(desktopViewportSize.width, desktopViewportSize.height);
    const screen = await render(<AlertStack />);
    showTestAlerts(MAX_DESKTOP_ALERT_COUNT + 1);
    const firstAlert = screen.getByText(alertMessages[0]);
    const firstQueuedAlert = screen.getByText(alertMessages[MAX_DESKTOP_ALERT_COUNT]);
    await expect.element(firstAlert).toBeVisible();
    await expect.element(firstQueuedAlert).not.toBeInTheDocument();

    // Act
    const closeButton = screen.getByRole('button').first();
    await closeButton.click();

    // Assert
    await expect.element(firstAlert).not.toBeInTheDocument();
    await expect.element(firstQueuedAlert).toBeVisible();
  });

  test('automatically removes alerts after duration time expires', async () => {
    // Arrange
    vi.useFakeTimers();
    const duration = 3000;
    const interval = 1000;
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await render(<AlertStack duration={duration} />);
    const firstAlert = screen.getByText(alertMessages[0]);
    const secondAlert = screen.getByText(alertMessages[1]);
    const thirdAlert = screen.getByText(alertMessages[2]);

    // Act
    showAlert(alertMessages[0], 'success');

    // Assert
    await expect.element(firstAlert).toBeVisible();

    // Act
    vi.advanceTimersByTime(interval);
    showAlert(alertMessages[1], 'success');

    // Assert after 1s
    await expect.element(firstAlert).toBeVisible();
    await expect.element(secondAlert).toBeVisible();

    // Act
    vi.advanceTimersByTime(interval);
    showAlert(alertMessages[2], 'success');

    // Assert after 2s
    await expect.element(firstAlert).toBeVisible();
    await expect.element(secondAlert).toBeVisible();
    await expect.element(thirdAlert).toBeVisible();

    // Act
    vi.advanceTimersByTime(interval);

    // Assert after 3s
    await expect.element(firstAlert).not.toBeInTheDocument();
    await expect.element(secondAlert).toBeVisible();
    await expect.element(thirdAlert).toBeVisible();

    // Act
    vi.advanceTimersByTime(interval);

    // Assert after 4s
    await expect.element(firstAlert).not.toBeInTheDocument();
    await expect.element(secondAlert).not.toBeInTheDocument();
    await expect.element(thirdAlert).toBeVisible();

    // Act
    vi.advanceTimersByTime(interval);

    // Assert after 5s
    await expect.element(firstAlert).not.toBeInTheDocument();
    await expect.element(secondAlert).not.toBeInTheDocument();
    await expect.element(thirdAlert).not.toBeInTheDocument();
  });

  test('starts the queued alert timeout when it becomes visible', async () => {
    // Arrange
    vi.useFakeTimers();
    const duration = 5000;
    const interval = 1000;
    await page.viewport(mobileViewportSize.width, mobileViewportSize.height);
    const screen = await render(<AlertStack duration={duration} />);

    // Act
    showTestAlerts(MAX_MOBILE_ALERT_COUNT + 1);
    const firstAlert = screen.getByText(alertMessages[0]);
    const firstQueuedAlert = screen.getByText(alertMessages[MAX_MOBILE_ALERT_COUNT]);
    await expect.element(firstAlert).toBeVisible();
    await expect.element(firstQueuedAlert).not.toBeInTheDocument();

    // Act
    vi.advanceTimersByTime(duration);

    // Assert after 5s
    await expect.element(firstAlert).not.toBeInTheDocument();

    // Act and assert for 4s
    for (let elapsedTime = 0; elapsedTime < duration; elapsedTime += interval) {
      await expect.element(firstQueuedAlert).toBeVisible();
      vi.advanceTimersByTime(interval);
    }

    // Assert after 5s lifetime of queued alert
    await expect.element(firstQueuedAlert).not.toBeInTheDocument();
  });
});
