const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const sendBrokerMessage = require('./brokerClient');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(bodyParser.json());

// In-memory data stores
const employees = [];

// Seed employees for E2E tests
const seedEmployees = [
  { id: 'emp_1', name: 'John Doe' },
  { id: 'emp_2', name: 'Jane Smith' },
  { id: 'emp_3', name: 'Mike Johnson' }
];
employees.push(...seedEmployees);
const timesheets = [];

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Payroll API',
    version: '1.0.0',
    description: 'API documentation for Payroll MVP',
  },
  servers: [
    { url: 'http://localhost:3000' }
  ],
};
const options = {
  swaggerDefinition,
  apis: ['./index.js'], // Path to the API docs
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Add employee
/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Add a new employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 */
app.post('/employees', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const employee = { id: uuidv4(), name };
  employees.push(employee);
  res.status(201).json(employee);
});

// List employees
/**
 * @swagger
 * /employees:
 *   get:
 *     summary: List all employees
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 */
app.get('/employees', (req, res) => {
  res.json(employees);
});

// Clock in
/**
 * @swagger
 * /timesheets/clock-in:
 *   post:
 *     summary: Clock in for an employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Timesheet clock-in record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.post('/timesheets/clock-in', (req, res) => {
  const { employeeId } = req.body;
  if (!employeeId) return res.status(400).json({ error: 'Employee ID is required' });
  const employee = employees.find(e => e.id === employeeId);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  const clockIn = { id: uuidv4(), employeeId, clockIn: new Date(), clockOut: null };
  timesheets.push(clockIn);
  // Send broker message
  sendBrokerMessage('clock-in', { employeeId, time: clockIn.clockIn })
    .then(brokerRes => {
      res.status(201).json({ ...clockIn, broker: brokerRes });
    })
    .catch(() => {
      res.status(201).json(clockIn);
    });
});

// Clock out
/**
 * @swagger
 * /timesheets/clock-out:
 *   post:
 *     summary: Clock out for an employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Timesheet clock-out record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.post('/timesheets/clock-out', (req, res) => {
  const { employeeId } = req.body;
  if (!employeeId) return res.status(400).json({ error: 'Employee ID is required' });
  const openSheet = timesheets.find(ts => ts.employeeId === employeeId && !ts.clockOut);
  if (!openSheet) return res.status(404).json({ error: 'No open timesheet found' });
  openSheet.clockOut = new Date();
  // Send broker message
  sendBrokerMessage('clock-out', { employeeId, time: openSheet.clockOut })
    .then(brokerRes => {
      res.json({ ...openSheet, broker: brokerRes });
    })
    .catch(() => {
      res.json(openSheet);
    });
});

// View timesheets for employee
// List all timesheets (for dashboard)
app.get('/timesheets', (req, res) => {
  res.json(timesheets);
});
/**
 * @swagger
 * /timesheets/{employeeId}:
 *   get:
 *     summary: View timesheets for an employee
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of timesheets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/timesheets/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const sheets = timesheets.filter(ts => ts.employeeId === employeeId);
  res.json(sheets);
});

// Get total hours worked for employee
/**
 * @swagger
 * /payroll/{employeeId}:
 *   get:
 *     summary: Get total hours worked for an employee
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Total hours worked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employeeId:
 *                   type: string
 *                 totalHours:
 *                   type: number
 */
app.get('/payroll/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const sheets = timesheets.filter(ts => ts.employeeId === employeeId && ts.clockOut);
  const totalHours = sheets.reduce((sum, ts) => {
    const diff = (new Date(ts.clockOut) - new Date(ts.clockIn)) / (1000 * 60 * 60);
    return sum + diff;
  }, 0);
  res.json({ employeeId, totalHours });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Payroll API running on port ${PORT}`);
});
