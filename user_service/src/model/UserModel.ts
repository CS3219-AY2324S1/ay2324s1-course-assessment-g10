import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    loginName : {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    }
});

export default mongoose.model('User', userSchema);
