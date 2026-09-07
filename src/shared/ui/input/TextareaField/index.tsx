import { useId } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { PencilIcon, InfoIcon } from '@shared/icons';
import './style.css';

type TextareaFieldStatus = 'default' | 'invalid';

interface TextareaFieldProps extends ComponentProps<'textarea'> {
  label: string;
  labelIcon?: ReactNode;
  status?: TextareaFieldStatus;
  hintMessage?: string;
  errorMessage?: string;
}

function TextareaField({
  label,
  labelIcon = <PencilIcon />,
  status = 'default',
  hintMessage,
  errorMessage,
  className = '',
  disabled,
  id,
  maxLength = 200,
  placeholder = 'Write description here...',
  rows = 1,
  ...restProps
}: TextareaFieldProps) {
  const privateId = useId();
  const textareaId = id ?? privateId;

  const isInvalid = status === 'invalid';

  let validationMessage = '';
  if (isInvalid && errorMessage) {
    validationMessage = errorMessage;
  } else if (!isInvalid && hintMessage) {
    validationMessage = hintMessage;
  }

  return (
    <div className='input-field-wrapper'>
      <div className='input-field-label-wrapper'>
        <label
          className={`input-field-label ${disabled ? `input-field-label_disabled` : ''}`}
          htmlFor={textareaId}
          title={label}
        >
          {labelIcon}
          <span className='input-field-label-text'>{label}</span>
        </label>
      </div>

      <textarea
        {...restProps}
        className={`input-field textarea-input-field ${isInvalid ? 'input-field_invalid' : ''} ${className}`}
        disabled={disabled}
        id={textareaId}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
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
        </div>
      }
    </div>
  );
}

export default TextareaField;
