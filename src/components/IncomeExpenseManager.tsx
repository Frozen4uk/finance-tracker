import React, { useState } from 'react';
import { 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DailyExpenseRecord, DailyIncome } from '../types';

interface IncomeExpenseManagerProps {
  todayIncome: number;
  incomeDate: Date | null;
  isWorkingDay: boolean;
  todayExpenses: DailyExpenseRecord;
  dailyIncomes: DailyIncome[];
  dailyExpenseRecords: DailyExpenseRecord[];
  onIncomeChange: (amount: number) => void;
  onIncomeDateChange: (date: Date | null) => void;
  onWorkingDayChange: (isWorking: boolean) => void;
  onAddIncome: () => void;
  onExpenseChange: (type: keyof DailyExpenseRecord, value: number) => void;
  onExpenseDateChange: (date: Date | null) => void;
  onAddExpenses: () => void;
  onDeleteIncome: (index: number) => void;
  onDeleteExpense: (index: number) => void;
  onEditIncome: (index: number, income: DailyIncome) => void;
  onEditExpense: (index: number, expense: DailyExpenseRecord) => void;
}

export const IncomeExpenseManager: React.FC<IncomeExpenseManagerProps> = ({
  todayIncome,
  incomeDate,
  isWorkingDay,
  todayExpenses,
  dailyIncomes,
  dailyExpenseRecords,
  onIncomeChange,
  onIncomeDateChange,
  onWorkingDayChange,
  onAddIncome,
  onExpenseChange,
  onExpenseDateChange,
  onAddExpenses,
  onDeleteIncome,
  onDeleteExpense,
  onEditIncome,
  onEditExpense
}) => {
  const [editingIncome, setEditingIncome] = useState<{ index: number; income: DailyIncome } | null>(null);
  const [editingExpense, setEditingExpense] = useState<{ index: number; expense: DailyExpenseRecord } | null>(null);
  const [commonDate, setCommonDate] = useState<Date | null>(new Date());

  const handleEditIncome = (index: number, income: DailyIncome) => {
    setEditingIncome({ index, income });
  };

  const handleEditExpense = (index: number, expense: DailyExpenseRecord) => {
    setEditingExpense({ index, expense });
  };

  const handleSaveIncome = () => {
    if (editingIncome) {
      onEditIncome(editingIncome.index, editingIncome.income);
      setEditingIncome(null);
    }
  };

  const handleSaveExpense = () => {
    if (editingExpense) {
      onEditExpense(editingExpense.index, editingExpense.expense);
      setEditingExpense(null);
    }
  };

  const handleCommonDateChange = (date: Date | null) => {
    setCommonDate(date);
    if (date) {
      onIncomeDateChange(date);
      onExpenseDateChange(date);
    }
  };

  return (
    <>
      <Paper sx={{ p: 3, mb: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
          Доходы и расходы
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DatePicker
              label="Общая дата"
              value={commonDate}
              onChange={handleCommonDateChange}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Добавить доход
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Сумма заработка"
                  type="number"
                  value={todayIncome}
                  onChange={(e) => onIncomeChange(Number(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isWorkingDay}
                      onChange={(e) => onWorkingDayChange(e.target.checked)}
                      sx={{
                        color: '#1a237e',
                        '&.Mui-checked': {
                          color: '#1a237e',
                        },
                      }}
                    />
                  }
                  label="Рабочий день"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={onAddIncome}
                  disabled={!todayIncome || !incomeDate}
                  fullWidth
                  sx={{
                    backgroundColor: '#1a237e',
                    '&:hover': {
                      backgroundColor: '#283593'
                    }
                  }}
                >
                  Добавить доход
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Добавить расходы
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Топливо"
                  type="number"
                  value={todayExpenses.fuel}
                  onChange={(e) => onExpenseChange('fuel', Number(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Еда"
                  type="number"
                  value={todayExpenses.food}
                  onChange={(e) => onExpenseChange('food', Number(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Мойка"
                  type="number"
                  value={todayExpenses.carWash}
                  onChange={(e) => onExpenseChange('carWash', Number(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Прочие расходы"
                  type="number"
                  value={todayExpenses.otherExpenses}
                  onChange={(e) => onExpenseChange('otherExpenses', Number(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={onAddExpenses}
                  disabled={!todayExpenses.fuel && !todayExpenses.food && !todayExpenses.carWash && !todayExpenses.otherExpenses}
                  fullWidth
                  sx={{
                    backgroundColor: '#1a237e',
                    '&:hover': {
                      backgroundColor: '#283593'
                    }
                  }}
                >
                  Добавить расходы
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
          История доходов и расходов
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Доходы
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                    <TableCell>Тип дня</TableCell>
                    <TableCell align="center">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dailyIncomes.map((income, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(income.date), 'dd.MM.yyyy')}</TableCell>
                      <TableCell align="right">{income.amount.toLocaleString()} ₽</TableCell>
                      <TableCell>{income.isWorkingDay ? 'Рабочий' : 'Выходной'}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEditIncome(index, income)}
                          sx={{ color: '#1a237e' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <Button
                          size="small"
                          onClick={() => onDeleteIncome(index)}
                          variant="contained"
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          Удалить
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Расходы
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell align="right">Топливо</TableCell>
                    <TableCell align="right">Еда</TableCell>
                    <TableCell align="right">Мойка</TableCell>
                    <TableCell align="right">Прочие</TableCell>
                    <TableCell align="right">Итого</TableCell>
                    <TableCell align="center">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dailyExpenseRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(record.date), 'dd.MM.yyyy')}</TableCell>
                      <TableCell align="right">{record.fuel.toLocaleString()} ₽</TableCell>
                      <TableCell align="right">{record.food.toLocaleString()} ₽</TableCell>
                      <TableCell align="right">{record.carWash.toLocaleString()} ₽</TableCell>
                      <TableCell align="right">{record.otherExpenses.toLocaleString()} ₽</TableCell>
                      <TableCell align="right">
                        {(record.fuel + record.food + record.carWash + record.otherExpenses).toLocaleString()} ₽
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEditExpense(index, record)}
                          sx={{ color: '#1a237e' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <Button
                          size="small"
                          onClick={() => onDeleteExpense(index)}
                          variant="contained"
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          Удалить
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>

      {/* Диалог редактирования дохода */}
      <Dialog open={!!editingIncome} onClose={() => setEditingIncome(null)}>
        <DialogTitle>Редактировать доход</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Сумма"
                type="number"
                value={editingIncome?.income.amount || 0}
                onChange={(e) => setEditingIncome(prev => prev ? {
                  ...prev,
                  income: { ...prev.income, amount: Number(e.target.value) }
                } : null)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Дата"
                value={editingIncome ? new Date(editingIncome.income.date) : null}
                onChange={(date) => setEditingIncome(prev => prev ? {
                  ...prev,
                  income: { ...prev.income, date: date ? format(date, 'yyyy-MM-dd') : prev.income.date }
                } : null)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editingIncome?.income.isWorkingDay || false}
                    onChange={(e) => setEditingIncome(prev => prev ? {
                      ...prev,
                      income: { ...prev.income, isWorkingDay: e.target.checked }
                    } : null)}
                    sx={{
                      color: '#1a237e',
                      '&.Mui-checked': {
                        color: '#1a237e',
                      },
                    }}
                  />
                }
                label="Рабочий день"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingIncome(null)}>Отмена</Button>
          <Button onClick={handleSaveIncome} variant="contained" sx={{ backgroundColor: '#1a237e' }}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования расходов */}
      <Dialog open={!!editingExpense} onClose={() => setEditingExpense(null)}>
        <DialogTitle>Редактировать расходы</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Топливо"
                type="number"
                value={editingExpense?.expense.fuel || 0}
                onChange={(e) => setEditingExpense(prev => prev ? {
                  ...prev,
                  expense: { ...prev.expense, fuel: Number(e.target.value) }
                } : null)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Еда"
                type="number"
                value={editingExpense?.expense.food || 0}
                onChange={(e) => setEditingExpense(prev => prev ? {
                  ...prev,
                  expense: { ...prev.expense, food: Number(e.target.value) }
                } : null)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Мойка"
                type="number"
                value={editingExpense?.expense.carWash || 0}
                onChange={(e) => setEditingExpense(prev => prev ? {
                  ...prev,
                  expense: { ...prev.expense, carWash: Number(e.target.value) }
                } : null)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Прочие расходы"
                type="number"
                value={editingExpense?.expense.otherExpenses || 0}
                onChange={(e) => setEditingExpense(prev => prev ? {
                  ...prev,
                  expense: { ...prev.expense, otherExpenses: Number(e.target.value) }
                } : null)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Дата"
                value={editingExpense ? new Date(editingExpense.expense.date) : null}
                onChange={(date) => setEditingExpense(prev => prev ? {
                  ...prev,
                  expense: { ...prev.expense, date: date ? format(date, 'yyyy-MM-dd') : prev.expense.date }
                } : null)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingExpense(null)}>Отмена</Button>
          <Button onClick={handleSaveExpense} variant="contained" sx={{ backgroundColor: '#1a237e' }}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 