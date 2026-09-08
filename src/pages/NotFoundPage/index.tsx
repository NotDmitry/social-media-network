import { NotFoundIcon } from '@shared/icons';

import './style.css';

function NotFoundPage() {
  return (
    <div className='not-found-page-container'>
      <NotFoundIcon className='not-found-page-icon' />
      <h1 className='not-found-page-title'>Page not found</h1>
    </div>
  );
}

export default NotFoundPage;
