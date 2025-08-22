import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import { useQuery } from 'react-query';

function Payroll() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [payrollData, setPayrollData] = useState(null);

  const { data: employees = [] } = useQuery('employees', () => 
    fetch('http://localhost:3000/employees').then(res => res.json())
  );

  const { data: timesheets = [] } = useQuery('timesheets', () => 
    fetch('http://localhost:3000/timesheets').then(res => res.json())
  );

  const calculatePayroll = async () => {
    if (!selectedEmployee) return;

    try {
      const response = await fetch(`http://localhost:3000/payroll/${selectedEmployee}`);
      const data = await response.json();
      setPayrollData(data);
    } catch (error) {
      console.error('Error calculating payroll:', error);
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : `Employee ${employeeId}`;
  };

  const totalHours = timesheets
    .filter(ts => ts.employeeId === selectedEmployee && ts.clockOut)
    .reduce((sum, ts) => {
      const diff = (new Date(ts.clockOut) - new Date(ts.clockIn)) / (1000 * 60 * 60);
      return sum + diff;
    }, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Payroll
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Calculate Payroll
        </Typography>
        
        <Box display="flex" gap={2} alignItems="center">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Employee</InputLabel>
            <Select
              value={selectedEmployee}
              label="Select Employee"
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            onClick={calculatePayroll}
            disabled={!selectedEmployee}
          >
            Calculate Payroll
          </Button>
        </Box>
      </Paper>

      {payrollData && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payroll Summary for {getEmployeeName(selectedEmployee)}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Hours
                  </Typography>
                  <Typography variant="h4">
                    {payrollData.totalHours ? payrollData.totalHours.toFixed(2) : totalHours.toFixed(2)}h
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Timesheet Entries
                  </Typography>
                  <Typography variant="h4">
                    {timesheets.filter(ts => ts.employeeId === selectedEmployee).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Status
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    Active
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Employee Timesheets
        </Typography>
        
        {selectedEmployee ? (
          <Box sx={{ p: 2 }}>
            {timesheets
              .filter(ts => ts.employeeId === selectedEmployee)
              .map((timesheet) => (
                <Box key={timesheet.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle1">
                    {new Date(timesheet.clockIn).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Clock In: {new Date(timesheet.clockIn).toLocaleTimeString()}
                    {timesheet.clockOut && ` | Clock Out: ${new Date(timesheet.clockOut).toLocaleTimeString()}`}
                  </Typography>
                  {timesheet.clockOut && (
                    <Typography variant="body2" color="primary">
                      Duration: {((new Date(timesheet.clockOut) - new Date(timesheet.clockIn)) / (1000 * 60 * 60)).toFixed(2)} hours
                    </Typography>
                  )}
                </Box>
              ))}
            
            {timesheets.filter(ts => ts.employeeId === selectedEmployee).length === 0 && (
              <Alert severity="info">
                No timesheets found for this employee
              </Alert>
            )}
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Alert severity="info">
              Select an employee to view their timesheets
            </Alert>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Payroll;
