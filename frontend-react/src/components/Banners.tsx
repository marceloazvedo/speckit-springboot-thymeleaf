import { useState } from 'react'
import { ChevronDown, FlaskConical, Share, SquarePlus, X } from 'lucide-react'
import { Button } from './ui/button'
import { navigate } from '../lib/router'

export function DemoBanner() {
  return (
    <div className="safe-top sticky top-0 z-30 border-b border-line bg-primary-soft px-4 py-2.5">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-primary">
          <FlaskConical className="size-4 shrink-0" />
          <span>
            Você está numa <strong className="font-semibold">obra de exemplo</strong>.
          </span>
        </p>
        <Button size="sm" onClick={() => navigate('/')}>
          Criar a minha
        </Button>
      </div>
    </div>
  )
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

export function InstallBanner({ onDismiss }: { onDismiss: () => void }) {
  const [open, setOpen] = useState(false)

  if (isStandalone()) return null

  return (
    <div className="mb-5 rounded-xl border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
            <SquarePlus className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Deixe o CustoCasa na sua tela de início</p>
            <p className="mt-1 text-sm text-muted">Abre em tela cheia e funciona sem internet.</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dispensar"
          className="-mt-1 -mr-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-faint active:bg-light"
        >
          <X className="size-4" />
        </button>
      </div>

      {open ? (
        <ol className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm text-muted">
          {isIOS() ? (
            <>
              <li className="flex items-center gap-2">
                <Share className="size-4 shrink-0" /> Toque em Compartilhar no Safari
              </li>
              <li className="flex items-center gap-2">
                <ChevronDown className="size-4 shrink-0" /> Role a lista para baixo
              </li>
              <li className="flex items-center gap-2">
                <SquarePlus className="size-4 shrink-0" /> Toque em “Adicionar à Tela de Início”
              </li>
            </>
          ) : (
            <>
              <li>Abra o menu do navegador</li>
              <li>Toque em “Instalar aplicativo”</li>
            </>
          )}
        </ol>
      ) : (
        <button onClick={() => setOpen(true)} className="mt-3 text-sm font-semibold text-primary">
          Como faço?
        </button>
      )}
    </div>
  )
}
