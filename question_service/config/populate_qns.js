const mongoose = require('mongoose');
const connectDB = require('./db');
const Model = require('../model/questionModel');
const data = require('./question_data');
const getNextSequenceValue = require('../model/counterModel');

async function populateData() {
  try {
    await connectDB(); // Connect to the MongoDB database

    for (const question of data) {
      // Check if the question already exists in the database
      const existingQuestion = await Model.findOne({ title: question.title });

      if (!existingQuestion) {
        // Generate a new ID for the question
        const id = await getNextSequenceValue('questionIndex');

        // Assign the generated ID to the question
        question.id = id;

        // Insert the question into the database
        await Model.create(question);
        console.log(`Question inserted successfully: ${question.title}`);
      } else {
        // If the question already exists, log a message
        console.log(`Question already exists: ${question.title}`);
      }
    }

    console.log('Questions population completed.');

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
}

populateData();
