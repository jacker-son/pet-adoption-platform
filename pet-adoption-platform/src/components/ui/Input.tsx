'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, hint, id, ...props }, ref) => {
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
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-2.5 
            bg-[var(--color-card)] 
            border-2 rounded-xl
            text-[var(--color-foreground)]
            placeholder:text-[var(--color-text-muted)]
            transition-all duration-200
            focus:outline-none focus:ring-0
            ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'
                        }
            disabled:opacity-60 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                />
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

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', label, error, hint, id, ...props }, ref) => {
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
                <textarea
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-2.5 
            bg-[var(--color-card)] 
            border-2 rounded-xl
            text-[var(--color-foreground)]
            placeholder:text-[var(--color-text-muted)]
            transition-all duration-200
            focus:outline-none focus:ring-0
            resize-none
            ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'
                        }
            disabled:opacity-60 disabled:cursor-not-allowed
            ${className}
          `}
                    rows={4}
                    {...props}
                />
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

Textarea.displayName = 'Textarea';
