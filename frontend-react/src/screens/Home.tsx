import { useState } from 'react'
import { ChevronRight, Receipt, Eye, EyeOff } from 'lucide-react'
import { EmptyState, Screen } from '../components/Chrome'
import { CategoryChart } from '../components/CategoryChart'
import { MonthlyChart } from '../components/MonthlyChart'
import { InstallBanner } from '../components/Banners'
import { formatBRL, formatWhole } from '../lib/money'
import { currentMonthKey, formatShort, monthLabel } from '../lib/dates'
import {
  byCategory,
  monthTotal,
  sortedExpenses,
  total,
} from '../lib/selectors'
import { useStore } from '../lib/store'
import type { Expense } from '../lib/types'

interface HomeProps {
  onLaunch: () => void
  onOpenExpense: (expense: Expense) => void
  onSeeAll: (filter: null) => void
}

export function Home({ onLaunch, onOpenExpense, onSeeAll }: HomeProps) {
  const [showTotal, setShowTotal] = useState(true)
  const { state, dispatch, demo } = useStore()
  const list = sortedExpenses(state.expenses)
  const grand = total(state.expenses)
  const month = monthTotal(state.expenses)
  const slices = byCategory(state.expenses)
  const recent = list.slice(0, 6)

  const showInstall = !demo && !state.installBannerSeen && state.launchCount >= 3

  return (
    <Screen>
      <header className="safe-top pt-4 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted">{state.project?.name}</p>
            <p className="tabular mt-2 text-4xl font-semibold">
              {showTotal ? formatBRL(grand) : '••••••'}
            </p>
            <p className="mt-1 text-sm text-muted">
              total gasto · <span className="tabular">{showTotal ? `R$ ${formatWhole(month)}` : '••••'}</span> em{' '}
              {monthLabel(currentMonthKey()).split(' de ')[0]}
            </p>
          </div>
          <button
            onClick={() => setShowTotal(!showTotal)}
            className="p-2 hover:bg-light rounded-lg transition-colors"
            title={showTotal ? 'Ocultar total' : 'Mostrar total'}
          >
            {showTotal ? (
              <Eye className="size-5 text-muted" />
            ) : (
              <EyeOff className="size-5 text-muted" />
            )}
          </button>
        </div>
      </header>

      {showInstall ? (
        <InstallBanner onDismiss={() => dispatch({ type: 'markInstallBannerSeen' })} />
      ) : null}

      {list.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Nenhum gasto lançado ainda"
          description="Lance o primeiro e o painel começa a mostrar para onde o dinheiro está indo."
          actionLabel="Lançar o primeiro gasto"
          actionVariant="outline"
          onAction={onLaunch}
        />
      ) : (
        <>
          <section className="mb-6">
            <MonthlyChart expenses={list} />
          </section>

          <section className="mb-6">
            <CategoryChart slices={slices} />
          </section>

          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-muted">Últimos lançamentos</h2>
              <button
                onClick={() => onSeeAll(null)}
                className="flex items-center gap-0.5 text-sm font-medium text-primary transition-opacity duration-150 ease-smooth hover:opacity-70"
              >
                Ver todos <ChevronRight className="size-4" />
              </button>
            </div>
            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
              {recent.map((expense) => (
                <li key={expense.id}>
                  <button
                    onClick={() => onOpenExpense(expense)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ease-smooth hover:bg-light active:bg-light"
                  >
                    <span className="tabular w-11 shrink-0 text-sm text-faint">
                      {formatShort(expense.date)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{expense.description}</span>
                      {expense.supplier ? (
                        <span className="block truncate text-xs text-muted">
                          {expense.supplier}
                        </span>
                      ) : null}
                    </span>
                    <span className="tabular shrink-0 text-sm font-medium">
                      {formatBRL(expense.amount)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </Screen>
  )
}
