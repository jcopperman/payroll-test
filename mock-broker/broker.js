const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Provider state setup for Pact testing
app.post('/provider-states', (req, res) => {
  const { consumer, state } = req.body;
  console.log(`Setting up provider state: ${state} for consumer: ${consumer}`);
  
  // Handle different provider states
  switch (state) {
    case 'ready to receive clock-in':
      // Setup any necessary state for clock-in testing
      console.log('Provider state set: ready to receive clock-in');
      break;
    case 'ready to receive clock-out':
      // Setup any necessary state for clock-out testing
      console.log('Provider state set: ready to receive clock-out');
      break;
    default:
      console.log(`Unknown provider state: ${state}`);
  }
  
  res.status(200).json({ status: 'provider state set' });
});

// Mock endpoint to receive alerts/updates
app.post('/message', (req, res) => {
  const { type, payload } = req.body;
  // Simulate sending to fictitious receiver
  console.log(`Received message of type '${type}' with payload:`, payload);
  // Simulate receiver response
  const response = {
    status: 'received',
    receiver: 'fictitious-receiver',
    message: `Mock response for type '${type}'`,
    timestamp: new Date()
  };
  res.json(response);
});

const PORT = process.env.BROKER_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Mock broker running on port ${PORT}`);
});
