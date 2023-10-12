import mongoose from "mongoose";

enum Role {
    ADMIN,
    USER
}

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
        type: Role
    }
});

export default mongoose.model('User', userSchema);
