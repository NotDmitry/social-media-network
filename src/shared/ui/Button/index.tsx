import type { ComponentProps } from 'react';
import './style.css';

type ButtonProps = ComponentProps<'button'>;

function Button({ children, ...props }: ButtonProps) {
  return (
    <button className='shared-button shared-button-text' {...props}>{children}</button>
  );
}

export default Button;
