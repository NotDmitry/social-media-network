import type { ComponentProps } from 'react';

import './style.css';

type ButtonProps = ComponentProps<'button'>;

function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`shared-button shared-button-text ${className}`} {...props}>{children}</button>
  );
}

export default Button;
