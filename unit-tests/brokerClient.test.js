const sendBrokerMessage = require('../brokerClient');
const axios = require('axios');
jest.mock('axios');

describe('brokerClient', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should send a message and return broker response', async () => {
    const mockResponse = {
      data: {
        status: 'received',
        receiver: 'fictitious-receiver',
        message: "Mock response for type 'clock-in'",
        timestamp: '2025-08-22T10:00:00.000Z'
      }
    };
    axios.post.mockResolvedValue(mockResponse);
    const result = await sendBrokerMessage('clock-in', { employeeId: '123' });
    expect(result).toEqual(mockResponse.data);
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:4000/message',
      { type: 'clock-in', payload: { employeeId: '123' } }
    );
  });

  it('should handle errors gracefully', async () => {
    axios.post.mockRejectedValue(new Error('Network error'));
    const result = await sendBrokerMessage('clock-in', { employeeId: '123' });
    expect(result).toHaveProperty('error');
    expect(result.error).toBe('Failed to send message to broker');
  });
});
