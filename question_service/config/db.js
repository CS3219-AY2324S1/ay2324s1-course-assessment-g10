const mongoose = require('mongoose')


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

// export connection function to be used in index.js
module.exports = connectDB
