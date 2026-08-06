import type { ComponentType, ReactNode } from 'react'
import { LayoutGrid, Plus, Receipt, Settings2, Wallet } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export type Tab = 'home' | 'expenses' | 'entries' | 'settings'

const TABS: { id: Tab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Painel', icon: LayoutGrid },
  { id: 'expenses', label: 'Gastos', icon: Receipt },
  { id: 'entries', label: 'Entradas', icon: Wallet },
  { id: 'settings', label: 'Ajustes', icon: Settings2 },
]

interface NavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

export function TabBar({ active, onChange }: NavProps) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-line bg-white/60 backdrop-blur-xl md:hidden" style={{
      background: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(16px) saturate(160%)',
    }}>
      <ul className="mx-auto flex max-w-md">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const on = active === tab.id
          return (
            <li key={tab.id} className="flex-1">
              <button
                onClick={() => onChange(tab.id)}
                className={cn(
                  'flex h-16 w-full flex-col items-center justify-center gap-1 transition-all duration-200 ease-smooth relative',
                  on
                    ? 'text-primary'
                    : 'text-muted hover:text-ink',
                )}
              >
                <Icon className={cn('size-6 transition-transform', on && 'scale-110')} />
                <span className={cn(
                  'text-[11px] font-medium transition-all',
                  on && 'font-semibold text-primary'
                )}>
                  {tab.label}
                </span>
                {on && (
                  <div className="absolute bottom-0 h-1 w-8 bg-primary rounded-t-full" />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

interface SidebarProps extends NavProps {
  projectName: string
  onNewExpense: () => void
}

export function Sidebar({ active, onChange, projectName, onNewExpense }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-surface px-3 py-5 md:flex">
      <div className="px-2">
        <p className="text-base font-semibold">CustoCasa</p>
        <p className="mt-0.5 truncate text-sm text-muted">{projectName}</p>
      </div>

      <Button variant="outline" full className="mt-5" onClick={onNewExpense}>
        <Plus /> Novo gasto
      </Button>

      <ul className="mt-6 space-y-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const on = active === tab.id
          return (
            <li key={tab.id}>
              <button
                onClick={() => onChange(tab.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ease-smooth',
                  on
                    ? 'bg-primary-soft font-semibold text-primary'
                    : 'text-muted hover:bg-light hover:text-ink',
                )}
              >
                <Icon className="size-5 shrink-0" />
                {tab.label}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export function Fab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Lançar gasto"
      className="fixed right-5 bottom-[calc(3.5rem+max(env(safe-area-inset-bottom),0.5rem)+1rem)] z-40 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform duration-200 ease-smooth active:scale-95 md:hidden"
    >
      <Plus className="size-7" />
    </button>
  )
}

export function Screen({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-md px-4 pb-32 md:max-w-3xl md:px-8 md:pb-16">{children}</div>
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="safe-top pt-4 pb-5">
      <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
      {subtitle ? <p className="mt-0.5 text-sm text-muted">{subtitle}</p> : null}
    </header>
  )
}

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
  actionVariant?: 'primary' | 'success' | 'outline'
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionVariant = 'primary',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface px-5 py-10 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-light">
        <Icon className="size-6 text-faint" />
      </div>
      <p className="text-base font-medium">{title}</p>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted">{description}</p>
      {actionLabel && onAction ? (
        <Button variant={actionVariant} className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
