import { Outlet } from 'react-router';
import type { HeaderVariant } from '@widgets/Header/types';
import Header from '@widgets/Header';
import Footer from './Footer';

interface LayoutProps {
  headerVariant: HeaderVariant;
}

function Layout({ headerVariant }: LayoutProps) {
  return (
    <>
      <Header variant={headerVariant}></Header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
