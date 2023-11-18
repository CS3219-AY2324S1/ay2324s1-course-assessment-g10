const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: String,  // e.g., 'userId'
    seq: Number
  });
  
export default mongoose.model('Counter', counterSchema);
