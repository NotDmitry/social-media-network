import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import Spinner from '@/shared/ui/Spinner';
import Footer from './Footer';
import Header from './Header';
import type { HeaderVariant } from './Header/types';
import './style.css';

interface LayoutProps {
  headerVariant: HeaderVariant;
}

function Layout({ headerVariant }: LayoutProps) {
  const { t } = useTranslation('common');

  return (
    <div className='layout-wrapper'>
      <Header variant={headerVariant} />
      <main className='layout-main'>
        <Suspense fallback={<Spinner label={t(($) => $.data.loading)} />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
