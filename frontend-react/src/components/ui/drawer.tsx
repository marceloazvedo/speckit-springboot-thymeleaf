import { useEffect, useRef, type ReactNode } from 'react'
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
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && contentRef.current) {
      // Scroll para o topo quando abre
      const scrollDiv = contentRef.current.querySelector('.overflow-y-auto') as HTMLElement
      if (scrollDiv) {
        scrollDiv.scrollTop = 0
      }
    }
  }, [open])

  return (
    <Vaul.Root
      open={open}
      onOpenChange={(next) => !next && onClose()}
      direction={desktop ? 'right' : 'bottom'}
      repositionInputs={false}
      {...(!desktop && {
        snapPoints: [0.9, 1],
      })}
    >
      <Vaul.Portal>
        <Vaul.Overlay className="fixed inset-0 z-50 bg-dark/60" />
        {!desktop && (
          <div className="pointer-events-none fixed inset-x-0 top-0 z-40 min-h-screen bg-dark/20 animate-in fade-in duration-1000" />
        )}
        <Vaul.Content
          ref={contentRef}
          className={cn(
            'fixed z-90 flex flex-col border-line bg-surface outline-none overflow-x-hidden',
            desktop
              ? 'inset-y-0 right-0 h-screen w-full max-w-lg border-l'
              : 'inset-y-0 inset-x-0 w-full h-screen rounded-t-2xl border-t',
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

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden border-t border-line px-4 py-4">
            {children}
          </div>

          {footer ? (
            <div className="safe-bottom shrink-0 border-t border-line bg-surface px-4 py-4 pb-6">
              {footer}
            </div>
          ) : null}
        </Vaul.Content>
      </Vaul.Portal>
    </Vaul.Root>
  )
}
