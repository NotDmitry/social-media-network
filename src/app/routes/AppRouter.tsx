import { Routes, Route } from 'react-router';
import { ROUTES } from './routes';
import Layout from '../layout/Layout';

import HomePage from '@/pages/HomePage';
import SignInPage from '@/pages/SingInPage';
import SignUpPage from '@/pages/SignUpPage';
import ProfilePage from '@/pages/ProfilePage';
import ErrorPage from '@/pages/ErrorPage';
import NotFoundPage from '@/pages/NotFoundPage';

function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout headerVariant={'guest'} />}>
        <Route path={ROUTES.home} element={<HomePage />} />
      </Route>

      <Route element={<Layout headerVariant='default' />}>
        <Route path={ROUTES.signIn} element={<SignInPage />} />
        <Route path={ROUTES.signUp} element={<SignUpPage />} />
        <Route path={ROUTES.error} element={<ErrorPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>

      <Route element={<Layout headerVariant='user' />}>
        <Route path={ROUTES.profile} element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
