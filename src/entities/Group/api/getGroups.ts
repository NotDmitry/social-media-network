import { groupsSchema } from '@/entities/Group/schema';
import type { GroupModel } from '@/entities/Group/types';
import { apiRequest } from '@/shared/api/apiRequest';

const GET_GROUPS_ERROR_MESSAGE = 'Can\'t get suggested groups';

export async function getGroups(signal?: AbortSignal): Promise<GroupModel[]> {
  return apiRequest(
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
