import { Link } from 'react-router';
import SignUpForm from '@features/SignUpForm';
import { ROUTES } from '@app/routes';

function SignUpPage() {
  return (
    <div className='auth-page-container'>
      <div className='auth-page-title-wrapper'>
        <h1 className='auth-page-title'>Create an account</h1>
        <p className='auth-page-text'>
          Enter your profile credentials
          <span>to sign up for this app</span>
        </p>
      </div>
      <SignUpForm />
      <p className='auth-page-agreement-text'>
        By clicking continue, you agree to our{' '}
        <a
          className='auth-page-external-link'
          href="https://policies.google.com/terms"
          target='_blank'
          rel='noreferrer'
        >
          Terms of Service
        </a>
        {' '}and{' '}
        <a
          className='auth-page-external-link'
          href="https://policies.google.com/privacy"
          target='_blank'
          rel='noreferrer'
        >
          Privacy Policy
        </a>
      </p>
      <p className='auth-page-text'>
        Already have an account? <Link className='auth-page-link' to={ROUTES.signIn}>Sign in</Link>
      </p>
    </div >
  );
}

export default SignUpPage;
