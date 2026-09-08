import { ErrorIcon } from '@shared/icons';
import './style.css';

function ErrorPage() {
  return (
    <div className='error-page-container'>
      <ErrorIcon className='error-page-icon' />
      <h1 className='error-page-title'>
        <span>Oops...</span>
        Something bad just happened
      </h1>
    </div>
  );
}

export default ErrorPage;
