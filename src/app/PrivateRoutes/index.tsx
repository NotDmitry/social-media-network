import { Navigate, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/entities/auth/useAuth';
import Spinner from '@/shared/ui/Spinner';

function PrivateRoutes() {
  const { t } = useTranslation('authentication');
  const { authStatus } = useAuth();

  if (authStatus === 'pending') {
    return <Spinner label={t(($) => $.session.permissions.loading)} />;
  }

  return authStatus === 'authenticated' ? <Outlet /> : <Navigate to={ROUTES.signIn} replace />;
}

export default PrivateRoutes;
