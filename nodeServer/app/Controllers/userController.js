const User = require('../Models/UserModel');
const Book = require('../Models/BookModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const UserController = {
  signup: async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create a new user
      const newUser = new User({ firstName, lastName, email, password });
      await newUser.save();
      console.log(newUser);
      res.status(201).json({ message: 'User created successfully', userID: newUser.userID});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },
  signIn: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Password is correct; generate a JWT token for authentication
      const token = jwt.sign({ userId: user.userID }, 'your-secret-key', { expiresIn: '1h' });
        // Set the token as an HTTP-only cookie
        res.cookie('authToken', token);
        res.status(200);
        res.json({ success: true, token });
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  },
  getUserDetails: async (req, res) => {
    const  userID  = req.userID;
    console.log(userID);

    try {
      // Find the user by ID
      const user = await User.findOne({ 'userID': userID }, { password: 0 });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

        // Retrieve detailed book information for each borrowed book
        const booksBorrowedDetails = await Promise.all(
            user.booksBorrowed.map(async (borrowedBook) => {
                const bookDetails = await Book.findOne({'bookID': borrowedBook});
                return {
                
                bookDetails
                };
            })
            );
            res.status(200);
            // Return user details with detailed book information
            res.json({
            ...user.toObject(), // Convert to plain JavaScript object
            booksBorrowed: booksBorrowedDetails,
            });
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  },
  updateUser: async (req, res) => {
    const { userID, firstName, lastName, email, password } = req.body;
    console.log(userID);

    try {
      // Find the user by userID or email
      let existingUser = await User.findOne({ 'userID': userID });

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update the user fields 
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.email = email;
      existingUser.password = password;
      // Save the updated user
      await existingUser.save();

      res.status(200).json({ message: 'User updated successfully', userID: existingUser.userID });
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }
        
};

module.exports = UserController;