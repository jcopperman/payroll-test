import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { getEmployees, getTimesheets, getBrokerStatus } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();

  const { data: employees = [] } = useQuery('employees', getEmployees);
  const { data: timesheets = [] } = useQuery('timesheets', getTimesheets);
  const { data: brokerStatus } = useQuery('brokerStatus', getBrokerStatus);

  const activeTimesheets = timesheets.filter(ts => !ts.clockOut);
  const totalHours = timesheets
    .filter(ts => ts.clockOut)
    .reduce((sum, ts) => {
      const diff = (new Date(ts.clockOut) - new Date(ts.clockIn)) / (1000 * 60 * 60);
      return sum + diff;
    }, 0);

  const stats = [
    {
      title: 'Total Employees',
      value: employees.length,
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary',
    },
    {
      title: 'Active Timesheets',
      value: activeTimesheets.length,
      icon: <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning',
    },
    {
      title: 'Total Hours',
      value: `${totalHours.toFixed(1)}h`,
      icon: <MoneyIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success',
    },
    {
      title: 'Broker Status',
      value: brokerStatus?.status || 'Unknown',
      icon: <MessageIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info',
    },
  ];

  const quickActions = [
    {
      title: 'Add Employee',
      description: 'Register a new employee',
      action: () => navigate('/employees'),
      color: 'primary',
    },
    {
      title: 'Clock In/Out',
      description: 'Manage employee timesheets',
      action: () => navigate('/timesheets'),
      color: 'secondary',
    },
    {
      title: 'View Payroll',
      description: 'Calculate and view payroll',
      action: () => navigate('/payroll'),
      color: 'success',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card data-testid="stats-card">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={4} key={action.title}>
            <Card 
              data-testid="quick-action-card"
              sx={{ 
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
              }}
              onClick={action.action}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  {action.description}
                </Typography>
                <Chip 
                  label="Go" 
                  color={action.color} 
                  variant="outlined"
                  clickable
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Recent Activity
      </Typography>
      <Card>
        <CardContent>
          <Typography color="textSecondary">
            {activeTimesheets.length > 0 ? (
              `${activeTimesheets.length} employees currently clocked in`
            ) : (
              'No active timesheets'
            )}
          </Typography>
          {activeTimesheets.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {activeTimesheets.slice(0, 3).map((ts) => (
                <Chip
                  key={ts.id}
                  label={`${ts.employeeId} - Clocked in at ${new Date(ts.clockIn).toLocaleTimeString()}`}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;
