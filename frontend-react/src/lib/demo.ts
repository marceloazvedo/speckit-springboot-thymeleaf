import type { Entry, Expense, Project, Snapshot } from './types'
import demoData from './demo-data.json'

export function buildDemoSnapshot(): Snapshot {
  const rawData = demoData as {
    project: { id: string; name: string; createdAt: string; updatedAt: string; deletedAt: null }
    expenses: Array<{
      id: string
      projectId: string
      date: string
      description: string
      amount: number
      unit?: string
      quantity?: number
      unitValue?: number
      supplier?: string | null
      paymentMethod?: string | null
      bank?: string | null
      categoryId?: string
      notes?: string
      createdAt: string
      updatedAt: string
      deletedAt: null
    }>
    entries: Array<{
      id: string
      projectId: string
      date: string
      description: string
      amount: number
      supplier?: string
      createdAt: string
      updatedAt: string
      deletedAt: null
    }>
  }

  const project: Project = {
    id: rawData.project.id,
    name: rawData.project.name,
    createdAt: rawData.project.createdAt,
    updatedAt: rawData.project.updatedAt,
    deletedAt: null,
  }

  const expenses: Expense[] = rawData.expenses.map((row) => ({
    id: row.id,
    projectId: project.id,
    date: row.date,
    description: row.description,
    amount: row.amount,
    unit: row.unit ?? null,
    quantity: row.quantity ?? null,
    unitAmount: row.unitValue ?? null,
    supplier: row.supplier ?? null,
    paymentMethod: row.paymentMethod ?? null,
    bank: row.bank ?? null,
    categoryId: row.categoryId ?? null,
    notes: row.notes ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: null,
  }))

  const entries: Entry[] = rawData.entries.map((row) => ({
    id: row.id,
    projectId: project.id,
    date: row.date,
    amount: row.amount,
    notes: null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: null,
  }))

  return {
    project,
    expenses,
    entries,
    pending: [],
    installBannerSeen: false,
    launchCount: 0,
    cursor: 0,
  }
}
