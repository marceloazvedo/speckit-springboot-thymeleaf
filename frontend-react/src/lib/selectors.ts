import { CATEGORIES, categoryColors } from './catalog'
import { compare, currentMonthKey, monthKey } from './dates'
import type { Cents, Entry, Expense, ExpenseFilters, SortOption } from './types'

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
  bgColor: string
  textColor: string
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

  const slices = Array.from(totals.entries())
    .map(([id, amount]) => {
      const colors = categoryColors(id)
      return {
        id,
        label: id ? (CATEGORIES.find((c) => c.id === id)?.label ?? 'Sem categoria') : 'Sem categoria',
        amount,
        share: amount / grand,
        bgColor: colors.bgColor,
        textColor: colors.textColor,
      }
    })
    .sort((a, b) => b.amount - a.amount)

  const major = slices.filter((s) => s.share > 0.03)
  const minor = slices.filter((s) => s.share <= 0.03)

  if (minor.length === 0) return major

  const otherAmount = minor.reduce((sum, s) => sum + s.amount, 0)
  const otherColors = categoryColors(null)
  major.push({
    id: null,
    label: 'Outros',
    amount: otherAmount,
    share: otherAmount / grand,
    bgColor: otherColors.bgColor,
    textColor: otherColors.textColor,
  })

  return major.sort((a, b) => b.amount - a.amount)
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

export function getUniqueSuppliers(expenses: Expense[]): (string | null)[] {
  const suppliers = new Set<string | null>()
  for (const e of alive(expenses)) {
    if (e.supplier) suppliers.add(e.supplier)
  }
  return Array.from(suppliers).sort()
}

export function getUniquePaymentMethods(expenses: Expense[]): (string | null)[] {
  const methods = new Set<string | null>()
  for (const e of alive(expenses)) {
    if (e.paymentMethod) methods.add(e.paymentMethod)
  }
  return Array.from(methods).sort()
}

export function getUniqueBanks(expenses: Expense[]): (string | null)[] {
  const banks = new Set<string | null>()
  for (const e of alive(expenses)) {
    if (e.bank) banks.add(e.bank)
  }
  return Array.from(banks).sort()
}

function applySorting(expenses: Expense[], sortBy: SortOption): Expense[] {
  const sorted = expenses.slice()

  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => compare(b.date, a.date) || b.createdAt.localeCompare(a.createdAt))
    case 'oldest':
      return sorted.sort((a, b) => compare(a.date, b.date) || a.createdAt.localeCompare(b.createdAt))
    case 'highest-value':
      return sorted.sort((a, b) => b.amount - a.amount)
    case 'lowest-value':
      return sorted.sort((a, b) => a.amount - b.amount)
    case 'supplier-az':
      return sorted.sort((a, b) => (a.supplier ?? '').localeCompare(b.supplier ?? ''))
    default:
      return sorted
  }
}

export function applyFilters(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  let result = alive(expenses)

  if (filters.dateFrom) {
    result = result.filter((e) => e.date >= filters.dateFrom!)
  }
  if (filters.dateTo) {
    result = result.filter((e) => e.date <= filters.dateTo!)
  }

  if (filters.suppliers.length > 0) {
    result = result.filter((e) => e.supplier && filters.suppliers.includes(e.supplier))
  }

  if (filters.categories.length > 0) {
    result = result.filter((e) => e.categoryId && filters.categories.includes(e.categoryId))
  }

  if (filters.paymentMethods.length > 0) {
    result = result.filter((e) => e.paymentMethod && filters.paymentMethods.includes(e.paymentMethod))
  }

  if (filters.banks.length > 0) {
    result = result.filter((e) => e.bank && filters.banks.includes(e.bank))
  }

  if (filters.minValue > 0) {
    result = result.filter((e) => e.amount >= filters.minValue)
  }

  if (filters.maxValue > 0) {
    result = result.filter((e) => e.amount <= filters.maxValue)
  }

  if (filters.hasQuantity) {
    result = result.filter((e) => e.quantity !== null && e.quantity > 0)
  }

  if (filters.noCategory) {
    result = result.filter((e) => !e.categoryId)
  }

  if (filters.withNotes) {
    result = result.filter((e) => e.notes && e.notes.trim().length > 0)
  }

  return applySorting(result, filters.sortBy)
}

export function getFilteredExpensesByMonth(
  expenses: Expense[],
  filters: ExpenseFilters,
): MonthGroup<Expense>[] {
  const filtered = applyFilters(expenses, filters)
  return groupByMonth(filtered)
}

