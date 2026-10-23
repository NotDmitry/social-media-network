import type { PostModel } from '@/entities/Post/types';
import { currentUser, testOtherPublicUser } from './userFixtures';

export const testPost = Object.freeze<PostModel>({
  id: 101,
  title: 'New post',
  content: 'I have some news to share',
  image: null,
  authorId: currentUser.id,
  likesCount: 0,
  commentsCount: 0,
  creationDate: '2026-06-13T09:00:00.000Z',
  modifiedDate: '2026-06-13T09:00:00.000Z',
});

export const testOtherPost = Object.freeze<PostModel>({
  id: 201,
  title: 'Diary of Jane',
  content: 'Jane has something to say',
  image: null,
  authorId: testOtherPublicUser.id,
  likesCount: 3,
  commentsCount: 0,
  creationDate: '2026-06-13T12:00:00.000Z',
  modifiedDate: '2026-06-13T12:00:00.000Z',
});
