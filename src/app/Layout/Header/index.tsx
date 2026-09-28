import { useState } from 'react';
import { Link } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
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
    <AppBar
      className='header'
      position='sticky'
      elevation={0}
    >
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
          <Link className='link header-profile-link' to={ROUTES.profile}>
            <Avatar
              className='avatar header-avatar'
              src={currentUser.profileImage ?? undefined}
              alt={`Profile picture of ${currentUser.displayName}`}
            >
              {currentUser.displayName.charAt(0)}
            </Avatar>
            <span className='header-profile-name'>{currentUser.displayName}</span>
          </Link>
        }
      </nav>
      {variant !== 'default' &&
        <>
          <IconButton
            className='header-menu-button'
            type='button'
            aria-label='Open mobile navigation'
            onClick={handleMenuClick}
          >
            <BurgerIcon isOpen={isDrawerOpen} />
          </IconButton>
          <DrawerNavigation
            isOpen={isDrawerOpen}
            variant={variant}
            onClose={handleDrawerClose}
          />
        </>
      }
    </AppBar>
  );
}

export default Header;
