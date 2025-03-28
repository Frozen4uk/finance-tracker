import React from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { Debt, DailyExpenses } from '../types';

interface StatisticsProps {
  totalDebt: number;
  monthlyPayments: number;
  totalIncome: number;
  workingDaysInMonth: number;
  totalExpenses: number;
  dailyExpenses: DailyExpenses;
  requiredDailyIncome: number;
}

export const Statistics: React.FC<StatisticsProps> = ({
  totalDebt,
  monthlyPayments,
  totalIncome,
  workingDaysInMonth,
  totalExpenses,
  dailyExpenses,
  requiredDailyIncome
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
        Статистика
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography sx={{ 
            p: 2, 
            borderRadius: 1, 
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            transition: 'background-color 0.3s',
            '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.2)' }
          }}>
            Общая сумма долгов: {totalDebt.toLocaleString()} ₽
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography sx={{ 
            p: 2, 
            borderRadius: 1, 
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            transition: 'background-color 0.3s',
            '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.2)' }
          }}>
            Ежемесячные платежи: {monthlyPayments.toLocaleString()} ₽
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography sx={{ 
            p: 2, 
            borderRadius: 1, 
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            transition: 'background-color 0.3s',
            '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.2)' }
          }}>
            Общий доход: {totalIncome.toLocaleString()} ₽
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography sx={{ 
            p: 2, 
            borderRadius: 1, 
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            transition: 'background-color 0.3s',
            '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.2)' }
          }}>
            Рабочих дней в месяце: {workingDaysInMonth}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography sx={{ 
            p: 2, 
            borderRadius: 1, 
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            transition: 'background-color 0.3s',
            '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.2)' }
          }}>
            Общие расходы: {totalExpenses.toLocaleString()} ₽
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography sx={{ 
            p: 2, 
            borderRadius: 1, 
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            transition: 'background-color 0.3s',
            '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.2)' }
          }}>
            Ежедневные расходы: {(dailyExpenses.fuel + dailyExpenses.food + dailyExpenses.carWash).toLocaleString()} ₽
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography sx={{ 
            p: 2, 
            borderRadius: 1, 
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            transition: 'background-color 0.3s',
            '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.2)' }
          }}>
            Необходимый дневной доход: {requiredDailyIncome.toLocaleString()} ₽
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}; 