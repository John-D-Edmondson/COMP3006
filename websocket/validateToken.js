const axios = require('axios');

async function validateToken(userID, authToken) {
    console.log(userID);
    console.log(authToken);
    try {
        const response = await axios.get('http://localhost:82/validate-token', {
            params: { userID, authToken },
          });
          
      return response.data.isValid;
    } catch (error) {
      // Handle errors here
      console.error('Error validating token:');
      throw error;
    }
  }

module.exports = validateToken;