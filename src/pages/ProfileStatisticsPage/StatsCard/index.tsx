import './style.css';

export interface StatsCardProps {
  title?: string;
  data?: string;
  trendText?: string;
}

function StatsCard({
  title = 'title',
  data = '99,999.90',
  trendText = '+99% month over month'
}: StatsCardProps) {
  return (
    <article className='stats-card-container'>
      <h3 className='stats-card-title'>{title}</h3>
      <p className='stats-card-data'>{data}</p>
      <p className='stats-card-trend'>{trendText}</p>
    </article>
  );
}

export default StatsCard;
