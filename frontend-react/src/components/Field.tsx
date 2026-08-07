import { useId, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { matches } from '../lib/selectors'

interface SuggestFieldProps {
  label: string
  value: string
  options: string[]
  placeholder?: string
  autoFocus?: boolean
  onChange: (value: string) => void
}

export function SuggestField({
  label,
  value,
  options,
  placeholder,
  autoFocus,
  onChange,
}: SuggestFieldProps) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const hits = focused ? matches(options, value) : []

  return (
    <div className="relative">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        onChange={(e) => onChange(e.target.value)}
      />
      {hits.length > 0 ? (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-line bg-surface shadow-lg">
          {hits.map((hit) => (
            <li key={hit}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(hit)
                  setFocused(false)
                }}
                className="w-full px-3 py-3 text-left text-base transition-colors duration-150 ease-smooth hover:bg-primary-soft active:bg-primary-soft"
              >
                {hit}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

interface ToggleRowProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  const id = useId()
  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-3 transition-colors duration-150 ease-smooth hover:border-faint">
      <label htmlFor={id} className="text-base">
        {label}
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
