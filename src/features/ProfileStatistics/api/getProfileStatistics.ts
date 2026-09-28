import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { ProfileStatisticsQueryData } from '../types';

export const GET_PROFILE_STATISTICS: TypedDocumentNode<ProfileStatisticsQueryData> = gql`
  query GetProfileStatistics {
    mePosts {
      id
      creationDate
    }

    meLikes {
      id
      creationDate
    }

    meComments {
      id
      creationDate
    }
  }
`;
