import './style.css';

export interface StatsCardProps {
  title?: string;
  data?: string;
  trendText?: string;
}

function StatsCard({
  title = 'Card title',
  data = 'unspecified data',
  trendText,
}: StatsCardProps) {
  return (
    <article className='stats-card-container'>
      <h3 className='stats-card-title'>{title}</h3>
      <p className='stats-card-data'>{data}</p>
      {trendText &&
        <p className='stats-card-trend'>{trendText}</p>
      }
    </article>
  );
}

export default StatsCard;
