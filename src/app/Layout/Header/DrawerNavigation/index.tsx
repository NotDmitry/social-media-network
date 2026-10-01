import { useEffect, useEffectEvent } from 'react';
import { useLocation, NavLink } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ROUTES } from '@/app/routes';
import type { HeaderVariant } from '@/app/Layout/Header/types';
import { useAuth } from '@/entities/auth/useAuth';
import Logo from '@/shared/ui/Logo';
import UserAvatar from '@/shared/ui/UserAvatar';
import './style.css';

type DrawerVariant = Exclude<HeaderVariant, 'default'>;

interface DrawerNavigationProps {
  variant: DrawerVariant,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void;
}

function DrawerNavigation({ variant, isOpen, onOpen, onClose }: DrawerNavigationProps) {
  const isMobile = useMediaQuery('screen and (width < 480px)');
  const currentLocation = useLocation();

  const { currentUser } = useAuth();
  const closeDrawer = useEffectEvent(onClose);

  useEffect(() => {
    if (!isMobile && isOpen) {
      closeDrawer();
    }
  }, [isMobile, isOpen]);

  useEffect(() => {
    closeDrawer();
  }, [currentLocation]);

  return (
    <SwipeableDrawer
      anchor='right'
      className='drawer-navigation'
      disableSwipeToOpen={true}
      elevation={0}
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      slotProps={{
        backdrop: {
          className: 'drawer-navigation-backdrop',
        },
        paper: {
          className: 'drawer-navigation-paper',
        },
      }}
    >
      <header className='drawer-navigation-header'>
        <Logo />
        {variant === 'user' && currentUser &&
          <UserAvatar
            className='drawer-navigation-avatar'
            displayName={currentUser.displayName}
            photoUrl={currentUser.profileImage}
            alt={`Profile picture of ${currentUser.displayName}`}
          />
        }
      </header>
      <List
        className='drawer-navigation-list'
        component='nav'
        disablePadding
      >
        {variant === 'guest' &&
          <>
            <ListItemButton
              className='drawer-navigation-link'
              component={NavLink}
              to={ROUTES.signUp}
            >
              Sign up
            </ListItemButton>
            <ListItemButton
              className='drawer-navigation-link'
              component={NavLink}
              to={ROUTES.signIn}
            >
              Sign in
            </ListItemButton>
          </>
        }
        {variant === 'user' &&
          <>
            <ListItemButton
              className='drawer-navigation-link'
              component={NavLink}
              to={ROUTES.profile}
              end
            >
              Profile info
            </ListItemButton>
            <ListItemButton
              className='drawer-navigation-link'
              component={NavLink}
              to={ROUTES.statistics}
            >
              Statistics
            </ListItemButton>
          </>
        }
        <ListItemButton
          className='drawer-navigation-link'
          component={NavLink}
          to={ROUTES.home}
        >
          Home
        </ListItemButton>
      </List>
    </SwipeableDrawer>
  );
}

export default DrawerNavigation;
