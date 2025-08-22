const path = require('path');
const { Verifier } = require('@pact-foundation/pact');

describe('Mock Broker Provider Verification', () => {
  it('validates the expectations of PayrollAPI', async () => {
    await new Verifier({
      provider: 'MockBroker',
      providerBaseUrl: 'http://localhost:4000',
      pactUrls: [path.resolve(__dirname, '../pacts/payrollapi-mockbroker.json')],
      publishVerificationResult: false,
    }).verifyProvider();
  });
});
