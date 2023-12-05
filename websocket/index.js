const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const connectToMongoDB = require('./MongoConnection');
const ChatMessage = require('./chatModel');


const app = express();
const server = createServer(app);
const io = new Server(server);
connectToMongoDB();

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('chat message',  async (msg) => {
      const { userID, name, message } = msg; 
      socket.broadcast.emit('chat message', `${name}: ${message}`);
        
      const chatMsg = new ChatMessage({
        userID: userID,
        message: message
      });

      try {
        // Save the chat message to the database
        await chatMsg.save();

        // Broadcast the message to all connected clients
        io.emit('chat message', chatMsg);
      } catch (error) {
        console.error('Error saving chat message:', error);
      }

    });
  });

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});