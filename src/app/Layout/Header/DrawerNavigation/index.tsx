import { useEffect, useRef } from 'react';
import { useAuth } from '@entities/auth/useAuth';
import type { HeaderVariant } from '@app/Layout/Header/types';
import { NavLink, useLocation } from 'react-router';
import Logo from '@shared/ui/Logo';
import { ROUTES } from '@app/routes';
import './style.css';

type DrawerVariant = Exclude<HeaderVariant, 'default'>;

interface DrawerNavigationProps {
  variant: DrawerVariant,
  isOpen: boolean,
  onClose: () => void;
}

function DrawerNavigation({ variant, isOpen, onClose }: DrawerNavigationProps) {
  const dialogElementRef = useRef<HTMLDialogElement | null>(null);
  const currentLocation = useLocation();

  const { currentUser } = useAuth();

  function handleNavigationClose(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  useEffect(() => {
    if (isOpen) {
      dialogElementRef.current?.showModal();
    } else {
      dialogElementRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    dialogElementRef.current?.close();
  }, [currentLocation]);

  useEffect(() => {
    const windowResizeMediaQuery = window.matchMedia('screen and (width >= 480px)');
    const dialogElement = dialogElementRef.current;

    const handleWindowResize = () => {
      if (windowResizeMediaQuery.matches) {
        dialogElement?.close();
      }
    }

    windowResizeMediaQuery.addEventListener('change', handleWindowResize);

    return () => {
      windowResizeMediaQuery.removeEventListener('change', handleWindowResize);
    };
  }, []);

  return (
    <dialog
      className='drawer-navigation-dialog'
      ref={dialogElementRef}
      onClose={onClose}
      onClick={handleNavigationClose}
    >
      <div className='drawer-navigation-wrapper'>
        <header className='drawer-navigation-header'>
          <Logo />
          {variant === 'user' && currentUser &&
            <img
              className='avatar'
              src={currentUser.avatarUrl}
              alt={`Profile picture of ${currentUser.fullName}`}
              width={24}
              height={24}
            />
          }
        </header>
        <nav className='drawer-navigation-list'>
          {variant === 'guest' &&
            <>
              <NavLink
                className='drawer-navigation-link'
                to={ROUTES.signUp}
                onClick={onClose}
              >
                Sign up
              </NavLink>
              <NavLink
                className='drawer-navigation-link'
                to={ROUTES.signIn}
                onClick={onClose}
              >
                Sign in
              </NavLink>
            </>
          }
          {variant === 'user' &&
            <>
              <NavLink
                className='drawer-navigation-link'
                to={ROUTES.profile}
                end
                onClick={onClose}
              >
                Profile info
              </NavLink>
              <NavLink
                className='drawer-navigation-link'
                to={ROUTES.statistics}
                onClick={onClose}
              >
                Statistics
              </NavLink>
            </>
          }
          <NavLink
            className='drawer-navigation-link'
            to={ROUTES.home}
            onClick={onClose}
          >
            Home
          </NavLink>
        </nav>
      </div>
    </dialog>
  );
}

export default DrawerNavigation;
