
const axios = require('axios');
const { execSync } = require('child_process');
const sendBrokerMessage = require('../brokerClient');

const WIREMOCK_PORT = 4000;
const WIREMOCK_CONTAINER = 'wiremock-demo';


async function startWiremock() {
  try {
    execSync(`docker run -d --rm --name ${WIREMOCK_CONTAINER} -p ${WIREMOCK_PORT}:8080 wiremock/wiremock:3.5.2`);
    // Wait for Wiremock to be ready
    let ready = false;
    for (let i = 0; i < 10; i++) {
      try {
        await axios.get(`http://localhost:${WIREMOCK_PORT}/__admin`);
        ready = true;
        break;
      } catch (e) {
        await new Promise(res => setTimeout(res, 1000)); // wait 1s
      }
    }
    if (!ready) throw new Error('Wiremock did not start');
  } catch (err) {
    throw new Error('Failed to start Wiremock via Docker. Is Docker running?');
  }
}

async function stopWiremock() {
  try {
    execSync(`docker stop ${WIREMOCK_CONTAINER}`);
  } catch (err) {
    // Ignore errors
  }
}

describe('brokerClient.js with Wiremock (Docker)', () => {
  beforeAll(async () => {
    await startWiremock();
  });

  afterAll(async () => {
    await stopWiremock();
  });

  it('should send a message and receive a mocked response', async () => {
    // Stub the /message endpoint
    await axios.post(`http://localhost:${WIREMOCK_PORT}/__admin/mappings`, {
      request: {
        method: 'POST',
        url: '/message',
        bodyPatterns: [
          { matchesJsonPath: '$[?(@.type == "testType")]' }
        ]
      },
      response: {
        status: 200,
        jsonBody: { success: true, message: 'Mocked response' }
      }
    });

    const result = await sendBrokerMessage('testType', { foo: 'bar' });
    expect(result).toEqual({ success: true, message: 'Mocked response' });
  });
});
