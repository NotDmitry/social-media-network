import { lazy } from 'react';
import { Outlet, Routes, Route, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '@/app/ErrorBoundary';
import Layout from '@/app/Layout';
import PrivateRoutes from '@/app/PrivateRoutes';
import ProfileLayout from '@/app/ProfileLayout';
import { ROUTES } from '@/app/routes';
import ErrorPage from '@/pages/ErrorPage';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import { useAuth } from '@/entities/auth/useAuth';
import Spinner from '@/shared/ui/Spinner';

const ProfileInfoPage = lazy(() => import('@/pages/ProfileInfoPage'));
const ProfileStatisticsPage = lazy(() => import('@/pages/ProfileStatisticsPage'));
const SignInPage = lazy(() => import('@/pages/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));

function AppRouter() {
  const { t } = useTranslation('authentication');
  const { authStatus, isUserAuthenticated } = useAuth();
  const location = useLocation();

  if (authStatus === 'pending') {
    return <Spinner label={t(($) => $.session.restoration.loading)} />
  }

  if (authStatus === 'unavailable') {
    return (
      <Routes>
        <Route element={<Layout headerVariant='default' />}>
          <Route path='*' element={<ErrorPage />} />
        </Route>
      </Routes>
    );
  }

  const retryPath = `${location.pathname}${location.search}`;

  return (
    <Routes>
      <Route element={
        <ErrorBoundary retryPath={retryPath}>
          <Outlet />
        </ErrorBoundary>
      }>

        <Route element={<Layout headerVariant={isUserAuthenticated ? 'user' : 'guest'} />}>
          <Route path={ROUTES.home} element={<HomePage />} />
        </Route>

        <Route element={<Layout headerVariant='default' />}>
          <Route path={ROUTES.signIn} element={<SignInPage />} />
          <Route path={ROUTES.signUp} element={<SignUpPage />} />
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
      </Route>

      <Route element={<Layout headerVariant='default' />}>
        <Route path={ROUTES.error} element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
