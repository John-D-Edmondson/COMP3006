const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  userID: { type: Number, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  booksBorrowed: { type: [Number], default: [] },
});

userSchema.pre('save', async function (next) {
    // Only generate a random userID if it's a new user

    if (this.isNew || (this.isModified('password') && this.password)) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }

    if (!this.isNew) return next();
  
    try {
      // Generate a random 5-digit userID
      this.userID = Math.floor(10000 + Math.random() * 90000);
      next();
    } catch (error) {
      next(error);
    }
  });


const User = mongoose.model('User', userSchema);

module.exports = User;