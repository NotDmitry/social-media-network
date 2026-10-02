import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/app/routes';
import { useTheme } from '@/features/theme/useTheme';
import UpdateProfileForm from '@/features/UpdateProfileForm';
import type { ThemeVariant } from '@/features/theme/model/types';
import { useAuth } from '@/entities/auth/useAuth';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import Button from '@/shared/ui/Button';
import ToggleSwitch from '@/shared/ui/ToggleSwitch';
import './style.css';
import LanguageSwitcher from '@/features/language/LanguageSwitcher';

function ProfileInfoPage() {
  const { t } = useTranslation(['profile', 'authentication']);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { currentUser, signOut } = useAuth();
  const { showAlert } = useAlert();

  async function handleLogoutClick() {
    setIsLoggingOut(true);

    try {
      await signOut();
      showAlert(t(($) => $.signOut.alert.success, { ns: 'authentication' }), 'success');
    } catch (error) {
      showAlert(t(($) => $.signOut.alert.warning, { ns: 'authentication' }), 'warning');
      console.error(error);
    } finally {
      setIsLoggingOut(false);
      void navigate(ROUTES.signIn, { replace: true });
    }
  }

  function handleDarkThemeToggle(isDarkThemeSelected: boolean) {
    const newTheme: ThemeVariant = isDarkThemeSelected ? 'dark' : 'light';
    setTheme(newTheme);
  }

  if (currentUser === null) {
    return null;
  }

  return (
    <div className='profile-info-page-container'>
      <h1 className='visually-hidden'>{t(($) => $.info.title)}</h1>
      <section className='profile-info-edit-section profile-info-section'>
        <h2 className='profile-info-title'>{t(($) => $.info.edit)}</h2>
        <UpdateProfileForm user={currentUser} />
      </section>

      <div className='profile-info-side-container'>
        <section className='profile-info-section'>
          <h2 className='profile-info-title'>{t(($) => $.info.preferences)}</h2>
          <div className='profile-info-preferences'>
            <ToggleSwitch
              label={t(($) => $.info.darkTheme)}
              isToggled={theme === 'dark'}
              onToggle={handleDarkThemeToggle}
            />
            <LanguageSwitcher />
          </div>
        </section>
        <section className='profile-info-section'>
          <h2 className='profile-info-title'>{t(($) => $.info.actions)}</h2>
          <Button type='button' disabled={isLoggingOut} onClick={() => void handleLogoutClick()}>
            {isLoggingOut
              ? t(($) => $.signOut.button.pending, { ns: 'authentication' })
              : t(($) => $.signOut.button.default, { ns: 'authentication' })
            }
          </Button>
        </section>
      </div>
    </div>
  );
}

export default ProfileInfoPage;
