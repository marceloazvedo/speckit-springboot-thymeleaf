import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-150 ease-smooth select-none disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white shadow-sm hover:bg-primary/90 active:bg-primary/90',
        outline: 'border border-primary bg-surface text-primary hover:bg-primary-soft active:bg-primary-soft',
        success: 'bg-success text-white shadow-sm hover:bg-success/90 active:bg-success/90',
        successOutline: 'border border-success bg-surface text-success hover:bg-success-soft active:bg-success-soft',
        neutral: 'border border-line bg-surface text-ink hover:bg-light active:bg-light',
        ghost: 'text-muted hover:bg-light hover:text-ink active:bg-light',
        danger: 'bg-danger text-white shadow-sm hover:bg-danger/90 active:bg-danger/90',
        dangerGhost: 'border border-line bg-surface text-danger hover:bg-danger-soft active:bg-danger-soft',
      },
      size: {
        sm: 'h-10 px-3 text-sm [&_svg]:size-4',
        md: 'h-12 px-4 text-base [&_svg]:size-5',
        lg: 'h-14 px-5 text-base [&_svg]:size-5',
        icon: 'size-11 [&_svg]:size-5',
      },
      full: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, full, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn(buttonVariants({ variant, size, full }), className)} {...props} />
  )
}

export { buttonVariants }
