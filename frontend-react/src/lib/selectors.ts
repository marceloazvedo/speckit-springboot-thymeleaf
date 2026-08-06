import { CATEGORIES } from './catalog'
import { compare, currentMonthKey, monthKey } from './dates'
import type { Cents, Entry, Expense } from './types'

export function alive<T extends { deletedAt: string | null }>(records: T[]): T[] {
  return records.filter((r) => r.deletedAt === null)
}

export function isFresh(createdAt: string): boolean {
  return Date.now() - Date.parse(createdAt) < 2000
}

export function sortedExpenses(expenses: Expense[]): Expense[] {
  return alive(expenses)
    .slice()
    .sort((a, b) => compare(b.date, a.date) || b.createdAt.localeCompare(a.createdAt))
}

export function sortedEntries(entries: Entry[]): Entry[] {
  return alive(entries)
    .slice()
    .sort((a, b) => compare(b.date, a.date) || b.createdAt.localeCompare(a.createdAt))
}

export function total(expenses: Expense[]): Cents {
  return alive(expenses).reduce((sum, e) => sum + e.amount, 0)
}

export function monthTotal(expenses: Expense[], key = currentMonthKey()): Cents {
  return alive(expenses)
    .filter((e) => monthKey(e.date) === key)
    .reduce((sum, e) => sum + e.amount, 0)
}

export interface CategorySlice {
  id: string | null
  label: string
  amount: Cents
  share: number
}

export function byCategory(expenses: Expense[]): CategorySlice[] {
  const list = alive(expenses)
  const grand = list.reduce((sum, e) => sum + e.amount, 0)
  if (grand === 0) return []

  const totals = new Map<string | null, Cents>()
  for (const e of list) {
    const key = e.categoryId ?? null
    totals.set(key, (totals.get(key) ?? 0) + e.amount)
  }

  return Array.from(totals.entries())
    .map(([id, amount]) => ({
      id,
      label: id ? (CATEGORIES.find((c) => c.id === id)?.label ?? 'Sem categoria') : 'Sem categoria',
      amount,
      share: amount / grand,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export interface MonthGroup<T> {
  key: string
  items: T[]
  total: Cents
}

export function groupByMonth<T extends { date: string; amount: Cents }>(
  records: T[],
): MonthGroup<T>[] {
  const groups = new Map<string, T[]>()
  for (const r of records) {
    const key = monthKey(r.date)
    const bucket = groups.get(key)
    if (bucket) bucket.push(r)
    else groups.set(key, [r])
  }

  return Array.from(groups.entries())
    .map(([key, items]) => ({
      key,
      items,
      total: items.reduce((sum, i) => sum + i.amount, 0),
    }))
    .sort((a, b) => (a.key < b.key ? 1 : -1))
}

export function suggestions(expenses: Expense[], field: 'description' | 'supplier' | 'bank'): string[] {
  const counts = new Map<string, number>()
  for (const e of alive(expenses)) {
    const value = e[field]
    if (!value) continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => value)
}

export function matches(list: string[], term: string, limit = 6): string[] {
  const needle = term.trim().toLowerCase()
  if (needle === '') return []
  return list
    .filter((v) => v.toLowerCase().includes(needle) && v.toLowerCase() !== needle)
    .slice(0, limit)
}

export function search(expenses: Expense[], term: string): Expense[] {
  const needle = term.trim().toLowerCase()
  if (needle === '') return expenses
  return expenses.filter(
    (e) =>
      e.description.toLowerCase().includes(needle) ||
      (e.supplier ?? '').toLowerCase().includes(needle),
  )
}

