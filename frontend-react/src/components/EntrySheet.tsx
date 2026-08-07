import { useEffect, useState } from 'react'
import { Drawer } from './ui/drawer'
import { Button } from './ui/button'
import { Input, Textarea } from './ui/input'
import { Label } from './ui/label'
import { MoneyInput } from './MoneyInput'
import { today } from '../lib/dates'
import type { EntryDraft } from '../lib/store'
import type { Cents, Entry } from '../lib/types'

interface FormState {
  amount: Cents
  date: string
  notes: string
}

function emptyForm(): FormState {
  return { amount: 0, date: today(), notes: '' }
}

interface EntrySheetProps {
  open: boolean
  entry: Entry | null
  onClose: () => void
  onSave: (draft: EntryDraft) => void
}

export function EntrySheet({ open, entry, onClose, onSave }: EntrySheetProps) {
  const [form, setForm] = useState<FormState>(emptyForm)

  useEffect(() => {
    if (!open) return
    setForm(
      entry ? { amount: entry.amount, date: entry.date, notes: entry.notes ?? '' } : emptyForm(),
    )
  }, [open, entry])

  const valid = form.amount > 0

  return (
    <Drawer
      open={open}
      title={entry ? 'Editar entrada' : 'Nova entrada'}
      description="Registro do dinheiro que entrou na obra."
      onClose={onClose}
      footer={
        <Button
          variant="success"
          full
          size="lg"
          className="mb-1"
          disabled={!valid}
          onClick={() => {
            if (!valid) return
            onSave({
              date: form.date,
              amount: form.amount,
              notes: form.notes.trim() || null,
            })
          }}
        >
          Salvar
        </Button>
      }
    >
      <div className="space-y-4">
        <MoneyInput
          label="Valor"
          value={form.amount}
          autoFocus={!entry}
          large
          onChange={(cents) => setForm((c) => ({ ...c, amount: cents }))}
        />

        <div>
          <Label htmlFor="entry-date">Data</Label>
          <Input
            id="entry-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((c) => ({ ...c, date: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="entry-notes">Observação</Label>
          <Textarea
            id="entry-notes"
            rows={3}
            value={form.notes}
            placeholder="Transferência Camila"
            onChange={(e) => setForm((c) => ({ ...c, notes: e.target.value }))}
          />
        </div>
      </div>
    </Drawer>
  )
}
