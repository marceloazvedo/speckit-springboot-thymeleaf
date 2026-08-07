import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string
  options: { value: string; label: string }[]
}

export function Select({ className, placeholder, options, value, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        value={value ?? ''}
        className={cn(
          'h-12 w-full appearance-none rounded-lg border border-line bg-surface pr-10 pl-3 text-base outline-none transition-colors duration-150 ease-smooth hover:border-faint focus:border-primary focus:ring-2 focus:ring-primary/15',
          value ? 'text-ink' : 'text-faint',
          className,
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-ink">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted" />
    </div>
  )
}
