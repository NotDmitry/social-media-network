import { Outlet } from 'react-router';
import Footer from './Footer';
import Header from './Header';
import type { HeaderVariant } from './Header/types';
import './style.css';

interface LayoutProps {
  headerVariant: HeaderVariant;
}

function Layout({ headerVariant }: LayoutProps) {
  return (
    <div className='layout-wrapper'>
      <Header variant={headerVariant} />
      <main className='layout-main'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
