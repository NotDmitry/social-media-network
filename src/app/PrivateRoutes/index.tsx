import { Navigate, Outlet } from 'react-router';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/entities/auth/useAuth';
import Spinner from '@/shared/ui/Spinner';

function PrivateRoutes() {
  const { authStatus } = useAuth();

  if (authStatus === 'pending') {
    return <Spinner label='Checking your permissions' />;
  }

  return authStatus === 'authenticated' ? <Outlet /> : <Navigate to={ROUTES.signIn} replace />;
}

export default PrivateRoutes;
