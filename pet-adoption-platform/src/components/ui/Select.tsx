'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', label, error, hint, options, placeholder, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium mb-1.5 text-[var(--color-foreground)]"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-2.5 
            bg-[var(--color-card)] 
            border-2 rounded-xl
            text-[var(--color-foreground)]
            transition-all duration-200
            focus:outline-none focus:ring-0
            appearance-none
            cursor-pointer
            ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'
                        }
            disabled:opacity-60 disabled:cursor-not-allowed
            ${className}
          `}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '20px',
                        paddingRight: '40px',
                    }}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {hint && !error && (
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{hint}</p>
                )}
                {error && (
                    <p className="mt-1.5 text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
