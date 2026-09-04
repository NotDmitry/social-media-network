import { Routes, Route } from 'react-router';
import { ROUTES } from '@app/routes';
import Layout from '@app/Layout';
import ProfileLayout from '@app/ProfileLayout';
import PrivateRoutes from '@app/PrivateRoutes';
import { useAuthMock } from '@shared/mocks/useAuthMock';

import HomePage from '@pages/HomePage';
import SignInPage from '@pages/SingInPage';
import SignUpPage from '@pages/SignUpPage';
import ProfileInfoPage from '@pages/ProfileInfoPage';
import ProfileStatisticsPage from '@pages/ProfileStatisticsPage';
import ErrorPage from '@pages/ErrorPage';
import NotFoundPage from '@pages/NotFoundPage';

function AppRouter() {
  const isAuthenticated = useAuthMock();

  return (
    <Routes>

      <Route element={<Layout headerVariant={isAuthenticated ? 'user' : 'guest'} />}>
        <Route path={ROUTES.home} element={<HomePage />} />
      </Route>

      <Route element={<Layout headerVariant='default' />}>
        <Route path={ROUTES.signIn} element={<SignInPage />} />
        <Route path={ROUTES.signUp} element={<SignUpPage />} />
        <Route path={ROUTES.error} element={<ErrorPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route element={<Layout headerVariant='user' />}>
          <Route path={ROUTES.profile} element={<ProfileLayout />}>
            <Route index element={<ProfileInfoPage />} />
            <Route path={ROUTES.statistics} element={<ProfileStatisticsPage />} />
          </Route>
        </Route>
      </Route>

    </Routes>
  );
}

export default AppRouter;
