import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { STARTING_BALANCE } from '../../data/mockData';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export const Charts = () => {
  const { transactions, isDarkMode } = useFinance();

  const chartTheme = {
    text: isDarkMode ? '#a1a1aa' : '#9ca3af',
    grid: isDarkMode ? '#27272a' : '#f3f4f6',
    tooltipBg: isDarkMode ? '#18181b' : '#fff',
    tooltipBorder: isDarkMode ? '#27272a' : '#e5e7eb',
  };

  const lineData = useMemo(() => {
    const data = transactions
      .slice()
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc: any[], t: any) => {
        const last = acc[acc.length - 1] || { balance: STARTING_BALANCE };
        const balance = last.balance + (t.type === 'income' ? t.amount : -t.amount);
        acc.push({ date: t.date, balance });
        return acc;
      }, []);
    return data.slice(-10); // Last 10 transactions
  }, [transactions]);

  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories = [...new Set(expenses.map(t => t.category))];
    return categories.map(cat => ({
      name: cat,
      value: expenses.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-all">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Balance Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: chartTheme.text }}
                dy={10}
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: chartTheme.text }}
                tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartTheme.tooltipBg, 
                  border: `1px solid ${chartTheme.tooltipBorder}`,
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
                itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                labelStyle={{ color: chartTheme.text }}
                formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Balance']}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: isDarkMode ? '#18181b' : '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-all">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Spending by Category</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={isDarkMode ? '#18181b' : '#fff'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartTheme.tooltipBg, 
                  border: `1px solid ${chartTheme.tooltipBorder}`,
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
                itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-gray-600 dark:text-zinc-400 text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
