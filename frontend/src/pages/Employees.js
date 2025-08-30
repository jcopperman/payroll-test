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
import { createEmployee, getEmployees } from '../services/api';

  function Employees() {
    const [open, setOpen] = useState(false);
    const [employeeName, setEmployeeName] = useState('');
    const queryClient = useQueryClient();

    const { data: employees = [] } = useQuery('employees', getEmployees);

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
        createEmployeeMutation.mutate({ name: employeeName });
      }
    };

    return (
      <Box>
        <Typography variant="h4" gutterBottom data-testid="heading-employees">
          Employees
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            data-testid="add-employee-btn"
          >
            Add Employee
          </Button>
        </Box>
        <Paper sx={{ mb: 2 }}>
          <List>
            {employees.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No employees found"
                  secondary="Add your first employee to get started"
                  data-testid="no-employees-msg"
                />
              </ListItem>
            ) : (
              employees.map((employee) => (
                <ListItem key={employee.id} data-testid={`employee-item-${employee.id}`}>
                  <ListItemText primary={employee.name} />
                  <IconButton edge="end" aria-label="delete" color="error" data-testid={`delete-employee-btn-${employee.id}`}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
        <Dialog open={open} onClose={() => setOpen(false)} data-testid="add-employee-dialog">
          <DialogTitle>Add New Employee</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Employee Name"
                type="text"
                fullWidth
                value={employeeName}
                onChange={e => setEmployeeName(e.target.value)}
                required
                inputProps={{ 'data-testid': 'employee-name-input' }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="primary" data-testid="cancel-add-employee-btn">Cancel</Button>
              <Button type="submit" variant="contained" color="primary" data-testid="save-employee-btn">Save</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    );
  }

  export default Employees;
