let port = 8080;
let express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');

const Book = require('./Models/BookModel'); 
const User = require('./Models/UserModel');
const bcrypt = require('bcryptjs');
const bookController = require('./Controllers/bookController');
const connectToMongoDB = require('./MongooseDB/MongooseConnection');

const UserController = require('./Controllers/userController');
const {extractUserIdMiddleware} = require('./Middleware/authMiddleware');

let app = express();
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


  

// Passport Local Strategy for authentication
passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {

        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        
        console.log(password);
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(isPasswordMatch);
 
        if (!isPasswordMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
// Serialize user to the session
passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.userID);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  console.log(id);
  User.findOne({ userID: id }, (err, user) => {
    done(err, user);
  });
});


// Allow requests from the React app
// Set up CORS middleware
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true,
};
app.use(cors(corsOptions));

// Example middleware using Express.js
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Important for requests with credentials
    next();
  });

connectToMongoDB();

app.use(bodyParser.json());


app.get('/', (req, res) => {
 res.send('Hello there!!');
});

app.get('/book/getall', bookController.getAllBooks);
app.put('/book/update/:bookID', extractUserIdMiddleware, bookController.updateBook);
app.get('/user', extractUserIdMiddleware, UserController.getUserDetails);
//app.post('/user/signin', UserController.signIn);
app.put('/book/return/:userID/:bookID', bookController.returnBook);
app.put('/user/update/', UserController.updateUser);
app.post('/user/signup', UserController.signup);
app.get('/validate-token', (req, res) => {
  const authToken = req.query.authToken;
  const userIDFromWebSocket = req.query.userID;
  
  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized - Token not provided' });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(authToken, 'your-secret-key');
    // Extract user ID from the decoded token
    const userIDFromToken = decodedToken.userID;
    console.log(userIDFromToken);
    console.log(userIDFromWebSocket);
    const isValid = userIDFromToken == userIDFromWebSocket;

    // Add the user ID to the request object
    if (isValid){
      res.json({ isValid });
    }
    
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
});


app.post('/user/signin', (req, res, next) => {
    passport.authenticate('local', (err, user) => {

      if (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // If authentication is successful, create a JWT token
      const token = jwt.sign({ userID: user.userID }, 'your-secret-key', { expiresIn: '12h' });
  
      // Set the token as an HTTP-only cookie
      
      res.cookie('authToken', token);
  
      // Send a success response with the token
      return res.json({ success: true, token, userID: user.userID});
    })(req, res, next);
  });

app.listen(port, () => {
 console.log('Running on port: ' + port);
});

module.exports = app;