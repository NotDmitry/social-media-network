import './style.css';

interface BurgerIconProps {
  isOpen?: boolean;
}

function BurgerIcon({ isOpen = false }: BurgerIconProps) {
  return (
    <div className={`burger-icon-wrapper ${isOpen ? 'burger-icon-wrapper_open' : ''}`}>
      <span className='burger-icon-line' />
      <span className='burger-icon-line' />
      <span className='burger-icon-line' />
    </div >
  );
}

export default BurgerIcon;
