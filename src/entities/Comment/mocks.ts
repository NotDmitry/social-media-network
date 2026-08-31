import type { Comment } from './types';

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    authorId: 'user-2',
    content: 'Ayo MR White, let\'s cook!',
    createdAt: '2026-08-31T12:25:00.000Z',
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    authorId: 'user-1',
    content: 'That\'s... that\'s actually a good point, Jesse.',
    createdAt: '2026-08-31T12:30:00.000Z',
  },
  {
    id: 'comment-3',
    postId: 'post-1',
    authorId: 'user-3',
    content: 'What does a man do, Walter? A man provides for his family... And a man, a man provides. And he does it even when he\'s not appreciated, or respected, or even loved',
    createdAt: '2026-08-31T12:35:00.000Z',
  },
  {
    id: 'comment-4',
    postId: 'post-3',
    authorId: 'user-1',
    content: 'Say my name',
    createdAt: '2026-08-31T12:30:00.000Z',
  },
];
