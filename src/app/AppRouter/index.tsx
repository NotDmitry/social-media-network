import { Routes, Route } from 'react-router';

import Layout from '@app/Layout';
import PrivateRoutes from '@app/PrivateRoutes';
import ProfileLayout from '@app/ProfileLayout';
import { ROUTES } from '@app/routes';

import ErrorPage from '@pages/ErrorPage';
import HomePage from '@pages/HomePage';
import NotFoundPage from '@pages/NotFoundPage';
import ProfileInfoPage from '@pages/ProfileInfoPage';
import ProfileStatisticsPage from '@pages/ProfileStatisticsPage';
import SignInPage from '@pages/SignInPage';
import SignUpPage from '@pages/SignUpPage';

import { useAuth } from '@/entities/auth/useAuth';

function AppRouter() {
  const { isUserAuthenticated } = useAuth();

  return (
    <Routes>

      <Route element={<Layout headerVariant={isUserAuthenticated ? 'user' : 'guest'} />}>
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
