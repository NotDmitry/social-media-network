import { useTranslation } from 'react-i18next';
import Spinner from '@/shared/ui/Spinner';
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
  loadingMessage?: string;
  errorMessage?: string;
  emptyListMessage?: string;
}

function CardsList({
  title,
  cardsData,
  isDataFetchPending,
  isDataFetchError,
  loadingMessage,
  errorMessage,
  emptyListMessage,
}: CardsListProps) {
  const { t } = useTranslation('common');
  let cardsListStatusMessage: string | null = null;

  if (isDataFetchError && cardsData === undefined) {
    cardsListStatusMessage = errorMessage ?? t(($) => $.data.error);
  } else if (cardsData === undefined || cardsData.length === 0) {
    cardsListStatusMessage = emptyListMessage ?? t(($) => $.data.empty);
  }

  return (
    <div className='cards-list-container'>
      <h3 className='cards-list-title'>{title}</h3>

      {isDataFetchPending ? (
        <Spinner label={loadingMessage ?? t(($) => $.data.loading)} />
      ) : (cardsListStatusMessage &&
        <p className='cards-list-message'>{cardsListStatusMessage}</p>
      )}

      {cardsData?.map((cardData) => (
        <article className='cards-list-item-container' key={cardData.id}>
          <img
            className='avatar'
            src={cardData.pictureUrl ?? undefined}
            alt={t(($) => $.a11y.picture, { name: cardData.title })}
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
