import React from 'react';
import styles from './Checkbox.module.scss';

interface ICheckbox {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
}

export const Checkbox: React.FC<ICheckbox> = ({
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
  className = '',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={`${styles.checkbox} ${className} ${disabled ? styles.checkbox__disabled : ''}`}
    >
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        aria-label={ariaLabel}
        className={styles.checkbox__input}
      />
      <span className={styles.checkbox__checkmark}>
        {checked && !indeterminate && (
          <svg className={styles.checkbox__icon} viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708L6.5 11.707a.5.5 0 0 1-.708 0L2.646 8.561a.5.5 0 1 1 .708-.708L6.146 10.646l6.708-6.793a.5.5 0 0 1 .708 0z" />
          </svg>
        )}
        {indeterminate && (
          <svg className={styles.checkbox__icon} viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
          </svg>
        )}
      </span>
    </label>
  );
};
