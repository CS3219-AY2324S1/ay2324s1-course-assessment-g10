const mongoose = require('mongoose')

const questionSchema = mongoose.Schema({
    id: {
        type: Number
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    topics: {
        type: [String],
        validate: (v) => Array.isArray(v) && v.length > 0
    },
    difficulty: {
<<<<<<< HEAD
        type: String,
=======
        type: Number,
>>>>>>> master
        required: true,
    }
}, { id: false })

module.exports = mongoose.model('Question', questionSchema)