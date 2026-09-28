import { useLocation, useNavigate } from 'react-router';
import { errorRouteStateSchema, ROUTES } from '@/app/routes';
import { ErrorIcon } from '@/shared/icons';
import Button from '@/shared/ui/Button';
import './style.css';

function ErrorPage() {
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
          <span>Oops...</span>
          Something bad just happened
        </h1>
        <p className='error-page-message'>Please try again or navigate Home</p>
        <div className='error-page-actions'>
          <Button type='button' onClick={handleRetry}>Retry</Button>
          <Button type='button' onClick={handleHomeNavigation}>Home</Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
