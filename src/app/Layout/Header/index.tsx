import type { HeaderVariant } from './types';
import { ROUTES } from '@app/routes';
import { Link } from 'react-router';
import Logo from '@shared/ui/Logo';
import './style.css';
import { useAuth } from '@/entities/auth/useAuth';

interface HeaderProps {
  variant: HeaderVariant;
}

function Header({ variant }: HeaderProps) {
  const { currentUser } = useAuth();

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

        {variant === 'user' && currentUser &&
          <Link className='link' to={ROUTES.profile}>
            <img
              className='avatar'
              src={currentUser.avatarUrl}
              alt={`Profile picture of ${currentUser.fullName}`}
              width={24}
              height={24}
            />
            {currentUser.fullName}
          </Link>
        }
      </nav>
    </header>
  );
}

export default Header;
