import { useTranslation } from 'react-i18next';
import { NotFoundIcon } from '@/shared/icons';
import './style.css';

function NotFoundPage() {
  const { t } = useTranslation('common');

  return (
    <div className='not-found-page-container'>
      <NotFoundIcon className='not-found-page-icon' />
      <h1 className='not-found-page-title'>{t(($) => $.pageNotFound)}</h1>
    </div>
  );
}

export default NotFoundPage;
