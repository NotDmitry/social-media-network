import { NavLink, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/app/routes';
import './style.css';

function ProfileLayout() {
  const { t } = useTranslation('common');

  return (
    <div className='profile-layout-wrapper'>
      <nav className='profile-layout-navigation'>
        <NavLink className={'profile-layout-link'} to={ROUTES.profile} end>
          {t(($) => $.navigation.profileInfo)}
        </NavLink>
        <NavLink className={'profile-layout-link'} to={ROUTES.statistics}>
          {t(($) => $.navigation.statistics)}
        </NavLink>
      </nav>

      <div className='profile-layout-content'>
        <Outlet />
      </div>
    </div>
  );
}

export default ProfileLayout;
