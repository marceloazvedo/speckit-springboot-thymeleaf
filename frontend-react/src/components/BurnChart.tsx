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

interface BurnChartProps {
  expenses: Expense[];
}

const formatLabel = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
  return value.toString()
}

export function BurnChart({ expenses }: BurnChartProps) {
  const now = new Date();
  const fourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  const monthlyData = expenses
    .filter((e) => new Date(e.date) >= fourMonthsAgo)
    .reduce(
      (acc: Array<{ monthKey: string; monthLabel: string; amount: number }>, expense) => {
        const date = new Date(expense.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = new Date(date.getFullYear(), date.getMonth()).toLocaleDateString('pt-BR', {
          month: 'short',
          year: '2-digit',
        });

        const existing = acc.find((item) => item.monthKey === monthKey);
        if (existing) {
          existing.amount += expense.amount;
        } else {
          acc.push({
            monthKey,
            monthLabel,
            amount: expense.amount,
          });
        }
        return acc;
      },
      [] as Array<{ monthKey: string; monthLabel: string; amount: number }>
    )
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  if (monthlyData.length === 0) return null;

  const amounts = monthlyData.map((m) => m.amount);
  const piorCaso = Math.max(...amounts);
  const melhorCaso = Math.min(...amounts);
  const esperado = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);

  const totalSpent = monthlyData.reduce((sum, item) => sum + item.amount, 0);

  const chartData = monthlyData.map((item, index) => {
    const burnup = monthlyData.slice(0, index + 1).reduce((sum, m) => sum + m.amount, 0);
    const burndown = totalSpent - burnup;
    return {
      ...item,
      burnup,
      burndown,
    };
  });

  // Adiciona projeção dos próximos 3 meses
  for (let i = 0; i < 3; i++) {
    const lastMonth = chartData[chartData.length - 1];
    chartData.push({
      monthKey: '',
      monthLabel: `+${i + 1}m`,
      amount: esperado,
      burnup: lastMonth.burnup + esperado * (i + 1),
      burndown: lastMonth.burndown - esperado * (i + 1),
    });
  }

  if (chartData.length === 0) return null;

  return (
    <div className="w-full bg-surface rounded-xl border border-line p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-ink mb-2">Previsão (últimos 4 meses)</h2>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-green-50 rounded p-2">
            <p className="text-muted">Melhor caso</p>
            <p className="font-semibold">R$ {(melhorCaso / 100).toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-blue-50 rounded p-2">
            <p className="text-muted">Esperado</p>
            <p className="font-semibold">R$ {(esperado / 100).toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-red-50 rounded p-2">
            <p className="text-muted">Pior caso</p>
            <p className="font-semibold">R$ {(piorCaso / 100).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>
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
          <Line
            type="monotone"
            dataKey="burnup"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            name="Burnup (acumulado)"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="burndown"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
            name="Burndown (restante)"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
