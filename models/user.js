const mongoose = require('mongoose');

// Define Schemes
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    method: { type: String, required: true },
    marketing: { type: Boolean, required: true },
  },
  {
    timestamps: true
  });

module.exports = mongoose.model('User', userSchema,'cloneuser');