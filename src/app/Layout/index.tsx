import { Outlet } from 'react-router';
import type { HeaderVariant } from '@widgets/Header/types';
import Header from '@widgets/Header';
import Footer from './Footer';
import './style.css';

interface LayoutProps {
  headerVariant: HeaderVariant;
}

function Layout({ headerVariant }: LayoutProps) {
  return (
    <div className='layout-wrapper'>
      <Header variant={headerVariant}></Header>
      <main className='layout-main'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
