import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variants = {
  primary: 'bg-black text-white hover:bg-gray-900',
  secondary: 'bg-gray-200 text-black hover:bg-gray-300',
  outline: 'border border-black text-black hover:bg-gray-100',
};

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-150 transform hover:scale-105 active:scale-95';
  const width = fullWidth ? 'w-full' : '';
  const loadingStyles = isLoading ? 'opacity-60 cursor-not-allowed' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type="button"
      className={`${baseStyles} ${variants[variant]} ${width} ${loadingStyles} ${disabledStyles} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-t-2 border-gray-200 border-t-black rounded-full animate-spin mr-2 align-middle" />
      ) : null}
      {children}
    </button>
  );
} 