import type { Cents, Milli } from './types'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const plain = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compact = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatBRL(cents: Cents): string {
  return brl.format(cents / 100)
}

export function formatAmount(cents: Cents): string {
  return plain.format(cents / 100)
}

export function formatWhole(cents: Cents): string {
  return compact.format(Math.round(cents / 100))
}

export function digitsToCents(digits: string): Cents {
  const clean = digits.replace(/\D/g, '').slice(0, 12)
  return clean === '' ? 0 : parseInt(clean, 10)
}

export function centsToDigits(cents: Cents): string {
  return cents === 0 ? '' : String(cents)
}

export function formatQuantity(milli: Milli): string {
  const value = milli / 1000
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(value)
}

export function parseQuantity(text: string): Milli | null {
  const clean = text.replace(/\s/g, '').replace(',', '.')
  if (clean === '') return null
  const value = Number(clean)
  if (!Number.isFinite(value) || value < 0) return null
  return Math.round(value * 1000)
}

export function divideCents(total: Cents, quantity: Milli): Cents | null {
  if (quantity <= 0) return null
  return Math.round((total * 1000) / quantity)
}

export function multiplyCents(unit: Cents, quantity: Milli): Cents {
  return Math.round((unit * quantity) / 1000)
}
