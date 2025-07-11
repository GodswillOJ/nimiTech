import React from 'react';
import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color,
  className = '',
}) => {
  return (
    <div
      className={`${styles.spinner} ${styles[`spinner--${size}`]} ${className}`}
      style={color ? { borderTopColor: color } : {}}
    />
  );
};

export default LoadingSpinner;
