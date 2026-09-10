import { useNavigate, Link } from 'react-router';
import { ROUTES } from '@/app/routes';
import SignInForm from '@/features/SignInForm';

function SignInPage() {
  const navigate = useNavigate();

  function handleSignInSubmit() {
    void navigate(ROUTES.home);
  }

  return (
    <div className='auth-page-container'>
      <div className='auth-page-title-wrapper'>
        <h1 className='auth-page-title'>Sign in into an account</h1>
        <p className='auth-page-text'>
          Enter your email and password
          <span>to sign in into this app</span>
        </p>
      </div>
      <SignInForm onSubmit={handleSignInSubmit} />
      <p className='auth-page-text'>
        Forgot to create an account? <Link className='auth-page-link' to={ROUTES.signUp}>Sign up</Link>
      </p>
    </div>
  );
}

export default SignInPage;
