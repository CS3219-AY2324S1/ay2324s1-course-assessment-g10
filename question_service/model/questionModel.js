const mongoose = require('mongoose')

const questionSchema = mongoose.Schema({
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
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Question', questionSchema)