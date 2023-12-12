const axios = require('axios');
const nodeServerUrl = process.env.NODE_SERVER_URL;

const validateToken = {
  validateToken: async (userID, authToken) => {
    try {
      const response = await axios.get(`${nodeServerUrl}/validate-token`, {
          params: { userID, authToken },
        });
    if(response.status === 401 ){
      return false
    };
    return true;
  } catch (error) {
    // Handle errors here
    console.error('Error validating token:');
    return false;
  }
  }
};

  module.exports = 
    validateToken
  ;