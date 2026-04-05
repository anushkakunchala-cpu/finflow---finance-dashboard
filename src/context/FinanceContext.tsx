import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MOCK_TRANSACTIONS, STARTING_BALANCE } from '../data/mockData';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finflow_transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  const [role, setRole] = useState(() => {
    try {
      const saved = localStorage.getItem('finflow_role');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (['admin', 'viewer', 'guest'].includes(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading role:', e);
    }
    return 'viewer';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('finflow_theme');
    return saved ? JSON.parse(saved) : false;
  });

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'All',
    dateRange: { start: '', end: '' },
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial fetch
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('finflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finflow_role', JSON.stringify(role));
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finflow_theme', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addTransaction = (newTransaction) => {
    setTransactions((prev) => [
      { ...newTransaction, id: Date.now() },
      ...prev,
    ]);
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentIncome = transactions
      .filter((t) => t.type === 'income' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastIncome = transactions
      .filter((t) => t.type === 'income' && new Date(t.date).getMonth() === lastMonth && new Date(t.date).getFullYear() === lastYear)
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = transactions
      .filter((t) => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastExpenses = transactions
      .filter((t) => t.type === 'expense' && new Date(t.date).getMonth() === lastMonth && new Date(t.date).getFullYear() === lastYear)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = STARTING_BALANCE + totalIncome - totalExpenses;

    const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;
    const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;

    return { 
      income: currentIncome, 
      expenses: currentExpenses, 
      balance,
      incomeChange: parseFloat(incomeChange.toFixed(1)),
      expenseChange: parseFloat(expenseChange.toFixed(1))
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || t.category === filters.category;
      const matchesType = filters.type === 'All' || t.type === filters.type;
      
      let matchesDate = true;
      if (filters.dateRange.start && filters.dateRange.end) {
        const tDate = new Date(t.date);
        matchesDate = tDate >= new Date(filters.dateRange.start) && tDate <= new Date(filters.dateRange.end);
      }

      return matchesSearch && matchesCategory && matchesType && matchesDate;
    });
  }, [transactions, filters]);

  const value = {
    transactions,
    filteredTransactions,
    role,
    setRole,
    isDarkMode,
    setIsDarkMode,
    filters,
    setFilters,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
