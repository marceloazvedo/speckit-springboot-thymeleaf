import { useState } from 'react'
import { Toaster } from 'sonner'
import { Fab, Sidebar, TabBar, type Tab } from './components/Chrome'
import { DemoBanner } from './components/Banners'
import { ExpenseSheet } from './components/ExpenseSheet'
import { EntrySheet } from './components/EntrySheet'
import { ImportSheet } from './components/ImportSheet'
import { StoreProvider, useStore, type EntryDraft, type ExpenseDraft } from './lib/store'
import { notify } from './lib/notify'
import { isDemoPath, usePathname } from './lib/router'
import { Onboarding } from './screens/Onboarding'
import { Home } from './screens/Home'
import { Expenses } from './screens/Expenses'
import { Entries } from './screens/Entries'
import { Settings } from './screens/Settings'
import type { Entry, Expense } from './lib/types'

export function App() {
  const pathname = usePathname()
  const demo = isDemoPath(pathname)

  return (
    <StoreProvider key={demo ? 'demo' : 'live'} demo={demo}>
      <Shell demo={demo} />
      <Toaster position="bottom-center" offset={80} mobileOffset={80} closeButton={false} />
    </StoreProvider>
  )
}

function Shell({ demo }: { demo: boolean }) {
  const { state, dispatch } = useStore()

  const [tab, setTab] = useState<Tab>('home')
  const [expenseSheet, setExpenseSheet] = useState<{ open: boolean; expense: Expense | null }>({
    open: false,
    expense: null,
  })
  const [entrySheet, setEntrySheet] = useState<{ open: boolean; entry: Entry | null }>({
    open: false,
    entry: null,
  })
  const [importSheet, setImportSheet] = useState(false)

  if (!state.project) {
    return <Onboarding onCreate={(name) => dispatch({ type: 'createProject', name })} />
  }

  const openExpense = (expense: Expense | null) => setExpenseSheet({ open: true, expense })
  const closeExpense = () => setExpenseSheet({ open: false, expense: null })

  const saveExpense = (draft: ExpenseDraft, again: boolean) => {
    if (expenseSheet.expense) {
      dispatch({ type: 'updateExpense', id: expenseSheet.expense.id, draft })
      notify('Gasto atualizado')
      closeExpense()
      return
    }

    dispatch({ type: 'addExpense', draft })
    notify('Gasto lançado')

    if (!again) {
      closeExpense()
      setTab('expenses')
    }
  }

  const saveEntry = (draft: EntryDraft) => {
    if (entrySheet.entry) {
      dispatch({ type: 'updateEntry', id: entrySheet.entry.id, draft })
      notify('Entrada atualizada')
    } else {
      dispatch({ type: 'addEntry', draft })
      notify('Entrada registrada')
    }
    setEntrySheet({ open: false, entry: null })
  }

  const handleImport = (expenses: Expense[], entries: Entry[]) => {
    for (const expense of expenses) {
      dispatch({ type: 'addExpense', draft: expense })
    }
    for (const entry of entries) {
      dispatch({ type: 'addEntry', draft: entry })
    }
    notify(`Importados ${expenses.length} gastos${entries.length > 0 ? ` e ${entries.length} entradas` : ''}`)
  }

  return (
    <div className="min-h-dvh md:flex">
      <Sidebar
        active={tab}
        onChange={setTab}
        projectName={state.project.name}
        onNewExpense={() => openExpense(null)}
      />

      <main className="min-w-0 flex-1">
        {demo ? <DemoBanner /> : null}

        {tab === 'home' ? (
          <Home
            onLaunch={() => openExpense(null)}
            onOpenExpense={(expense) => openExpense(expense)}
            onSeeAll={() => setTab('expenses')}
          />
        ) : null}

        {tab === 'expenses' ? (
          <Expenses
            onEdit={(expense) => openExpense(expense)}
            onLaunch={() => openExpense(null)}
          />
        ) : null}

        {tab === 'entries' ? (
          <Entries
            onEdit={(entry) => setEntrySheet({ open: true, entry })}
            onLaunch={() => setEntrySheet({ open: true, entry: null })}
          />
        ) : null}

        {tab === 'settings' ? <Settings onImport={() => setImportSheet(true)} /> : null}
      </main>

      {tab === 'entries' || tab === 'settings' ? null : (
        <Fab onClick={() => openExpense(null)} />
      )}

      <TabBar active={tab} onChange={setTab} />

      <ExpenseSheet
        open={expenseSheet.open}
        expense={expenseSheet.expense}
        history={state.expenses}
        onClose={closeExpense}
        onSave={saveExpense}
      />

      <EntrySheet
        open={entrySheet.open}
        entry={entrySheet.entry}
        onClose={() => setEntrySheet({ open: false, entry: null })}
        onSave={saveEntry}
      />

      <ImportSheet
        open={importSheet}
        onClose={() => setImportSheet(false)}
        onImport={handleImport}
      />
    </div>
  )
}
