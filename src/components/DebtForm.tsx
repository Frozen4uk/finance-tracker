import React from 'react';
import { 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Debt } from '../types';

interface DebtFormProps {
  newDebt: Partial<Debt>;
  startDate: Date | null;
  dueDate: Date | null;
  onDebtChange: (debt: Partial<Debt>) => void;
  onStartDateChange: (date: Date | null) => void;
  onDueDateChange: (date: Date | null) => void;
  onSubmit: () => void;
}

export const DebtForm: React.FC<DebtFormProps> = ({
  newDebt,
  startDate,
  dueDate,
  onDebtChange,
  onStartDateChange,
  onDueDateChange,
  onSubmit
}) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    onDebtChange({ ...newDebt, amount });
  };

  const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = Number(e.target.value);
    onDebtChange({ ...newDebt, loanTerm: term });
  };

  const handleTermTypeChange = (e: any) => {
    const type = e.target.value as 'years' | 'months';
    onDebtChange({ ...newDebt, termType: type });
  };

  return (
    <Paper sx={{ p: 3, mb: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
        Добавить новый долг
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Название"
            value={newDebt.name}
            onChange={(e) => onDebtChange({ ...newDebt, name: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#1a237e' } } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Начальная сумма долга"
            helperText="Введите первоначальную сумму долга"
            value={newDebt.amount}
            onChange={handleAmountChange}
            sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#1a237e' } } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Ежемесячный платеж"
            helperText="Будет рассчитан автоматически, если не указан"
            value={newDebt.monthlyPayment}
            onChange={(e) => onDebtChange({ ...newDebt, monthlyPayment: Number(e.target.value) })}
            sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#1a237e' } } }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="number"
            label="Срок"
            value={newDebt.loanTerm}
            onChange={handleLoanTermChange}
            sx={{ '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#1a237e' } } }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Тип срока</InputLabel>
            <Select
              value={newDebt.termType}
              label="Тип срока"
              onChange={handleTermTypeChange}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1a237e' } }}
            >
              <MenuItem value="years">Лет</MenuItem>
              <MenuItem value="months">Месяцев</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Дата начала кредита"
            value={startDate}
            onChange={onStartDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                sx: { '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#1a237e' } } }
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Дата погашения (необязательно)"
            value={dueDate}
            onChange={onDueDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                required: false,
                helperText: "Если не указана, будет рассчитана на основе срока",
                sx: { '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#1a237e' } } }
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            onClick={onSubmit}
            sx={{ 
              backgroundColor: '#1a237e',
              '&:hover': { backgroundColor: '#000051' },
              transition: 'background-color 0.3s'
            }}
          >
            Добавить
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}; 