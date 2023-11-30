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
      const { message, userID } = await response.json();
      console.log('User updated successfully');
      return true;

    } else {
      console.error('Failed to update user');
      return false;
      // Handle error
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
    // Handle error
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
      const { message, userID } = await response.json();
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
