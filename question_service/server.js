const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')


connectDB()
const app = express()

app.options('*', cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
}))

app.use(cors());

//allows JSON data in request body to be parsed
app.use(express.json())
// allow URL-encoded data in request body to be parsed
app.use(express.urlencoded({ extended: false }))

// use the address router to handle requests 
// at http://localhost:8080/api/addresses
app.use('/api/questions', require('./routes/questionRouter'))


const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }...`)
})


app.get('/', (req, res) => {
    res.json({ message: 'Hello World' })
})


module.exports = app
