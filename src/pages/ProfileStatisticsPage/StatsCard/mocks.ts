import type { StatsCardProps } from './index';

interface CardsData extends StatsCardProps {
  id: string;
}

export const CARDS_DATA: CardsData[] = [
  {
    id: crypto.randomUUID(),
    title: 'title1',
    data: '45,678.90',
    trendText: '+20% month over month',
  },
  {
    id: crypto.randomUUID(),
    title: 'title2',
    data: '2,405',
    trendText: '+33% month over month',
  },
  {
    id: crypto.randomUUID(),
    title: 'title3',
    data: '10,353',
    trendText: '-8% month over month',
  },
]
