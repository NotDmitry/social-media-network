import type { CommentModel } from '@/entities/Comment/types';

export const testComment = Object.freeze<CommentModel>({
  id: 1,
  text: 'The opinion everyone cares about',
  authorId: 1,
  postId: 1,
  creationDate: '2026-06-13T09:00:00.000Z',
  modifiedDate: '2026-06-13T09:00:00.000Z',
});
