import { useEffect, useState } from 'react'
import { Drawer } from './ui/drawer'
import { Button } from './ui/button'
import { Input, Textarea } from './ui/input'
import { Label } from './ui/label'
import { Select } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { MoneyInput } from './MoneyInput'
import { SuggestField, ToggleRow } from './Field'
import { CATEGORIES, PAYMENT_METHODS, UNITS, needsBank } from '../lib/catalog'
import { formatQuantity, multiplyCents, parseQuantity } from '../lib/money'
import { today } from '../lib/dates'
import { suggestions } from '../lib/selectors'
import { cn } from '../lib/utils'
import type { ExpenseDraft } from '../lib/store'
import type { Cents, Expense } from '../lib/types'

interface FormState {
  amount: Cents
  description: string
  date: string
  supplier: string
  paymentMethod: string | null
  bank: string
  notes: string
  categoryId: string | null
  detailed: boolean
  quantityText: string
  unit: string | null
  unitAmount: Cents
  paid: boolean
  delivered: boolean
  deliveredText: string
}

function emptyForm(): FormState {
  return {
    amount: 0,
    description: '',
    date: today(),
    supplier: '',
    paymentMethod: null,
    bank: '',
    notes: '',
    categoryId: null,
    detailed: false,
    quantityText: '',
    unit: null,
    unitAmount: 0,
    paid: true,
    delivered: true,
    deliveredText: '',
  }
}

function fromExpense(expense: Expense): FormState {
  return {
    amount: expense.amount,
    description: expense.description,
    date: expense.date,
    supplier: expense.supplier ?? '',
    paymentMethod: expense.paymentMethod,
    bank: expense.bank ?? '',
    notes: expense.notes ?? '',
    categoryId: expense.categoryId,
    detailed: expense.quantity !== null,
    quantityText: expense.quantity === null ? '' : formatQuantity(expense.quantity),
    unit: expense.unit,
    unitAmount: expense.unitAmount ?? 0,
    paid: expense.paid,
    delivered: expense.delivered,
    deliveredText:
      expense.deliveredQuantity === null ? '' : formatQuantity(expense.deliveredQuantity),
  }
}

function totalOf(form: FormState): Cents {
  if (!form.detailed) return form.amount
  const quantity = parseQuantity(form.quantityText)
  if (quantity === null) return 0
  return multiplyCents(form.unitAmount, quantity)
}

function toDraft(form: FormState): ExpenseDraft {
  const quantity = form.detailed ? parseQuantity(form.quantityText) : null
  const keepsBank = needsBank(form.paymentMethod)

  return {
    date: form.date,
    description: form.description.trim(),
    amount: totalOf(form),
    supplier: form.supplier.trim() || null,
    categoryId: form.categoryId,
    unit: form.detailed ? form.unit : null,
    quantity,
    unitAmount: form.detailed ? form.unitAmount : null,
    paymentMethod: form.paymentMethod,
    bank: keepsBank ? form.bank.trim() || null : null,
    paid: form.paid,
    delivered: form.delivered,
    deliveredQuantity: form.delivered ? quantity : parseQuantity(form.deliveredText),
    notes: form.notes.trim() || null,
  }
}

interface ExpenseSheetProps {
  open: boolean
  expense: Expense | null
  history: Expense[]
  onClose: () => void
  onSave: (draft: ExpenseDraft, again: boolean) => void
}

