import { createElement } from 'react'
import { toast } from 'sonner'
import { Check, Trash2, TriangleAlert } from 'lucide-react'

const iconClass = 'size-4 shrink-0'

export function notify(message: string): void {
  toast(message, {
    icon: createElement(Check, { className: `${iconClass} text-success` }),
  })
}

export function notifyWarning(message: string): void {
  toast(message, {
    icon: createElement(TriangleAlert, { className: `${iconClass} text-warning` }),
  })
}

export function notifyWithUndo(message: string, onUndo: () => void): void {
  toast(message, {
    icon: createElement(Trash2, { className: `${iconClass} text-faint` }),
    action: { label: 'Desfazer', onClick: onUndo },
    duration: 6000,
  })
}
