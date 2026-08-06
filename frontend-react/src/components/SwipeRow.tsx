import { useRef, useState, type ReactNode } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useDesktop } from '../lib/useMediaQuery'

const OPEN_WIDTH = 152
const THRESHOLD = 56

interface SwipeRowProps {
  children: ReactNode
  onEdit: () => void
  onDelete: () => void
}

export function SwipeRow({ children, onEdit, onDelete }: SwipeRowProps) {
  const desktop = useDesktop()

  if (desktop) {
    return (
      <div className="group relative">
        {children}
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-1 opacity-0 transition-opacity duration-150 ease-smooth group-hover:pointer-events-auto group-hover:opacity-100">
          <button
            onClick={onEdit}
            aria-label="Editar"
            className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-muted shadow-sm transition-colors duration-150 ease-smooth hover:border-primary hover:text-primary"
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={onDelete}
            aria-label="Excluir"
            className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-muted shadow-sm transition-colors duration-150 ease-smooth hover:border-danger hover:text-danger"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    )
  }

  return <SwipeableRow onEdit={onEdit} onDelete={onDelete}>{children}</SwipeableRow>
}

function SwipeableRow({ children, onEdit, onDelete }: SwipeRowProps) {
  const [offset, setOffset] = useState(0)
  const startX = useRef(0)
  const startOffset = useRef(0)
  const dragging = useRef(false)

  const close = () => setOffset(0)

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 flex">
        <button
          onClick={() => {
            close()
            onEdit()
          }}
          className="flex w-19 flex-col items-center justify-center gap-1 text-xs font-medium text-white hover:brightness-110 active:brightness-95"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Pencil className="size-4" />
          Editar
        </button>
        <button
          onClick={() => {
            close()
            onDelete()
          }}
          className="flex w-19 flex-col items-center justify-center gap-1 text-xs font-medium text-white hover:brightness-110 active:brightness-95"
          style={{ backgroundColor: 'var(--color-danger)' }}
        >
          <Trash2 className="size-4" />
          Excluir
        </button>
      </div>

      <div
        className="relative bg-surface"
        style={{
          transform: `translateX(${-offset}px)`,
          transition: dragging.current ? 'none' : 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX
          startOffset.current = offset
          dragging.current = true
        }}
        onTouchMove={(e) => {
          if (!dragging.current) return
          const delta = startX.current - e.touches[0].clientX
          setOffset(Math.min(Math.max(startOffset.current + delta, 0), OPEN_WIDTH))
        }}
        onTouchEnd={() => {
          dragging.current = false
          setOffset((current) => (current > THRESHOLD ? OPEN_WIDTH : 0))
        }}
      >
        {children}
      </div>
    </div>
  )
}
