import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  LinearProgress,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DailyIncome, DailyExpenseRecord, MonthlyReport } from '../types';

interface ReportsModalProps {
  open: boolean;
  onClose: () => void;
  dailyIncomes: DailyIncome[];
  dailyExpenseRecords: DailyExpenseRecord[];
  monthlyReports: MonthlyReport[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  open,
  onClose,
  dailyIncomes,
  dailyExpenseRecords,
  monthlyReports
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculatePeriodReport = () => {
    if (!startDate || !endDate) return null;

    const periodIncomes = dailyIncomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate >= startDate && incomeDate <= endDate;
    });

    const periodExpenses = dailyExpenseRecords.filter(record => {
      const expenseDate = new Date(record.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    const totalIncome = periodIncomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = periodExpenses.reduce((sum, record) => 
      sum + record.fuel + record.food + record.carWash, 0);
    
    const remainingAmount = totalIncome - totalExpenses;
    const workingDays = periodIncomes.filter(income => income.isWorkingDay).length;
    const averageDailyIncome = workingDays > 0 ? totalIncome / workingDays : 0;
    
    const requiredDailyIncome = 5000;
    const progress = Math.min(100, (averageDailyIncome / requiredDailyIncome) * 100);

    return {
      totalIncome,
      totalExpenses,
      remainingAmount,
      workingDays,
      averageDailyIncome,
      progress
    };
  };

  const periodReport = calculatePeriodReport();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ color: '#1a237e' }}>
          Отчеты
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Отчет за период" />
            <Tab label="Отчеты по месяцам" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Начало периода"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Конец периода"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>

          {periodReport && (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Показатель</TableCell>
                      <TableCell align="right">Сумма</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Общий доход</TableCell>
                      <TableCell align="right">{periodReport.totalIncome.toLocaleString()} ₽</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Общие расходы</TableCell>
                      <TableCell align="right">{periodReport.totalExpenses.toLocaleString()} ₽</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Остаток</TableCell>
                      <TableCell align="right">{periodReport.remainingAmount.toLocaleString()} ₽</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Рабочих дней</TableCell>
                      <TableCell align="right">{periodReport.workingDays}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Средний доход в день</TableCell>
                      <TableCell align="right">{periodReport.averageDailyIncome.toLocaleString()} ₽</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Прогресс к цели (5000₽ в день)
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={periodReport.progress} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: periodReport.progress >= 100 ? '#4caf50' : '#1a237e',
                    }
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
                  {periodReport.progress.toFixed(1)}%
                </Typography>
              </Box>
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Месяц</TableCell>
                  <TableCell align="right">Доходы</TableCell>
                  <TableCell align="right">Расходы</TableCell>
                  <TableCell align="right">Рабочих дней</TableCell>
                  <TableCell align="right">Выходных</TableCell>
                  <TableCell align="right">Средний доход в день</TableCell>
                  <TableCell align="right">Осталось</TableCell>
                  <TableCell align="right">Должно остаться</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthlyReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>{report.month}</TableCell>
                    <TableCell align="right">{report.totalIncome.toLocaleString()} ₽</TableCell>
                    <TableCell align="right">{report.totalExpenses.toLocaleString()} ₽</TableCell>
                    <TableCell align="right">{report.workingDays}</TableCell>
                    <TableCell align="right">{report.nonWorkingDays}</TableCell>
                    <TableCell align="right">{report.averageDailyIncome.toLocaleString()} ₽</TableCell>
                    <TableCell align="right">{report.remainingAmount.toLocaleString()} ₽</TableCell>
                    <TableCell align="right">{report.expectedRemainingAmount.toLocaleString()} ₽</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}; 