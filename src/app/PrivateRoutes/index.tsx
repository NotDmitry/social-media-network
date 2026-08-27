import { Navigate, Outlet } from 'react-router';
import { ROUTES } from '@app/routes';
import { useAuthMock } from '@shared/mocks/useAuthMock';

function PrivateRoutes() {
  const isAuthenticated = useAuthMock();

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.signIn} replace />;
}

export default PrivateRoutes;
