import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const base =
  'w-full rounded-lg border border-line bg-surface text-base text-ink outline-none transition-colors duration-150 ease-smooth placeholder:text-faint hover:border-faint focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-50'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, 'h-12 px-3', className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, 'resize-none px-3 py-3', className)} {...props} />
}
