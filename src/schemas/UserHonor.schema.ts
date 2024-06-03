import mongoose from 'mongoose';
const { Schema } = mongoose;

export default new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    xp: {
        type: Number,
        required: true,
    },
})