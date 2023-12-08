// WebSocketServer.test.js

const { createServer } = require('http');
const { Server } = require('socket.io');
const { connect } = require('socket.io-client');
const { MongoClient } = require('mongodb');
const ChatMessage = require('./chatModel');
const { server: WebSocketServer } = require('./index'); // Import your WebSocket server implementation
const connectToMongoDB = require('./MongoConnection');

let httpServer, io, socket;

beforeAll(async () => {
  // Connect to MongoDB before running tests
  await connectToMongoDB();

  // Create an HTTP server and attach the WebSocket server to it
  httpServer = createServer();
  io = new Server(httpServer);
  WebSocketServer.start(httpServer);

  // Start the HTTP server
  httpServer.listen(3001);
});

afterAll(async () => {
  // Close the MongoDB connection and the HTTP server after running tests
  await mongoose.connection.close();
  httpServer.close();
});

beforeEach((done) => {
  // Connect a client socket before each test
  socket = connect('http://localhost:3002', {
    query: {
      userID: '54850',
      authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjU0ODUwLCJpYXQiOjE3MDIwMzMwMDYsImV4cCI6MTcwMjA3NjIwNn0.S1PC3tI-zMzrA80sQ_w-wbXIkfCWubju1jkXzZ9XfEc',
    },
  });

  socket.on('connect', () => {
    done();
  });
});

afterEach((done) => {
  // Disconnect the client socket after each test
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});

describe('WebSocket Server Tests', () => {
  test('WebSocket connection is established with valid token', (done) => {
    // The connection event is already handled in the beforeEach hook
    expect(socket.connected).toBe(true);
    done();
  });

  test('WebSocket connection fails with invalid token', (done) => {
    const invalidSocket = connect('http://localhost:3002', {
      query: {
        userID: 'invalidUserID',
        authToken: 'invalidAuthToken',
      },
    });

    invalidSocket.on('connect_error', (error) => {
      expect(error.message).toBe('Authentication failed');
      done();
    });
  });

  test('WebSocket server broadcasts messages to all clients', (done) => {
    const messageToSend = 'Hello, WebSocket server!';

    // Set up another client socket
    const anotherSocket = connect('http://localhost:3002', {
      query: {
        userID: '21604',
        authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIxNjA0LCJpYXQiOjE3MDIwMzMxNDgsImV4cCI6MTcwMjA3NjM0OH0.Zm9-IxqFAwsZ8huLV-Xxp8XLGeUD48AKQ5Bht9DRpXE',
      },
    });

    anotherSocket.on('connect', () => {
      // Listen for messages on the second client socket
      anotherSocket.on('chat message', (message) => {
        expect(message).toBe(`testUserName: ${messageToSend}`);
        done();
      });

      // Send a message from the first client socket
      socket.emit('chat message', {
        userID: 'testUserID',
        name: 'testUserName',
        message: messageToSend,
      });
    });
  });

  // Add more tests as needed for your specific WebSocket server functionality
});