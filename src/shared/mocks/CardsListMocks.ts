import type { CardData } from '@/pages/HomePage/CardsList';
import communityBcs from '@/assets/images/test_community_bcs.jpg';
import communityDea from '@/assets/images/test_community_dea.jpg';
import communityPollos from '@/assets/images/test_community_pollos.jpg';
import userGus from '@/assets/images/test_user_gus.jpg';
import userHank from '@/assets/images/test_user_hank.jpg';
import userJesse from '@/assets/images/test_user_jesse.jpg';
import userJimmy from '@/assets/images/test_user_jimmy.jpg';
import userSkyler from '@/assets/images/test_user_skyler.jpg';

export const SUGGESTED_USERS_CARDS_DATA: CardData[] = [
  {
    id: 1,
    pictureUrl: userJesse,
    title: 'Jesse Pinkman',
    subtitle: '@cap_cook',
  },
  {
    id: 2,
    pictureUrl: userGus,
    title: 'Gustavo Fring',
    subtitle: '@chicken_man',
  },
  {
    id: 3,
    pictureUrl: userHank,
    title: 'Hank Schrader',
    subtitle: '@goodcop',
  },
  {
    id: 4,
    pictureUrl: userSkyler,
    title: 'Skyler White',
    subtitle: '@wife',
  },
  {
    id: 5,
    pictureUrl: userJimmy,
    title: 'James McGill',
    subtitle: '@itsallgoodman',
  },
];

export const SUGGESTED_COMMUNITIES_CARDS_DATA: CardData[] = [
  {
    id: 1,
    pictureUrl: communityPollos,
    title: 'Los Pollos Hermanos',
    subtitle: '13.2k members',
  },
  {
    id: 2,
    pictureUrl: communityBcs,
    title: 'Better Call Saul',
    subtitle: '2k members',
  },
  {
    id: 3,
    pictureUrl: communityDea,
    title: 'DEA',
    subtitle: '125 members',
  },
]
