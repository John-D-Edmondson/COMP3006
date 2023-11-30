// mongoose.js

const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
      const mongoURI = 'mongodb+srv://johnedmondson83:Password@cluster0.zliwnea.mongodb.net/3006';
      await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  };

module.exports = connectToMongoDB;