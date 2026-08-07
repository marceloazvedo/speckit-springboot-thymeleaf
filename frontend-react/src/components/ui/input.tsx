import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const base =
  'w-full max-w-full min-w-0 box-border rounded-lg border border-line bg-surface text-base text-ink outline-none transition-colors duration-150 ease-smooth placeholder:text-faint hover:border-faint focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-50'

export function Input({ className, type, style, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const isDate = type === 'date'
  return (
    <input
      type={type}
      className={cn(
        base,
        'h-12 px-3',
        isDate && 'font-mono',
        className
      )}
      style={{
        ...(isDate && {
          appearance: 'none',
          WebkitAppearance: 'none',
          WebkitBorderRadius: '0.5rem',
        }),
        ...style,
      }}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, 'resize-none px-3 py-3', className)} {...props} />
}
