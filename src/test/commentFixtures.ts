import type { CommentModel } from '@/entities/Comment/types';
import { testPost } from './postFixtures';
import { currentUser, testOtherPublicUser } from './userFixtures';

export const testComment = Object.freeze<CommentModel>({
  id: 10101,
  text: 'The opinion everyone cares about',
  authorId: currentUser.id,
  postId: testPost.id,
  creationDate: '2026-06-13T09:00:00.000Z',
  modifiedDate: '2026-06-13T09:00:00.000Z',
});

export const testNewComment = Object.freeze<CommentModel>({
  id: 10102,
  text: 'A new comment from the current user',
  authorId: currentUser.id,
  postId: testPost.id,
  creationDate: '2026-06-13T15:00:00.000Z',
  modifiedDate: '2026-06-13T15:00:00.000Z',
});

export const testOtherComment = Object.freeze<CommentModel>({
  id: 20101,
  text: 'Other user has something to say',
  authorId: testOtherPublicUser.id,
  postId: testPost.id,
  creationDate: '2026-06-13T12:00:00.000Z',
  modifiedDate: '2026-06-13T12:00:00.000Z',
});
