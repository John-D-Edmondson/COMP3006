export const loadUserDataToLocalStorage = () => {
    try {
      if (!localStorage.getItem('usersData')){
        const usersData = require('./users.json');
        localStorage.setItem('usersData', JSON.stringify(usersData));
        console.log('Users data loaded to localStorage');
      }
    } catch (error) {
      console.error('Error loading users data to localStorage:', error);
    }
  };
  
  export const loadBooksDataToLocalStorage = () => {
    try {
      if (!localStorage.getItem('booksData')){
        const booksData = require('./booksdata.json');
        localStorage.setItem('booksData', JSON.stringify(booksData));
    }
    } catch (error) {
      console.error('Error loading books data to localStorage:', error);
    }
  };

  export const loadUserDataFromLocalStorage = () => {
    try {
      const usersData = localStorage.getItem('usersData');
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      return [];
    }
  };

  export const loadBookDataFromLocalStorage = () => {
    try {
      const booksData = localStorage.getItem('booksData');
      return booksData ? JSON.parse(booksData) : [];
    } catch (error) {
      console.error('Error loading books data from localStorage:', error);
      return [];
    }
  };

  export const updateUserInLocalStorage = (updatedUser) => {
    // Replace this with actual logic to update user data in localStorage
    console.log('Updating user data in localStorage:', updatedUser);
    const usersData = loadUserDataFromLocalStorage();
    const updatedUsersData = usersData.map((user) =>
      user.userID === updatedUser.userID ? updatedUser : user
    );
    localStorage.setItem('usersData', JSON.stringify(updatedUsersData));
  };
  
  export const updateBookInLocalStorage = (updatedBook) => {
    // Replace this with actual logic to update user data in localStorage
    console.log(updatedBook);
    console.log('Updating book data in localStorage:', updatedBook);
    const booksData = loadBookDataFromLocalStorage();
    const updatedBooksData = booksData.map((book) =>
      book.bookID === updatedBook.bookID ? updatedBook : book
    );
    localStorage.setItem('booksData', JSON.stringify(updatedBooksData));
  };
  
// Function to save user data to localStorage
export const saveUserDataToLocalStorage = (userData) => {
  try {
    localStorage.setItem('usersData', JSON.stringify(userData));
    console.log('User data saved to localStorage:', userData);
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

// Function to add a user to userData
export const addUserToUserData = (user) => {
  // Load existing user data
  const existingUserData = loadUserDataFromLocalStorage();

  // Add the new user
  const updatedUserData = [...existingUserData, user];

  // Save the updated user data to localStorage
  saveUserDataToLocalStorage(updatedUserData);
};