import { useId } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { EnvelopeIcon, CheckIcon, CrossIcon, InfoIcon, InfoTooltipIcon } from '@shared/icons';

type TextFieldStatus = 'default' | 'valid' | 'invalid';

interface TextFieldProps extends Omit<ComponentProps<'input'>, 'type'> {
  label?: string;
  labelIcon?: ReactNode;
  status?: TextFieldStatus;
  errorMessage?: string;
  type?: 'text' | 'email';
  tooltipMessage?: string;
}

function TextField({
  label = 'Email',
  labelIcon = <EnvelopeIcon />,
  status = 'default',
  errorMessage,
  type = 'email',
  tooltipMessage,
  className = '',
  disabled,
  id,
  placeholder = 'Enter email',
  ...restProps
}: TextFieldProps) {
  const privateId = useId();
  const textInputId = id ?? privateId;

  const isInvalid = status === 'invalid';
  const isValid = status === 'valid';

  let statusIcon = null;
  if (isInvalid) {
    statusIcon = <CrossIcon className='input-field-status-icon input-field-status-icon_invalid' />
  } else if (isValid) {
    statusIcon = <CheckIcon className='input-field-status-icon input-field-status-icon_valid' />
  }

  const validationMessage = isInvalid && errorMessage ? errorMessage : '';

  return (
    <div className='input-field-wrapper'>
      <div className='input-field-label-wrapper'>
        <label
          className={`input-field-label ${disabled ? `input-field-label_disabled` : ''}`}
          htmlFor={textInputId}
          title={label}
        >
          {labelIcon}
          <span className='input-field-label-text'>{label}</span>
        </label>
        {!disabled && statusIcon}
      </div>

      <input
        {...restProps}
        type={type}
        className={`input-field ${isInvalid ? 'input-field_invalid' : ''} ${className}`}
        disabled={disabled}
        id={textInputId}
        placeholder={placeholder}
      />

      {!disabled && validationMessage &&
        <div className={`input-field-validation-wrapper`}>
          <div
            className={`input-field-validation ${isInvalid ? 'input-field-validation_invalid' : ''}`}
            title={validationMessage}
          >
            <InfoIcon />
            <span className='input-field-validation-text'>{validationMessage}</span>
          </div>
          {tooltipMessage &&
            <span title={tooltipMessage} className='input-field-tooltip-icon' aria-label='Tooltip icon'>
              <InfoTooltipIcon />
            </span>
          }
        </div>
      }
    </div >
  );
}

export default TextField;
