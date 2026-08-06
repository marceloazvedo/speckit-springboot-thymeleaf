import { categoryLabel } from './catalog'
import { formatFull } from './dates'
import { formatAmount, formatQuantity } from './money'
import { alive } from './selectors'
import type { Entry, Expense } from './types'

const EXPENSE_HEADER = [
  'Data',
  'Descrição',
  'Categoria',
  'Unidade',
  'Quantidade',
  'Valor Unitário',
  'Valor Total',
  'Fornecedor',
  'Forma de Pagamento',
  'Banco Usado',
  'Observação',
]

const ENTRY_HEADER = ['Data', 'Valor', 'Observação']

function cell(value: string | null | undefined): string {
  const text = value ?? ''
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function toCsv(rows: string[][]): string {
  return rows.map((row) => row.join(';')).join('\r\n')
}

export function expensesToCsv(expenses: Expense[]): string {
  const rows = alive(expenses).map((e) => [
    cell(formatFull(e.date)),
    cell(e.description),
    cell(e.categoryId ? categoryLabel(e.categoryId) : ''),
    cell(e.unit),
    cell(e.quantity === null ? '' : formatQuantity(e.quantity)),
    cell(e.unitAmount === null ? '' : formatAmount(e.unitAmount)),
    cell(formatAmount(e.amount)),
    cell(e.supplier),
    cell(e.paymentMethod),
    cell(e.bank),
    cell(e.notes),
  ])

  return toCsv([EXPENSE_HEADER, ...rows])
}

export function entriesToCsv(entries: Entry[]): string {
  const rows = alive(entries).map((e) => [
    cell(formatFull(e.date)),
    cell(formatAmount(e.amount)),
    cell(e.notes),
  ])

  return toCsv([ENTRY_HEADER, ...rows])
}

export function download(filename: string, content: string): void {
  const blob = new Blob([`﻿${content}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
