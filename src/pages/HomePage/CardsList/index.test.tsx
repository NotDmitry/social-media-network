import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import CardsList from './index';
import type { CardData, CardsListProps } from './index';

describe('CardsList', () => {
  const loadingMessageText = 'Loading suggested people';
  const errorMessageText = 'Cannot load suggested people';
  const emptyListMessageText = 'No suggested people';

  const defaultProps = Object.freeze<CardsListProps>({
    title: 'Suggested people',
    cardsData: undefined,
    isDataFetchPending: false,
    isDataFetchError: false,
    loadingMessage: loadingMessageText,
    errorMessage: errorMessageText,
    emptyListMessage: emptyListMessageText,
  });

  test('shows fallback message when no cards available', async () => {
    // Arrange
    const screen = await render(<CardsList {...defaultProps} cardsData={[]} />);
    const emptyListMessage = screen.getByText(emptyListMessageText);

    // Assert
    await expect.element(emptyListMessage).toBeVisible();
  });

  test('shows error message on failed loading request', async () => {
    // Arrange
    const screen = await render(<CardsList {...defaultProps} isDataFetchError={true} />);
    const errorMessage = screen.getByText(errorMessageText);
    const emptyListMessage = screen.getByText(emptyListMessageText);

    // Assert
    await expect.element(errorMessage).toBeVisible();
    await expect.element(emptyListMessage).not.toBeInTheDocument();
  });

  test('doesn\'t remove previously loaded cards on failed loading request', async () => {
    // Arrange
    const testCard: CardData = {
      id: 1,
      pictureUrl: null,
      title: 'John Doe',
      subtitle: '@john_doe',
    };
    const screen = await render(<CardsList {...defaultProps} cardsData={[testCard]} isDataFetchError={true} />);
    const cardTitle = screen.getByText(testCard.title);
    const errorMessage = screen.getByText(errorMessageText);

    // Assert
    await expect.element(cardTitle).toBeVisible();
    await expect.element(errorMessage).not.toBeInTheDocument();
  });

  test('shows spinner on pending loading request', async () => {
    // Arrange
    const screen = await render(<CardsList {...defaultProps} isDataFetchPending={true} />);
    const loadingSpinner = screen.getByRole('progressbar');
    const loadingMessage = screen.getByText(loadingMessageText);
    const emptyListMessage = screen.getByText(emptyListMessageText);

    // Assert
    await expect.element(loadingSpinner).toBeVisible();
    await expect.element(loadingMessage).toBeVisible();
    await expect.element(emptyListMessage).not.toBeInTheDocument();
  });
});
