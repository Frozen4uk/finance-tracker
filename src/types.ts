export interface Debt {
  id: number;
  name: string;
  amount: number;
  monthlyPayment: number;
  dueDate: Date;
  type: 'credit' | 'other';
  startDate: Date;
  loanTerm: number;
  termType: 'years' | 'months';
  remainingAmount: number;
}

export interface DailyExpenses {
  fuel: number;
  food: number;
  carWash: number;
  otherExpenses: number;
}

export interface DailyExpenseRecord {
  date: string;
  fuel: number;
  food: number;
  carWash: number;
  otherExpenses: number;
}

export interface DailyIncome {
  date: string;
  amount: number;
  isWorkingDay: boolean;
}

export interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  workingDays: number;
  nonWorkingDays: number;
  averageDailyIncome: number;
  remainingAmount: number;
  expectedRemainingAmount: number;
} 