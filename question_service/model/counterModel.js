const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: String,  // e.g., 'userId'
    seq: Number
  });
  
module.exports = mongoose.model('Counter', counterSchema);
