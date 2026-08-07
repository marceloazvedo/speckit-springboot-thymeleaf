import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface CheckboxProps {
  checked: boolean
  label: string
  hint?: string
  className?: string
  onCheckedChange: (checked: boolean) => void
}

export function Checkbox({ checked, label, hint, className, onCheckedChange }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition-colors',
        checked ? 'border-primary bg-primary-soft/40' : 'border-line bg-surface hover:border-faint',
        className,
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
          checked ? 'border-primary bg-primary text-white' : 'border-line bg-surface',
        )}
      >
        {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-base leading-tight">{label}</span>
        {hint ? <span className="mt-0.5 block text-sm text-muted">{hint}</span> : null}
      </span>
    </button>
  )
}
