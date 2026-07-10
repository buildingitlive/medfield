import React from 'react';

interface VerifiedMarkProps {
  size?: number;
  className?: string;
  tooltip?: string;
}

export const VerifiedMark: React.FC<VerifiedMarkProps> = ({
  size = 18,
  className = '',
  tooltip = '100% Genuine Pharmacy Certification',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center text-primary-container ${className}`}
      title={tooltip}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Leaf + Checkmark hybrid brand motif */}
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10.5 16.5L6 12L7.41 10.59L10.5 13.67L16.59 7.58L18 9L10.5 16.5Z"
          fill="currentColor"
        />
        <path
          d="M17.5 4.5C18.5 4.5 20.5 6 20.5 8C20.5 9.5 19 11 17.5 11C16 11 14.5 9.5 14.5 8C14.5 6 16.5 4.5 17.5 4.5Z"
          fill="#84d99a"
        />
      </svg>
    </span>
  );
};
