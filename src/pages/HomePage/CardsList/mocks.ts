import type { CardData } from './index';
import userJesse from '@assets/images/test_user_jesse.jpg';
import userGus from '@assets/images/test_user_gus.jpg';
import userHank from '@assets/images/test_user_hank.jpg';
import userSkyler from '@assets/images/test_user_skyler.jpg';
import userJimmy from '@assets/images/test_user_jimmy.jpg';
import communityPollos from '@assets/images/test_community_pollos.jpg';
import communityBcs from '@assets/images/test_community_bcs.jpg';
import communityDea from '@assets/images/test_community_dea.jpg';

export const SUGGESTED_USERS_CARDS_DATA: CardData[] = [
  {
    pictureUrl: userJesse,
    title: 'Jesse Pinkman',
    subtitle: '@cap_cook',
  },
  {
    pictureUrl: userGus,
    title: 'Gustavo Fring',
    subtitle: '@chicken_man',
  },
  {
    pictureUrl: userHank,
    title: 'Hank Schrader',
    subtitle: '@goodcop',
  },
  {
    pictureUrl: userSkyler,
    title: 'Skyler White',
    subtitle: '@wife',
  },
  {
    pictureUrl: userJimmy,
    title: 'James McGill',
    subtitle: '@itsallgoodman',
  },
];

export const SUGGESTED_COMMUNITIES_CARDS_DATA: CardData[] = [
  {
    pictureUrl: communityPollos,
    title: 'Los Pollos Hermanos',
    subtitle: '13.2k members',
  },
  {
    pictureUrl: communityBcs,
    title: 'Better Call Saul',
    subtitle: '2k members',
  },
  {
    pictureUrl: communityDea,
    title: 'DEA',
    subtitle: '125 members',
  },
]
