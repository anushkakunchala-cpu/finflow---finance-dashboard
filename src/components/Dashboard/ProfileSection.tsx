import React from 'react';
import { User, Mail, Calendar, Wallet, CreditCard, MapPin } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

import { useFinance } from '../../context/FinanceContext';

export const ProfileSection = () => {
  const { summary } = useFinance();
  
  const user = {
    name: "Arjun Sharma",
    email: "arjun.sharma@example.in",
    monthlyIncome: summary.income, // Use dynamic income from context
    salaryDate: "1st of every month",
    location: "Bangalore, India",
    memberSince: "Jan 2024"
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-600 to-indigo-800" />
          <div className="relative mt-12">
            <div className="w-24 h-24 rounded-3xl bg-white dark:bg-zinc-800 p-1 mx-auto shadow-xl">
              <div className="w-full h-full rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <User className="w-12 h-12" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 tracking-tight">{user.name}</h3>
            <p className="text-gray-500 dark:text-zinc-400 font-medium">{user.location}</p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-50 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-zinc-400">
              <Mail className="w-4 h-4 text-indigo-500" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-zinc-400">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Member since {user.memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Financial Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-emerald-600 shadow-sm">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Monthly Income</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{formatCurrency(user.monthlyIncome)}</p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Salary Credit</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{user.salaryDate}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Linked Accounts</h3>
          <div className="space-y-4">
            {[
              { name: 'HDFC Bank Savings', type: 'Primary Account', number: '**** 4590', icon: CreditCard },
              { name: 'ICICI Credit Card', type: 'Credit Line', number: '**** 8821', icon: CreditCard }
            ].map((account, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 transition-colors">
                    <account.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{account.name}</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">{account.type} • {account.number}</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
