import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';

const InsightCard = ({ title, value, description, icon: Icon, trend = null, iconColor = "text-indigo-600 dark:text-indigo-400", iconBg = "bg-indigo-50 dark:bg-indigo-900/20" }) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">
    <div className="flex items-center justify-between relative z-10">
      <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} transition-colors duration-300`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
          trend.isPositive 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
        }`}>
          {trend.label}
        </div>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">{value}</h3>
      <p className="text-gray-500 dark:text-zinc-400 text-sm mt-3 leading-relaxed font-medium">{description}</p>
    </div>
    {/* Subtle background accent */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/5 transition-colors duration-500" />
  </div>
);

export const InsightsSection = () => {
  const { transactions, summary } = useFinance();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Monthly Comparison
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthExpenses = expenses
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
      
    const lastMonthExpenses = expenses
      .filter(t => {
        const d = new Date(t.date);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyDiff = lastMonthExpenses > 0 
      ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const topCategory = Object.entries(categoryTotals).sort((a: any, b: any) => (b[1] as number) - (a[1] as number))[0];
    const savingsRate = summary.income > 0 ? ((summary.income - summary.expenses) / summary.income) * 100 : 0;

    return {
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      savingsRate: savingsRate.toFixed(1),
      avgTransaction: expenses.length > 0 ? (summary.expenses / expenses.length).toFixed(0) : 0,
      monthlyComparison: {
        thisMonth: thisMonthExpenses,
        diff: monthlyDiff.toFixed(1),
        isHigher: thisMonthExpenses > lastMonthExpenses
      }
    };
  }, [transactions, summary]);

  if (!insights) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-16 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 text-center flex flex-col items-center gap-6">
        <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-gray-300 dark:text-zinc-600" />
        </div>
        <div className="max-w-xs">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Insights Available</h3>
          <p className="text-gray-500 dark:text-zinc-400 mt-2">Start adding transactions to unlock personalized financial observations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <InsightCard 
        title="Top Category" 
        value={insights.topCategory?.name || 'N/A'} 
        description={`Highest spending in ${insights.topCategory?.name.toLowerCase()} category.`}
        icon={Lightbulb} 
        iconColor="text-indigo-600 dark:text-indigo-400"
        iconBg="bg-indigo-50 dark:bg-indigo-900/20"
      />
      <InsightCard 
        title="Monthly Spending" 
        value={formatCurrency(insights.monthlyComparison.thisMonth)} 
        description={
          insights.monthlyComparison.diff !== "0.0" 
            ? `${Math.abs(Number(insights.monthlyComparison.diff))}% ${insights.monthlyComparison.isHigher ? 'more' : 'less'} than last month.`
            : "First month of data tracking."
        }
        icon={insights.monthlyComparison.isHigher ? TrendingUp : TrendingDown} 
        iconColor={insights.monthlyComparison.isHigher ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}
        iconBg={insights.monthlyComparison.isHigher ? "bg-rose-50 dark:bg-rose-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"}
        trend={{
          label: `${insights.monthlyComparison.diff}%`,
          isPositive: !insights.monthlyComparison.isHigher
        }}
      />
      <InsightCard 
        title="Savings Rate" 
        value={`${insights.savingsRate}%`} 
        description={parseFloat(insights.savingsRate) > 20 ? "Healthy savings rate above 20%." : "Aim for a 20% savings target."}
        icon={TrendingUp} 
        iconColor={parseFloat(insights.savingsRate) > 20 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}
        iconBg={parseFloat(insights.savingsRate) > 20 ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-rose-50 dark:bg-rose-900/20"}
        trend={{
          label: parseFloat(insights.savingsRate) > 20 ? 'Good' : 'Low',
          isPositive: parseFloat(insights.savingsRate) > 20
        }}
      />
      <InsightCard 
        title="Avg. Transaction" 
        value={formatCurrency(Number(insights.avgTransaction))} 
        description="Average spend per transaction this month."
        icon={TrendingDown} 
        iconColor="text-indigo-600 dark:text-indigo-400"
        iconBg="bg-indigo-50 dark:bg-indigo-900/20"
      />
    </div>
  );
};
