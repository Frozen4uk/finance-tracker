import React from 'react';
import { List, ListItem, ListItemText, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Debt } from '../types';

interface DebtListProps {
  debts: Debt[];
  onDeleteDebt: (id: number) => void;
  calculateOverpayment: (debt: Debt) => number;
}

export const DebtList: React.FC<DebtListProps> = ({
  debts,
  onDeleteDebt,
  calculateOverpayment
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
        Список долгов
      </Typography>
      <List>
        {debts.map((debt: Debt) => (
          <ListItem
            key={debt.id}
            secondaryAction={
              <IconButton 
                edge="end" 
                onClick={() => onDeleteDebt(debt.id)}
                sx={{ 
                  color: '#1a237e',
                  '&:hover': { color: '#000051' },
                  transition: 'color 0.3s'
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
            sx={{
              mb: 1,
              borderRadius: 1,
              backgroundColor: 'rgba(26, 35, 126, 0.05)',
              transition: 'background-color 0.3s',
              '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.1)' }
            }}
          >
            <ListItemText
              primary={debt.name}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    Сумма: {debt.amount.toLocaleString()} ₽ | Осталось: {debt.remainingAmount.toLocaleString()} ₽ | 
                    Ежемесячный платеж: {debt.monthlyPayment.toLocaleString()} ₽
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.secondary">
                    Начало: {debt.startDate.toLocaleDateString()} | Конец: {debt.dueDate.toLocaleDateString()} | 
                    Срок: {debt.loanTerm} {debt.termType === 'years' ? 'лет' : 'месяцев'} | 
                    Переплата: {calculateOverpayment(debt).toLocaleString()} ₽
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 