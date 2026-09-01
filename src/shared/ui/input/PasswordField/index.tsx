import { useId, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import {
  KeyboardIcon,
  CheckIcon,
  CrossIcon,
  InfoIcon,
  InfoTooltipIcon,
  ThumbUpIcon,
  EyeIcon,
  EyeCrossedIcon,
} from '@shared/icons';
import './style.css';

type PasswordFieldStatus = 'default' | 'valid' | 'invalid';

interface PasswordFieldProps extends Omit<ComponentProps<'input'>, 'type'> {
  label?: string;
  labelIcon?: ReactNode;
  status?: PasswordFieldStatus;
  errorMessage?: string;
  tooltipMessage?: string;
  infoMessage?: string;
}

function PasswordField({
  label = 'Password',
  labelIcon = <KeyboardIcon />,
  status = 'default',
  errorMessage,
  tooltipMessage,
  infoMessage,
  className = '',
  disabled,
  id,
  placeholder = 'Enter password...',
  ...restProps
}: PasswordFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const privateId = useId();
  const passwordInputId = id ?? privateId;

  const isInvalid = status === 'invalid';
  const isValid = status === 'valid';

  let statusIcon = null;
  if (isInvalid) {
    statusIcon = <CrossIcon className='input-field-status-icon input-field-status-icon_invalid' />
  } else if (isValid) {
    statusIcon = <CheckIcon className='input-field-status-icon input-field-status-icon_valid' />
  }

  let validationMessage = '';
  let validationClassName = 'input-field-validation';

  if (isInvalid && errorMessage) {
    validationMessage = errorMessage;
    validationClassName = `${validationClassName} input-field-validation_invalid`;
  } else if (isValid && infoMessage) {
    validationMessage = infoMessage;
    validationClassName = `${validationClassName} input-field-validation_valid`;
  }

  function togglePasswordVisibility() {
    setIsPasswordVisible((isVisible) => !isVisible);
  }

  return (
    <div className='input-field-wrapper'>
      <div className='input-field-label-wrapper'>
        <label
          className={`input-field-label ${disabled ? `input-field-label_disabled` : ''}`}
          htmlFor={passwordInputId}
        >
          {labelIcon}
          <span>{label}</span>
        </label>
        {!disabled && statusIcon}
      </div>

      <div className='password-input-container'>
        <input
          {...restProps}
          type={isPasswordVisible ? 'text' : 'password'}
          className={`input-field password-input-field ${isInvalid ? 'input-field_invalid' : ''} ${className}`}
          disabled={disabled}
          id={passwordInputId}
          placeholder={placeholder}
        />
        {status !== 'default' &&
          <button className='toggle-password-button' onClick={togglePasswordVisibility}>
            {isPasswordVisible ? <EyeCrossedIcon /> : <EyeIcon />}
          </button>
        }
      </div>

      {!disabled && validationMessage &&
        <div className={`input-field-validation-wrapper`}>
          <div className={validationClassName}>
            {isInvalid ? <InfoIcon /> : <ThumbUpIcon />}
            <span>{validationMessage}</span>
          </div>
          {tooltipMessage && isInvalid &&
            <span title={tooltipMessage} className='input-field-tooltip-icon'>
              <InfoTooltipIcon />
            </span>
          }
        </div>
      }
    </div >
  );
}

export default PasswordField;
