import { useTranslation } from 'react-i18next';
import { NotFoundIcon } from '@/shared/icons';
// import { useQuery } from '@tanstack/react-query';
// import type { TypedDocumentNode } from '@apollo/client';
// import { useQuery as useQueryApollo } from '@apollo/client/react';
import './style.css';
// import { gql } from '@apollo/client';

// const GET_LOCATION: TypedDocumentNode<DataResponse> = gql`
// query {
//      location(id: 4) {
//        id,
//        name,
//        type,
//      }
//    }
// `;

// function GET_QUERY_STRING() {
//   return `query {
//     location(id: 4) {
//       id,
//       name,
//       type,
//     }
//   }`;
// };

// async function getLocationById() {
//   let response: Response;

//   try {
//     response = await fetch('https://rickandmortyapi.com/graphql', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: GET_QUERY_STRING(),
//     });
//   } catch {
//     throw new Error('Bad fetch');
//   }

//   const data = await response.json() as LocationResponse;
//   return data;
// }


// interface LocationResponse {
//   id: number;
//   name: string;
//   type: string;
// };

// interface DataResponse {
//   data: LocationResponse;
// }

function NotFoundPage() {
  const { t } = useTranslation('common');

  // const {
  //   data,
  // } = useQueryApollo(GET_LOCATION, { fetchPolicy: 'cache-and-network' });


  // const {
  //   data,
  // } = useQuery({
  //   queryKey: ['rick'],
  //   queryFn: () => getLocationById(),
  // });

  return (
    <div className='not-found-page-container'>
      <p>{'Undefined'}</p>
      {/* <p>{data?.data.name ?? 'undefined'}</p> */}
      {/* <p>{data?.data.type ?? 'undefined'}</p> */}
      <NotFoundIcon className='not-found-page-icon' />
      <h1 className='not-found-page-title'>{t(($) => $.pageNotFound)}</h1>
    </div>
  );
}

export default NotFoundPage;
