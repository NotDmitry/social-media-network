import type { PostModel } from '@/entities/Post/types';
import postImage1 from '@/assets/images/test_post_1.jpg';
import postImage2 from '@/assets/images/test_post_2.jpg';
import postImage3 from '@/assets/images/test_post_3.jpg';

export const MOCK_POSTS: PostModel[] = [
  {
    id: 1,
    title: 'Test post',
    content: 'Body text for a post. Sometimes it is an observation, and sometimes it is seeking recommendations.',
    image: postImage1,
    authorId: 1,
    likesCount: 20,
    commentsCount: 3,
    creationDate: '2026-08-31T10:00:00.000Z',
    modifiedDate: '2026-08-31T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Car',
    content: 'Look at my new CAAAAR 😍!',
    image: postImage2,
    authorId: 2,
    likesCount: 3,
    commentsCount: 0,
    creationDate: '2026-08-31T11:00:00.000Z',
    modifiedDate: '2026-08-31T11:00:00.000Z',
  },
  {
    id: 3,
    title: 'Restaurant',
    content: '"Los Pollos Hermanos" now opening new location in Minsk, Belarus. 🎉🎉🎉',
    image: postImage3,
    authorId: 3,
    likesCount: 4,
    commentsCount: 1,
    creationDate: '2026-08-31T12:00:00.000Z',
    modifiedDate: '2026-08-31T12:00:00.000Z',
  },
];
