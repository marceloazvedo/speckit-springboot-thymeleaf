import { pull, push } from './api'
import type { PendingRef, PullResult, PushPayload, Snapshot } from './types'

export const SYNC_ENABLED = false

export function collectPending(state: Snapshot): PushPayload {
  const ids = new Set(state.pending)

  const wanted = (kind: 'project' | 'expense' | 'entry', id: string) =>
    ids.has(`${kind}:${id}` as PendingRef)

  return {
    projects: state.project && wanted('project', state.project.id) ? [state.project] : [],
    expenses: state.expenses.filter((e) => wanted('expense', e.id)),
    entries: state.entries.filter((e) => wanted('entry', e.id)),
  }
}

export function isEmpty(payload: PushPayload): boolean {
  return (
    payload.projects.length === 0 &&
    payload.expenses.length === 0 &&
    payload.entries.length === 0
  )
}

export interface SyncOutcome {
  cursor: number
  conflicts: string[]
  incoming: PullResult | null
}

export async function runSync(state: Snapshot): Promise<SyncOutcome> {
  if (!SYNC_ENABLED) {
    return { cursor: state.cursor, conflicts: [], incoming: null }
  }

  const payload = collectPending(state)
  let conflicts: string[] = []

  if (!isEmpty(payload)) {
    const result = await push(state.cursor, payload)
    conflicts = result.conflicts
  }

  const incoming = await pull(state.cursor)

  return { cursor: incoming.cursor, conflicts, incoming }
}
