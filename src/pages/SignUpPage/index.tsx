import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/app/routes';
import SignUpForm from '@/features/SignUpForm';

function SignUpPage() {
  const { t } = useTranslation('authentication');
  const navigate = useNavigate();

  function handleSignUpSubmit() {
    void navigate(ROUTES.home);
  }

  return (
    <div className='auth-page-container'>
      <div className='auth-page-title-wrapper'>
        <h1 className='auth-page-title'>{t(($) => $.signUp.title)}</h1>
        <p className='auth-page-text'>
          {t(($) => $.signUp.description.main)}
          <span>{t(($) => $.signUp.description.postfix)}</span>
        </p>
      </div>
      <SignUpForm onSubmit={handleSignUpSubmit} />
      <p className='auth-page-agreement-text'>
        {t(($) => $.signUp.agreement.prefix)}{' '}
        <a
          className='auth-page-external-link'
          href='https://policies.google.com/terms'
          target='_blank'
          rel='noreferrer'
        >
          {t(($) => $.signUp.agreement.terms)}
        </a>
        {' '}{t(($) => $.signUp.agreement.conjunction)}{' '}
        <a
          className='auth-page-external-link'
          href='https://policies.google.com/privacy'
          target='_blank'
          rel='noreferrer'
        >
          {t(($) => $.signUp.agreement.policy)}
        </a>
      </p>
      <p className='auth-page-text'>
        {t(($) => $.signUp.prompt)}{' '}
        <Link className='auth-page-link' to={ROUTES.signIn}>
          {t(($) => $.signUp.link)}
        </Link>
      </p>
    </div>
  );
}

export default SignUpPage;
