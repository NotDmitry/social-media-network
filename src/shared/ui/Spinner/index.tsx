import CircularProgress from '@mui/material/CircularProgress';
import './style.css';

interface SpinnerProps {
  label?: string;
}

function Spinner({ label }: SpinnerProps) {
  return (
    <span className='spinner-wrapper'>
      <CircularProgress />
      {label &&
        <span className='spinner-label'>{label}</span>
      }
    </span>
  );
}

export default Spinner;
