import { ReactNode } from 'react';

interface ButtonProps {
  title?: string;
  icon?: ReactNode;
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}

export const Button = ({
  title,
  icon,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  ...props
}: ButtonProps) => {
  const buttonStyles = {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: 'none',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
    },
    primary: {
      backgroundColor: '#88199a',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'white',
      color: '#374151',
      border: '1px solid #d1d5db',
    },
    danger: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#374151',
      border: '1px solid transparent',
    },
    small: { padding: '6px 12px', fontSize: '14px' },
    medium: { padding: '12px 24px', fontSize: '14px' },
    large: { padding: '16px 32px', fontSize: '16px' },
  };

  const style = {
    ...buttonStyles.base,
    ...buttonStyles[variant],
    ...buttonStyles[size],
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <button style={style} disabled={disabled} onClick={onClick} className={className} {...props}>
      {icon && <span>{icon}</span>}
      {title && <span>{title}</span>}
      {children}
    </button>
  );
};
