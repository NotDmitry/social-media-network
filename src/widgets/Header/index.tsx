import type { HeaderVariant } from './types';
import { ROUTES } from '@app/routes';
import { Link } from 'react-router';
import Logo from '@shared/ui/Logo';
import './style.css';
import userImage from '@assets/images/test_user_1.jpg';

interface HeaderProps {
  variant: HeaderVariant;
}

function Header({ variant }: HeaderProps) {
  return (
    <header className='header'>
      <Logo />
      <nav className='nav-panel'>
        {variant === 'guest' &&
          <>
            <Link className='link' to={ROUTES.signUp}>Sign Up</Link>
            <Link className='link' to={ROUTES.signIn}>Sign In</Link>
          </>
        }

        {variant === 'user' &&
          <Link className='link' to={ROUTES.profile}>
            <img className='avatar' src={userImage} width={24} height={24} />
            Name Surname
          </Link>
        }
      </nav>
    </header>
  );
}

export default Header;
