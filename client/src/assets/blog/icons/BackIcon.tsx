import React from 'react';

interface BackIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const BackIcon: React.FC<BackIconProps> = ({ className, ...props }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    {...props}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
