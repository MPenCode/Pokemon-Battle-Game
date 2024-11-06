import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    exp: {
        type: Number,
        required: true,
    },
    matchesPlayed: {
        type: Number,
        required: true,
    },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password; // Exclude password
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                delete ret.password; // Exclude password
                return ret;
            },
        },
    },
);

export default model('User', userSchema);