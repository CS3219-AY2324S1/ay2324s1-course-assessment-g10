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
    category: {
        type: [String],
        validate: (v) => Array.isArray(v) && v.length > 0
    },
    complexity: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Difficult']
    }
})

module.exports = mongoose.model('Question', questionSchema)