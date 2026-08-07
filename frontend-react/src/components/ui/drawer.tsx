import type { ReactNode } from 'react'
import { Drawer as Vaul } from 'vaul'
import { X } from 'lucide-react'
import { useDesktop } from '../../lib/useMediaQuery'
import { cn } from '../../lib/utils'

interface DrawerProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Drawer({ open, title, description, onClose, children, footer }: DrawerProps) {
  const desktop = useDesktop()

  return (
    <Vaul.Root
      open={open}
      onOpenChange={(next) => !next && onClose()}
      direction={desktop ? 'right' : 'bottom'}
      repositionInputs={false}
    >
      <Vaul.Portal>
        <Vaul.Overlay className="fixed inset-0 z-50 bg-dark/40" />
        <Vaul.Content
          className={cn(
            'fixed z-50 flex flex-col border-line bg-surface outline-none',
            desktop
              ? 'inset-y-0 right-0 h-dvh w-full max-w-lg border-l'
              : 'inset-x-0 bottom-0 max-h-[94vh] rounded-t-2xl border-t',
          )}
        >
          {desktop ? null : (
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line" />
          )}

          <div
            className={cn(
              'flex shrink-0 items-start justify-between gap-3 px-4 pb-3',
              desktop ? 'safe-top pt-5' : 'pt-3',
            )}
          >
            <div className="min-w-0">
              <Vaul.Title className="text-base font-semibold text-ink">{title}</Vaul.Title>
              {description ? (
                <Vaul.Description className="mt-0.5 text-sm text-muted">
                  {description}
                </Vaul.Description>
              ) : (
                <Vaul.Description className="sr-only">{title}</Vaul.Description>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="-mt-1 -mr-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors duration-150 ease-smooth hover:bg-light hover:text-ink active:bg-light"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-line px-4 py-4">
            {children}
          </div>

          {footer ? (
            <div className="safe-bottom shrink-0 border-t border-line px-4 pt-3">{footer}</div>
          ) : null}
        </Vaul.Content>
      </Vaul.Portal>
    </Vaul.Root>
  )
}
