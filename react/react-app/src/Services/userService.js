export const fetchUserDetails = async (authToken) => {

    
    try {
      const response = await fetch(`http://localhost:82/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include the authentication token in the Authorization header
          'authorization':  authToken,
        },
      });
  
      if (response.ok) {
        // User is authenticated
        const userData = await response.json();
        return (userData);

        console.log('Authenticated user:', userData);
      } else {
        // User is not authenticated
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };