import { useId } from 'react'
import { Label } from './ui/label'
import { digitsToCents, formatAmount } from '../lib/money'
import { cn } from '../lib/utils'
import type { Cents } from '../lib/types'

interface MoneyInputProps {
  label: string
  value: Cents
  autoFocus?: boolean
  large?: boolean
  readOnly?: boolean
  hint?: string
  onChange?: (cents: Cents) => void
}

export function MoneyInput({
  label,
  value,
  autoFocus,
  large,
  readOnly,
  hint,
  onChange,
}: MoneyInputProps) {
  const id = useId()

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div
        className={cn(
          'flex items-baseline gap-2 rounded-lg border px-3 transition-colors',
          large ? 'py-3' : 'py-3',
          readOnly
            ? 'border-line bg-light'
            : 'border-line bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15',
        )}
      >
        <span className={cn('text-muted', large ? 'text-xl' : 'text-base')}>R$</span>
        <input
          id={id}
          inputMode="numeric"
          pattern="[0-9]*"
          autoFocus={autoFocus}
          readOnly={readOnly}
          className={cn(
            'tabular w-full bg-transparent outline-none',
            large ? 'text-3xl font-semibold' : 'text-base',
            readOnly && 'text-muted',
          )}
          value={formatAmount(value)}
          onChange={(e) => onChange?.(digitsToCents(e.target.value))}
          onFocus={(e) => e.currentTarget.setSelectionRange(999, 999)}
        />
      </div>
      {hint ? <p className="mt-1.5 text-sm text-muted">{hint}</p> : null}
    </div>
  )
}
