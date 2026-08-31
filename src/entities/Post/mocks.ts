import postImage1 from '@assets/images/test_post_1.jpg';
import postImage2 from '@assets/images/test_post_2.jpg';
import postImage3 from '@assets/images/test_post_3.jpg';
import type { Post } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    imageUrl: postImage1,
    description: 'Body text for a post. Sometimes it is an observation, and sometimes it is seeking recommendations.',
    createdAt: '2026-08-31T10:00:00.000Z',
  },
  {
    id: 'post-2',
    authorId: 'user-2',
    imageUrl: postImage2,
    description: 'Look at my new CAAAAR 😍!',
    createdAt: '2026-08-31T11:00:00.000Z',
  },
  {
    id: 'post-3',
    authorId: 'user-3',
    imageUrl: postImage3,
    description: '"Los Pollos Hermanos" now opening new location in Minsk, Belarus. 🎉🎉🎉',
    createdAt: '2026-08-31T12:00:00.000Z',
  },
];
