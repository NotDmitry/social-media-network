import { useTheme } from '@features/theme/useTheme';
import type { ThemeVariant } from '@features/theme/types';
import { getAuthUserMock } from '@entities/User/mocks';
import EditProfileForm from '@features/EditProfileForm';
import ToggleSwitch from '@shared/ui/ToggleSwitch';
import Button from '@shared/ui/Button';
import './style.css';

function ProfileInfoPage() {
  const { theme, setTheme } = useTheme();

  const authenticatedUser = getAuthUserMock();

  function toggleDarkTheme(isDarkThemeSelected: boolean) {
    const newTheme: ThemeVariant = isDarkThemeSelected ? 'dark' : 'light';
    setTheme(newTheme);
  }

  return (
    <div className='profile-info-page-container'>
      <section className='profile-info-edit-section profile-info-section'>
        <h2 className='profile-info-title'>Edit profile</h2>
        <EditProfileForm user={authenticatedUser} />
      </section>

      <div className='profile-info-side-container'>
        <section className='profile-info-preferences-section profile-info-section'>
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
        <section className='profile-info-actions-section profile-info-section'>
          <h2 className='profile-info-title'>Actions</h2>
          <Button>Logout</Button>
        </section>
      </div>
    </div>
  );
}

export default ProfileInfoPage;
