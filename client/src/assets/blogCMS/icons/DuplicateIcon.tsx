import React from 'react';

interface DuplicateIconProps {
  className?: string;
  size?: number;
}

export const DuplicateIcon: React.FC<DuplicateIconProps> = ({ className = '', size = 16 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        ry="2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
