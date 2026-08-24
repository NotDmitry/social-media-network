import { Outlet } from 'react-router';
import type { HeaderVariant } from '@widgets/Header';
import Header from '@widgets/Header';

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
      <footer></footer>
    </>
  );
}

export default Layout;
