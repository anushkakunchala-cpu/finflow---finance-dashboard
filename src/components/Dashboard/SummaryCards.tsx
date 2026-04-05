import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';

const SummaryCard = ({ title, value, icon: Icon, type, change }) => {
  const styles = {
    balance: {
      bg: 'bg-white dark:bg-zinc-900',
      accent: 'bg-indigo-600',
      text: 'text-indigo-600',
      gradient: 'from-slate-50 to-indigo-50 dark:from-zinc-800/50 dark:to-indigo-900/20',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    income: {
      bg: 'bg-white dark:bg-zinc-900',
      accent: 'bg-emerald-600',
      text: 'text-emerald-600',
      gradient: 'from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    expense: {
      bg: 'bg-white dark:bg-zinc-900',
      accent: 'bg-rose-600',
      text: 'text-rose-600',
      gradient: 'from-rose-50/50 to-orange-50/50 dark:from-rose-900/10 dark:to-orange-900/10',
      iconBg: 'bg-rose-100 dark:bg-rose-900/40',
      iconColor: 'text-rose-600 dark:text-rose-400'
    }
  }[type];

  return (
    <div className={`relative overflow-hidden ${styles.bg} p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group`}>
      {/* Decorative Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative flex items-center justify-between">
        <div className={`p-3.5 rounded-2xl ${styles.iconBg} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className={`w-6 h-6 ${styles.iconColor}`} />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
          change >= 0 
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
            : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
        }`}>
          {change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div className="relative">
        <p className="text-gray-500 dark:text-zinc-400 text-sm font-semibold tracking-wide uppercase">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1.5 tracking-tight">
          {formatCurrency(value)}
        </h3>
      </div>
    </div>
  );
};

export const SummaryCards = () => {
  const { summary } = useFinance();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard 
        title="Total Balance" 
        value={summary.balance} 
        icon={Wallet} 
        type="balance"
        change={2.5} 
      />
      <SummaryCard 
        title="Total Income" 
        value={summary.income} 
        icon={TrendingUp} 
        type="income"
        change={summary.incomeChange} 
      />
      <SummaryCard 
        title="Total Expenses" 
        value={summary.expenses} 
        icon={TrendingDown} 
        type="expense"
        change={summary.expenseChange} 
      />
    </div>
  );
};
