class User {
    constructor(firstName, lastName, email, password) {
      this.userID = generateRandomId(); // Generate a random 5-digit ID
      this.firstname = firstName;
      this.lastname = lastName;
      this.email = email;
      this.password = password;
      this.booksBorrowed = [];

    }
  }
  
  // Function to generate a random 5-digit ID
  function generateRandomId() {
    return Math.floor(10000 + Math.random() * 90000);
  }
  
  export default User;