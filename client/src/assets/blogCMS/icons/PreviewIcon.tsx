import React from 'react';

interface PreviewIconProps {
  className?: string;
  size?: number;
}

export const PreviewIcon: React.FC<PreviewIconProps> = ({ className = '', size = 16 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4.5C7.305 4.5 3.27 7.26 1.5 12c1.77 4.74 5.805 7.5 10.5 7.5s8.73-2.76 10.5-7.5c-1.77-4.74-5.805-7.5-10.5-7.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
