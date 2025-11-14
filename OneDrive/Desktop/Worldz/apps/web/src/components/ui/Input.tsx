import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const baseStyles = 'px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2';
    const width = fullWidth ? 'w-full' : '';
    const errorStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-black';

    return (
      <div className={`${width} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${width} ${errorStyles}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 