export function ExpenseSheet({ open, expense, history, onClose, onSave }: ExpenseSheetProps) {
  const [form, setForm] = useState<FormState>(emptyForm)

  useEffect(() => {
    if (!open) return
    setForm(expense ? fromExpense(expense) : emptyForm())
  }, [open, expense])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const total = totalOf(form)
  const showBank = needsBank(form.paymentMethod)
  const valid = form.description.trim() !== '' && total > 0

  const submit = (again: boolean) => {
    if (!valid) return
    onSave(toDraft(form), again)
    if (again) {
      setForm({
        ...emptyForm(),
        date: form.date,
        supplier: form.supplier,
        paymentMethod: form.paymentMethod,
        bank: form.bank,
        categoryId: form.categoryId,
      })
    }
  }

  return (
    <Drawer
      open={open}
      title={expense ? 'Editar gasto' : 'Novo gasto'}
      onClose={onClose}
      footer={
        <div className="flex gap-3 pb-1">
          <Button full size="lg" disabled={!valid} onClick={() => submit(false)}>
            Salvar
          </Button>
          {expense ? null : (
            <Button variant="outline" size="lg" disabled={!valid} onClick={() => submit(true)}>
              Lançar outro
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <MoneyInput
          label="Valor total"
          value={form.detailed ? total : form.amount}
          autoFocus={!expense}
          large
          readOnly={form.detailed}
          hint={form.detailed ? 'Calculado por quantidade × valor unitário' : undefined}
          onChange={(cents) => {
            if (!form.detailed) {
              set('amount', cents)
            }
          }}
        />

        <SuggestField
          label="Descrição"
          value={form.description}
          options={suggestions(history, 'description')}
          placeholder="Cimento CP-II 50kg"
          onChange={(value) => set('description', value)}
        />

        <div>
          <Label htmlFor="expense-date">Data</Label>
          <Input
            id="expense-date"
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </div>

        <SuggestField
          label="Fornecedor"
          value={form.supplier}
          options={suggestions(history, 'supplier')}
          placeholder="Depósito Central"
          onChange={(value) => set('supplier', value)}
        />

        <Checkbox
          checked={form.detailed}
          label="Detalhar por quantidade × valor unitário"
          hint="Para quando você comprou vários itens iguais"
          onCheckedChange={(checked) => set('detailed', checked)}
        />

        {form.detailed ? (
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-line bg-light p-3">
            <div>
              <Label htmlFor="expense-quantity">Quantidade</Label>
              <Input
                id="expense-quantity"
                inputMode="decimal"
                placeholder="0"
                value={form.quantityText}
                onChange={(e) => set('quantityText', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="expense-unit">Unidade</Label>
              <Select
                id="expense-unit"
                placeholder="Selecione"
                value={form.unit ?? ''}
                options={UNITS.map((u) => ({ value: u.id, label: `${u.id} — ${u.label}` }))}
                onChange={(e) => set('unit', e.target.value || null)}
              />
            </div>
            <div className="col-span-2">
              <MoneyInput
                label="Valor unitário"
                value={form.unitAmount}
                onChange={(cents) => set('unitAmount', cents)}
              />
            </div>
          </div>
        ) : null}

        <div>
          <Label>Categoria</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const active = form.categoryId === category.id
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => set('categoryId', active ? null : category.id)}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-sm transition-colors duration-150 ease-smooth',
                    active
                      ? 'bg-primary font-medium text-white'
                      : 'border border-line bg-surface text-muted hover:border-faint hover:text-ink',
                  )}
                >
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="expense-payment">Forma de pagamento</Label>
          <Select
            id="expense-payment"
            placeholder="Selecione"
            value={form.paymentMethod ?? ''}
            options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
            onChange={(e) => set('paymentMethod', e.target.value || null)}
          />
        </div>

        {showBank ? (
          <SuggestField
            label="Banco"
            value={form.bank}
            options={suggestions(history, 'bank')}
            placeholder="Itaú"
            onChange={(value) => set('bank', value)}
          />
        ) : null}

        <div className="space-y-3">
          <ToggleRow label="Está pago" checked={form.paid} onChange={(v) => set('paid', v)} />
          <ToggleRow
            label="Está entregue"
            checked={form.delivered}
            onChange={(v) => set('delivered', v)}
          />
          {form.delivered ? null : (
            <div>
              <Label htmlFor="expense-delivered">Quantos entregues</Label>
              <Input
                id="expense-delivered"
                inputMode="decimal"
                placeholder="0"
                value={form.deliveredText}
                onChange={(e) => set('deliveredText', e.target.value)}
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="expense-notes">Observação</Label>
          <Textarea
            id="expense-notes"
            rows={3}
            value={form.notes}
            placeholder="Boleto vence dia 20"
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>
      </div>
    </Drawer>
  )
}
