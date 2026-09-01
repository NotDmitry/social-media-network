import type { HeaderVariant } from './types';
import { ROUTES } from '@app/routes';
import { Link } from 'react-router';
import Logo from '@shared/ui/Logo';
import './style.css';
import { getAuthUserMock } from '@entities/User/mocks';

interface HeaderProps {
  variant: HeaderVariant;
}

function Header({ variant }: HeaderProps) {
  const authenticatedUser = getAuthUserMock();

  return (
    <header className='header'>
      <a href="https://sidekick-software.com/" target='_blank' rel='noreferrer'>
        <Logo />
      </a>
      <nav className='nav-panel'>
        {variant === 'guest' &&
          <>
            <Link className='link' to={ROUTES.signUp}>Sign Up</Link>
            <Link className='link' to={ROUTES.signIn}>Sign In</Link>
          </>
        }

        {variant === 'user' &&
          <Link className='link' to={ROUTES.profile}>
            <img
              className='avatar'
              src={authenticatedUser.avatarUrl}
              alt={`Profile picture of ${authenticatedUser.fullName}`}
              width={24}
              height={24}
            />
            {authenticatedUser.fullName}
          </Link>
        }
      </nav>
    </header>
  );
}

export default Header;
