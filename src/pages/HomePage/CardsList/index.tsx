import './style.css';

export interface CardData {
  id: number;
  pictureUrl: string | null;
  title: string;
  subtitle: string;
}

interface CardsListProps {
  title: string;
  cardsData?: CardData[];
  isDataFetchPending: boolean;
  isDataFetchError: boolean;
  errorMessage?: string;
  emptyListMessage?: string;
}

function CardsList({
  title,
  cardsData,
  isDataFetchPending,
  isDataFetchError,
  errorMessage,
  emptyListMessage,
}: CardsListProps) {
  let cardsListStatusMessage: string | null = null;

  if (isDataFetchPending) {
    cardsListStatusMessage = 'Loading...';
  } else if (isDataFetchError && cardsData === undefined) {
    cardsListStatusMessage = errorMessage ?? 'Unable to load data';
  } else if (cardsData === undefined || cardsData.length === 0) {
    cardsListStatusMessage = emptyListMessage ?? 'No data yet';
  }

  return (
    <div className='cards-list-container'>
      <h3 className='cards-list-title'>{title}</h3>

      {cardsListStatusMessage &&
        <p className='cards-list-message'>{cardsListStatusMessage}</p>
      }

      {cardsData?.map((cardData) => (
        <article className='cards-list-item-container' key={cardData.id}>
          <img
            className='avatar'
            src={cardData.pictureUrl ?? undefined}
            alt={`Profile picture of ${cardData.title}`}
            width={48}
            height={48}
          />
          <div className='cards-list-item-text-wrapper'>
            <p className='cards-list-item-title'>{cardData.title}</p>
            <small className='cards-list-item-subtitle'>{cardData.subtitle}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

export default CardsList;
