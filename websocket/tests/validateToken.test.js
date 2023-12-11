const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const validateToken = require('../validateToken');
const nodeServerUrl = process.env.NODE_SERVER_URL;

describe('validateToken', () => {
  let axiosMock;

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.restore();
  });

  it('should validate a valid token', async () => {
    // Stub the axios.get function to simulate a successful response
    axiosMock.onGet(`${nodeServerUrl}/validate-token`).reply(200, { valid: true });

    const isValid = await validateToken('validUserID', 'validAuthToken');

    // Your test logic here
    expect(isValid).to.be.true;
  });

  it('should invalidate an invalid token', async () => {
    // Stub the axios.get function to simulate an invalid response
    axiosMock.onGet(`${nodeServerUrl}/validate-token`).reply(401, { valid: false });

    const isValid = await validateToken('invalidUserID', 'invalidAuthToken');

    // Your test logic here
    expect(isValid).to.be.false;
  });

  it('should handle network errors', async () => {
    // Stub the axios.get function to simulate a network error
    axiosMock.onGet(`${nodeServerUrl}/validate-token`).networkError();

    const isValid = await validateToken('someUserID', 'someAuthToken');

    
    expect(isValid).to.be.false;
  });


});
