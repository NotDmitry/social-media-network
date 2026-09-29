import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { errorRouteStateSchema, ROUTES } from '@/app/routes';
import { ErrorIcon } from '@/shared/icons';
import Button from '@/shared/ui/Button';
import './style.css';

function ErrorPage() {
  const { t } = useTranslation('errorPage');
  const location = useLocation();
  const navigate = useNavigate();
  const errorRouteState = errorRouteStateSchema.safeParse(location.state);
  const retryPath = errorRouteState.success ? errorRouteState.data.retryPath : undefined;

  function handleRetry() {
    if (retryPath) {
      void navigate(retryPath, { replace: true });

      return;
    }

    window.location.reload();
  }

  function handleHomeNavigation() {
    void navigate(ROUTES.home, { replace: true });
  }

  return (
    <div className='error-page-container'>
      <ErrorIcon className='error-page-icon' />
      <div className='error-page-main-content'>
        <h1 className='error-page-title'>
          <span>{t(($) => $.title.prefix)}</span>
          {t(($) => $.title.main)}
        </h1>
        <p className='error-page-message'>{t(($) => $.message)}</p>
        <div className='error-page-actions'>
          <Button type='button' onClick={handleRetry}>{t(($) => $.actions.retry)}</Button>
          <Button type='button' onClick={handleHomeNavigation}>{t(($) => $.actions.home)}</Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
