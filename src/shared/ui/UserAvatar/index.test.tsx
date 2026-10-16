import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import photoUrl from '@/assets/images/test_user_walter.jpg';
import UserAvatar from './index';

describe('UserAvatar', () => {
  test('renders the provided photo', async () => {
    // Arrange
    const displayName = 'Walter Black';
    const alt = `Photo of ${displayName}`;
    const screen = await render(
      <UserAvatar displayName={displayName} photoUrl={photoUrl} alt={alt} />
    );
    const photo = screen.getByRole('img', { name: alt });

    // Assert
    await expect.element(photo).toBeVisible();
    await expect.element(photo).toHaveAttribute('src', photoUrl);
  });

  test('shows fallback as a first letter of display name when photo is missing', async () => {
    // Arrange
    const displayName = 'Walter Black';
    const screen = await render(<UserAvatar displayName={displayName} />);
    const textFallback = screen.getByText('W');

    // Assert
    await expect.element(textFallback).toBeVisible();
  });
});
