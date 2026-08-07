import type { Snapshot } from './types'

const LIVE_KEY = 'custocasa:v1'
const DEMO_KEY = 'custocasa:demo:v1'

export const EMPTY: Snapshot = {
  project: null,
  expenses: [],
  entries: [],
  pending: [],
  cursor: 0,
  launchCount: 0,
  installBannerSeen: false,
}

export function storageKey(demo: boolean): string {
  return demo ? DEMO_KEY : LIVE_KEY
}

export function load(key: string): Snapshot | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Snapshot>
    return {
      ...EMPTY,
      ...parsed,
      expenses: parsed.expenses ?? [],
      entries: parsed.entries ?? [],
      pending: parsed.pending ?? [],
    }
  } catch {
    return null
  }
}

export function save(key: string, snapshot: Snapshot): void {
  try {
    localStorage.setItem(key, JSON.stringify(snapshot))
  } catch {
    return
  }
}

export function clear(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    return
  }
}
