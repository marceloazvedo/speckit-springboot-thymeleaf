import type { LocalDate } from './types'

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

export function today(): LocalDate {
  const d = new Date()
  return toLocalDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

export function toLocalDate(year: number, month: number, day: number): LocalDate {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function parts(date: LocalDate): { year: number; month: number; day: number } {
  const [year, month, day] = date.split('-').map(Number)
  return { year, month, day }
}

export function monthKey(date: LocalDate): string {
  return date.slice(0, 7)
}

export function currentMonthKey(): string {
  return today().slice(0, 7)
}

export function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number)
  return `${MONTHS[month - 1]} de ${year}`
}

export function shortMonthLabel(key: string): string {
  const [, month] = key.split('-').map(Number)
  return MONTHS[month - 1].slice(0, 3)
}

export function formatShort(date: LocalDate): string {
  const { day, month } = parts(date)
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`
}

export function formatFull(date: LocalDate): string {
  const { day, month, year } = parts(date)
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
}

export function addDays(date: LocalDate, days: number): LocalDate {
  const { year, month, day } = parts(date)
  const d = new Date(year, month - 1, day + days)
  return toLocalDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

export function compare(a: LocalDate, b: LocalDate): number {
  return a < b ? -1 : a > b ? 1 : 0
}
