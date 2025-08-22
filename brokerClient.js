const axios = require('axios');

module.exports = async function sendBrokerMessage(type, payload) {
  try {
    const res = await axios.post('http://localhost:4000/message', { type, payload });
    return res.data;
  } catch (err) {
    return { error: 'Failed to send message to broker', details: err.message };
  }
};
