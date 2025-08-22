import axios from 'axios';

// API base URLs
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const BROKER_BASE_URL = process.env.REACT_APP_BROKER_URL || 'http://localhost:4000';

// Create axios instances
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const brokerClient = axios.create({
  baseURL: BROKER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Payroll API endpoints
export const getEmployees = async () => {
  const response = await apiClient.get('/employees');
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await apiClient.post('/employees', employeeData);
  return response.data;
};

export const getTimesheets = async () => {
  const response = await apiClient.get('/timesheets');
  return response.data;
};

export const clockIn = async (employeeId) => {
  const response = await apiClient.post('/timesheets/clock-in', { employeeId });
  return response.data;
};

export const clockOut = async (employeeId) => {
  const response = await apiClient.post('/timesheets/clock-out', { employeeId });
  return response.data;
};

export const getEmployeeTimesheets = async (employeeId) => {
  const response = await apiClient.get(`/timesheets/${employeeId}`);
  return response.data;
};

export const getPayroll = async (employeeId) => {
  const response = await apiClient.get(`/payroll/${employeeId}`);
  return response.data;
};

// Mock Broker endpoints
export const getBrokerStatus = async () => {
  try {
    const response = await brokerClient.get('/health');
    return { status: 'Connected', details: response.data };
  } catch (error) {
    return { status: 'Disconnected', details: error.message };
  }
};

export const sendTestMessage = async (messageData) => {
  const response = await brokerClient.post('/message', messageData);
  return response.data;
};

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

brokerClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Broker Error:', error);
    throw error;
  }
);

export default {
  getEmployees,
  createEmployee,
  getTimesheets,
  clockIn,
  clockOut,
  getEmployeeTimesheets,
  getPayroll,
  getBrokerStatus,
  sendTestMessage,
};
