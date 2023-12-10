const jwt = require('jsonwebtoken');

const extractUserIdMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization;
  console.log(token);

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Token not provided' });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Extract user ID from the decoded token
    const userID = decodedToken.userID;
    // Add the user ID to the request object
    console.log(userID);
    req.userID = userID;
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

const isAuthenticated = (req, res, next) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized from middleware!' });
  }

  next();
};

const isAuthorized = (req, res, next) => {
  // Check if the requested user ID matches the authenticated user ID
  const requestedUserId = req.params.userID; // Assuming the user ID is in the route params
  console.log(requestedUserId);
  console.log(req.userID);
  const authenticatedUserId = req.userID;
  if (requestedUserId != authenticatedUserId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};

module.exports = { isAuthenticated, isAuthorized, extractUserIdMiddleware };