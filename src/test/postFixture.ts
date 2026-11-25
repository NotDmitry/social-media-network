import type { PostModel } from '@/entities/Post/types';

export const testPost = Object.freeze<PostModel>({
  id: 1,
  title: 'New post',
  content: 'I have some news to share',
  image: null,
  authorId: 1,
  likesCount: 0,
  commentsCount: 0,
  creationDate: '2026-06-13T09:00:00.000Z',
  modifiedDate: '2026-06-13T09:00:00.000Z',
});
