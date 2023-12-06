const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const connectToMongoDB = require('./MongoConnection');
const ChatMessage = require('./chatModel');
const validateToken = require('./validateToken');


const app = express();
const server = createServer(app);
const io = new Server(server);
connectToMongoDB();

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.get('/403', (req, res) => {
  res.sendFile(join(__dirname, '403.html'));
})

io.on('connection', async (socket) => {
  const { userID, authToken } = socket.handshake.query;
  console.log(userID);
  console.log(authToken);

  try {
    // Validate the token
    const isValid = await validateToken(userID, authToken);

    if (isValid) {
      // Token is valid, proceed with your WebSocket logic
      console.log(`User ${userID} connected.`);

      const currentDate = new Date().setUTCHours(0, 0, 0, 0); // Set the time to the beginning of the day
      console.log(currentDate);
      
      try {
        const todaysMessages = await ChatMessage.find({
          timeSent: {
            $gte: currentDate, // Greater than or equal to the start of the day
            $lt: currentDate + 24 * 60 * 60 * 1000, // Less than the start of the next day
          },
        });
      
        console.log(todaysMessages);
      
        if (todaysMessages.length > 0) {
          todaysMessages.forEach((message) => {
            socket.emit('chat message', message.message);
          });
        }
      } catch (error) {
        console.error('Error retrieving messages:', error);
      }
            
      socket.on('chat message',  async (msg) => {
        const { userID, name, message } = msg;
        const chatMsg = new ChatMessage({
          userID: userID,
          message: `${name}: ${message}`
        });
  
        try {
          // Save the chat message to the database
          await chatMsg.save();
          console.log('message saved');
          socket.broadcast.emit('chat message', `${name}: ${message}`);
        } catch (error) {
          console.error('Error saving chat message:', error);
        }
  
      });

    } else {
      // Token is not valid, redirect the user to a 403 page
      console.log(`User ${userID} failed authentication.`);
      // Redirect to a 403 page
      socket.emit('redirect', '/403');
      // Optionally, disconnect the socket
      socket.disconnect(true);
    }
  } catch (error) {
    console.error('Error validating token:', error);
    // Handle errors as needed
    socket.disconnect(true);
  }

  });


server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});