import { Link } from 'react-router';
import SignInForm from '@features/SignInForm';
import { ROUTES } from '@app/routes';

function SignInPage() {
  return (
    <div className='auth-page-container'>
      <div className='auth-page-title-wrapper'>
        <h1 className='auth-page-title'>Sign in into an account</h1>
        <p className='auth-page-text'>
          Enter your email and password
          <span>to sign in into this app</span>
        </p>
      </div>
      <SignInForm />
      <p className='auth-page-text'>
        Forgot to create an account? <Link className='auth-page-link' to={ROUTES.signUp}>Sign up</Link>
      </p>
    </div >
  );
}

export default SignInPage;
