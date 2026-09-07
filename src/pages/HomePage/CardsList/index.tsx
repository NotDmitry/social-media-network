import './style.css';

export interface CardData {
  pictureUrl: string;
  title: string;
  subtitle: string;
}

interface CardsListProps {
  title: string;
  cardsData: CardData[];
}

function CardsList({ title, cardsData }: CardsListProps) {
  return (
    <div className='cards-list-container'>
      <p className='cards-list-title'>{title}</p>
      {cardsData.map((cardData) => (
        <article className='cards-list-item-container' key={crypto.randomUUID()}>
          <img
            className='avatar'
            src={cardData.pictureUrl}
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
