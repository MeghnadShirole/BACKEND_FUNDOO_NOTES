import pkg from 'mongoose';
const { Schema, model } = pkg;
import User from '../models/user.model.js';

const noteSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        color: {
            type: String,
        },
        isArchieved: Boolean,
        isDeleted: Boolean,
        userId: {

        }
    },

    {
        timestamps: true,
        versionKey: false
    }
)
export default model('Note', noteSchema)