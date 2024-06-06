import { Schema } from 'mongoose'

export default new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    }
})