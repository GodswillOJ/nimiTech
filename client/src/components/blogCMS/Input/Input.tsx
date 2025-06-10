import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'datetime-local';
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  helperText?: string;
  maxLength?: number;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  helperText?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  className?: string;
}

export const Input = ({
  label,
  error,
  required = false,
  type = 'text',
  className = '',
  ...props
}: InputProps) => (
  <div className={`${styles.field} ${className}`}>
    {label && (
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
    )}
    <input
      type={type}
      className={`${styles.input} ${error ? styles.input_error : ''}`}
      {...props}
    />
    {error && <div className={styles.error}>{error}</div>}
  </div>
);

export const Textarea = ({
  label,
  error,
  required = false,
  rows = 4,
  className = '',
  ...props
}: TextareaProps) => (
  <div className={`${styles.field} ${className}`}>
    {label && (
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
    )}
    <textarea
      rows={rows}
      className={`${styles.textarea} ${error ? styles.textarea_error : ''}`}
      {...props}
    />
    {error && <div className={styles.error}>{error}</div>}
  </div>
);

export const Select = ({
  label,
  error,
  required = false,
  options = [],
  className = '',
  ...props
}: SelectProps) => (
  <div className={`${styles.field} ${className}`}>
    {label && (
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
    )}
    <select className={`${styles.select} ${error ? styles.select_error : ''}`} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <div className={styles.error}>{error}</div>}
  </div>
);
