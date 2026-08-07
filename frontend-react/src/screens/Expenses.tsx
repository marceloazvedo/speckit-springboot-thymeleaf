import { useEffect, useMemo, useState } from 'react'
import { Receipt, SearchX } from 'lucide-react'
import { EmptyState, Screen, ScreenTitle } from '../components/Chrome'
import { FilterPanel } from '../components/FilterPanel'
import { SwipeRow } from '../components/SwipeRow'
import { Input } from '../components/ui/input'
import { categoryLabel } from '../lib/catalog'
import { formatShort, monthLabel } from '../lib/dates'
import { formatBRL } from '../lib/money'
import { notifyWithUndo } from '../lib/notify'
import { applyFilters, getUniqueSuppliers, getUniquePaymentMethods, getUniqueBanks, isFresh } from '../lib/selectors'
import { useStore } from '../lib/store'
import { cn } from '../lib/utils'
import type { Expense, ExpenseFilters } from '../lib/types'

const STORAGE_KEY = 'custocasa_expense_filters'

const DEFAULT_FILTERS: ExpenseFilters = {
  dateFrom: null,
  dateTo: null,
  suppliers: [],
  categories: [],
  paymentMethods: [],
  banks: [],
  minValue: 0,
  maxValue: 0,
  hasQuantity: false,
  noCategory: false,
  withNotes: false,
  sortBy: 'recent',
}

interface ExpensesProps {
  onEdit: (expense: Expense) => void
  onLaunch: () => void
}

export function Expenses({ onEdit, onLaunch }: ExpensesProps) {
  const { state, dispatch } = useStore()
  const [term, setTerm] = useState('')
  const [filters, setFilters] = useState<ExpenseFilters>(DEFAULT_FILTERS)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setFilters(JSON.parse(saved))
      } catch {
        setFilters(DEFAULT_FILTERS)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  }, [filters])

  const suppliers = useMemo(() => getUniqueSuppliers(state.expenses), [state.expenses])
  const paymentMethods = useMemo(() => getUniquePaymentMethods(state.expenses), [state.expenses])
  const banks = useMemo(() => getUniqueBanks(state.expenses), [state.expenses])

  const filtered = useMemo(() => applyFilters(state.expenses, filters), [state.expenses, filters])
  const searched = useMemo(() => {
    const needle = term.trim().toLowerCase()
    if (needle === '') return filtered
    return filtered.filter(
      (e) =>
        e.description.toLowerCase().includes(needle) ||
        (e.supplier ?? '').toLowerCase().includes(needle),
    )
  }, [filtered, term])

  const groups = useMemo(() => {
    const grouped = new Map<string, Expense[]>()
    for (const e of searched) {
      const key = e.date.substring(0, 7)
      const bucket = grouped.get(key)
      if (bucket) bucket.push(e)
      else grouped.set(key, [e])
    }

    return Array.from(grouped.entries())
      .map(([key, items]) => ({
        key,
        items: items.sort((a, b) => b.date.localeCompare(a.date)),
        total: items.reduce((sum, i) => sum + i.amount, 0),
      }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
  }, [searched])

  const remove = (expense: Expense) => {
    dispatch({ type: 'removeExpense', id: expense.id })
    notifyWithUndo('Gasto excluído', () => dispatch({ type: 'restoreExpense', id: expense.id }))
  }

  const isFiltered =
    term !== '' ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.suppliers.length > 0 ||
    filters.categories.length > 0 ||
    filters.paymentMethods.length > 0 ||
    filters.banks.length > 0 ||
    filters.minValue > 0 ||
    filters.maxValue > 0 ||
    filters.hasQuantity ||
    filters.noCategory ||
    filters.withNotes

  return (
    <Screen>
      <ScreenTitle title="Gastos" />

      <div className="relative mb-3">
        <Input
          value={term}
          placeholder="Buscar descrição ou fornecedor"
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs text-primary hover:text-primary/80 mb-4 transition-colors"
      >
        {showAdvanced ? '▼' : '▶'} Busca avançada
      </button>

      {showAdvanced && (
        <FilterPanel
          filters={filters}
          suppliers={suppliers}
          paymentMethods={paymentMethods}
          banks={banks}
          onFiltersChange={setFilters}
        />
      )}

      {groups.length === 0 ? (
        <EmptyState
          icon={isFiltered ? SearchX : Receipt}
          title={isFiltered ? 'Nada encontrado' : 'Nenhum gasto lançado'}
          description={
            isFiltered
              ? 'Nenhum lançamento bate com esse filtro.'
              : 'Assim que você lançar um gasto ele aparece nesta lista.'
          }
          actionLabel={isFiltered ? undefined : 'Lançar gasto'}
          actionVariant="outline"
          onAction={isFiltered ? undefined : onLaunch}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-light px-4 py-2.5">
            <span className="text-sm font-medium text-ink">
              {searched.length} {searched.length === 1 ? 'gasto' : 'gastos'}
            </span>
            <span className="tabular text-sm font-semibold text-primary">
              {formatBRL(searched.reduce((sum, e) => sum + e.amount, 0))}
            </span>
          </div>

          {groups.map((group) => (
            <MonthlyCard
              key={group.key}
              monthKey={group.key}
              total={group.total}
              count={group.items.length}
              items={group.items}
              onEdit={onEdit}
              onRemove={remove}
            />
          ))}
        </div>
      )}
    </Screen>
  )
}

function MonthlyCard({
  monthKey,
  total,
  count,
  items,
  onEdit,
  onRemove,
}: {
  monthKey: string
  total: number
  count: number
  items: Expense[]
  onEdit: (expense: Expense) => void
  onRemove: (expense: Expense) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-light transition-colors"
      >
        <div className="flex-1 text-left">
          <h2 className="text-sm font-semibold text-ink capitalize">
            {monthLabel(monthKey)}
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {count} {count === 1 ? 'gasto' : 'gastos'}
          </p>
        </div>
        <div className="text-right">
          <span className="tabular text-sm font-semibold text-primary block">
            {formatBRL(total)}
          </span>
          <svg
            className={cn(
              'size-4 text-muted transition-transform mt-1 ml-auto',
              expanded && 'rotate-180',
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </button>

      {expanded && (
        <ul className="divide-y divide-line border-t border-line">
          {items.map((expense) => (
            <li key={expense.id}>
              <SwipeRow onEdit={() => onEdit(expense)} onDelete={() => onRemove(expense)}>
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
      )}
    </div>
  )
}
