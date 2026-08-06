import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { CATEGORIES } from '../lib/catalog'
import { formatBRL } from '../lib/money'
import { cn } from '../lib/utils'
import type { ExpenseFilters, SortOption } from '../lib/types'

interface FilterPanelProps {
  filters: ExpenseFilters
  suppliers: string[]
  paymentMethods: string[]
  banks: string[]
  onFiltersChange: (filters: ExpenseFilters) => void
}

export function FilterPanel({
  filters,
  suppliers,
  paymentMethods,
  banks,
  onFiltersChange,
}: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['period']))

  const toggleSection = (section: string) => {
    const next = new Set(openSections)
    if (next.has(section)) {
      next.delete(section)
    } else {
      next.add(section)
    }
    setOpenSections(next)
  }

  const isOpen = (section: string) => openSections.has(section)

  const updateFilter = <K extends keyof ExpenseFilters>(key: K, value: ExpenseFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArray = <K extends keyof ExpenseFilters>(
    key: K,
    item: string,
  ) => {
    const arr = filters[key] as string[]
    const newArr = arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]
    updateFilter(key, newArr as ExpenseFilters[K])
  }

  const clearFilters = () => {
    onFiltersChange({
      dateFrom: null,
      dateTo: null,
      suppliers: [],
      categories: [],
      paymentMethods: [],
      banks: [],
      minValue: 0,
      maxValue: 0,
      hasQuantity: false,
      noCategory: false,
      withNotes: false,
      sortBy: 'recent',
    })
  }

  const isFiltered = JSON.stringify(filters) !== JSON.stringify({
    dateFrom: null,
    dateTo: null,
    suppliers: [],
    categories: [],
    paymentMethods: [],
    banks: [],
    minValue: 0,
    maxValue: 0,
    hasQuantity: false,
    noCategory: false,
    withNotes: false,
    sortBy: 'recent',
  })

  return (
    <div className="space-y-1 mb-6">
      {/* SECTION 1: Period */}
      <Section
        title="Período"
        open={isOpen('period')}
        onToggle={() => toggleSection('period')}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="filter-date-from">De</Label>
              <Input
                id="filter-date-from"
                type="date"
                value={filters.dateFrom ?? ''}
                onChange={(e) => updateFilter('dateFrom', e.target.value || null)}
              />
            </div>
            <div>
              <Label htmlFor="filter-date-to">Até</Label>
              <Input
                id="filter-date-to"
                type="date"
                value={filters.dateTo ?? ''}
                onChange={(e) => updateFilter('dateTo', e.target.value || null)}
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <QuickButton
              label="Últimos 7d"
              onClick={() => {
                const today = new Date()
                const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                updateFilter('dateFrom', sevenDaysAgo.toISOString().split('T')[0])
                updateFilter('dateTo', today.toISOString().split('T')[0])
              }}
            />
            <QuickButton
              label="Este mês"
              onClick={() => {
                const today = new Date()
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
                updateFilter('dateFrom', firstDay.toISOString().split('T')[0])
                updateFilter('dateTo', today.toISOString().split('T')[0])
              }}
            />
            <QuickButton
              label="Últimos 30d"
              onClick={() => {
                const today = new Date()
                const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                updateFilter('dateFrom', thirtyDaysAgo.toISOString().split('T')[0])
                updateFilter('dateTo', today.toISOString().split('T')[0])
              }}
            />
          </div>
        </div>
      </Section>

      {/* SECTION 2: Main Filters */}
      <Section
        title="Filtros Principais"
        open={isOpen('main')}
        onToggle={() => toggleSection('main')}
      >
        <div className="space-y-4">
          {/* Suppliers */}
          <div>
            <Label className="text-xs">Fornecedor</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {suppliers.length === 0 ? (
                <p className="text-xs text-faint">Nenhum fornecedor</p>
              ) : (
                suppliers.map((supplier) => (
                  <label key={supplier} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.suppliers.includes(supplier)}
                      onCheckedChange={() => toggleArray('suppliers', supplier)}
                    />
                    <span className="text-sm">{supplier}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <Label className="text-xs">Categoria</Label>
            <div className="mt-2 space-y-2">
              {CATEGORIES.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.categories.includes(cat.id)}
                    onCheckedChange={() => toggleArray('categories', cat.id)}
                  />
                  <span className="text-sm">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="text-xs">Forma de Pagamento</Label>
            <div className="mt-2 space-y-2">
              {paymentMethods.length === 0 ? (
                <p className="text-xs text-faint">Nenhum método</p>
              ) : (
                paymentMethods.map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.paymentMethods.includes(method)}
                      onCheckedChange={() => toggleArray('paymentMethods', method)}
                    />
                    <span className="text-sm">{method}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Banks */}
          <div>
            <Label className="text-xs">Banco</Label>
            <div className="mt-2 space-y-2">
              {banks.length === 0 ? (
                <p className="text-xs text-faint">Nenhum banco</p>
              ) : (
                banks.map((bank) => (
                  <label key={bank} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.banks.includes(bank)}
                      onCheckedChange={() => toggleArray('banks', bank)}
                    />
                    <span className="text-sm">{bank}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 3: Advanced Filters */}
      <Section
        title="Filtros Avançados"
        open={isOpen('advanced')}
        onToggle={() => toggleSection('advanced')}
      >
        <div className="space-y-4">
          {/* Value Range */}
          <div>
            <Label className="text-xs">Intervalo de Valores</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <Label htmlFor="filter-min-value" className="text-xs text-muted">
                  Mínimo
                </Label>
                <Input
                  id="filter-min-value"
                  type="number"
                  placeholder="0"
                  value={filters.minValue === 0 ? '' : (filters.minValue / 100).toFixed(2)}
                  onChange={(e) => {
                    const value = e.target.value ? Math.round(parseFloat(e.target.value) * 100) : 0
                    updateFilter('minValue', value)
                  }}
                />
              </div>
              <div>
                <Label htmlFor="filter-max-value" className="text-xs text-muted">
                  Máximo
                </Label>
                <Input
                  id="filter-max-value"
                  type="number"
                  placeholder="0"
                  value={filters.maxValue === 0 ? '' : (filters.maxValue / 100).toFixed(2)}
                  onChange={(e) => {
                    const value = e.target.value ? Math.round(parseFloat(e.target.value) * 100) : 0
                    updateFilter('maxValue', value)
                  }}
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={filters.hasQuantity}
              onCheckedChange={(checked) => updateFilter('hasQuantity', !!checked)}
            />
            <span className="text-sm">Apenas com quantidade</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={filters.noCategory}
              onCheckedChange={(checked) => updateFilter('noCategory', !!checked)}
            />
            <span className="text-sm">Sem categoria</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={filters.withNotes}
              onCheckedChange={(checked) => updateFilter('withNotes', !!checked)}
            />
            <span className="text-sm">Com notas</span>
          </label>
        </div>
      </Section>

      {/* SECTION 4: Sorting */}
      <Section
        title="Ordenação"
        open={isOpen('sort')}
        onToggle={() => toggleSection('sort')}
      >
        <div>
          <Label htmlFor="filter-sort">Ordenar por</Label>
          <Select
            id="filter-sort"
            value={filters.sortBy}
            options={[
              { value: 'recent', label: 'Mais recente' },
              { value: 'oldest', label: 'Mais antigo' },
              { value: 'highest-value', label: 'Maior valor' },
              { value: 'lowest-value', label: 'Menor valor' },
              { value: 'supplier-az', label: 'Fornecedor (A-Z)' },
            ]}
            onChange={(value) => updateFilter('sortBy', value as SortOption)}
          />
        </div>
      </Section>

      {/* Clear Button */}
      {isFiltered && (
        <Button
          variant="dangerGhost"
          full
          size="sm"
          onClick={clearFilters}
          className="mt-2"
        >
          <X className="size-4" /> Limpar filtros
        </Button>
      )}
    </div>
  )
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border border-line rounded-lg bg-surface overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-light transition-colors"
      >
        <span className="font-medium text-sm">{title}</span>
        <ChevronDown
          className={cn('size-4 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <div className="px-4 py-3 border-t border-line space-y-3">{children}</div>}
    </div>
  )
}

function QuickButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1.5 rounded-full border border-line bg-light hover:bg-line text-muted hover:text-ink transition-colors"
    >
      {label}
    </button>
  )
}
