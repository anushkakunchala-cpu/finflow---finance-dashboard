import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, MoreVertical, Download, Plus, Trash2, Edit2, X } from 'lucide-react';
import Papa from 'papaparse';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';

export const TransactionsTable = () => {
  const { filteredTransactions, role, setFilters, filters, deleteTransaction, addTransaction, updateTransaction } = useFinance();
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const itemsPerPage = 8;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Groceries',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const handleOpenModal = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        description: '',
        amount: '',
        category: 'Groceries',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingTransaction) {
      updateTransaction({ ...transactionData, id: editingTransaction.id });
    } else {
      addTransaction(transactionData);
    }
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(filteredTransactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden transition-all duration-300">
      {/* Filter Bar */}
      <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4 md:items-center justify-between bg-gray-50/30 dark:bg-zinc-800/20">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all text-gray-600 dark:text-zinc-400 font-bold text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          {role === 'admin' && (
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-zinc-800 p-10 transform transition-all animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {editingTransaction ? 'Edit Entry' : 'New Entry'}
                </h3>
                <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
                  {editingTransaction ? 'Update your transaction details.' : 'Log a new financial activity.'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Description</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Amount</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Type</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Category</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-200 dark:shadow-none mt-4 uppercase tracking-widest text-xs"
              >
                {editingTransaction ? 'Update Transaction' : 'Create Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-zinc-800/30 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-2">Date <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-8 py-5">Description</th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('amount')}>
                <div className="flex items-center gap-2">Amount <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-8 py-5">Type</th>
              {role === 'admin' && <th className="px-8 py-5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((t) => (
                <tr 
                  key={t.id} 
                  onClick={() => setSelectedRow(t.id === selectedRow ? null : t.id)}
                  className={`transition-all group cursor-pointer ${
                    selectedRow === t.id 
                      ? 'bg-indigo-50/30 dark:bg-indigo-900/10' 
                      : 'hover:bg-gray-50/50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <td className="px-8 py-5 text-sm text-gray-500 dark:text-zinc-500 font-medium">{formatDate(t.date)}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-900 dark:text-white">{t.description}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-sm font-black ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      t.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(t);
                          }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTransaction(t.id);
                          }}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'admin' ? 6 : 5} className="px-8 py-20 text-center text-gray-400 dark:text-zinc-600">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-3xl">
                      <Filter className="w-8 h-8 opacity-20" />
                    </div>
                    <div className="max-w-xs">
                      <p className="font-bold text-gray-900 dark:text-white">No matches found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                    <button 
                      onClick={() => setFilters({ search: '', category: 'All', type: 'All', dateRange: { start: '', end: '' } })}
                      className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline mt-2"
                    >
                      Reset all filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-8 py-6 bg-gray-50/30 dark:bg-zinc-800/20 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
            Page <span className="text-gray-900 dark:text-white">{currentPage}</span> of <span className="text-gray-900 dark:text-white">{totalPages}</span>
          </p>
          <div className="flex items-center gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Prev
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
