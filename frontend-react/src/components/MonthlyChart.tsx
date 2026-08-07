import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
    <div className="w-full h-96 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Gastos por Mês</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthLabel" />
          <YAxis />
          <Tooltip
            formatter={(value: any) => {
              if (!value) return ''
              return `R$ ${(value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            }}
          />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" name="Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
