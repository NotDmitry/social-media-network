import { Navigate, Outlet } from 'react-router';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/entities/auth/useAuth';

function PrivateRoutes() {
  const { authStatus } = useAuth();

  // TODO: show spinner
  if (authStatus === 'pending') {
    return null;
  }

  return authStatus === 'authenticated' ? <Outlet /> : <Navigate to={ROUTES.signIn} replace />;
}

export default PrivateRoutes;
