import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { uuidv7, now } from './id'
import { EMPTY, load, save, storageKey, clear } from './storage'
import { buildDemoSnapshot } from './demo'
import type { Entry, Expense, PendingRef, Project, Snapshot, Syncable } from './types'

export type ExpenseDraft = Omit<Expense, keyof Syncable | 'projectId'>
export type EntryDraft = Omit<Entry, keyof Syncable | 'projectId'>

type Action =
  | { type: 'hydrate'; snapshot: Snapshot }
  | { type: 'createProject'; name: string }
  | { type: 'renameProject'; name: string }
  | { type: 'addExpense'; draft: ExpenseDraft }
  | { type: 'updateExpense'; id: string; draft: ExpenseDraft }
  | { type: 'removeExpense'; id: string }
  | { type: 'restoreExpense'; id: string }
  | { type: 'addEntry'; draft: EntryDraft }
  | { type: 'updateEntry'; id: string; draft: EntryDraft }
  | { type: 'removeEntry'; id: string }
  | { type: 'restoreEntry'; id: string }
  | { type: 'markInstallBannerSeen' }
  | { type: 'reset' }

function withPending(pending: PendingRef[], ref: PendingRef): PendingRef[] {
  return pending.includes(ref) ? pending : [...pending, ref]
}

function touch<T extends Syncable>(record: T, changes: Partial<T>): T {
  return { ...record, ...changes, updatedAt: now() }
}

function reducer(state: Snapshot, action: Action): Snapshot {
  switch (action.type) {
    case 'hydrate':
      return action.snapshot

    case 'createProject': {
      const stamp = now()
      const project: Project = {
        id: uuidv7(),
        name: action.name.trim(),
        createdAt: stamp,
        updatedAt: stamp,
        deletedAt: null,
      }
      return {
        ...state,
        project,
        pending: withPending(state.pending, `project:${project.id}`),
      }
    }

    case 'renameProject': {
      if (!state.project) return state
      const project = touch(state.project, { name: action.name.trim() })
      return {
        ...state,
        project,
        pending: withPending(state.pending, `project:${project.id}`),
      }
    }

    case 'addExpense': {
      if (!state.project) return state
      const stamp = now()
      const expense: Expense = {
        ...action.draft,
        id: uuidv7(),
        projectId: state.project.id,
        createdAt: stamp,
        updatedAt: stamp,
        deletedAt: null,
      }
      return {
        ...state,
        expenses: [expense, ...state.expenses],
        launchCount: state.launchCount + 1,
        pending: withPending(state.pending, `expense:${expense.id}`),
      }
    }

    case 'updateExpense': {
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.id ? touch(e, action.draft) : e,
        ),
        pending: withPending(state.pending, `expense:${action.id}`),
      }
    }

    case 'removeExpense': {
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.id ? touch(e, { deletedAt: now() }) : e,
        ),
        pending: withPending(state.pending, `expense:${action.id}`),
      }
    }

    case 'restoreExpense': {
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.id ? touch(e, { deletedAt: null }) : e,
        ),
        pending: withPending(state.pending, `expense:${action.id}`),
      }
    }

    case 'addEntry': {
      if (!state.project) return state
      const stamp = now()
      const entry: Entry = {
        ...action.draft,
        id: uuidv7(),
        projectId: state.project.id,
        createdAt: stamp,
        updatedAt: stamp,
        deletedAt: null,
      }
      return {
        ...state,
        entries: [entry, ...state.entries],
        pending: withPending(state.pending, `entry:${entry.id}`),
      }
    }

    case 'updateEntry': {
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.id ? touch(e, action.draft) : e,
        ),
        pending: withPending(state.pending, `entry:${action.id}`),
      }
    }

    case 'removeEntry': {
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.id ? touch(e, { deletedAt: now() }) : e,
        ),
        pending: withPending(state.pending, `entry:${action.id}`),
      }
    }

    case 'restoreEntry': {
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.id ? touch(e, { deletedAt: null }) : e,
        ),
        pending: withPending(state.pending, `entry:${action.id}`),
      }
    }

    case 'markInstallBannerSeen':
      return { ...state, installBannerSeen: true }

    case 'reset':
      return { ...EMPTY }
  }
}

interface StoreValue {
  state: Snapshot
  dispatch: (action: Action) => void
  demo: boolean
  resetAll: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function initial(demo: boolean): Snapshot {
  const key = storageKey(demo)
  const stored = load(key)
  if (stored) return stored
  return demo ? buildDemoSnapshot() : { ...EMPTY }
}

export function StoreProvider({ demo, children }: { demo: boolean; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, demo, initial)

  useEffect(() => {
    save(storageKey(demo), state)
  }, [state, demo])

  const value = useMemo<StoreValue>(
    () => ({
      state,
      dispatch,
      demo,
      resetAll: () => {
        clear(storageKey(demo))
        if (demo) dispatch({ type: 'hydrate', snapshot: buildDemoSnapshot() })
        else dispatch({ type: 'reset' })
      },
    }),
    [state, demo],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore precisa estar dentro de StoreProvider')
  return value
}
