const mongoose = require('mongoose')
const Counter = require('../model/counterModel');


// function to start up and connect to MongoDB database
const connectDB = async () => {
    try {
        // attempt to connect to MongoDB database via the connection string specified in .env file
        console.log(`connecting with... ${process.env.MONGODB_URI}`)
        const con = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${con.connection.host} `)
    } catch (error) {
        console.log(error)
        console.log(`Unable to establish connection with MongoDB service... Please check if the service is running`)
        process.exit(1)
    }
}

const initCounter = async () => {
    try {
      const questionIndex = await Counter.findById('questionIndex');
      if (!questionIndex) {
        await new Counter({ _id: 'questionIndex', seq: 1 }).save();
        console.log(`Counter not found in DB, initializing...`)
      }

      console.log(`Counter found in DB, current sequence: ${questionIndex.seq}`)

    } catch (error) {
      console.log('Error initializing counter:', error);
    }
};

// export connection function to be used in index.js
module.exports = { connectDB, initCounter }

