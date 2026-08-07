import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Expense } from '@/lib/types';

const formatLabel = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
  return value.toString()
}

interface MonthlyChartProps {
  expenses: Expense[];
}

export function MonthlyChart({ expenses }: MonthlyChartProps) {
  const [months, setMonths] = useState(4);
  const [showActual, setShowActual] = useState(true);
  const [showBest, setShowBest] = useState(true);
  const [showWorst, setShowWorst] = useState(true);

  const now = new Date();
  const cutoffDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const monthlyData = expenses
    .filter((e) => new Date(e.date) >= cutoffDate)
    .reduce(
      (acc: Array<{ monthKey: string; monthLabel: string; total: number; best?: number; worst?: number; isProjection?: boolean }>, expense) => {
        const date = new Date(expense.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = new Date(date.getFullYear(), date.getMonth()).toLocaleDateString('pt-BR', {
          month: 'short',
          year: 'numeric',
        });

        const existing = acc.find((item) => item.monthKey === monthKey);
        if (existing) {
          existing.total += expense.amount;
        } else {
          acc.push({
            monthKey,
            monthLabel,
            total: expense.amount,
          });
        }
        return acc;
      },
      [] as Array<{ monthKey: string; monthLabel: string; total: number; isProjection?: boolean }>
    );

  monthlyData.sort((a: { monthKey: string }, b: { monthKey: string }) => a.monthKey.localeCompare(b.monthKey));

  // Calcula melhor e pior caso
  const amounts = monthlyData.map((m) => m.total);
  const melhorCaso = Math.min(...amounts);
  const piorCaso = Math.max(...amounts);
  const media = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);

  // Cria projeção para os próximos 3 meses
  const chartData: Array<{ monthKey: string; monthLabel: string; total: number; best?: number; worst?: number; isProjection?: boolean }> = [...monthlyData];
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth());

  for (let i = 1; i <= 3; i++) {
    const projDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + i);
    const monthLabel = projDate.toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric',
    });

    chartData.push({
      monthKey: '',
      monthLabel: `${monthLabel} (proj)`,
      total: media,
      best: melhorCaso,
      worst: piorCaso,
      isProjection: true,
    });
  }

  return (
    <div className="w-full bg-surface rounded-xl border border-line p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-ink mb-3">Evolução de gastos</h2>

        <div className="flex flex-col gap-3">
          {/* Período */}
          <div className="flex gap-2 items-center">
            <label className="text-xs text-muted">Período:</label>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.currentTarget.value))}
              className="text-xs bg-light border border-line rounded px-2 py-1 text-ink"
            >
              <option value={4}>Últimos 4 meses</option>
              <option value={6}>Últimos 6 meses</option>
              <option value={12}>Últimos 12 meses</option>
              <option value={999}>Todos</option>
            </select>
          </div>

          {/* Linhas */}
          <div className="flex gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={showActual}
                onChange={(e) => setShowActual(e.currentTarget.checked)}
                className="w-4 h-4"
              />
              <span className="text-ink">Gasto real</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={showBest}
                onChange={(e) => setShowBest(e.currentTarget.checked)}
                className="w-4 h-4"
              />
              <span className="text-ink">Melhor caso</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={showWorst}
                onChange={(e) => setShowWorst(e.currentTarget.checked)}
                className="w-4 h-4"
              />
              <span className="text-ink">Pior caso</span>
            </label>
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-line">
            <div>
              <p className="text-muted">Melhor</p>
              <p className="font-semibold">R$ {(melhorCaso / 100).toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-muted">Média</p>
              <p className="font-semibold">R$ {(media / 100).toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-muted">Pior</p>
              <p className="font-semibold">R$ {(piorCaso / 100).toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>

      {monthlyData.length === 0 ? (
        <div className="text-center text-sm text-muted py-8">Nenhum dado para este período</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
            <XAxis dataKey="monthLabel" stroke="var(--color-muted)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--color-muted)" style={{ fontSize: '12px' }} tickFormatter={formatLabel} />
            <Tooltip
              formatter={(value: any) => {
                if (!value) return ''
                return `R$ ${(value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              }}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-line)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {showActual && (
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', r: 4 }}
                name="Gasto real"
                activeDot={{ r: 6 }}
              />
            )}
            {showBest && (
              <Line
                type="stepAfter"
                dataKey="best"
                stroke="#10b981"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                name="Melhor caso"
              />
            )}
            {showWorst && (
              <Line
                type="stepAfter"
                dataKey="worst"
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                name="Pior caso"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
