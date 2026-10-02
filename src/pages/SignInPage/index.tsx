import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/app/routes';
import SignInForm from '@/features/SignInForm';

function SignInPage() {
  const { t } = useTranslation('authentication');
  const navigate = useNavigate();

  function handleSignInSubmit() {
    void navigate(ROUTES.home);
  }

  return (
    <div className='auth-page-container'>
      <div className='auth-page-title-wrapper'>
        <h1 className='auth-page-title'>{t(($) => $.signIn.title)}</h1>
        <p className='auth-page-text'>
          {t(($) => $.signIn.description.main)}
          <span>{t(($) => $.signIn.description.postfix)}</span>
        </p>
      </div>
      <SignInForm onSubmit={handleSignInSubmit} />
      <p className='auth-page-text'>
        {t(($) => $.signIn.prompt)}{' '}
        <Link className='auth-page-link' to={ROUTES.signUp}>
          {t(($) => $.signIn.link)}
        </Link>
      </p>
    </div>
  );
}

export default SignInPage;
