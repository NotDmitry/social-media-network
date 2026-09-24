import type { CommentModel } from '@/entities/Comment/types';

export const MOCK_COMMENTS: CommentModel[] = [
  {
    id: 1,
    text: 'Ayo MR White, let\'s cook!',
    authorId: 2,
    postId: 1,
    creationDate: '2026-08-31T12:25:00.000Z',
    modifiedDate: '2026-08-31T12:25:00.000Z',
  },
  {
    id: 2,
    text: 'That\'s... that\'s actually a good point, Jesse.',
    authorId: 1,
    postId: 1,
    creationDate: '2026-08-31T12:30:00.000Z',
    modifiedDate: '2026-08-31T12:30:00.000Z',
  },
  {
    id: 3,
    text: 'What does a man do, Walter? A man provides for his family... And a man, a man provides. And he does it even when he\'s not appreciated, or respected, or even loved',
    authorId: 3,
    postId: 1,
    creationDate: '2026-08-31T12:35:00.000Z',
    modifiedDate: '2026-08-31T12:35:00.000Z',
  },
  {
    id: 4,
    text: 'Say my name',
    authorId: 1,
    postId: 3,
    creationDate: '2026-08-31T12:30:00.000Z',
    modifiedDate: '2026-08-31T12:30:00.000Z',
  },
];
