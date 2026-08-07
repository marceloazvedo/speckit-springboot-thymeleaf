import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Expense } from '@/lib/types';

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

  return (
    <div className="w-full bg-surface rounded-xl border border-line p-6">
      <h2 className="text-sm font-semibold text-ink mb-4">Evolução de gastos</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
          <XAxis dataKey="monthLabel" stroke="var(--color-muted)" style={{ fontSize: '12px' }} />
          <YAxis stroke="var(--color-muted)" style={{ fontSize: '12px' }} />
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
          <Line
            type="monotone"
            dataKey="total"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-primary)', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
