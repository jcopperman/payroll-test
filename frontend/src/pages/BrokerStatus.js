import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  Grid,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getBrokerStatus, sendTestMessage } from '../services/api';

function BrokerStatus() {
  const [messageType, setMessageType] = useState('clock-in');
  const [employeeId, setEmployeeId] = useState('123');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const queryClient = useQueryClient();

  const { data: brokerStatus, refetch: refetchStatus } = useQuery('brokerStatus', getBrokerStatus, {
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const sendMessageMutation = useMutation(sendTestMessage, {
    onSuccess: () => {
      setSnackbarMessage('Message sent successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      refetchStatus();
    },
    onError: () => {
      setSnackbarMessage('Failed to send message');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    },
  });

  const handleSendMessage = () => {
    const messageData = {
      type: messageType,
      payload: {
        employeeId: employeeId,
        time: new Date().toISOString()
      }
    };
    
    sendMessageMutation.mutate(messageData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Connected':
        return 'success.main';
      case 'Disconnected':
        return 'error.main';
      default:
        return 'warning.main';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom data-testid="heading-broker-status">
        Broker Status
      </Typography>

      {/* Broker Connection Status */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connection Status
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Status
                </Typography>
                <Typography 
                  variant="h4" 
                  color={getStatusColor(brokerStatus?.status)}
                >
                  {brokerStatus?.status || 'Unknown'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Last Check
                </Typography>
                <Typography variant="h6">
                  {new Date().toLocaleTimeString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {brokerStatus?.details && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Details:
            </Typography>
            <Typography variant="body2" component="pre" sx={{ 
              backgroundColor: 'grey.100', 
              p: 1, 
              borderRadius: 1,
              overflow: 'auto'
            }}>
              {JSON.stringify(brokerStatus.details, null, 2)}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Test Message Sending */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Send Test Message
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Message Type</InputLabel>
              <Select
                value={messageType}
                label="Message Type"
                onChange={(e) => setMessageType(e.target.value)}
              >
                <MenuItem value="clock-in">Clock In</MenuItem>
                <MenuItem value="clock-out">Clock Out</MenuItem>
                <MenuItem value="test">Test Message</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isLoading}
            >
              {sendMessageMutation.isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Broker Information */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Broker Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Endpoint
                </Typography>
                <Typography variant="body1">
                  http://localhost:4000
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Health Check
                </Typography>
                <Typography variant="body1">
                  /health
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Message Endpoint
                </Typography>
                <Typography variant="body1">
                  /message
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Supported Message Types:
          </Typography>
          <Typography variant="body2">
            • <strong>clock-in:</strong> Employee clock-in event
          </Typography>
          <Typography variant="body2">
            • <strong>clock-out:</strong> Employee clock-out event
          </Typography>
          <Typography variant="body2">
            • <strong>test:</strong> Generic test message
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BrokerStatus;
