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
  const monthlyData = expenses.reduce(
    (acc: Array<{ monthKey: string; monthLabel: string; total: number }>, expense) => {
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
    [] as Array<{ monthKey: string; monthLabel: string; total: number }>
  );

  monthlyData.sort((a: { monthKey: string }, b: { monthKey: string }) => a.monthKey.localeCompare(b.monthKey));

  const totalSpent = monthlyData.reduce((sum, item) => sum + item.total, 0);

  const chartData = monthlyData.map((item, index) => {
    const burnup = monthlyData.slice(0, index + 1).reduce((sum, m) => sum + m.total, 0);
    const burndown = totalSpent - burnup;
    return {
      ...item,
      burnup,
      burndown,
    };
  });

  return (
    <div className="w-full bg-surface rounded-xl border border-line p-6">
      <h2 className="text-sm font-semibold text-ink mb-4">Evolução de gastos</h2>
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
            dataKey="total"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-primary)', r: 4 }}
            name="Gasto mensal"
            activeDot={{ r: 6 }}
          />
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
