import React, { useRef, useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Receipt, Lightbulb, Menu, X, Wallet, TrendingUp, TrendingDown, Settings as SettingsIcon, User } from 'lucide-react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { SummaryCards } from './components/Dashboard/SummaryCards';
import { Charts } from './components/Dashboard/Charts';
import { TransactionsTable } from './components/Transactions/TransactionsTable';
import { InsightsSection } from './components/Insights/InsightsSection';
import { ProfileSection } from './components/Dashboard/ProfileSection';
import { SettingsSection, GuestOverlay } from './components/Dashboard/SettingsSection';
import { ThemeToggle } from './components/UI/ThemeToggle';

import { formatCurrency, formatDate } from './lib/utils';

const Sidebar = ({ activeSection, scrollTo }) => {
  const { isDarkMode, role } = useFinance();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">FinFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex items-center gap-3 shrink-0">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">FinFlow</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 shrink-0">
          <p className="px-4 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollTo(item.id);
                setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group
                ${activeSection === item.id 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'}
              `}
            >
              <item.icon className={`w-5 h-5 transition-colors ${activeSection === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
              {item.label}
              {activeSection === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-200" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto shrink-0 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Arjun Sharma</p>
              <p className="text-xs text-gray-500 dark:text-zinc-500 truncate capitalize">{role} Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

const DashboardContent = () => {
  const overviewRef = useRef(null);
  const transactionsRef = useRef(null);
  const insightsRef = useRef(null);
  
  const [activeSection, setActiveSection] = useState('overview');
  const { isLoading, isDarkMode, transactions, role } = useFinance();

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const sections = {
    overview: overviewRef,
    transactions: transactionsRef,
    insights: insightsRef,
  };

  const navigateTo = (id) => {
    if (sections[id]) {
      // If it's one of the scrolling sections
      if (['overview', 'transactions', 'insights'].includes(activeSection)) {
        // Already on the main page, just scroll
        sections[id].current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setActiveSection(id);
        setTimeout(() => {
          sections[id].current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // It's a separate tab
      setActiveSection(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!['overview', 'transactions', 'insights'].includes(activeSection)) return;

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sections).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [activeSection]);

  if (isLoading) {
    return (
      <div className="flex-1 h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-zinc-500 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (['overview', 'transactions', 'insights'].includes(activeSection)) {
      return (
        <div className="space-y-24">
          <section id="overview" ref={overviewRef} className="scroll-mt-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500 dark:text-zinc-400 text-lg">Welcome back! Here's what's happening with your money.</p>
              </div>
              <SummaryCards />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <Charts />
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                    <button className="text-sm text-indigo-600 font-medium hover:underline">View all</button>
                  </div>
                  <div className="space-y-4">
                    {recentTransactions.map((t: any) => (
                      <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'}`}>
                            {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{t.description}</p>
                            <p className="text-xs text-gray-500 dark:text-zinc-500">{t.category} • {formatDate(t.date)}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="transactions" ref={transactionsRef} className="scroll-mt-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Recent Transactions</h2>
                <p className="text-gray-500 dark:text-zinc-400">Manage and track your daily spending and income.</p>
              </div>
              <GuestOverlay>
                <TransactionsTable />
              </GuestOverlay>
            </div>
          </section>

          <section id="insights" ref={insightsRef} className="scroll-mt-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Financial Insights</h2>
                <p className="text-gray-500 dark:text-zinc-400">Smart observations based on your spending patterns.</p>
              </div>
              <GuestOverlay>
                <InsightsSection />
              </GuestOverlay>
            </div>
          </section>
        </div>
      );
    }

    switch (activeSection) {
      case 'profile':
        return (
          <section id="profile" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">User Profile</h2>
                <p className="text-gray-500 dark:text-zinc-400">View and manage your personal financial information.</p>
              </div>
              <ProfileSection />
            </div>
          </section>
        );
      case 'settings':
        return (
          <section id="settings" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-8 pb-24">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h2>
                <p className="text-gray-500 dark:text-zinc-400">Configure your dashboard preferences and access levels.</p>
              </div>
              <SettingsSection />
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors">
      <Sidebar activeSection={activeSection} scrollTo={navigateTo} />
      
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Navbar */}
        <header className="hidden lg:flex fixed top-0 right-0 left-72 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 z-30 px-12 items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize tracking-tight">
              {activeSection}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-zinc-800">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Arjun Sharma</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500 capitalize">{role} Access</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-12 mt-16 lg:mt-24 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
