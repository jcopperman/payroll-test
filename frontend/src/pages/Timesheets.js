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
  List,
  ListItem,
  ListItemText,
  Alert,
  Snackbar,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { clockIn, clockOut } from '../services/api';

function Timesheets() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const queryClient = useQueryClient();

  const { data: employees = [] } = useQuery('employees', () => 
    fetch('http://localhost:3000/employees').then(res => res.json())
  );

  const { data: timesheets = [] } = useQuery('timesheets', () => 
    fetch('http://localhost:3000/timesheets').then(res => res.json())
  );

  const clockInMutation = useMutation(clockIn, {
    onSuccess: () => {
      queryClient.invalidateQueries('timesheets');
      setMessage('Successfully clocked in');
      setSeverity('success');
    },
    onError: () => {
      setMessage('Failed to clock in');
      setSeverity('error');
    },
  });

  const clockOutMutation = useMutation(clockOut, {
    onSuccess: () => {
      queryClient.invalidateQueries('timesheets');
      setMessage('Successfully clocked out');
      setSeverity('success');
    },
    onError: () => {
      setMessage('Failed to clock out');
      setSeverity('error');
    },
  });

  const handleClockIn = () => {
    if (selectedEmployee) {
      clockInMutation.mutate(selectedEmployee);
    }
  };

  const handleClockOut = () => {
    if (selectedEmployee) {
      clockOutMutation.mutate(selectedEmployee);
    }
  };

  const activeTimesheets = timesheets.filter(ts => !ts.clockOut);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Timesheets
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Clock In/Out
        </Typography>
        
        <Box display="flex" gap={2} alignItems="center" mb={2}>
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
            color="primary"
            onClick={handleClockIn}
            disabled={!selectedEmployee}
          >
            Clock In
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClockOut}
            disabled={!selectedEmployee}
          >
            Clock Out
          </Button>
        </Box>
      </Paper>

      <Paper>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Recent Timesheets
        </Typography>
        <List>
          {timesheets.slice(-10).reverse().map((timesheet) => (
            <ListItem key={timesheet.id}>
              <ListItemText
                primary={`Employee ${timesheet.employeeId}`}
                secondary={`Clock In: ${new Date(timesheet.clockIn).toLocaleString()}${
                  timesheet.clockOut ? ` | Clock Out: ${new Date(timesheet.clockOut).toLocaleString()}` : ''
                }`}
              />
            </ListItem>
          ))}
          {timesheets.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No timesheets found"
                secondary="Clock in to start tracking time"
              />
            </ListItem>
          )}
        </List>
      </Paper>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      >
        <Alert onClose={() => setMessage('')} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Timesheets;
