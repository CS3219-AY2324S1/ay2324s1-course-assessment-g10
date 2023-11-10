import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
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
        validate: (v: String[]) => Array.isArray(v) && v.length > 0
    },
    difficulty: {
        type: Number,
        required: true,
    }
}, { id: false })

export default mongoose.model('Question', questionSchema)