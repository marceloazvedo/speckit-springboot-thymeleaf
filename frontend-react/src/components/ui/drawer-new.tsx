import { useEffect, type ReactNode } from 'react'
import ReactModal from 'react-modal'
import { X } from 'lucide-react'
import { useDesktop } from '../../lib/useMediaQuery'

interface DrawerProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

// Define o elemento raiz para acessibilidade
if (typeof window !== 'undefined') {
  ReactModal.setAppElement('#root')
}

export function Drawer({ open, title, description, onClose, children, footer }: DrawerProps) {
  const desktop = useDesktop()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  const customStyles = {
    content: {
      position: 'fixed' as const,
      bottom: '0',
      left: '0',
      right: '0',
      top: desktop ? '0' : 'auto',
      display: 'flex',
      flexDirection: 'column' as const,
      border: 'none',
      borderRadius: desktop ? '0' : '1.5rem 1.5rem 0 0',
      padding: '0',
      backgroundColor: 'var(--color-surface)',
      maxWidth: desktop ? '28rem' : 'none',
      marginLeft: desktop ? 'auto' : 'auto',
      marginRight: desktop ? '0' : 'auto',
      width: desktop ? 'auto' : '100%',
      maxHeight: desktop ? '100vh' : '94dvh',
      boxShadow: 'var(--shadow-lg)',
      inset: desktop ? '0 auto 0 0' : 'auto',
    },
    overlay: {
      position: 'fixed' as const,
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      zIndex: '50',
    },
  }

  return (
    <ReactModal
      isOpen={open}
      onRequestClose={onClose}
      style={customStyles}
      closeTimeoutMS={300}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-4 pt-4 pb-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-muted">{description}</p>
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

        {/* Content - scrollable */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden border-t border-line px-4 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer ? (
          <div className="shrink-0 border-t border-line bg-surface px-4 pt-3 pb-safe">
            {footer}
          </div>
        ) : null}
      </div>
    </ReactModal>
  )
}
