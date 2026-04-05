export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export type UserRole = 'admin' | 'viewer';

export interface FinanceState {
  transactions: Transaction[];
  role: UserRole;
  isDarkMode: boolean;
}
