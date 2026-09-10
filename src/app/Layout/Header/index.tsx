import { useState } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/entities/auth/useAuth';
import Logo from '@/shared/ui/Logo';
import BurgerIcon from '@/shared/ui/BurgerIcon';
import DrawerNavigation from './DrawerNavigation';
import type { HeaderVariant } from './types';
import './style.css';

interface HeaderProps {
  variant: HeaderVariant;
}

function Header({ variant }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { currentUser } = useAuth();

  function handleMenuClick() {
    setIsDrawerOpen(true);
  }

  function handleDrawerClose() {
    setIsDrawerOpen(false);
  }

  return (
    <header className='header'>
      <Link className='header-external-link' to={ROUTES.home}>
        <Logo />
      </Link>
      <nav className='nav-panel'>
        {variant === 'guest' &&
          <>
            <Link className='link' to={ROUTES.signUp}>Sign Up</Link>
            <Link className='link' to={ROUTES.signIn}>Sign In</Link>
          </>
        }

        {variant === 'user' && currentUser &&
          <Link className='link' to={ROUTES.profile}>
            <img
              className='avatar'
              src={currentUser.profileImage ?? undefined}
              alt={`Profile picture of ${currentUser.displayName}`}
              width={24}
              height={24}
            />
            {currentUser.displayName}
          </Link>
        }
      </nav>
      {variant !== 'default' &&
        <>
          <button
            className='header-menu-button'
            type='button'
            aria-label='Open mobile navigation'
            onClick={() => { handleMenuClick() }}
          >
            <BurgerIcon isOpen={isDrawerOpen} />
          </button>
          <DrawerNavigation
            isOpen={isDrawerOpen}
            variant={variant}
            onClose={() => { handleDrawerClose() }}
          />
        </>
      }
    </header>
  );
}

export default Header;
