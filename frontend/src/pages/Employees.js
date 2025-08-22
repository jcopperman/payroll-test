import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createEmployee } from '../services/api';

function Employees() {
  const [open, setOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const queryClient = useQueryClient();

  const { data: employees = [] } = useQuery('employees', () => 
    fetch('http://localhost:3000/employees').then(res => res.json())
  );

  const createEmployeeMutation = useMutation(createEmployee, {
    onSuccess: () => {
      queryClient.invalidateQueries('employees');
      setOpen(false);
      setEmployeeName('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (employeeName.trim()) {
      createEmployeeMutation.mutate({ name: employeeName.trim() });
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Employees</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Employee
        </Button>
      </Box>

      <Paper>
        <List>
          {employees.map((employee) => (
            <ListItem key={employee.id}>
              <ListItemText
                primary={employee.name}
                secondary={`ID: ${employee.id}`}
              />
            </ListItem>
          ))}
          {employees.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No employees found"
                secondary="Add your first employee to get started"
              />
            </ListItem>
          )}
        </List>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Employee</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Employee Name"
              type="text"
              fullWidth
              variant="outlined"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Employees;
