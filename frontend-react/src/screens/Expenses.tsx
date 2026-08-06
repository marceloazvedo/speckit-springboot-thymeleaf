import { useMemo, useState, type ComponentType } from 'react'
import { Receipt, Search, SearchX } from 'lucide-react'
import { EmptyState, Screen, ScreenTitle } from '../components/Chrome'
import { SwipeRow } from '../components/SwipeRow'
import { Input } from '../components/ui/input'
import { CATEGORIES, categoryLabel } from '../lib/catalog'
import { formatShort, monthLabel } from '../lib/dates'
import { formatBRL } from '../lib/money'
import { notifyWithUndo } from '../lib/notify'
import { groupByMonth, isFresh, search, sortedExpenses } from '../lib/selectors'
import { useStore } from '../lib/store'
import { cn } from '../lib/utils'
import type { Expense } from '../lib/types'

export type ExpenseFilter = null

interface ExpensesProps {
  filter: ExpenseFilter
  onFilterChange: (filter: ExpenseFilter) => void
  onEdit: (expense: Expense) => void
  onLaunch: () => void
}

export function Expenses({ filter, onFilterChange, onEdit, onLaunch }: ExpensesProps) {
  const { state, dispatch } = useStore()
  const [term, setTerm] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const groups = useMemo(() => {
    let list = sortedExpenses(state.expenses)
    if (category) list = list.filter((e) => e.categoryId === category)
    return groupByMonth(search(list, term))
  }, [state.expenses, category, term])

  const remove = (expense: Expense) => {
    dispatch({ type: 'removeExpense', id: expense.id })
    notifyWithUndo('Gasto excluído', () => dispatch({ type: 'restoreExpense', id: expense.id }))
  }

  const used = new Set(state.expenses.filter((e) => !e.deletedAt).map((e) => e.categoryId))
  const available = CATEGORIES.filter((c) => used.has(c.id))
  const filtering = term !== '' || filter !== null || category !== null

  return (
    <Screen>
      <ScreenTitle title="Gastos" />

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
        <Input
          value={term}
          placeholder="Buscar por descrição ou fornecedor"
          onChange={(e) => setTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="-mx-4 mt-3 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
        {available.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            active={category === c.id}
            onClick={() => setCategory(category === c.id ? null : c.id)}
          />
        ))}
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={filtering ? SearchX : Receipt}
          title={filtering ? 'Nada encontrado' : 'Nenhum gasto lançado'}
          description={
            filtering
              ? 'Nenhum lançamento bate com esse filtro.'
              : 'Assim que você lançar um gasto ele aparece nesta lista.'
          }
          actionLabel={filtering ? undefined : 'Lançar gasto'}
          onAction={filtering ? undefined : onLaunch}
        />
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.key}>
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-muted capitalize">
                  {monthLabel(group.key)}
                </h2>
                <span className="tabular text-sm text-muted">{formatBRL(group.total)}</span>
              </div>
              <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                {group.items.map((expense) => (
                  <li key={expense.id}>
                    <SwipeRow onEdit={() => onEdit(expense)} onDelete={() => remove(expense)}>
                      <button
                        onClick={() => onEdit(expense)}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ease-smooth hover:bg-light active:bg-light',
                          isFresh(expense.createdAt) && 'animate-flash-new',
                        )}
                      >
                        <span className="tabular w-11 shrink-0 text-sm text-faint">
                          {formatShort(expense.date)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{expense.description}</span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                            {expense.supplier ? <span>{expense.supplier}</span> : null}
                            {expense.categoryId ? (
                              <span>{categoryLabel(expense.categoryId)}</span>
                            ) : null}
                          </span>
                        </span>
                        <span className="tabular shrink-0 text-sm font-medium">
                          {formatBRL(expense.amount)}
                        </span>
                      </button>
                    </SwipeRow>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Screen>
  )
}

function Chip({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string
  icon?: ComponentType<{ className?: string }>
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors duration-150 ease-smooth',
        active ? 'bg-primary font-medium text-white' : 'border border-line bg-surface text-muted hover:border-faint hover:text-ink',
      )}
    >
      {Icon ? <Icon className="size-3.5" /> : null}
      {label}
    </button>
  )
}
