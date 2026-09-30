import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/entities/auth/useAuth';
import { getProfileImageFallbackUrl } from '@/entities/User/utilities';
import Logo from '@/shared/ui/Logo';
import BurgerIcon from '@/shared/ui/BurgerIcon';
import IconButton from '@/shared/ui/IconButton';
import UserAvatar from '@/shared/ui/UserAvatar';
import DrawerNavigation from './DrawerNavigation';
import type { HeaderVariant } from './types';
import './style.css';

interface HeaderProps {
  variant: HeaderVariant;
}

function Header({ variant }: HeaderProps) {
  const { t } = useTranslation('common');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { currentUser } = useAuth();

  function handleDrawerOpen() {
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
            <Link className='link' to={ROUTES.signUp}>{t(($) => $.navigation.signUp)}</Link>
            <Link className='link' to={ROUTES.signIn}>{t(($) => $.navigation.signIn)}</Link>
          </>
        }

        {variant === 'user' && currentUser &&
          <Link className='link header-profile-link' to={ROUTES.profile}>
            <UserAvatar
              className='header-avatar'
              displayName={currentUser.displayName}
              photoUrl={getProfileImageFallbackUrl(true, currentUser.profileImage)}
              alt={t(($) => $.a11y.profilePicture, { name: currentUser.displayName })}
            />
            <span className='header-profile-name'>{currentUser.displayName}</span>
          </Link>
        }
      </nav>
      {variant !== 'default' &&
        <>
          <IconButton
            className='header-menu-button'
            type='button'
            aria-label={t(($) => $.a11y.openMobileNavigation)}
            onClick={handleDrawerOpen}
          >
            <BurgerIcon isOpen={isDrawerOpen} />
          </IconButton>
          <DrawerNavigation
            isOpen={isDrawerOpen}
            variant={variant}
            onOpen={handleDrawerOpen}
            onClose={handleDrawerClose}
          />
        </>
      }
    </AppBar>
  );
}

export default Header;
