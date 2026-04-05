import React from 'react';
import { User, Shield, Eye, Lock, Settings as SettingsIcon } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { ROLES } from '../../data/mockData';

export const SettingsSection = () => {
  const { role, setRole } = useFinance();

  const getIcon = (r) => {
    switch (r) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
      case 'guest': return <Lock className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm transition-all">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Account Settings</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Manage your access levels and preferences.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="px-1 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Select Access Role</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.role}
                onClick={() => setRole(r.role)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all border ${
                  role === r.role 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none' 
                    : 'bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-zinc-400 border-transparent hover:border-indigo-500/50'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${
                  role === r.role ? 'bg-white/20' : 'bg-white dark:bg-zinc-800'
                }`}>
                  {getIcon(r.role)}
                </div>
                {r.label.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-gray-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Enhanced Security</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">Enable two-factor authentication for your account.</p>
              </div>
            </div>
            <div className="w-10 h-5 rounded-full bg-gray-200 dark:bg-zinc-700 relative cursor-not-allowed opacity-50">
              <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GuestOverlay = ({ children }) => {
  const { role } = useFinance();

  if (role !== 'guest') return <>{children}</>;

  return (
    <div className="relative group">
      <div className="filter blur-[8px] pointer-events-none select-none opacity-40 transition-all duration-500 group-hover:blur-[10px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10 p-6">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-zinc-800/50 text-center max-w-sm transform transition-all group-hover:scale-[1.02]">
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 dark:shadow-none">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Limited Access</h3>
          <p className="text-gray-600 dark:text-zinc-400 mb-8 leading-relaxed font-medium">
            Please sign in to view complete financial details and transaction history.
          </p>
          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95">
            Sign In to Unlock
          </button>
        </div>
      </div>
    </div>
  );
};
