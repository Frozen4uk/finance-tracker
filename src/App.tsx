import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { addYears, addMonths, differenceInMonths, eachDayOfInterval, isSunday, format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { DebtForm } from './components/DebtForm';
import { DebtList } from './components/DebtList';
import { Statistics } from './components/Statistics';
import { IncomeExpenseManager } from './components/IncomeExpenseManager';
import { ReportsModal } from './components/ReportsModal';
import { Debt, DailyExpenses, DailyExpenseRecord, DailyIncome, MonthlyReport } from './types';
import { ru } from 'date-fns/locale';

function App() {
  const [debts, setDebts] = useState<Debt[]>(() => {
    const savedDebts = localStorage.getItem('debts');
    if (savedDebts) {
      const parsedDebts = JSON.parse(savedDebts);
      return parsedDebts.map((debt: any) => ({
        ...debt,
        startDate: new Date(debt.startDate),
        dueDate: new Date(debt.dueDate),
        remainingAmount: debt.remainingAmount || debt.amount
      }));
    }
    return [];
  });

  const [dailyExpenses, setDailyExpenses] = useState<DailyExpenses>(() => {
    const savedExpenses = localStorage.getItem('dailyExpenses');
    return savedExpenses ? JSON.parse(savedExpenses) : { fuel: 2000, food: 1000, carWash: 100, otherExpenses: 0 };
  });

  const [dailyExpenseRecords, setDailyExpenseRecords] = useState<DailyExpenseRecord[]>(() => {
    const savedRecords = localStorage.getItem('dailyExpenseRecords');
    return savedRecords ? JSON.parse(savedRecords) : [];
  });

  const [todayExpenses, setTodayExpenses] = useState<DailyExpenseRecord>({
    date: format(new Date(), 'yyyy-MM-dd'),
    fuel: 0,
    food: 0,
    carWash: 0,
    otherExpenses: 0
  });

  const [dailyIncomes, setDailyIncomes] = useState<DailyIncome[]>(() => {
    const savedIncomes = localStorage.getItem('dailyIncomes');
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });

  const [todayIncome, setTodayIncome] = useState<number>(0);
  const [incomeDate, setIncomeDate] = useState<Date | null>(null);
  
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    name: '',
    amount: 0,
    monthlyPayment: 0,
    type: 'credit',
    loanTerm: 0,
    termType: 'years'
  });
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isWorkingDay, setIsWorkingDay] = useState<boolean>(true);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);

  useEffect(() => {
    const currentDebts = JSON.stringify(debts);
    const currentExpenses = JSON.stringify(dailyExpenses);
    const currentIncomes = JSON.stringify(dailyIncomes);
    const currentRecords = JSON.stringify(dailyExpenseRecords);

    if (currentDebts !== localStorage.getItem('debts')) {
      localStorage.setItem('debts', currentDebts);
    }
    if (currentExpenses !== localStorage.getItem('dailyExpenses')) {
      localStorage.setItem('dailyExpenses', currentExpenses);
    }
    if (currentIncomes !== localStorage.getItem('dailyIncomes')) {
      localStorage.setItem('dailyIncomes', currentIncomes);
    }
    if (currentRecords !== localStorage.getItem('dailyExpenseRecords')) {
      localStorage.setItem('dailyExpenseRecords', currentRecords);
    }
  }, [debts, dailyExpenses, dailyIncomes, dailyExpenseRecords]);

  const calculateEndDate = (start: Date, term: number, type: 'years' | 'months') => {
    return type === 'years' ? addYears(start, term) : addMonths(start, term);
  };

  const calculateMonthlyPayment = (amount: number, start: Date, end: Date) => {
    const months = differenceInMonths(end, start);
    if (months <= 0) return amount;
    return Math.ceil(amount / months);
  };

  const calculateOverpayment = (debt: Debt) => {
    const months = differenceInMonths(debt.dueDate, debt.startDate);
    const totalPayment = debt.monthlyPayment * months;
    return totalPayment - debt.amount;
  };

  const calculateWorkingDaysInMonth = () => {
    return 25; // Фиксированное количество рабочих дней
  };

  const handleAddDebt = () => {
    if (newDebt.name && newDebt.amount && startDate && newDebt.loanTerm) {
      let endDate: Date;
      let calculatedMonthlyPayment: number;

      if (dueDate) {
        // Если дата погашения указана, используем её
        endDate = dueDate;
        calculatedMonthlyPayment = newDebt.monthlyPayment || 
          calculateMonthlyPayment(newDebt.amount, startDate, endDate);
      } else {
        // Если дата погашения не указана, рассчитываем её на основе срока
        endDate = calculateEndDate(startDate, newDebt.loanTerm, newDebt.termType || 'years');
        calculatedMonthlyPayment = newDebt.monthlyPayment || 
          calculateMonthlyPayment(newDebt.amount, startDate, endDate);
      }

      setDebts([
        ...debts,
        {
          id: Date.now(),
          name: newDebt.name,
          amount: newDebt.amount,
          monthlyPayment: calculatedMonthlyPayment,
          dueDate: endDate,
          type: newDebt.type as 'credit' | 'other',
          startDate: startDate,
          loanTerm: newDebt.loanTerm,
          termType: newDebt.termType || 'years',
          remainingAmount: newDebt.amount
        }
      ]);
      setNewDebt({
        name: '',
        amount: 0,
        monthlyPayment: 0,
        type: 'credit',
        loanTerm: 0,
        termType: 'years'
      });
      setDueDate(null);
      setStartDate(null);
    }
  };

  const handleDeleteDebt = (id: number) => {
    setDebts(debts.filter((debt: Debt) => debt.id !== id));
  };

  const handleAddIncome = () => {
    if (todayIncome > 0 && incomeDate) {
      const formattedDate = format(incomeDate, 'yyyy-MM-dd');
      setDailyIncomes([...dailyIncomes, { 
        date: formattedDate, 
        amount: todayIncome,
        isWorkingDay 
      }]);
      
      let remainingIncome = todayIncome;
      const updatedDebts = debts.map(debt => {
        if (remainingIncome > 0) {
          const payment = Math.min(remainingIncome, debt.remainingAmount);
          remainingIncome -= payment;
          return {
            ...debt,
            remainingAmount: debt.remainingAmount - payment
          };
        }
        return debt;
      });
      
      setDebts(updatedDebts);
      setTodayIncome(0);
      setIncomeDate(null);
      setIsWorkingDay(true);
    }
  };

  const calculateTotalIncome = () => {
    return dailyIncomes.reduce((sum, income) => sum + income.amount, 0);
  };

  const calculateTotalDebt = () => {
    return debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
  };

  const calculateMonthlyPayments = () => {
    return debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  };

  const calculateRequiredDailyIncome = () => {
    const monthlyPayments = calculateMonthlyPayments();
    const workingDaysInMonth = calculateWorkingDaysInMonth();
    const dailyExpensesTotal = dailyExpenses.fuel + dailyExpenses.food + dailyExpenses.carWash + dailyExpenses.otherExpenses;
    return (monthlyPayments / workingDaysInMonth) + dailyExpensesTotal;
  };

  const handleExpenseChange = (type: keyof DailyExpenseRecord, value: number) => {
    setTodayExpenses(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleExpenseDateChange = (date: Date | null) => {
    if (date) {
      setTodayExpenses(prev => ({
        ...prev,
        date: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  const handleAddExpenses = () => {
    if (todayExpenses.fuel > 0 || todayExpenses.food > 0 || todayExpenses.carWash > 0 || todayExpenses.otherExpenses > 0) {
      setDailyExpenseRecords([...dailyExpenseRecords, todayExpenses]);
      setTodayExpenses({
        date: format(new Date(), 'yyyy-MM-dd'),
        fuel: 0,
        food: 0,
        carWash: 0,
        otherExpenses: 0
      });
    }
  };

  const calculateTotalExpenses = () => {
    return dailyExpenseRecords.reduce((sum, record) => 
      sum + record.fuel + record.food + record.carWash + record.otherExpenses, 0);
  };

  const generateMonthlyReports = (): MonthlyReport[] => {
    const reports: MonthlyReport[] = [];
    const allDates = new Set([
      ...dailyIncomes.map(income => income.date),
      ...dailyExpenseRecords.map(record => record.date)
    ]);

    const months = new Set(
      Array.from(allDates).map(date => format(parseISO(date), 'yyyy-MM'))
    );

    months.forEach(month => {
      const [year, monthNum] = month.split('-');
      const startDate = startOfMonth(new Date(parseInt(year), parseInt(monthNum) - 1));
      const endDate = endOfMonth(startDate);

      const monthIncomes = dailyIncomes.filter(income => 
        income.date.startsWith(month)
      );
      const monthExpenses = dailyExpenseRecords.filter(record => 
        record.date.startsWith(month)
      );

      const workingDays = monthIncomes.filter(income => income.isWorkingDay).length;
      const nonWorkingDays = monthIncomes.filter(income => !income.isWorkingDay).length;

      const totalIncome = monthIncomes.reduce((sum, income) => sum + income.amount, 0);
      const totalExpenses = monthExpenses.reduce((sum, record) => 
        sum + record.fuel + record.food + record.carWash + record.otherExpenses, 0);

      const averageDailyIncome = workingDays > 0 ? totalIncome / workingDays : 0;
      const remainingAmount = totalIncome - totalExpenses;
      const expectedRemainingAmount = (averageDailyIncome * workingDays) - totalExpenses;

      reports.push({
        month: format(startDate, 'LLLL yyyy', { locale: ru }),
        totalIncome,
        totalExpenses,
        workingDays,
        nonWorkingDays,
        averageDailyIncome,
        remainingAmount,
        expectedRemainingAmount
      });
    });

    return reports.sort((a, b) => {
      const dateA = parseISO(a.month);
      const dateB = parseISO(b.month);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const handleDeleteIncome = (index: number) => {
    const newIncomes = [...dailyIncomes];
    newIncomes.splice(index, 1);
    setDailyIncomes(newIncomes);
  };

  const handleDeleteExpense = (index: number) => {
    const newExpenses = [...dailyExpenseRecords];
    newExpenses.splice(index, 1);
    setDailyExpenseRecords(newExpenses);
  };

  const handleEditIncome = (index: number, income: DailyIncome) => {
    const newIncomes = [...dailyIncomes];
    newIncomes[index] = income;
    setDailyIncomes(newIncomes);
  };

  const handleEditExpense = (index: number, expense: DailyExpenseRecord) => {
    const newExpenses = [...dailyExpenseRecords];
    newExpenses[index] = expense;
    setDailyExpenseRecords(newExpenses);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: '#1a237e',
            textAlign: 'center',
            mb: 4,
            fontWeight: 'bold'
          }}
        >
          Финансовый трекер
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => setReportsModalOpen(true)}
            sx={{ 
              backgroundColor: '#1a237e',
              '&:hover': {
                backgroundColor: '#283593'
              }
            }}
          >
            Заказать отчет
          </Button>
        </Box>

        <IncomeExpenseManager
          todayIncome={todayIncome}
          incomeDate={incomeDate}
          isWorkingDay={isWorkingDay}
          todayExpenses={todayExpenses}
          dailyIncomes={dailyIncomes}
          dailyExpenseRecords={dailyExpenseRecords}
          onIncomeChange={setTodayIncome}
          onIncomeDateChange={setIncomeDate}
          onWorkingDayChange={setIsWorkingDay}
          onAddIncome={handleAddIncome}
          onExpenseChange={handleExpenseChange}
          onExpenseDateChange={handleExpenseDateChange}
          onAddExpenses={handleAddExpenses}
          onDeleteIncome={handleDeleteIncome}
          onDeleteExpense={handleDeleteExpense}
          onEditIncome={handleEditIncome}
          onEditExpense={handleEditExpense}
        />

        <ReportsModal
          open={reportsModalOpen}
          onClose={() => setReportsModalOpen(false)}
          dailyIncomes={dailyIncomes}
          dailyExpenseRecords={dailyExpenseRecords}
          monthlyReports={generateMonthlyReports()}
        />

        <DebtForm
          newDebt={newDebt}
          startDate={startDate}
          dueDate={dueDate}
          onDebtChange={setNewDebt}
          onStartDateChange={setStartDate}
          onDueDateChange={setDueDate}
          onSubmit={handleAddDebt}
        />

        <Statistics
          totalDebt={calculateTotalDebt()}
          monthlyPayments={calculateMonthlyPayments()}
          totalIncome={calculateTotalIncome()}
          workingDaysInMonth={calculateWorkingDaysInMonth()}
          totalExpenses={calculateTotalExpenses()}
          dailyExpenses={dailyExpenses}
          requiredDailyIncome={calculateRequiredDailyIncome()}
        />

        <DebtList
          debts={debts}
          onDeleteDebt={handleDeleteDebt}
          calculateOverpayment={calculateOverpayment}
        />
      </Box>
    </Container>
  );
}

export default App; 