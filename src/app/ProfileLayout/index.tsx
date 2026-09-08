import { NavLink, Outlet } from 'react-router';

import { ROUTES } from '@app/routes';

import './style.css';

function ProfileLayout() {
  return (
    <div className='profile-layout-wrapper'>
      <nav className='profile-layout-navigation'>
        <NavLink className={'profile-layout-link'} to={ROUTES.profile} end>Profile Info</NavLink>
        <NavLink className={'profile-layout-link'} to={ROUTES.statistics}>Statistics</NavLink>
      </nav>

      <div className='profile-layout-content'>
        <Outlet />
      </div>
    </div>
  );
}

export default ProfileLayout;
