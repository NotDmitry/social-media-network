import type { StatsCardProps } from '@/pages/ProfileStatisticsPage/StatsCard';

interface CardsData extends StatsCardProps {
  id: string;
}

export const CARDS_DATA: CardsData[] = [
  {
    id: 'card-1',
    title: 'title1',
    data: '45,678.90',
    trendText: '+20% month over month',
  },
  {
    id: 'card-2',
    title: 'title2',
    data: '2,405',
    trendText: '+33% month over month',
  },
  {
    id: 'card-3',
    title: 'title3',
    data: '10,353',
    trendText: '-8% month over month',
  },
]
