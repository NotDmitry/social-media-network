import { groupsSchema } from '@/entities/Group/schema';
import type { GroupModel } from '@/entities/Group/types';
import { protectedApiRequest } from '@/shared/api/protectedApiRequest';

const GET_GROUPS_ERROR_MESSAGE = 'Can\'t get suggested groups';

export async function getGroups(signal?: AbortSignal): Promise<GroupModel[]> {
  return protectedApiRequest(
    '/api/groups',
    {
      method: 'GET',
      signal,
    },
    {
      responseValidationSchema: groupsSchema,
      fallbackErrorMessage: GET_GROUPS_ERROR_MESSAGE,
    }
  );
}
