const mongoose = require('mongoose');
const connectDB = require('./db'); 
const Model = require('../model/questionModel'); 
const data = require('./question_data');

async function populateData() {
  try {
    await connectDB(); // Connect to the MongoDB database

    // Use the Mongoose model to insert data
    await Model.insertMany(data);

    console.log('Questions inserted successfully.');

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
}

populateData();
