export type ISOTimestamp = string

export type LocalDate = string

export type Cents = number

export type Milli = number

export interface Syncable {
  id: string
  createdAt: ISOTimestamp
  updatedAt: ISOTimestamp
  deletedAt: ISOTimestamp | null
}

export interface Project extends Syncable {
  name: string
}

export interface Expense extends Syncable {
  projectId: string
  date: LocalDate
  description: string
  amount: Cents
  supplier: string | null
  categoryId: string | null
  unit: string | null
  quantity: Milli | null
  unitAmount: Cents | null
  paymentMethod: string | null
  bank: string | null
  notes: string | null
}

export interface Entry extends Syncable {
  projectId: string
  date: LocalDate
  amount: Cents
  notes: string | null
}

export type PendingRef = `${'project' | 'expense' | 'entry'}:${string}`

export interface Snapshot {
  project: Project | null
  expenses: Expense[]
  entries: Entry[]
  pending: PendingRef[]
  cursor: number
  launchCount: number
  installBannerSeen: boolean
}

export interface PushPayload {
  projects: Project[]
  expenses: Expense[]
  entries: Entry[]
}

export interface PushResult {
  cursor: number
  conflicts: string[]
}

export interface PullResult {
  cursor: number
  projects: Project[]
  expenses: Expense[]
  entries: Entry[]
}

export interface Account {
  id: string
  email: string
}
