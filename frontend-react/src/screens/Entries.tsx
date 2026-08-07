import { Plus, Wallet } from 'lucide-react'
import { EmptyState, Screen, ScreenTitle } from '../components/Chrome'
import { SwipeRow } from '../components/SwipeRow'
import { Button } from '../components/ui/button'
import { formatShort, monthLabel } from '../lib/dates'
import { formatBRL } from '../lib/money'
import { notifyWithUndo } from '../lib/notify'
import { groupByMonth, isFresh, sortedEntries } from '../lib/selectors'
import { useStore } from '../lib/store'
import { cn } from '../lib/utils'
import type { Entry } from '../lib/types'

interface EntriesProps {
  onEdit: (entry: Entry) => void
  onLaunch: () => void
}

export function Entries({ onEdit, onLaunch }: EntriesProps) {
  const { state, dispatch } = useStore()
  const groups = groupByMonth(sortedEntries(state.entries))

  const remove = (entry: Entry) => {
    dispatch({ type: 'removeEntry', id: entry.id })
    notifyWithUndo('Entrada excluída', () => dispatch({ type: 'restoreEntry', id: entry.id }))
  }

  return (
    <Screen>
      <ScreenTitle title="Entradas" subtitle="Registro do dinheiro que entrou na obra." />

      {groups.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Nenhuma entrada registrada"
          description="Anote aqui o dinheiro que entrou, para não perder a conta de quem transferiu o quê."
          actionLabel="Registrar entrada"
          actionVariant="success"
          onAction={onLaunch}
        />
      ) : (
        <>
          <div className="space-y-6">
            {groups.map((group) => (
              <section key={group.key}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold text-muted capitalize">
                    {monthLabel(group.key)}
                  </h2>
                  <span className="tabular text-sm font-medium text-success">
                    {formatBRL(group.total)}
                  </span>
                </div>
                <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                  {group.items.map((entry) => (
                    <li key={entry.id}>
                      <SwipeRow onEdit={() => onEdit(entry)} onDelete={() => remove(entry)}>
                        <button
                          onClick={() => onEdit(entry)}
                          className={cn(
                            'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ease-smooth hover:bg-light active:bg-light',
                            isFresh(entry.createdAt) && 'animate-flash-new',
                          )}
                        >
                          <span className="tabular w-11 shrink-0 text-sm text-faint">
                            {formatShort(entry.date)}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm">
                            {entry.notes ?? 'Entrada'}
                          </span>
                          <span className="tabular shrink-0 text-sm font-medium text-success">
                            {formatBRL(entry.amount)}
                          </span>
                        </button>
                      </SwipeRow>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <Button variant="successOutline" full size="lg" className="mt-6" onClick={onLaunch}>
            <Plus /> Registrar entrada
          </Button>
        </>
      )}
    </Screen>
  )
}
