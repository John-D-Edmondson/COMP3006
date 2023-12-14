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
      } else {
        // User is not authenticated
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

export const updateUserDetails = async (formData) => {
  try {
    const response = await fetch(`http://localhost:82/user/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      return true;

    } else {
      console.error('Failed to update user');
      return false;
      // Handle error
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  
  }
}

export const createNewUser = async (formData) => {
  try {
    const response = await fetch('http://localhost:82/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
    
      console.log('User created successfully');
      return true;
    } else {
      console.error('Failed to create user');
      return false;
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return false;
  }
}

export const userSignin = async (formData) => {
  try {
    const response = await fetch('http://localhost:82/user/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const { token } = await response.json();
      console.log('Authentication successful. Token:', token);
      localStorage.setItem('authToken', token);
      return true;
 
      // Handle successful authentication
    } else if (response.status === 401) {
      const { message } = await response.json();
      return ('Authentication failed: ' + message);
    } else if (response.status === 500) {
      return 'Authentication failed: Internal Server Error';
    } else {
      return ('Authentication failed with status: ' + response.status)
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return ('Error during authentication');
  }
};
