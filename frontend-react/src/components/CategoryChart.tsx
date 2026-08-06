import { useState } from 'react'
import { BarChart3, PieChart } from 'lucide-react'
import { formatBRL } from '../lib/money'
import type { CategorySlice } from '../lib/selectors'
import { cn } from '../lib/utils'

interface CategoryChartProps {
  slices: CategorySlice[]
}

const COLOR_MAP: Record<string, string> = {
  'bg-yellow-100': '#fef3c7',
  'bg-amber-100': '#fef3c7',
  'bg-orange-100': '#fed7aa',
  'bg-red-100': '#fee2e2',
  'bg-rose-100': '#ffe4e6',
  'bg-blue-100': '#dbeafe',
  'bg-cyan-100': '#cffafe',
  'bg-teal-100': '#ccfbf1',
  'bg-green-100': '#dcfce7',
  'bg-violet-100': '#ede9fe',
  'bg-indigo-100': '#e0e7ff',
  'bg-purple-100': '#f3e8ff',
  'bg-pink-100': '#fce7f3',
  'bg-gray-100': '#f3f4f6',
}

function getHexColor(bgClass: string): string {
  return COLOR_MAP[bgClass] || '#f3f4f6'
}

export function CategoryChart({ slices }: CategoryChartProps) {
  const [mode, setMode] = useState<'pie' | 'bars'>('pie')

  if (mode === 'pie') {
    return <PieChartView slices={slices} onSwitch={() => setMode('bars')} />
  }

  return <BarsChartView slices={slices} onSwitch={() => setMode('pie')} />
}

function PieChartView({
  slices,
  onSwitch,
}: {
  slices: CategorySlice[]
  onSwitch: () => void
}) {
  if (slices.length === 0) return null

  let cumulativePercent = 0
  const stops = slices.map((slice) => {
    const percent = slice.share * 100
    const color = getHexColor(slice.bgColor)
    const result = `${color} ${cumulativePercent}% ${cumulativePercent + percent}%`
    cumulativePercent += percent
    return result
  })

  const conicGradient = `conic-gradient(${stops.join(', ')})`

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted">Onde foi o dinheiro</h2>
        <button
          onClick={onSwitch}
          className="p-1.5 hover:bg-light rounded-lg transition-colors"
          title="Mudar para gráfico de barras"
        >
          <BarChart3 className="size-4 text-muted" />
        </button>
      </div>

      <div className="flex gap-6 items-center">
        <div className="flex-shrink-0 flex justify-center">
          <div
            className="size-28 rounded-full shadow-md"
            style={{ background: conicGradient }}
          />
        </div>

        <ul className="flex-1 space-y-2">
          {slices.map((slice) => (
            <li key={slice.id ?? 'none'} className="flex items-center gap-2 text-sm">
              <div
                className={cn('size-3 rounded-sm flex-shrink-0', slice.bgColor)}
              />
              <span className="text-muted flex-1 truncate">{slice.label}</span>
              <span className="tabular font-medium text-sm">{Math.round(slice.share * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function BarsChartView({
  slices,
  onSwitch,
}: {
  slices: CategorySlice[]
  onSwitch: () => void
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted">Onde foi o dinheiro</h2>
        <button
          onClick={onSwitch}
          className="p-1.5 hover:bg-light rounded-lg transition-colors"
          title="Mudar para gráfico de pizza"
        >
          <PieChart className="size-4 text-muted" />
        </button>
      </div>

      <ul className="space-y-3">
        {slices.map((slice) => (
          <li key={slice.id ?? 'none'}>
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <span className="truncate text-sm text-ink">{slice.label}</span>
              <span className="tabular shrink-0 text-sm font-medium">
                {formatBRL(slice.amount)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn('h-full rounded-full', slice.bgColor)}
                style={{ width: `${Math.max(slice.share * 100, 2)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
