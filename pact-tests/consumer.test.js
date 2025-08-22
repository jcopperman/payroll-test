const path = require('path');
const { Pact, Matchers } = require('@pact-foundation/pact');
const axios = require('axios');
const { regex } = Matchers;

describe('Payroll API <-> Mock Broker contract', () => {
  let provider;

  beforeAll(async () => {
    provider = new Pact({
      port: 41000,
      log: path.resolve(process.cwd(), 'logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      spec: 2,
      consumer: 'PayrollAPI',
      provider: 'MockBroker',
    });
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  describe('clock-in message', () => {
    beforeAll(async () => {
      await provider.addInteraction({
        state: 'ready to receive clock-in',
        uponReceiving: 'a clock-in message',
        withRequest: {
          method: 'POST',
          path: '/message',
          headers: { 'Content-Type': 'application/json' },
          body: {
            type: 'clock-in',
            payload: { employeeId: '123', time: '2025-08-22T10:00:00.000Z' }
          }
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: {
            status: 'received',
            receiver: 'fictitious-receiver',
            message: 'Mock response for type \'clock-in\'',
            timestamp: regex({
              generate: '2025-08-22T10:00:00.000Z',
              matcher: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$'
            })
          }
        }
      });
    });

    it('sends a clock-in message and receives acknowledgment', async () => {
      const res = await axios.post('http://localhost:41000/message', {
        type: 'clock-in',
        payload: { employeeId: '123', time: '2025-08-22T10:00:00.000Z' }
      });
      expect(res.status).toBe(200);
      expect(res.data.status).toBe('received');
      expect(res.data.receiver).toBe('fictitious-receiver');
      expect(res.data.message).toContain('clock-in');
      expect(res.data.timestamp).toBeDefined();
    });
  });

  describe('clock-out message', () => {
    beforeAll(async () => {
      await provider.addInteraction({
        state: 'ready to receive clock-out',
        uponReceiving: 'a clock-out message',
        withRequest: {
          method: 'POST',
          path: '/message',
          headers: { 'Content-Type': 'application/json' },
          body: {
            type: 'clock-out',
            payload: { employeeId: '123', time: '2025-08-22T18:00:00.000Z' }
          }
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: {
            status: 'received',
            receiver: 'fictitious-receiver',
            message: 'Mock response for type \'clock-out\'',
            timestamp: regex({
              generate: '2025-08-22T18:00:00.000Z',
              matcher: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$'
            })
          }
        }
      });
    });

    it('sends a clock-out message and receives acknowledgment', async () => {
      const res = await axios.post('http://localhost:41000/message', {
        type: 'clock-out',
        payload: { employeeId: '123', time: '2025-08-22T18:00:00.000Z' }
      });
      expect(res.status).toBe(200);
      expect(res.data.status).toBe('received');
      expect(res.data.receiver).toBe('fictitious-receiver');
      expect(res.data.message).toContain('clock-out');
      expect(res.data.timestamp).toBeDefined();
    });
  });

  // You can add more interactions for other messages...
});
