import type { CommentModel } from '@/entities/Comment/types';
import type { LikeModel } from '@/entities/Like/types';
import type { PostModel } from '@/entities/Post/types';

export interface ProfileStatisticsQueryData {
  mePosts: Pick<PostModel, 'id' | 'creationDate'>[],
  meLikes: Pick<LikeModel, 'id' | 'creationDate'>[],
  meComments: Pick<CommentModel, 'id' | 'creationDate'>[],
}

export interface Activity {
  creationDate: string;
}
