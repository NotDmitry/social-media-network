import { Navigate, Outlet } from 'react-router';
import { ROUTES } from '@app/routes';
import { useAuth } from '@/entities/auth/useAuth';

function PrivateRoutes() {
  const { isUserAuthenticated } = useAuth();

  return isUserAuthenticated ? <Outlet /> : <Navigate to={ROUTES.signIn} replace />;
}

export default PrivateRoutes;
