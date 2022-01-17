import pkg from 'mongoose';
const { Schema, model } = pkg;

const userSchema = new Schema({
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true
        }
    },

    {
        timestamps: true,
        versionKey: false
    }
)
export default model('User', userSchema)