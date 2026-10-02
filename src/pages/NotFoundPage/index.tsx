import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { NotFoundIcon } from '@/shared/icons';
import './style.css';

interface Location {
  location: {
    id: string | number;
    name: string;
    type: string;
  }
};

interface LocationResponse {
  data: Location,
}

const GET_LOCATION_BY_ID_QUERY = `
  query GetLocationById($locationId: ID!){
    location(id: $locationId) {
      id
      name
      type
    }
  }
`;

async function getLocationById(locationId: number | string) {
  let response: Response;

  try {
    response = await fetch('https://rickandmortyapi.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_LOCATION_BY_ID_QUERY,
        variables: {
          locationId,
        }
      }),
    });
  } catch {
    throw new Error('Invalid graphql request');
  }

  try {
    return await response.json() as LocationResponse;
  } catch {
    throw new Error('Response data type mismatch');
  }
}

function NotFoundPage() {
  const { t } = useTranslation('common');

  const {
    data: queryResponse,
  } = useQuery({
    queryKey: ['rick'],
    queryFn: () => getLocationById(4),
    staleTime: 0,
    gcTime: 0,
  });

  return (
    <div className='not-found-page-container'>
      <p>Id: {queryResponse?.data.location.id ?? 'undefined'}</p>
      <p>Name: {queryResponse?.data.location.name ?? 'undefined'}</p>
      <p>Type: {queryResponse?.data.location.type ?? 'undefined'}</p>
      <NotFoundIcon className='not-found-page-icon' />
      <h1 className='not-found-page-title'>{t(($) => $.pageNotFound)}</h1>
    </div>
  );
}

export default NotFoundPage;
