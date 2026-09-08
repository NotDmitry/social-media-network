import { useNavigate } from 'react-router';

import { ROUTES } from '@app/routes';

import { useTheme } from '@features/theme/useTheme';
import UpdateProfileForm from '@/features/UpdateProfileForm';
import type { ThemeVariant } from '@features/theme/types';

import { useAuth } from '@entities/auth/useAuth';

import Button from '@shared/ui/Button';
import ToggleSwitch from '@shared/ui/ToggleSwitch';

import './style.css';

function ProfileInfoPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { currentUser, signOut } = useAuth();

  function logout() {
    signOut();
    void navigate(ROUTES.signIn);
  }

  function toggleDarkTheme(isDarkThemeSelected: boolean) {
    const newTheme: ThemeVariant = isDarkThemeSelected ? 'dark' : 'light';
    setTheme(newTheme);
  }

  if (currentUser === null) {
    return null;
  }

  return (
    <div className='profile-info-page-container'>
      <h1 className='visually-hidden'>Profile info page</h1>
      <section className='profile-info-edit-section profile-info-section'>
        <h2 className='profile-info-title'>Edit profile</h2>
        <UpdateProfileForm user={currentUser} />
      </section>

      <div className='profile-info-side-container'>
        <section className='profile-info-section'>
          <h2 className='profile-info-title'>Preferences</h2>
          {/* TODO: add label text directly to ToggleSwitch */}
          <div className='dark-theme-switch-container'>
            <ToggleSwitch
              ariaLabel='Switch dark mode theme'
              isToggled={theme === 'dark'}
              onToggle={toggleDarkTheme}
            />
            <span className='dark-theme-switch-label'>Dark theme</span>
          </div>
        </section>
        <section className='profile-info-section'>
          <h2 className='profile-info-title'>Actions</h2>
          <Button type='button' onClick={logout}>Logout</Button>
        </section>
      </div>
    </div>
  );
}

export default ProfileInfoPage;
